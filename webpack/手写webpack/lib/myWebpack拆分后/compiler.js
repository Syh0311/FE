const { getAst, getDeps, getCode } = require("./parser");

class Compiler {
  constructor(options = {}) {
    this.options = options;
  }

  run() {
    // 1. 读取入口文件内容
    const entryFileName = this.options.entry;

    // 2. 将入口文件解析为AST  借助 babel/parser
    const ast = getAst(entryFileName);
    console.log("[ ast ]", ast);

    // 3. 使用 babel/tarverse 收集依赖
    const deps = getDeps(ast, entryFileName);
    console.log("[ deps ]", deps);

    // 4. 编译代码 将ES6代码解析为ES5
    const code = getCode(ast);
    console.log("[ code ]", code);
  }
}

module.exports = Compiler;
