const axios = require('axios');
const path = require('path');
const fs = require('fs');
const ora = require('ora');
const Inquirer = require('inquirer');
const { promisify } = require('util');
const MetalSmith = require('metalsmith'); // 遍历文件件 找需不需要渲染
// consolidate 统一了所有的模板引擎
let { render } = require('consolidate').ejs;

render = promisify(render);
/**
 * download-git-repo 缺陷
 *  downloadGitRepo(1, 2, function() {
 *    写法不是promise 可以用promisify转一下
 *  })
 */
let downloadGitRepo = require('download-git-repo');
// 可以把异步的api转换成promise
downloadGitRepo = promisify(downloadGitRepo);
let ncp = require('ncp');
// 和download-git-repo包一样 需要用promisify转一下
ncp = promisify(ncp);
const { downloadDirectory } = require('./constants');

// create所有的逻辑

// create功能是创建项目
// 拉取你自己的所有项目列出来 让用户选 安装哪个项目 projectName [tag git tag v1.0.1 git push origin v1.0.1]
// 选完后 在显示所有的版本号 1.0
// 可能还需要用户配置一些数据 来结合渲染我的项目

// https://developer.github.com/v3/repos/ [github文档]
// GET /orgs/:org/repos [组织 | 组织名 | 仓库]

// https://api.github.com/orgs/danboard-cli-templates/repos 获取组织下的仓库

// 怎么模块渲染？

// 封装loading
const waitFnLoading = (fn, message) => async (...args) => {
  const spinner = ora(message);
  spinner.start();
  const result = await fn(...args);
  spinner.succeed();
  return result;
};

// 下载git仓库
const download = async (repo, tag) => {
  let api = `danboard-cli-templates/${repo}`;
  if (tag) {
    api += `#${tag}`;
  }
  const dest = `${downloadDirectory}/${repo}`;
  console.log('api:', api, 'dest:', dest);
  await downloadGitRepo(api, dest);
  return dest; // 下载的最终目录
};

// 1) 获取项目列表
const fetchRepoList = async () => {
  const { data } = await axios.get('https://api.github.com/orgs/danboard-cli-templates/repos');
  return data;
};

// 获取tag版本号
const fechTagList = async (repo) => {
  const { data } = await axios.get(`https://api.github.com/repos/danboard-cli-templates/${repo}/tags`);
  return data;
};

module.exports = async (projectName) => {
  // # 1） 获取项目的所有模板
  // const spinner = ora('fetching template...');
  // spinner.start();
  // let repos = await fetchRepoList();
  // spinner.succeed();
  let repos = await waitFnLoading(fetchRepoList, 'fetching template...')();
  repos = repos.map((item) => item.name);
  // 在获取之前 显示loading 结束之后关闭loading 失败的话显示失败状态
  // 然后选择模板 使用inquirer[用户与命令行交互工具]包ora包[loading]
  const { repo } = await Inquirer.prompt({ // 它返回的是promise
    name: 'repo', // 获取选择后的结果
    type: 'list',
    message: '请创建一个项目 [please choise a template to create project]',
    choices: repos,
  });

  // # 2) 通过当前选择的项目 拉取对应的版本 [GET /repos/:owner/:repo/tags (https://api.github.com/repos/danboard-cli-templates/template-test_v2/tags)]
  // 获取对应的版本号
  let tags = await waitFnLoading(fechTagList, 'fetching tags...')(repo);
  tags = tags.map((item) => item.name);
  console.log(tags);

  const { tag } = await Inquirer.prompt({ // 它返回的是promise
    name: 'tag', // 获取选择后的结果
    type: 'list',
    message: 'please choise a tags to create project',
    choices: tags,
  });
  console.log(repo, tag, '===>'); // 下载模板
  // # 3) 下载模板后 把模板放到一个临时目录里 存好 以备后期使用 [问题：比如我第一次下载的是2.0版本，第二次依然是2.0，我是用缓存的还是覆盖？还有编译问题]

  // download-git-repo 下载git仓库的包
  const result = await waitFnLoading(download, 'download template...')(repo, tag);
  console.log(result); // 下载的目录

  // 拿到了下载的目录 直接拷贝当前执行的目录即可 [ncp包 主要做拷贝]
  // 复杂的需要模板渲染 渲染后再拷贝
  // 把template下的文件 拷贝到执行命令的目录下
  // # 4) 拷贝操作
  // 这个目录 项目名字是否已经存在 如果存在提示当前已经存在

  // 如果有ask.js文件 就是复杂模板
  // require(result); // 就是下载到根目录的文件 ./template/xxx
  if (!fs.existsSync(path.join(result, 'ask.js'))) {
    await ncp(result, path.resolve(projectName));
  } else {
    // 复杂的模板
    // 把git上的项目下载下俩，如果有ask文件就是一个复杂的模板，需要选择之后编译模板
    console.log('我是复杂模板');
    await new Promise((resolve, reject) => {
      // 1. 让用户填写信息
    // 2. 用户填写的信息去渲染模板
    // metalsmith包 遍历目录文件件，只要是编译 都需要这个模板
      MetalSmith(__dirname) // 如果你传入路径 默认会遍历当前路径下的src文件夹
        .source(result) // 本机根目录的模板地址
        .destination(path.resolve(projectName)) // 拷贝的文件夹目录
        .use(async (files, metal, done) => {
          const args = require(path.join(result, '/ask.js'));
          console.log(args, 'argsargsargsargs');
          const obj = await Inquirer.prompt(args);
          console.log(obj);
          const meta = metal.metadata();
          console.log(meta, '===', metal);
          Object.assign(meta, obj);
          delete files['ask.js'];
          done(); // 感觉有点像koa里的那个next() 貌似也属于中间件？？？
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
