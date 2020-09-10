const axios = require('axios');

axios.interceptors.response.use((res) => res.data);

// 获取项目列表
const fetchRepoList = async () => {
  const data = await axios.get('https://api.github.com/orgs/danboard-cli-templates/repos');
  return data;
};

// 获取tag版本号
const fechTagList = async (repo) => {
  const data = await axios.get(`https://api.github.com/repos/danboard-cli-templates/${repo}/tags`);
  return data;
};

module.exports = {
  fetchRepoList,
  fechTagList,
};
