const Plugin1 = require("./plugins/Plugin1");
// const Plugin2 = require("./plugins/Plugin2.js");
const CopyWebpackPlugin = require("./plugins/CopyWebpackPlugin.js");

module.exports = function (env) {
  console.log("[ env ]", env);
  const { production } = env;
  return {
    mode: "development",
    plugins: [
      // new Plugin1(),
      // new Plugin2(),
      new CopyWebpackPlugin({
        from: "public",
        to: "css",
        // ignore: ["**/index.html"], // 任意目录下的都会被忽略
        ignore: ["index.html"], // 自己写的排除方法  只能管一层
      }),
    ],
  };
};
