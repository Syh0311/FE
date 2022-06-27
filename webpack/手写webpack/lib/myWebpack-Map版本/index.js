// webpack内容
const Compiler = require("./compiler");

function myWebpack(config) {
  return new Compiler(config);
}

module.exports = myWebpack;
