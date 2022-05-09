// webpack内容
const path = require("path");
const fs = require("fs");
const babelParser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

function myWebpack(config) {
  return new Compiler(config);
}

class Compiler {
  constructor(options = {}) {
    this.options = options;
  }

  run() {
    // 1. 读取入口文件内容
    const entryFileName = this.options.entry;

    // 2. 将入口文件解析为AST  借助 babel/parser

    // 不加 utf-8 默认是bufferData
    const fileContent = fs.readFileSync(entryFileName, "utf-8");
    const ast = babelParser.parse(fileContent, {
      sourceType: "module", // 解析文件的模块化方案为 ES Module
    });
    debugger;
    console.dir(ast);

    // 3. 使用 babel/tarverse 收集依赖
    const deps = new Map();
    // 保存入口文件原地址
    const dirname = path.dirname(entryFileName);
    // 参数为ast和对象 此处的对象可能是策略者模式
    // taverse 遍历ast的program.body数组
    traverse(ast, {
      //ImportDeclaration的参数是 program.body内命中ImportDeclaration的元素
      ImportDeclaration(NodePath) {
        debugger;
        console.dir(NodePath);
        const { node } = NodePath;
        console.dir(node);
        debugger;
        debugger;
        // ast中引入写的是  被引入文件的相对路径
        const relativePath = node.source.value;
        // 生成绝对路径
        const absoluePath = path.resolve(dirname, relativePath);
        // 添加依赖
        deps.set(relativePath, absoluePath);
      },
    });
    debugger;
    console.log("[ deps ] >", deps);

    // 4. 编译代码 将ES6代码解析为ES5
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"],
    });
    console.log("[ code ] >", code);
  }
}

module.exports = myWebpack;
