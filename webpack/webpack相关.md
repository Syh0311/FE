## 目录

[toc]

## [webpack面试题总结](https://juejin.cn/post/6844904094281236487)



1. [「吐血整理」再来一打Webpack面试题](https://juejin.cn/post/6844904094281236487)
2. [24 个实例入门并掌握「Webpack4」(一)](https://juejin.cn/post/6844903817322954759)
2. [2020年了,再不会webpack敲得代码就不香了(近万字实战)](https://juejin.cn/post/6844904031240863758?share_token=08e6a8e1-396c-4cbe-bff6-2a2ca7a2a82b)

## webpack干的事

分为三方面

一、打包、编译时间优化

二、打包体积优化

三、首屏优化

### 一、打包、编译时间优化

#### 全能王 - TerserPlugin

TerserPlugin 可`开启多线程并行打包`，提高打包速度

```js
optimization: {
  minimize: isProd,
  minimizer: [
    // webpack4中UglifyJsPlugin废弃。
    // 4.48MB -> 2.77MB  88s缓存后12s
    new TerserPlugin({
      parallel: true, // 电脑cpu核数-1
      terserOptions: {
        output: {
          comments: false, // 默认为true，保留注释
        },
        compress: {
          drop_console: true, // 2.67MB->2.65MB
        },
      },
      // minify: TerserPlugin.uglifyJsMinify, //2.65->2.65
      extractComments: false, // 是否提取注释到单独文件中
    }),
  ],
},
```

#### babel-loader

解析 js 时开启`"babel-loader?cacheDirectory"`，将不变动的内容缓存起来

```js
{
  test: /\.js$/,
  include: path.resolve("src"),
  exclude: [path.resolve("../../node_modules")],
  use: [
    // "cache-loader", // 缓存位置：node_modules/.cache/cache-loader
    "thread-loader",
    "babel-loader?cacheDirectory", // 开启缓存
  ],
},
```

thread-loader 没排上用场？？
**`minimize TerserPlugin 下`**

1. 第一次打包-无缓存时                            89.6s
2. 第一次打包-无缓存-thread-loader        86.8s
3. babel + cache                                          11.9s
4. babel + cache + thread-loader               11.8s

**`非 minimize TerserPlugin 下`**

1. 第一次打包-无缓存时                            23.5s
2. 第一次打包-无缓存-thread-loader        23.1s
3. babel + cache                                           8.9s
4. babel + cache + thread-loader                8.3s



#### cache和多线程 需注意

**`注：`**`cache【读写文件】`和 `thread【创建线程】`自身也会耗时 所以在耗时的 loader 上使用这两个

#### 文件路径 alias-in/exclude

1. alias 别名，快速定位查找；
2. js和css知名include和exclude；

通过以上两种方式，快速找到要`解析的模块所依赖的模块位置`，从而较少查找模块时间消耗

### 二、打包体积优化 - 分包

#### 代码压缩 JS - CSS

**`总结`**：

1. **JavaScript - TerserPlugin**
2. **CSS- OptimizeCssAssetsPlugin - MiniCssExtractPlugin**
   - [【升级webpack4】mini-css-extract-plugin 替换 extract-text-webpack-plugin](https://juejin.cn/post/6878096648199897102)



**`JavaScript - TerserPlugin`**

TerserPlugin内设置`output`和`compress`，可

- 去除注释；
- 丑化代码，减小不必要的命名开销；
- webpack4 中 `UglifyJsPlugin 废弃`，被 TerSerPlugin 替代。

```js
optimization: {
  minimize: isProd, //需设置为true
  minimizer: [
    // webpack4中UglifyJsPlugin废弃。
    // 4.48MB -> 2.77MB  88s缓存后12s
    new TerserPlugin({
      parallel: true, // 电脑cpu核数-1
      terserOptions: {
        output: {
          comments: false, // 默认为true，保留注释
        },
        compress: {
          drop_console: true, // 2.67MB->2.65MB
        },
      },
      // minify: TerserPlugin.uglifyJsMinify, //2.65->2.65
      extractComments: false, // 是否提取注释到单独文件中
    }),
  ],
},
```

**`CSS- OptimizeCssAssetsPlugin - MiniCssExtractPlugin `**

优化css，不知道为啥没css了？？

```js
new OptimizeCssAssetsPlugin({
  assetNameRegExp: /\.css$/g,
  cssProcessor: require("cssnano"), //引入cssnano配置压缩选项
  cssProcessorPluginOptions: {
    preset: ["default", { discardComments: { removeAll: true } }],
  },
  canPrint: true, //是否将插件信息打印到控制台
}),
new MiniCssExtractPlugin({
  filename: "./css/[name].[chunkhash:10].css",
}),
```

#### [splitChunks](https://juejin.cn/post/6844904195737255943)

splitChunk有两个主要作用：

1. `抽离重复模块`，只打包第一次出现的模块；
2. `分包`，设置大于某个大小的文件进行分包

通过splitChunk



**写法一：**直接写到`configureWebpack -> optization -> splitChunks`下，与minimize同级

```js
// 2.68MB --> 2.64MB
// 从 webpack4开始，移除了CommonsChunkPlugin，取而代之的是 optimization.splitChunks。
splitChunks: {
  chunks: "all", // 指定打包同步加载还是异步加载
  minSize: 10240, //无用 构建出来的chunk大于10kb才会被分割
  maxSize: 0, //无用 会尝试根据这个大小进行代码分割

  // cacheGroups的作用就相当于是一个分组条件，满足这个条件输出为一个chunks。
  cacheGroups: {
    // 第三方公共包
    vendor: {
      name: "vendorSyh",
      test: /[\\/]node_modules[\\/]/, //在这个文件夹下的是 vendor
      priority: 10, // 打包权重，数值越大权重越高
      chunks: "initial", // 只打包初始时的依赖
    },
    // 1.55MB --> 继续分包、CDN + external
    commons: {
      name: "splitCommonSyh",
      minSize: 10240, //构建出来的chunk大于10kb才会被分割
      minChunks: 2, //模块被引用2次以上的才抽离
      priority: 0,
      reuseExistingChunk: true,
    },
    // 分出去个js包 有啥用？？
    // css: {
    //   name: "css",
    //   test: /\.css$/,
    //   minChunks: 1,
    //   enforce: true,
    // },
  },
},
```

**写法二：**`chainWebpack`与devServer、configureWebpack`同级别`，`高于plugin`

```js
chainWebpack: (config) => {
  // 2.68MB --> 2.64MB
  // 从 webpack4开始，移除了CommonsChunkPlugin，取而代之的是 optimization.splitChunks。
  config.optimization.splitChunks({
    chunks: "all",
    cacheGroups: {
      // 第三方公共包
      vendor: {
        name: "vendorSyh",
        test: /[\\/]node_modules[\\/]/,
        priority: 10, // 打包权重，数值越大权重越高
        chunks: "initial", // 只打包初始时的依赖
      },
      // 1.55MB --> 继续分包、CDN + external
      commons: {
        name: "splitCommonSyh",
        minSize: 30,
        minChunks: 2, //模块被引用2次以上的才抽离
        priority: 0,
        reuseExistingChunk: true,
      },
    },
  });
},
```



```js
optimization: {
  minimize: isProd, // 需设置为true

  splitChunks: {
    chunks: "all",
    cacheGroups: {
      // 第三方公共包
      vendor: {
        name: "vendorSyh",
        test: /[\\/]node_modules[\\/]/,
        priority: 10, // 打包权重，数值越大权重越高
        chunks: "initial", // 只打包初始时的依赖
      },
      // 1.55MB --> 继续分包、CDN + external
      commons: {
        name: "splitCommonSyh",
        minSize: 30,
        minChunks: 2, //模块被引用2次以上的才抽离
        priority: 0,
        reuseExistingChunk: true,
      },
    },
  },
},
```



#### [externals && cdn](https://blog.csdn.net/j178202798/article/details/117443143) && defer

通过cdn引入，不打包到bundle.js中

1. `externals作用`：

   - 防止将import的包【`依赖`】被打包到bundle里；

   - 给包起别名

2. externals形式：

   - 键值对

3. 总结下：

   - `cdn+externals`能降低打包大小，提高打包速度；`但`
   - `但`不能减小整个的加载速度；
   - 所以可`配合 defer`，将`不是很急需的依赖`通过cnd加载 【如cesium，mapbox，truf】
   - 但是cdn也可起一个`分发`的作用，具体看`dist的部署是否也是cdn去拿`

```js
externals: {
  CesiumSyh: "Cesium",
  "@turf/turf": "turf", // splitCommonSyh内 2.65MB->2.51MB
},
```

#### gzip插件

通过`CompressionWebpackPlugin`插件来实现对js、css、html等文件的压缩，

- 通过`test`进行正则筛选，
- 通过设置`门槛 threshold`限定超过多大的文件进行压缩

```js
new CompressionWebpackPlugin({
  test: /\.js$|\.html$|\.css$/u,
  // threshold: 4096, // 超过 4kb 压缩
}),
```

#### Tree Shaking 及原理

### 三、首屏优化 - hash缓存

#### **从`两个方面`考虑：**

**一、文件方面**

1. 减小打包体积；
2. 权衡打包文件`数量`与`大小`
3. 路由懒加载

**二、网络传输**

1. 缓存
   - contenthash
3. gzip

#### hash分类

**缓存 -- [通过hash值给文件命名](https://juejin.cn/post/6844904018053955591)**

1. `hash`                     
  - 基于build，所有chunk文件使用相同的hash。项目中`任一文件内容发生变化都会`影响所有chunk文件hash
  - 所有文件`公用`一个hash值，`不推荐`
2. `chunkhash`      
    基于 webpack 的 entry point ，任意文件改变`只会影响其所属的chunk`，不会影响其它chunk。
3. `contenthash`         
    基于文件内容产生的hash，影响范围`只限于本文件`

[**`前提-js中引用css`**](https://juejin.cn/post/6844903935812059144)

1. 不管是在chunkhash还是contenthash，修改css都会引发js和css的改变；
2. 在chunkhash时，由于js和css的chunkhash`是一样的`，所以修改了js，会导致整个chunk的chunkhash改变，它们俩是同一个chunkhash，肯定就都变了，
3. 而在contenthash时，js修改不会影响css的改变

## webpack原理

### 一、loader、plugin 原理

### 二、常用 plugin、loader

### 三、webpack 编译原理

### 四、HMR原理

1. [原理](https://zhuanlan.zhihu.com/p/30669007)

### 五、Babel原理

## webpack配置

### 一、sourceMap devTool



## 学校- 项目打包体积优化

打包 60Mb -> 22Mb -> 16Mb -> 9Mb

1. 本来cesium  CopyWebpackPlugin 60Mb

2. 60Mb --> 22Mb 
   删除cesium 的 CopyWebpackPlugin 22Mb
3. 22Mb->16Mb
   cdn+externals：
   - cdn引用cesium，
   - externals作用 **防止**将某些 `import` 的包(package)**打包**到 bundle 中，而是在运行时(runtime)再去从外部获取这些*扩展依赖(external dependencies)*。
4. 使用`splitChunks`去重复打包  16Mb->9Mb

## 参考

### splitChunk

1. [如何使用 splitChunks 精细控制代码分割](https://juejin.cn/post/6844904103848443912)  `各个属性具体介绍`
1. [在淘宝优化了一个大型项目，分享一些干货（SplitChunk**`代码实例`**）](https://juejin.cn/post/6844904183917871117)
2. [Webpack系列（二）：SplitChunksPlugin源码讲解](https://juejin.cn/post/6844904196790026253)
3. [精读 Webpack SplitChunksPlugin 插件源码](https://juejin.cn/post/7098213874788204580)
3. [Webpack: An in-depth introduction to SplitChunksPlugin](https://indepth.dev/posts/1490/webpack-an-in-depth-introduction-to-splitchunksplugin)
4. [webpack4 之 cacheGroups 分包【究极奥义】](https://juejin.cn/post/6919684767575179278) 分包策略 `10k~100k最佳`
5. [关于webpack.optimization.splitChunks的心得](https://juejin.cn/post/6921606847359582215)  **webpack Prefetch**
6. [webpack splitChunks配置（一）chunks属性的使用](https://juejin.cn/post/6844904195737255943#heading-1)
7. [webpack splitChunks配置（二）cacheGroups属性的使用](https://juejin.cn/news)

### TerserPlugin

1. [[译]Uglify vs Babel-minify vs Terser 一场代码压缩的pk](https://juejin.cn/post/6844903933370957831)
1. [【升级webpack4】mini-css-extract-plugin 替换 extract-text-webpack-plugin](https://juejin.cn/post/6878096648199897102)

### css

#### webpack4之前

使用extract-text-webpack-plugin分离打包，optimize-css-assets-webpack-plugin压缩，



webpack4后：使用MiniCssExtractPlugin分离打包，css-minimizer-webpack-plugin压缩。

1. [mini-css-extract-plugin插件快速入门](https://juejin.cn/post/6844903826630115335)
1. [webpack-css打包超详解 ( 分离 & 压缩 )](https://blog.csdn.net/weixin_45809580/article/details/118282429)

### hash命名

1. [webpack中的hash、chunkhash、contenthash分别是什么](https://juejin.cn/post/6844903935812059144)

### 编译时间优化

1. [前端项目常规性能优化](https://juejin.cn/post/7080066104613142559)
