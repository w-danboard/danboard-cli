// 存放用户所需要的常量
const { version } = require('../package.json');

// 存储模板的位置
// 缓存存到当前根目录
// 先判断下当前的平台 每个系统都不一样 比如MAC是darwin
const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;
console.log(downloadDirectory);
module.exports = {
  version,
  downloadDirectory,
};
