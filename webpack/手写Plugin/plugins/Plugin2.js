const { readFileSync } = require("fs");
const path = require("path");
const webpack = require("webpack");
const { RawSource } = webpack.sources;

// const util = require("util");
// const readFile = util.promisify(fs.readFile); // 用fs.readFileSync 代替

class Plugin2 {
  apply(compiler) {
    // 初始化compilation钩子
    compiler.hooks.thisCompilation.tap("Plugin2", (compilation, compilationParams) => {
      // debugger;
      // console.log(compilation); //compilation中有很多hooks
      compilation.hooks.additionalAssets.tapAsync("Plugin2", async (cb) => {
        // debugger;
        // console.log(compilation);
        const content = "hello plugin2 by Syh----";

        // 往要输出的资源中 添加其他资源
        // 1. 复杂操作 需要手动长度和文本
        compilation.assets["syh.txt"] = {
          // 文件大小
          size() {
            return content.length;
          },
          // 文件内容
          source() {
            return content;
          },
        };

        // 2.使用webpack.sources本身 RawSource方法
        const bufferData = await readFileSync(path.resolve(__dirname, "b.txt"));
        // 2.1 直接在对象上赋值
        compilation.assets["b.txt"] = new RawSource(bufferData);
        // 2.2 调用函数    两者等价
        compilation.emitAsset("b2.txt", new RawSource(bufferData));

        // 执行回调 不执行的话会？？？！！！!!!
        cb();
      });
    });
  }
}

module.exports = Plugin2;
