// 找到要执行的核心文件
// 1） 要解析用户的参数 process.argv
const { program } = require('commander');
const { version } = require('./constants.js');

// vue create projectname
// vue ui ...
// vue config

program
  .command('create') // 配置命令的名字
  .alias('c') // 命令的别名
  .description('create a project') // 命令对应的描述
  .action(() => {
    console.log('create');
  });

// 解析用户传递过来的参数
program.version(version).parse(process.argv);
