# 手写 webpack 核心原理

[toc]

## 一、核心打包原理

### 1.1 打包的主要流程如下

1. 需要读到入口文件里面的内容。
2. 分析入口文件，递归的去读取模块所依赖的文件内容，生成 AST 语法树。
3. 根据 AST 语法树，生成浏览器能够运行的代码

### 1.2 具体细节

1. 获取主模块内容
2. 分析模块
   - 安装@babel/parser 包（转 AST）
3. 对模块内容进行处理
   - 安装@babel/traverse 包（遍历 AST 收集依赖）
   - 安装@babel/core 和@babel/preset-env 包 （es6 转 ES5）
4. 递归所有模块
5. 生成最终代码

## 二、基本准备工作

我们先建一个项目

项目目录暂时如下：

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e4428976afb1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 已经把项目放到 **github**：https://github.com/Sunny-lucking/howToBuildMyWebpack。 可以卑微地要个 star 吗

我们创建了 add.js 文件和 minus.js 文件,然后 在 index.js 中引入，再将 index.js 文件引入 index.html。

代码如下:

add.js

```
export default (a,b)=>{
  return a+b;
}
```

minus.js

```js
export const minus = (a, b) => {
  return a - b;
};
```

index.js

```js
import add from "./add";
import { minus } from "./minus";

const sum = add(1, 2);
const division = minus(2, 1);

console.log(sum);
console.log(division);
```

index.html

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<script src="./src/index.js"></script>
</body>
</html>
```

现在我们打开 index.html。你猜会发生什么？？显然会报错，因为浏览器还不能识别 import 语法

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e4428e16ee77?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

不过没关系，因为我们本来就是要来解决这些问题的。

## 三、获取模块内容

好了，现在我们开始根据上面核心打包原理的思路来实践一下，第一步就是 实现获取模块内容。

我们来创建一个 bundle.js 文件。

```js
// 获取主入口文件
const fs = require("fs");
const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, "utf-8");
  console.log(body);
};
getModuleInfo("./src/index.js");
```

目前项目目录如下

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e4428e96990a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

我们来执行一下 bundle.js，看看时候成功获得入口文件内容

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e4428eab35af?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

哇塞，不出所料的成功。一切尽在掌握之中。好了，已经实现第一步了，且让我看看第二步是要干嘛。

哦？是分析模块了

## 四、分析模块

分析模块的主要任务是 将获取到的模块内容 解析成 AST 语法树，这个需要用到一个依赖包@babel/parser

```
npm install @babel/parser
```

ok,安装完成我们将@babel/parser 引入 bundle.js,

```js
// 获取主入口文件
const fs = require("fs");
const parser = require("@babel/parser");
const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, "utf-8");
  const ast = parser.parse(body, {
    sourceType: "module", //表示我们要解析的是ES模块
  });
  console.log(ast);
};
getModuleInfo("./src/index.js");
```

我们去看下@babel/parser 的文档：

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e4429116277c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
可见提供了三个 API，而我们目前用到的是 parse 这个 API。

它的主要作用是 parses the provided code as an entire ECMAScript program，也就是将我们提供的代码解析成完整的 ECMAScript 代码。

再看看该 API 提供的参数

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e442948b3312?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
我们暂时用到的是 sourceType，也就是用来指明我们要解析的代码是什么模块。

好了，现在我们来执行一下 bundle.js，看看 AST 是否成功生成。

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e442b1ca38e5?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

成功。又是不出所料的成功。

不过，我们需要知道的是，当前我们解析出来的不单单是 index.js 文件里的内容，它也包括了文件的其他信息。
而它的内容其实是它的属性 program 里的 body 里。如图所示

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e442b884bcf4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

我们可以改成打印 ast.program.body 看看

```js
// 获取主入口文件
const fs = require('fs')
const parser = require('@babel/parser')
const getModuleInfo = (file)=>{
    const body = fs.readFileSync(file,'utf-8')
    const ast = parser.parse(body,{
        sourceType:'module' //表示我们要解析的是ES模块
    });
    console.log(ast.program.body);
}
getModuleInfo("./src/index.js"
```

执行

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e442bddc993d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

看，现在打印出来的就是 index.js 文件里的内容（也就是我们再 index.js 里写的代码啦）.

## 五、收集依赖

现在我们需要 遍历 AST，将用到的依赖收集起来。什么意思呢？其实就是将用 import 语句引入的文件路径收集起来。我们将收集起来的路径放到 deps 里。

前面我们提到过，遍历 AST 要用到@babel/traverse 依赖包

```
npm install @babel/traverse
```

现在，我们引入。

```js
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, "utf-8");
  const ast = parser.parse(body, {
    sourceType: "module", //表示我们要解析的是ES模块
  });

  // 新增代码
  const deps = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file);
      const abspath = "./" + path.join(dirname, node.source.value);
      deps[node.source.value] = abspath;
    },
  });
  console.log(deps);
};
getModuleInfo("./src/index.js");
```

我们来看下官方文档对@babel/traverse 的描述

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e442bf94ac34?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
好吧，如此简略

不过我们不难看出，第一个参数就是 AST。第二个参数就是配置对象

我们看看我们写的代码

```
traverse(ast,{
    ImportDeclaration({node}){
        const dirname = path.dirname(file)
        const abspath = './' + path.join(dirname,node.source.value)
        deps[node.source.value] = abspath
    }
})
```

配置对象里，我们配置了 ImportDeclaration 方法，这是什么意思呢？
我们看看之前打印出来的 AST。

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e442c2eb2d42?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

ImportDeclaration 方法代表的是对 type 类型为 ImportDeclaration 的节点的处理。

这里我们获得了该节点中 source 的 value，也就是 node.source.value，

这里的 value 指的是什么意思呢？其实就是 import 的值，可以看我们的 index.js 的代码。

```js
import add from "./add";
import { minus } from "./minus";

const sum = add(1, 2);
const division = minus(2, 1);

console.log(sum);
console.log(division);
```

可见，value 指的就是 import 后面的 './add' 和 './minus'

然后我们将 file 目录路径跟获得的 value 值拼接起来保存到 deps 里，美其名曰：收集依赖。

ok，这个操作就结束了，执行看看收集成功了没？

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e442e3f91329?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

oh my god。又成功了。

## 六、ES6 转成 ES5（AST）

现在我们需要把获得的 ES6 的 AST 转化成 ES5 的 AST，前面讲到过，执行这一步需要两个依赖包

```js
npm install @babel/core @babel/preset-env
```

我们现在将依赖引入并使用

```js
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");
const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, "utf-8");
  const ast = parser.parse(body, {
    sourceType: "module", //表示我们要解析的是ES模块
  });
  const deps = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file);
      const abspath = "./" + path.join(dirname, node.source.value);
      deps[node.source.value] = abspath;
    },
  });

  新增代码;
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });
  console.log(code);
};
getModuleInfo("./src/index.js");
```

我们看看官网文档对@babel/core 的 transformFromAst 的介绍

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e442d065d8a4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

害，又是一如既往的简略。。。

简单说一下，其实就是将我们传入的 AST 转化成我们在第三个参数里配置的模块类型。

好了，现在我们来执行一下，看看结果

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e442ed52794c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

我的天，一如既往的成功。可见 它将我们写 const 转化成 var 了。

好了，这一步到此结束，咦，你可能会有疑问，上一步的收集依赖在这里怎么没啥关系啊，确实如此。收集依赖是为了下面进行的递归操作。

## 七、递归获取所有依赖

经过上面的过程，现在我们知道 getModuleInfo 是用来获取一个模块的内容，不过我们还没把获取的内容 return 出来，因此，更改下 getModuleInfo 方法

```js
const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, "utf-8");
  const ast = parser.parse(body, {
    sourceType: "module", //表示我们要解析的是ES模块
  });
  const deps = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file);
      const abspath = "./" + path.join(dirname, node.source.value);
      deps[node.source.value] = abspath;
    },
  });
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });
  // 新增代码
  const moduleInfo = { file, deps, code };
  return moduleInfo;
};
```

我们返回了一个对象 ，这个对象包括**该模块的路径（file）**，**该模块的依赖（deps）**，**该模块转化成 es5 的代码**

该方法只能获取一个模块的的信息，但是我们要怎么获取一个模块里面的依赖模块的信息呢？

没错，看标题，，你应该想到了就算递归。

现在我们来写一个递归方法，递归获取依赖

```js
const parseModules = (file) => {
  const entry = getModuleInfo(file);
  const temp = [entry];
  for (let i = 0; i < temp.length; i++) {
    const deps = temp[i].deps;
    if (deps) {
      for (const key in deps) {
        if (deps.hasOwnProperty(key)) {
          temp.push(getModuleInfo(deps[key]));
        }
      }
    }
  }
  console.log(temp);
};
```

讲解下 parseModules 方法：

1. 我们首先传入主模块路径
2. 将获得的模块信息放到 temp 数组里。
3. 外面的循坏遍历 temp 数组，此时的 temp 数组只有主模块
4. 里面再获得主模块的依赖 deps
5. 遍历 deps，通过调用 getModuleInfo 将获得的依赖模块信息 push 到 temp 数组里。

目前 bundle.js 文件：

```js
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");
const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, "utf-8");
  const ast = parser.parse(body, {
    sourceType: "module", //表示我们要解析的是ES模块
  });
  const deps = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file);
      const abspath = "./" + path.join(dirname, node.source.value);
      deps[node.source.value] = abspath;
    },
  });
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });
  const moduleInfo = { file, deps, code };
  return moduleInfo;
};

// 新增代码
const parseModules = (file) => {
  const entry = getModuleInfo(file);
  const temp = [entry];
  for (let i = 0; i < temp.length; i++) {
    const deps = temp[i].deps;
    if (deps) {
      for (const key in deps) {
        if (deps.hasOwnProperty(key)) {
          temp.push(getModuleInfo(deps[key]));
        }
      }
    }
  }
  console.log(temp);
};
parseModules("./src/index.js");
```

按照目前我们的项目来说执行完，应当是 temp 应当是存放了 index.js,add.js,minus.js 三个模块。
,执行看看。

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e442e4a822fc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

牛逼！！！确实如此。

不过现在的 temp 数组里的对象格式不利于后面的操作，我们希望是以文件的路径为 key，{code，deps}为值的形式存储。因此，我们创建一个新的对象 depsGraph。

```js
const parseModules = (file) => {
  const entry = getModuleInfo(file);
  const temp = [entry];
  const depsGraph = {}; //新增代码
  for (let i = 0; i < temp.length; i++) {
    const deps = temp[i].deps;
    if (deps) {
      for (const key in deps) {
        if (deps.hasOwnProperty(key)) {
          temp.push(getModuleInfo(deps[key]));
        }
      }
    }
  }
  // 新增代码
  temp.forEach((moduleInfo) => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code,
    };
  });
  console.log(depsGraph);
  return depsGraph;
};
```

ok，现在存储的就是这种格式啦

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e442ed76d596?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 八、处理两个关键字

我们现在的目的就是要生成一个 bundle.js 文件，也就是打包后的一个文件。其实思路很简单，就是把 index.js 的内容和它的依赖模块整合起来。然后把代码写到一个新建的 js 文件。

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e442fd3ba98e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

我们把这段代码格式化一下

```js
// index.js
"use strict";
var _add = _interopRequireDefault(require("./add.js"));
var _minus = require("./minus.js");
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var sum = (0, _add["default"])(1, 2);
var division = (0, _minus.minus)(2, 1);
console.log(sum);
console.log(division);
```

```js
// add.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports["default"] = void 0;
var _default = function _default(a, b) {
  return a + b;
};
exports["default"] = _default;
```

但是我们现在是不能执行 index.js 这段代码的，因为浏览器不会识别执行 require 和 exports。

不能识别是为什么？不就是因为没有定义这 require 函数，和 exports 对象。那我们可以自己定义。

我们创建一个函数

```js
const bundle = (file) => {
  const depsGraph = JSON.stringify(parseModules(file));
};
```

我们将上一步获得的 depsGraph 保存起来。

现在返回一个整合完整的字符串代码。

怎么返回呢？更改下 bundle 函数

```js
const bundle = (file) => {
  const depsGraph = JSON.stringify(parseModules(file));
  return `(function (graph) {
                function require(file) {
                    (function (code) {
                        eval(code)
                    })(graph[file].code)
                }
                require(file)
            })(depsGraph)`;
};
```

我们看下返回的这段代码

```js
(function (graph) {
  function require(file) {
    (function (code) {
      eval(code);
    })(graph[file].code);
  }
  require(file);
})(depsGraph);
```

其实就是

1. 把保存下来的 depsGraph，传入一个立即执行函数。
2. 将主文件路径传入 require 函数执行
3. 执行 reuire 函数的时候，又立即执行一个立即执行函数，这里是把 code 的值传进去了
4. 执行 eval（code）。也就是执行 code 这段代码

我们再来看下 code 的值

```
// index.js
"use strict"
var _add = _interopRequireDefault(require("./add.js"));
var _minus = require("./minus.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var sum = (0, _add["default"])(1, 2);
var division = (0, _minus.minus)(2, 1);
console.log(sum); console.log(division);

```

没错执行这段代码的时候，又会用到 require 函数。此时 require 的参数为 add.js 的路径，哎，不是绝对路径，需要转化成绝对路径。因此写一个函数 absRequire 来转化。怎么实现呢？我们来看下代码

```
(function (graph) {
    function require(file) {
        function absRequire(relPath) {
            return require(graph[file].deps[relPath])
        }
        (function (require,code) {
            eval(code)
        })(absRequire,graph[file].code)
    }
    require(file)
})(depsGraph)
```

实际上是实现了一层拦截。

1. 执行 require（'./src/index.js'）函数
2. 执行了

```
(function (require,code) {
    eval(code)
})(absRequire,graph[file].code)
```

3. 执行 eval，也就是执行了 index.js 的代码。
4. 执行过程会执行到 require 函数。
5. 这时会调用这个 require，也就是我们传入的 absRequire
   ![](https://user-gold-cdn.xitu.io/2020/7/24/1737e44302247961?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
6. 而执行 absRequire 就执行了`return require(graph[file].deps[relPath])`这段代码，也就是执行了外面这个 require

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e4430a58feb7?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
在这里`return require(graph[file].deps[relPath])`，我们已经对路径转化成绝对路径了。因此执行外面的 require 的时候就是传入绝对路径。

7. 而执行 require（"./src/add.js"）之后，又会执行 eval，也就是执行 add.js 文件的代码。

是不是有点绕？其实是个递归。

这样就将代码整合起来了，但是有个问题，就是在执行 add.js 的 code 时候，会遇到 exports 这个还没定义的问题。如下所示

```js
// add.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports["default"] = void 0;
var _default = function _default(a, b) {
  return a + b;
};
exports["default"] = _default;
```

我们发现 这里它把 exports 当作一个对象来使用了，但是这个对象还没定义，因此我们可以自己定义一个 exports 对象。

```
(function (graph) {
    function require(file) {
        function absRequire(relPath) {
            return require(graph[file].deps[relPath])
        }
        var exports = {}
        (function (require,exports,code) {
            eval(code)
        })(absRequire,exports,graph[file].code)
        return exports
    }
    require(file)
})(depsGraph)
```

我们增添了一个空对象 exports，执行 add.js 代码的时候，会往这个空对象上增加一些属性，

```js
// add.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports["default"] = void 0;
var _default = function _default(a, b) {
  return a + b;
};
exports["default"] = _default;
```

比如，执行完这段代码后

```
exports = {
  __esModule：{  value: true}，
  default：function _default(a, b) {  return a + b;}
}
```

然后我们把 exports 对象 return 出去。

```js
var _add = _interopRequireDefault(require("./add.js"));
```

可见，return 出去的值，被\_interopRequireDefault 接收，\_interopRequireDefault 再返回 default 这个属性给\_add，因此`_add = function _default(a, b) { return a + b;}`

现在明白了，为什么 ES6 模块 引入的是一个对象引用了吧，因为 exports 就是一个对象。

至此，处理；两个关键词的功能就完整了。

```js
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");
const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, "utf-8");
  const ast = parser.parse(body, {
    sourceType: "module", //表示我们要解析的是ES模块
  });
  const deps = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file);
      const abspath = "./" + path.join(dirname, node.source.value);
      deps[node.source.value] = abspath;
    },
  });
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });
  const moduleInfo = { file, deps, code };
  return moduleInfo;
};
const parseModules = (file) => {
  const entry = getModuleInfo(file);
  const temp = [entry];
  const depsGraph = {};
  for (let i = 0; i < temp.length; i++) {
    const deps = temp[i].deps;
    if (deps) {
      for (const key in deps) {
        if (deps.hasOwnProperty(key)) {
          temp.push(getModuleInfo(deps[key]));
        }
      }
    }
  }
  temp.forEach((moduleInfo) => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code,
    };
  });
  return depsGraph;
};
// 新增代码
const bundle = (file) => {
  const depsGraph = JSON.stringify(parseModules(file));
  return `(function (graph) {
        function require(file) {
            function absRequire(relPath) {
                return require(graph[file].deps[relPath])
            }
            var exports = {}
            (function (require,exports,code) {
                eval(code)
            })(absRequire,exports,graph[file].code)
            return exports
        }
        require('${file}')
    })(${depsGraph})`;
};
const content = bundle("./src/index.js");

console.log(content);
```

来执行下，看看效果

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e4431d738737?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
确实执行成功。接下来，把返回的这段代码写入新创建的文件中

```
//写入到我们的dist目录下
fs.mkdirSync('./dist');
fs.writeFileSync('./dist/bundle.js',content)
```

至次，我们的手写 webpack 核心原理就到此结束了。

我们参观下生成的 bundle.js 文件

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e4432571632c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

发现其实就是将我们早期收集的所有依赖作为参数传入到立即执行函数当中，然后通过 eval 来递归地执行每个依赖的 code。

现在我们将 bundle.js 文件引入 index.html 看看能不能执行

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e44325c1b044?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

成功。。。。。惊喜。。

感谢您也恭喜您看到这里，我可以卑微的求个 star 吗！！！
