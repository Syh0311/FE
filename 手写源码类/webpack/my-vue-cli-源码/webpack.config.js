const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // 模式 开发模式
  mode: "development",
  // 入口文件 main.js
  entry: {
    main: "./src/main.js",
  },
  // 输出
  output: {
    // 输出到 dist文件夹
    path: path.resolve(__dirname, "./dist"),
    // js文件下
    filename: "js/chunk-[contenthash].js",
    // 每次打包前自动清除旧的dist
    clean: true,
  },

  // 插件都放 plugins 中
  plugins: [
    new HtmlWebpackPlugin({
      // 选择模板 public/index.html
      template: "./public/index.html",
      // 打包后的名字
      filename: "index.html",
      // js文件插入 body里
      inject: "body",
    }),

    new MiniCssExtractPlugin({
      // 将css代码输出到dist/styles文件夹下
      filename: "styles/chunk-[contenthash].css",
      ignoreOrder: true,
    }),
  ],

  module: {
    rules: [
      {
        // 匹配文件后缀的规则
        test: /\.(css|s[cs]ss)$/,
        use: [
          // loader执行顺序是从右到左
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          // {
          //   loader: 'sass-resources-loader',
          //   options: {
          //     resources: [
          //       // 放置全局引入的公共scss文件
          //     ],
          //   },
          // },
        ],
      },
    ],
  },
};
