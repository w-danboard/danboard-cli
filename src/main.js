// 找到要执行的核心文件
// 1） 要解析用户的参数 process.argv
const { program } = require('commander');
const path = require('path');
const chalk = require('chalk');
const { version } = require('./constants.js');

/**
 * 关于eslint
 * npm i eslint
 * npx eslint --init
 * vscode中配置eslint 保存时修复
 */

// vue-cli 主要做的是拉取模板，模板里配置的是webpack
// vue create projectname
// vue ui ...
// vue config

const mapActions = {
  create: {
    alias: 'c',
    description: 'create a project',
    examples: [
      'danboard-cli create <project-name>',
    ],
  },
  config: {
    alias: 'conf',
    description: 'config project variable',
    examples: [
      'danboard-cli config set <k> <v>',
      'danboard-cli config get <k>',
    ],
  },
  '*': {
    alias: '',
    description: 'command not found',
    examples: [],
  },
};

/**
 * 与Obejct.keys区别
 * https://blog.csdn.net/oxgos/article/details/82854848
 *  - Object.keys() 返回属性key，但不包括不可枚举的属性
 *  - Reflect.ownKeys() 返回所有属性key
 *  - Object.keys() 相当于返回属性数组
 *  - Reflect.ownKeys() 相当于Object.getOwnPropertyName(target)
 *    concat(Object.getOwnPropertySymbols(target))
 * 总结：
 *  Object.keys()主要用于遍历对象自有的可枚举属性，不包括继承自原型的属性和不可枚举的属性
 *  Reflect.ownKeys()返回所有自有属性key，不管是否可枚举，但不包括继承自原型的属性
 */
Reflect.ownKeys(mapActions).forEach((action) => {
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
  Reflect.ownKeys(mapActions).forEach((action) => {
    mapActions[action].examples.forEach((example) => {
      console.log(` ${example}`);
    });
  });
});

// 解析用户传递过来的参数
program.version(version).parse(process.argv);
