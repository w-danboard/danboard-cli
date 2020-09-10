// create所有的逻辑
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const Inquirer = require('inquirer');
const chalk = require('chalk');
const debug = require('debug')('development');
const MetalSmith = require('metalsmith'); // 遍历文件

let { render } = require('consolidate').ejs;
// 统一了所有的模板引擎
render = promisify(render);

let ncp = require('ncp');
// 主要做拷贝
ncp = promisify(ncp);

const { fetchRepoList, fechTagList } = require('../request');
const { waitFnLoading, download } = require('../utils');

module.exports = async (projectName) => {
  // 获取所有模板
  let repos = await waitFnLoading(fetchRepoList, 'fetching template...')();
  repos = repos.map((item) => item.name);

  // 然后选择模板 使用inquirer包[用户与命令行交互工具，返回promise]
  const { repo } = await Inquirer.prompt({
    name: 'repo', // 获取选择后的结果
    type: 'list',
    message: '请创建一个项目 [please choise a template to create project]',
    choices: repos,
  });

  // 根据选择的项目，拉取对应的tag版本 [GET /repos/:owner/:repo/tags (https://api.github.com/repos/danboard-cli-templates/template-test_v2/tags)]
  let tags = await waitFnLoading(fechTagList, 'fetching tags...')(repo);
  tags = tags.map((item) => item.name);
  debug(chalk.redBright('---所有的tag版本:---'), tags);

  const { tag } = await Inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: 'please choise a tags to create project',
    choices: tags,
  });
  debug(chalk.redBright('---模板 & tag版本---:'), repo, +'&' + tag);

  // # 3) 下载模板后 把模板放到一个临时目录里 存好 以备后期使用 [问题：比如我第一次下载的是2.0版本，第二次依然是2.0，我是用缓存的还是覆盖？还有编译问题]

  // 下载模板
  const rootDirectory = await waitFnLoading(download, 'download template...')(repo, tag);
  debug(chalk.redBright('---下载模板所对应的本机根目录---:'), rootDirectory);

  // 判断模板了类型
  if (!fs.existsSync(path.join(rootDirectory, 'ask.js'))) {
    // 简单模板
    debug(chalk.redBright('我是简单模板'));
    await ncp(rootDirectory, path.resolve(projectName));
  } else {
    // 复杂的模板
    debug(chalk.redBright('我是复杂模板'));
    await new Promise((resolve, reject) => {
      // metalsmith包 [遍历目录文件]
      MetalSmith(__dirname) // 如果传入路径 默认会遍历当前路径下的src文件夹
        .source(rootDirectory)
        .destination(path.resolve(projectName)) // 拷贝到的文件夹目录
        .use(async (files, metal, done) => {
          const args = require(path.join(rootDirectory, '/ask.js'));
          const obj = await Inquirer.prompt(args);
          const meta = metal.metadata();
          Object.assign(meta, obj);
          delete files['ask.js'];
          done();
        })
        .use((files, metal, done) => {
          // 根据用户的选择输入，下载模板
          const obj = metal.metadata();
          Object.keys(files).forEach(async (file) => {
            if (file.includes('js') || file.includes('json')) {
              let content = files[file].contents.toString(); // 文件内容
              if (content.includes('<%')) {
                content = await render(content, obj);
                files[file].contents = Buffer.from(content); // 渲染
              }
            }
          });
          done();
        })
        .build((err) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
        });
    });
  }
};
