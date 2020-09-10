// cosnt chalk = require('chalk')
const { version } = require('../../package.json');

/**
 * 存储模板的位置
 *   mac: 'darwin'
 */
const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;
console.log(downloadDirectory);
console.log(process.env);
module.exports = {
  version,
  downloadDirectory,
};
