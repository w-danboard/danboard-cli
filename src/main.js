const path = require('path');
const chalk = require('chalk');
const { program } = require('commander');
const mapActions = require('./map-actions');
const { version } = require('./constants.js');

Object.keys(mapActions).forEach((action) => {
  program
    .command(action) // 配置命令的名字
    .alias(mapActions[action].alias) // 命令的别名
    .description(mapActions[action].description) // 命令对应的描述
    .action(() => {
      if (action === '*') { // 访问不到对应的命令，打印找不到
        console.log(chalk.redBright('error:'), mapActions[action].description);
        return;
      }
      // create config...
      console.log(action);
      // danboard-cli create xxx // [node, danboard-cli, create]
      require(path.resolve(__dirname, action))(...process.argv.slice(3)); // 对应的action分配给每个文件执行
    });
});

program.on('--help', () => {
  console.log('\nExamples:');
  Object.keys(mapActions).forEach((action) => {
    mapActions[action].examples.forEach((example) => {
      console.log(` ${example}`);
    });
  });
});

// 解析用户传递过来的参数
program.version(version).parse(process.argv);
