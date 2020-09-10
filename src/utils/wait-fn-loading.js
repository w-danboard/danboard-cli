const ora = require('ora');

/**
 * 封装loading
 * @param {Function} fn 执行函数
 * @param {String} message loading信息
 */
module.exports = (fn, message) => async (...args) => {
  const spinner = ora(message);
  spinner.start();
  const result = await fn(...args);
  spinner.succeed();
  return result;
};
