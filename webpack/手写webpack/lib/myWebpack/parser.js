const path = require("path");
const fs = require("fs");
const babelParser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { transformFromAst } = require("@babel/core");

const parser = {
  // 将入口文件解析为AST  借助 babel/parser
  getAst(filePath) {
    // 不加 utf-8 默认是bufferData
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const ast = babelParser.parse(fileContent, {
      sourceType: "module", // 解析文件的模块化方案为 ES Module
    });
    return ast;
  },

  // 收集依赖
  getDeps(ast, filePath) {
    const deps = {};
    const dirname = path.dirname(filePath);

    // 参数为ast和对象 此处的对象可能是策略者模式
    // taverse 遍历ast的program.body数组
    traverse(ast, {
      //ImportDeclaration的参数是 program.body内命中ImportDeclaration的元素
      ImportDeclaration(NodePath) {
        const { node } = NodePath;

        // ast中引入写的是  被引入文件的相对路径
        const relativePath = node.source.value;
        // 生成绝对路径
        const absoluePath = path.resolve(dirname, relativePath);
        // 添加依赖
        deps[relativePath] = absoluePath;
      },
    });

    return deps;
  },

  // 编译代码 ast转code   ES6->ES5
  getCode(ast) {
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"],
    });
    return code;
  },
};

module.exports = parser;
