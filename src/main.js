const path = require('path');
const chalk = require('chalk');
const { program } = require('commander');
const mapActions = require('./map-actions');
const { version } = require('./constants');

/**
 *  遍历process.argv的参数
 *     mapActions: 所有可执行的参数命令集合
 *     action: 每个可执行的参数命令
 */
Object.keys(mapActions).forEach((action) => {
  program
    .command(action)
    .alias(mapActions[action].alias)
    .description(mapActions[action].description)
    .action(() => {
      // 访问不到对应的命令
      if (action === '*') {
        console.log(chalk.redBright('error:'), mapActions[action].description);
        return;
      }
      // 对应的action分配给每个文件执行 [例: d-cli create | d-cli config]
      require(path.join(__dirname, '/actions', action))(...process.argv.slice(3));
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
