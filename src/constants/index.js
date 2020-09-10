const chalk = require('chalk');
const debug = require('debug')('development');
const { version } = require('../../package.json');

/**
 * 存储模板的位置
 *   mac: 'darwin'
 */
const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;
debug(chalk.redBright('---downloadDirectory---:', downloadDirectory));
module.exports = {
  version,
  downloadDirectory,
};
