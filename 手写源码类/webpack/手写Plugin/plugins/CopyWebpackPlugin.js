const path = require("path");
const fs = require("fs");
const { validate } = require("schema-utils");

const schema = require("./schema.json");
const { RawSource } = require("webpack-sources");
// const globby = require("globby"); // globby 最新的为纯esm包 不能require引入  改用11.0.1版本

class CopyWebpackPlugin {
  constructor(options = {}) {
    // 对options做校验
    validate(schema, options, {
      name: "CopyWebpackPlugin",
    });

    this.options = options;
  }

  apply(compiler) {
    // 初始化compilation
    compiler.hooks.thisCompilation.tap("CopyWebpackPlugin", (compilation) => {
      // compilation中钩子
      compilation.hooks.additionalAssets.tapAsync("CopyWebpackPlugin", async (cb) => {
        // 将from中资源 复制到to中
        const { from, to = ".", ignore } = this.options;

        // 1. 读取from中所有资源
        // 2. 过滤ignore

        // context 是webpack配置的路径 没配置为默认路径
        const contextPath = compiler.options.context;
        debugger;
        // 将输入路径变为绝对路径
        const absolutePath = path.isAbsolute(from) ? from : path.resolve(contextPath, from);

        const paths = [];
        walkSync(absolutePath, (fileFullPath) => {
          const { root, dir: absolute, base: nama_ext, name, ext } = path.parse(fileFullPath);
          if (ignore.includes(nama_ext)) return;
          paths.push(fileFullPath);
        });

        // 使用globby处理文件
        // const paths = await globby(absolutePath, { ignore });
        // console.log("[ paths ]", paths);

        // 3. 生成wenpack格式的资源   如果是异步的话 可以用promise.all存放所有异步for循环
        // 如 const files = Promise.all(paths.map(async path=>{ await xxx}))

        // 4. 添加到compilation中 输出
        paths.forEach((absolutePath) => {
          const bufferData = fs.readFileSync(absolutePath);

          // baseName与to结合
          const baseName = path.basename(absolutePath);
          const fileName = path.join(to, baseName);
          compilation.emitAsset(fileName, new RawSource(bufferData));
        });
        cb();
      });
    });
  }
}

module.exports = CopyWebpackPlugin;

// 获取文件夹下的地址 将其中文件做回调
function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(function (name) {
    const fileFullPath = path.join(currentDirPath, name);
    const stat = fs.statSync(fileFullPath);
    // console.log("[ stat ]", stat);

    if (stat.isFile()) {
      callback(fileFullPath, stat);
    } else if (stat.isDirectory()) {
      walkSync(fileFullPath, callback);
    }
  });
}
