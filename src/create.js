const axios = require('axios');
const ora = require('ora');
const Inquirer = require('inquirer');
// create所有的逻辑

// create功能是创建项目
// 拉取你自己的所有项目列出来 让用户选 安装哪个项目 projectName [tag git tag v1.0.1 git push origin v1.0.1]
// 选完后 在显示所有的版本号 1.0
// 可能还需要用户配置一些数据 来结合渲染我的项目

// https://developer.github.com/v3/repos/ [github文档]
// GET /orgs/:org/repos [组织 | 组织名 | 仓库]

// https://api.github.com/orgs/danboard-cli-templates/repos 获取组织下的仓库

// 怎么模块渲染？
// 1) 获取项目列表
const fetchRepoList = async () => {
  const { data } = await axios.get('https://api.github.com/orgs/danboard-cli-templates/repos');
  return data;
};
module.exports = async () => {
  // 1） 获取项目的所有模板
  const spinner = ora('fetching template...');
  spinner.start();
  let repos = await fetchRepoList();
  spinner.succeed();
  repos = repos.map((item) => item.name);
  // 在获取之前 显示loading 结束之后关闭loading 失败的话显示失败状态
  // 然后选择模板 使用inquirer[用户与命令行交互工具]包ora包[loading]
  const { repo } = await Inquirer.prompt({ // 它返回的是promise
    name: 'repo', // 获取选择后的结果
    type: 'list',
    message: 'please choise a template to create project',
    choices: repos,
  });
  console.log(repo);
};
