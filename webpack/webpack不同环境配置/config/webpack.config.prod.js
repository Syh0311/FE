const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env) => {
  console.log("%c [ env ]-7", "font-size:13px; background:pink; color:#bf2c9f;", env);
  return {
    entry: {
      index: "./src/index.js",
      another: "./src/another.js",
    },

    output: {
      filename: "script/[name].[contenthash].js",
      path: path.resolve(__dirname, "../dist"),
      clean: true, //清空上次打包结果【清空dist】
      assetModuleFilename: "images/[contenthash][ext]", //对于其他所有资源，生成对应的hash值和后缀【此处优先级低于module中】
      publicPath: "http://localhost:8080/", //开发环境不需要
    },

    mode: "production",

    devtool: "inline-source-map",

    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html", //模板选择
        filename: "app.html", //打包的文件名
        inject: "body", //打包出的bundle插到哪个地方
      }),
      new MiniCssExtractPlugin({
        filename: "style/[contenthash].css",
      }),
    ],

    devServer: {
      //生产环境中不需要
      static: "./dist", //执行  npx webpack-dev-server --open  【dist中文件放到了内存中，提高了开发效率和编译效率】
      // open: true, //自动打开浏览器
    },

    module: {
      rules: [
        {
          test: /\.png$/, //以png结尾的文件
          type: "asset/resource", //资源模块的资源类型
          generator: {
            filename: "images/[contenthash][ext]", //生成对应的hash值和后缀【此处优先级高于】
          },
        },
        {
          test: /\.svg$/,
          type: "asset/inline",
          // // data URI 默认是Base64 算法编码的内容，但是可自定义编码算法
          generator: {
            dataUrl: (content) => {
              content = content.toString();
              return svgToMiniDataURI(content);
            },
          },
        },
        {
          test: /\.txt$/,
          type: "asset/source", //txt资源类型
        },
        {
          test: /\.jpg$/,
          type: "asset", //asset将资源在【asset/resource】和【asset/inline】中间按资源大小选择，一般大于8k按照前者，不过可【自定义这个判断条件】
          parser: {
            dataUrlCondition: {
              maxSize: 20 * 1024, //本来8*1024，增大了判断条件
            },
          },
        },
        {
          test: /\.(css|less)$/,
          use: ["style-loader", "css-loader", "less-loader"],
        },
        {
          //【只是】为了兼容不支持的浏览器，像是chrome，不需要这个插件也能支持最新语法【await等】
          test: /\.js$/,
          exclude: /node_modules/, //排除包里的js
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                [
                  "@babel/plugin-transform-runtime", //作用是需要regenerator【await问题】地方帮它自动加上 为啥要放到数组里？？
                ],
              ],
            },
          },
        },
      ],
    },
    optimization: {
      minimizer: [
        new CssMinimizerPlugin(), //css压缩
        new TerserPlugin(), //js压缩
      ],
      splitChunks: {
        chunks: "all",
      },
    },
  };
};
