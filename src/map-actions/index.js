// 解析参数 process.argv
module.exports = {
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
      'danboard-cli config set <key> <value>',
      'danboard-cli config get <key>',
    ],
  },
  '*': {
    alias: '',
    description: 'command not found',
    examples: [],
  },
};
