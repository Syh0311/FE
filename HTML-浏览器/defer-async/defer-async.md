## defer async 区别

-

## defer async 三点不同

在*正常情况下*，即 `<script>` 没有任何额外属性标记的情况下，有几点共识

1. JS 的脚本分为**加载、解析、执行**几个步骤，简单对应到图中就是 `fetch` (加载) 和 `execution` (解析并执行)
2. **JS 的脚本加载(fetch)且执行(execution)会阻塞 DOM 的渲染**，因此 JS 一般放到最后头

`相同点`: **异步加载 (fetch)**

### 三点不同

1. 是否阻塞 HTML，
2. 带 defer 标签的 script 解析顺序
3. defer 一定在 DOMContentLoader 前执行，async 随机

### 详细说明

1. defer 异步加载完后，等到【HTML 解析完】再解析，而 async 异步加载完后立马解析，阻塞了 HTML 解析；
2. defer 的解析顺序是 html 内顺序，async 是随机的【谁先下载完谁先解析】；（defer 本身就是等待再解析的）
3. DOMContentLoaded 下【总结：defer 在 DOMContentLoaded`前解析完`，`async看情况`】
   defer ： 异步下载 js -> HTML 解析完 -> 解析异步 js -> DOMContentLoaded；
   async： 异步下载 js -> 下载完后分两种情况：
   1. 此时 HTML 已经解析完，`HTML解析完后触发DOMContentLoaded`，继续解析 js，此时 DOMContentLoaded 在 async 前
   2. 此时 HTML 还未解析完，js 解析`阻塞HTML解析`，DOMContentLoaded 在 async 的 js 后

## [async、defer 与 DOMContentLoaded 的执行先后关系](https://blog.csdn.net/zyj0209/article/details/79698430)

async defer 的第三点不同之处

## css 会阻塞页面加载吗【css DomeContentLoaded】

https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work 【非常全面】
https://juejin.cn/post/6844903667733118983 【css 会阻塞页面加载吗】
html 和 css 的下载顺序、解析顺序？？【css 构建很快】

1. css 加载不会阻塞`HTML(DOM)的解析`；【`仍有问题`】
2. css 加载会阻塞` DOM树的渲染`；
   【css 解析为 cssOm 后，结合 DOM 才能生成 renderTree，没法合成 render 树】
3. css 加载会阻塞后面 js 语句的执行。
   【js `可能会获取样式`，所以 css 加载完才能执行 ;而 js 本身就是 html 的一部分，`此时css会阻塞HTML的解析`】
4. `DOMContentLoaded`则为`HTML解析完成`，已生成`domTree，但cssomTree未知`

因此，为了避免让用户看到长时间的白屏时间，我们应该尽可能的提高 css 加载速度，比如可以使用以下几种方法:

1. 使用 CDN(因为 CDN 会根据你的网络状况，替你挑选最近的一个具有缓存内容的节点为你提供资源，因此可以减少加载时间)
2. 对 css 进行压缩(可以用很多打包工具，比如 webpack,gulp 等，也可以通过开启 gzip 压缩)
3. 合理的使用缓存(设置 cache-control,expires,以及 E-tag 都是不错的，不过要注意一个问题，就是文件更新后，你要避免缓存而带来的影响。其中一个解决防范是在文件名字后面加一个版本号)
4. 减少 http 请求数，将多个 css 文件合并，或者是干脆直接写成内联样式(内联样式的一个缺点就是不能缓存)
