能写 plugin 和 loader

vite 原理

## 1.简介

node 环境下：require，可通过插件再浏览器中实现 require；

esm 新规范：import export 【需将 script 标签设置为 type:'module'】

webpack：不管是 require、esm 新规范、图片、css、模块拆分，都可以打包

## 2. 安装-使用

cnpm install webpack webpack-cli --global 【全局】

cnpm install webpack webpack --save-dev 【本地】

webpack-cli 可以使得在全局终端中使用 webpack

npx webpack

## [资源模块](https://webpack.docschina.org/guides/asset-modules/)

使用`资源模块`代替所有 loader

webpack 只能理解 js 和 json 格式的文件，所以需要 loader

## css loader plugin

1. 安装对应所需 loader 和 plugin

   ```node
   cnpm i less-loader css-loader style-loader mini-css-extract-plugin css-minimizer-webpack-plugin -D
   ```

2. 如果有 less 样式，先将 less 解析为 css

3. 使用【css-loader】先识别 css 文件；

4. 使用【style-loader】把 css 放到页面上；

   ```js
   module: {
     rules: [
       {
         test: /\.(css|less)$/,
         use: ["style-loader", "css-loader", "less-loader"],
       },
     ],
   },
   ```

5. 将所有 css 放到一个文件中【mini-css-extract-plugin webpack5 下才能用】

   ```
   plugins: [
     new MiniCssExtractPlugin({
       filename: "style/[contenthash].css",
     }),
   ],
   ```

6. 使用【css-minimizer-webpack-plugin】插件压缩 css 代码 【写到 optimization 内，同时 mode 改为 production】

   ```
   optimization: {
     minimizer: [
       new CssMinimizerPlugin()
     ],
   },
   ```

7.

css 中加载 img

## bable-loader

1. 目的：将 es6 代码编译为 ES5，使得代码能运行在老旧浏览器上

   ```js
   cnpm i -D babel-loader @babel/core @babel/preset-env
   ```

2. 编译后报错：**`Uncaught ReferenceError: regeneratorRuntime is not defined`**

   ```js
   //安装包 【这个包中有regeneratorRuntime】
   cnpm i -S @babel/runtime

   //安装插件 这个插件会在需要regeneratorRuntime的地方自动require 导入包
   cnpm i -D @babel/plugin-transform-runtime
   ```

3. 修改 webpack.config.json

   ```js
   module: {
     rules: [
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
   ```

## [代码分离](https://webpack.docschina.org/guides/code-splitting#root)

### 入口起点

不会去重，不推荐

```js
//两个入口
entry: {
  index: "./src/index.js",
  another: "./src/another-module.js",
},

//两个入口时，出口要加 [name]
output: {
  filename: "[name].bundle.js", //为啥name是main？？
  path: path.resolve(__dirname, "./dist"),
  clean: true, //清空上次打包结果【清空dist】
  assetModuleFilename: "images/[contenthash][ext]", //生成对应的hash值和后缀【此处优先级低于module中】
},
```

这种方式存在一些`隐患`：

- 如果入口 chunk 之间包含一些重复的模块，那些重复模块都会被引入到各个 bundle 中。
- 这种方法不够灵活，并且不能动态地将核心应用程序逻辑中的代码拆分出来。

### 防止重复

#### 1. dependOn 和 share

尽管可以在 webpack 中允许每个页面使用多入口，应尽可能避免使用多入口的入口：`entry: { page: ['./analytics', './app'] }`。如此，在使用 `async` 脚本标签时，会有更好的优化以及一致的执行顺序。

```js
//两个入口
entry: {
  index: {
    import: "./src/index.js",
    dependOn: "shared",
  },
  another: {
    import: "./src/another-module.js",
    dependOn: "shared",
  },
}

optimization: {
    runtimeChunk: 'single',
},
```

#### 2. splitChunks

```js
//两个入口
entry: {
  index: "./src/index.js",
  another: "./src/another-module.js",
},
// optimization内
optimization: {
  minimizer: [new CssMinimizerPlugin()],
  splitChunks: {
    chunks: "all",
  },
},
```

### 动态导入

使用 import

js 文件内 import，

### 动态导入应用

懒加载、preFetch、preLoad

**`选择`**：preFetch > 懒加载 = preLoad

webpack 的`魔法注释`

1. 懒加载：假设有个按钮，按钮添加点击事件，使用动态导入，则在点击按钮时才会加载这个 js 文件，否则不加载
2. preFetch：在动态导入前加【魔法注释】，规定这是 prefetch，系统会在网页都加载完后【不影响首屏加载速度】，空闲下来了，再去加载这个文件；
3. preLoad：跟懒加载逻辑一样

## 缓存

**`步骤`**

1. 设置打包后 js 文件名称【contenthash 由文件内容计算出】

   ```js
   output: {
     filename: "[name].[contenthash].js",
     path: path.resolve(__dirname, "./dist"),
     clean: true, //清空上次打包结果【清空dist】
     assetModuleFilename: "images/[contenthash][ext]", //对于其他所有资源，生成对应的hash值和后缀【此处优先级低于module中】
   },
   ```

2. 虽有【contenthash】，但两次打包内容依然名称不同【`现在好像不设置也相同`】，因为：因为 webpack 在入口 chunk 中，包含了某些 boilerplate(引导模板)，特别是 runtime 和 manifest。

   ```js
   //所以需要在optimization中设置
   optimization: {
   	runtimeChunk: 'single',
   },
   ```

3. 第三方库提取到单独的 `vendor` chunk 文件中：

   将第三方库(library)（例如 `lodash` 或 `react`）提取到单独的 `vendor` chunk 文件中，是比较推荐的做法，这是因为，它们很少像本地的源代码那样频繁修改。因此通过实现以上步骤，利用 client 【浏览器】的长效缓存机制，命中缓存来消除请求，并减少向 server 获取资源，同时还能保证 client 代码和 server 代码版本一致。 这可以通过使用 [SplitChunksPlugin 示例 2](https://webpack.docschina.org/plugins/split-chunks-plugin/#split-chunks-example-2) 中演示的 [`SplitChunksPlugin`](https://webpack.docschina.org/plugins/split-chunks-plugin/) 插件的 [`cacheGroups`](https://webpack.docschina.org/plugins/split-chunks-plugin/#splitchunkscachegroups) 选项来实现。我们在 `optimization.splitChunks` 添加如下 `cacheGroups` 参数并构建：

   ```js
   optimization: {
     runtimeChunk: "single", //将其设置为 `single` 来为所有 chunk 创建一个 runtime bundle
     splitChunks: {
       cacheGroups: {
         vendor: {
           test: /[\\/]node_modules[\\/]/,
           name: "vendors",
           chunks: "all",
         },
       },
     },
   },
   ```

4. 【contenthash】的缓存作用：

   文件名称是通过设置为【contenthash】时，名称根据文件内容变动，若文件内容没变化，则打包出的 dist 名称不变，前端缓存就仍然相同，【此处针对协商缓存中 eTag】；

   对于强缓存，如果在 max-age 没过期之前想更新缓存，可以：

   1. 更新文件名，则 html 单页面请求 js 文件时，名字改变了的，会重新请求；
   2. ctrl + F5，刷新同时`清楚本地缓存`，则对于强缓存的数据需要重新加载。

## 环境变量

1. 公共路径：publicPath 【生产环境下需要】

2. webpack 命令传入参数

   ```bash
   npx webpack --env goal=local --env production --progress
   ```

3. `module.exports` 转换为函数

4. pruduction 环境下 js 压缩

   ```js
   cnpm install terser-webpack-plugin -D

   minimizer: [
     new CssMinimizerPlugin(), //css压缩
     new TerserPlugin(), //js压缩   压缩后3.15Mb --> 3.12Mb
   ],
   ```

5. 拆分配置文件
   config 文件夹下两个不同的配置文件【注意打包 dist 路径问题】，开发环境不需要压缩

6. 提取公共配置后-【`深merge`】
   对三个文件进行 深 merge

   ```
   npm -i webpack-merge -D
   ```

## 高阶

## 1.规范类

### 1. source-map

For development, use `cheap-module-eval-source-map`. For production, use `cheap-module-source-map`.

### 2. devServer

### 3. 模块热替换与热加载

### 4. eslint

### 5. git-hooks 与 husky

## 2.模块与依赖

### webpack 模块与解析原理

### [模块解析(resolve)](https://webpack.docschina.org/concepts/module-resolution/#root)

resolver 是一个帮助寻找模块绝对路径的库。 一个模块可以作为另一个模块的依赖模块，然后被后者引用，如下：

```js
import foo from "path/to/module";
// 或者
require("path/to/module");
```

所依赖的模块可以是来自应用程序的代码或第三方库。 resolver 帮助 webpack 从每个 `require`/`import` 语句中，找到需要引入到 bundle 中的模块代码。 当打包模块时，webpack 使用 [enhanced-resolve](https://github.com/webpack/enhanced-resolve) 来解析文件路径。

### 外部扩展(Externals)

# placeholder
