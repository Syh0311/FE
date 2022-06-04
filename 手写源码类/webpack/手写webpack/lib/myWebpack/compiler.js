const path = require("path");
const fs = require("fs");
const { getAst, getDeps, getCode } = require("./parser");

class Compiler {
  constructor(options = {}) {
    // 初始化
    this.options = options;

    // 存放module的数组
    this.modules = [];
  }

  run() {
    // 读取入口文件内容
    const entryFilePath = this.options.entry;

    // 入口文件的 【filePath deps code】
    const fileInfo = this.build(entryFilePath);

    this.modules.push(fileInfo);

    // 将所有依赖添加到modules中   类似层序遍历
    // 如果存在循环引用 停不下来了
    this.modules.forEach((fileInfo) => {
      const { deps } = fileInfo;

      // deps 是Map
      // deps.forEach((value, key) => {
      //   const fileInfo = this.build(value);
      //   this.modules.push(fileInfo);
      // });

      // Object.entries(deps).forEach((key, value) => {}？？?
      Object.keys(deps).forEach((key) => {
        const fileInfo = this.build(deps[key]);
        this.modules.push(fileInfo);
      });
    });

    // 层序遍历完后 所有依赖被添加到modules中
    // console.log(this.modules);

    // 将依赖 modules 整理更好依赖关系图  树结构
    /*
      {
        'index.js': {
          code: 'xxx',
          deps: { 'add.js': "xxx" }
        },
        'add.js': {
          code: 'xxx',
          deps: {}
        }
      }
    */
    // 这只是简单的相加而已
    const depsGraph = this.modules.reduce((graph, module) => {
      const { filePath, deps, code } = module;
      // const fileName = path.basename(filePath);
      return {
        ...graph,
        [filePath]: {
          code: code,
          deps: deps,
        },
      };
    }, {});
    console.log("[ depsGraph ]", depsGraph);

    this.generate(depsGraph);
  }

  build(filePath) {
    // 将入口文件解析为AST  借助 babel/parser
    const ast = getAst(filePath);

    // 使用 babel/tarverse 收集依赖
    const deps = getDeps(ast, filePath);

    // 编译代码 将ES6代码解析为ES5
    const code = getCode(ast);

    return {
      // 当前文件 filePath
      filePath,
      // 当前文件 依赖
      deps,
      // 当前文件 编译后代码
      code,
    };
  }

  // 生成输出资源
  generate(depsGraph) {
    /* index.js的代码
      "use strict";\n' +
      '\n' +
      'var _add = _interopRequireDefault(require("./add.js"));\n' +
      '\n' +
      'var _count = _interopRequireDefault(require("./count.js"));\n' +
      '\n' +
      'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }\n' +
      '\n' +
      'console.log((0, _add["default"])(1, 2));\n' +
      'console.log((0, _count["default"])(3, 1));
    */

    const bundle = `
      (function (depsGraph) {
        // require目的：为了加载入口文件
        function require(module) {
          // 定义模块内部的require函数
          function localRequire(relativePath) {
            // 为了找到要引入模块的绝对路径，通过require加载
            return require(depsGraph[module].deps[relativePath]);
          }
          // 定义暴露对象（将来我们模块要暴露的内容）
          var exports = {};

          (function (require, exports, code) {
            eval(code);
          })(localRequire, exports, depsGraph[module].code);
          
          // 作为require函数的返回值返回出去
          // 后面的require函数能得到暴露的内容
          return exports;
        }
        // 加载入口文件
        require('${this.options.entry}');

      })(${JSON.stringify(depsGraph)})
    `;
    // 生成输出文件的绝对路径
    const filePath = path.resolve(this.options.output.path, this.options.output.filename);
    // 写入文件
    fs.writeFileSync(filePath, bundle, "utf-8");
  }
}

module.exports = Compiler;
