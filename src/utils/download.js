const { promisify } = require('util');
let downloadGitRepo = require('download-git-repo');
// 下载git
downloadGitRepo = promisify(downloadGitRepo);
const { downloadDirectory } = require('../constants');

/**
 * 下载git仓库
 * @param {String} repo 需要下载的模板
 * @param {String} tag  需要下载模板的tag版本
 */
module.exports = async (repo, tag) => {
  let api = `danboard-cli-templates/${repo}`;
  if (tag) {
    api += `#${tag}`;
  }
  const dest = `${downloadDirectory}/${repo}`;
  await downloadGitRepo(api, dest);
  return dest;
};
