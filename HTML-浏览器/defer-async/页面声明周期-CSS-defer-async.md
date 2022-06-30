## [页面生命周期](https://zh.javascript.info/onload-ondomcontentloaded)

### **DOMContent**Loaded 事件

**DomContentLoaded 事件只关注 HTML 是否被解析完**



- 浏览器完全加载HTML，已构建DOM树，可以查找DOM节点并初始化接口；

- 但像 `<img>` 和样式表之类的外部资源可能尚未加载完成

- 可以理解为HTML解析完成，已构建DOM树，但CSSOMTree未知

- `DOMContentLoaded` 事件发生在 `document` 对象上，所以需要addEventListener捕获：

  ```js
  document.addEventListener("DOMContentLoaded", ready);
  // 不是 "document.onDOMContentLoaded = ..."
  ```

  

#### [DOMContentLoaded 和脚本](https://zh.javascript.info/onload-ondomcontentloaded#domcontentloaded-he-jiao-ben)

**不会阻塞 `DOMContentLoaded` 的脚本**

此规则有两个例外：

1. 具有 `async` 特性（attribute）的脚本不会阻塞 `DOMContentLoaded`，[稍后](https://zh.javascript.info/script-async-defer) 我们会讲到。
2. 使用 `document.createElement('script')` 动态生成并添加到网页的脚本也不会阻塞 `DOMContentLoaded`。

#### [DOMContentLoaded 和样式](https://zh.javascript.info/onload-ondomcontentloaded#domcontentloaded-he-yang-shi)

**`取决于CSS在js之前还是之后`**

外部样式表不会影响 DOM，因此 `DOMContentLoaded` 不会等待它们。

但这里有一个陷阱。如果在样式后面有一个脚本，那么该脚本必须等待样式表加载完成：

```js
<link type="text/CSS" rel="stylesheet" href="style.CSS">
<script>
  // 在样式表加载完成之前，脚本都不会执行
  alert(getComputedStyle(document.body).marginTop);
</script>
```

原因是，脚本可能想要获取元素的坐标和其他与样式相关的属性，如上例所示。因此，它必须等待样式加载完成。

当 `DOMContentLoaded` 等待脚本时，它现在也在等待脚本前面的样式。

#### [浏览器内建的自动填充](https://zh.javascript.info/onload-ondomcontentloaded#liu-lan-qi-nei-jian-de-zi-dong-tian-chong)

Firefox，Chrome 和 Opera 都会在 `DOMContentLoaded` 中自动填充表单。

例如，如果页面有一个带有登录名和密码的表单，并且浏览器记住了这些值，那么在 `DOMContentLoaded` 上，浏览器会尝试自动填充它们（如果得到了用户允许）。

因此，如果 `DOMContentLoaded` 被需要加载很长时间的脚本延迟触发，那么自动填充也会等待。你可能在某些网站上看到过（如果你使用浏览器自动填充）—— 登录名/密码字段不会立即自动填充，而是在页面被完全加载前会延迟填充。这实际上是 `DOMContentLoaded` 事件之前的延迟。

### load 事件

- 浏览器不仅加载完成了 HTML，还加载完成了所有外部资源：图片，样式等。
- 外部资源已加载完成，样式`已被应用`，图片大小也已知了。 

#### window.onload

使用`window.onload`触发

当整个页面，包括样式、图片和其他资源被加载完成时，会触发 `window` 对象上的 `load` 事件。可以通过 `onload` 属性获取此事件。

下面的这个示例正确显示了图片大小，因为 `window.onload` 会等待所有图片加载完毕：

```js
<script>
  window.onload = function() { // 也可以用 window.addEventListener('load', (event) => {
    alert('Page loaded');

    // 此时图片已经加载完成
    alert(`Image size: ${img.offsetWidth}x${img.offsetHeight}`);
  };
</script>

<img id="img" src="https://en.js.cx/clipart/train.gif?speed=1&cache=0">
```

### beforeunload 事件

 —— 用户正在离开：我们可以检查用户是否保存了更改，并询问他是否真的要离开。 

### unload 事件

 —— 用户`几乎已经离开`了，但是我们仍然可以启动一些操作，例如发送统计数据。



## defer async

### 两个相同点

1. 都是异步加载；
2. 都在load事件之前。

### 三个不同点

#### 一、是否阻塞 HTML

1. async异步加载完后`立马解析执行`阻塞HTML解析；
2. defer不阻塞；

#### 二、是否顺序解析

1. 因为async是异步加载之后立马解析执行的，而其异步加载不保证加载顺序，所以async不是顺序解析的；
2. defer异步加载之后，`不阻塞`HTML继续解析，HTML解析完后，开始`顺序解析执行defer脚本`；

#### 三、[ async defer DOMContentLoaded load](https://blog.csdn.net/zyj0209/article/details/79698430)

**总结：**

- defer 一定在 DOMContentLoaded 前【解析执行】，async 随机
- sync async defer 都在load事件之前【解析执行】



1. sync：DOMContentLoaded 在HTML解析完后触发；
   ![img](D:\Sync\typora图片\format,png.png)

2. async： 异步下载 js -> 下载完后分两种情况；

   ![image-20220628104640014](D:\Sync\typora图片\image-20220628104640014.png)

3. defer ： 异步下载 js -> HTML 解析完 -> 解析异步 js -> DOMContentLoaded；

   ![image-20220628104604534](D:\Sync\typora图片\image-20220628104604534.png)

   
   

#### 不同的总结 - 可删可留

1. defer 异步加载完后，等到【HTML 解析完】再解析，而 async 异步加载完后立马解析，阻塞了 HTML 解析；

2. defer 的解析顺序是 html 内顺序，async 是随机的【谁先下载完谁先解析】；（defer 本身就是等待再解析的）

3. DOMContentLoaded 下【总结：defer 在 DOMContentLoaded`前解析完`，`async看情况`】
   
   无异步脚本：DOMContentLoaded 在HTML解析完后触发；
   
   defer ： 异步下载 js -> HTML 解析完 -> 解析异步 js -> DOMContentLoaded；
   async： 异步下载 js -> 下载完后分两种情况：
   
   1. 此时 HTML 已经解析完，`HTML解析完后触发DOMContentLoaded`，继续解析 js，此时 DOMContentLoaded 在 async 前
   2. 此时 HTML 还未解析完，js 解析`阻塞HTML解析`，DOMContentLoaded 在 async 的 js 后



## [CSS阻塞DOM树的解析渲染吗](https://www.yisu.com/zixun/400181.html)

**Q：[js执行会阻塞DOM树的解析和渲染，那么`CSS加载会阻塞DOM树的解析和渲染`吗？](https://juejin.cn/post/6844903667733118983)**

问题同：**CSS与DOMContentLoaded关系**



### 总结

分以下**三种情况**，其中2和3可合并：

1. CSS在js前：
   - `CSS-> CSSOM  -> js -> HTML ->  DOMContentLoaded`
   - CSS在js前，则DOMContentLoaded事件会在`CSS加载完`后才执行；
     【因为DOMContentLoaded等HTML解析，HTML等js解析，js等CSS解析，所以当CSS再js前时，阻塞了js的解析与执行】  
2. CSS在js后：
   - `js -> HTML-> DOMConentLoaded -> CSS-> CSSOM`
   - CSS在js前，则DOMContentLoaded都不会等待CSS加载，并且DOMContentLoaded事件也不会等待图片、视频等其他资源加载。
3. 无CSS ：
   - `js -> HTML-> DOMConentLoaded -> CSS-> CSSOM`
   - 同CSS在js前

`DOMContentLoaded时`【可以理解为`HTML解析完成`，已生成`domTree，但CSSomTree未知`】



### CSS-首屏优化

基本还是那两方面

一、文件数量与大小

1. 对 CSS进行压缩【webpack用到的插件 gzip】
2. 减少 HTTP 请求数，合并CSS文件，写成内联样式【但内联样式不能缓存】

二、提前与延缓

1. 合理的使用缓存(设置 cache-control、expires、E-tag )
2. preFetch
3. 使用 CDN

### 参考

[css加载会造成阻塞吗？](https://juejin.cn/post/6844903667733118983) 【即阻塞DOM解析渲染吗】

[渲染页面：浏览器的工作原理](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work) 【非常全面】

