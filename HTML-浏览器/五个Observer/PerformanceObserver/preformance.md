## [Performance 与 PerformanceObserver](https://juejin.cn/post/6844903818132455432)

1. W3C 性能小组鼓励开发人员在浏览器兼容性允许的情况下，`尽可能使用 PerformanceObserver`。
2. 另外，`新的性能API和指标`可能只能通过 PerformanceObserver 接口获得。
   新的性能 API 和指标有啥？？



相比`PerformanceObserver`，`window.performance`在浏览器中兼容性较好，另外 `Performance Hooks` 在Node.js  v12.x 中已经处于 Stable 阶段，可以正式投入生产环境使用。

```js
const {performance, PerformanceObserver} = require('perf_hooks');
```

推荐在浏览器兼容的情况下使用`PerformanceObserver`，使用这种观察者模式可以`解决主动调用`的问题，而且`更为优雅`。

## [Performance](https://juejin.cn/post/6844903818132455432)

### performance 使用

```js
init();
function init() {
  console.log("[ performance ]", performance);
  // see [[USER-TIMING-2]]
  performance.mark("startWork");
  setTimeout(() => {
    performance.mark("endWork");
    performance.measure("work_syh", "startWork", "endWork");
    measurePerf();
    console.log("------------");
    measurePerfByName();
  }, 2000);
}

function measurePerf() {
  // 使用了performance.getEntries来获取浏览器缓冲区中所有的性能数据记录
  performance
    .getEntries() // 获取所有
    .map((entry) => JSON.stringify(entry, null, 2))
    .forEach((json) => console.log(json));
}

function measurePerfByName() {
  // 使用xx获取浏览器缓冲区内部所有名称对应的性能记录
  performance
    .getEntriesByName("work_syh")
    .map((entry) => JSON.stringify(entry, null, 2))
    .forEach((json) => console.log(json));
}
```



### performance.getEntries()

获取`浏览器缓冲区`内保存的性能监控指标 的所有数据

### performance.getEntries('name')

`name属性包括`

1. resource 资源名称,
2. first-paint,
3. first-content-paint,
4. 自定义的mark名称 ：
   通过 performance.mark('name')添加的
   可通过 performance.getEntriesByName('name') 获取
5. 等

### performance.getEntriesByType('type')

`type属性包括`

1. frame：event-loop 时的每一帧
2. navigation：导航
3. resource：资源
4. mark: 打点，得到一个时间戳
5. measure：在两个点之间测量
6. paint：绘制
7. longtask(好像只有 chrome支持)：任何在浏览器中执行超过 50 ms 的任务，都是 long task

## PerformanceObserver 

### PerformanceObserver 解决的三个问题

如上代码实现所述，我们要想获得某项性能记录，需要知道指定的性能事件已经发生（或者使用定时轮训的方式），**`主动调用`**`performance.getEntries`或者`performance.getEntriesByName`来获得。

为了解决这个问题，在`Performance Timeline Level 2`中，除了扩展了`Performance`的基本定义以外，还增加了`PerformanceObserver`接口。

顾名思义，`PerformanceObserver`在浏览器内部对`Performance`实现了**`观察者模式`**，也是现代浏览器支持的几个 Observer 之一。

它解决了以下 3 点问题：

1. 避免不知道性能事件啥时候会发生，需要重复轮训 timeline 获取记录。
2. 避免产生重复的逻辑去获取不同的性能数据指标
3. 避免其他资源需要操作浏览器性能缓冲区时产生竞态关系。



PerformanceObserver 解决了PerformanceObserver 的问题：【另一种说法】

1. 重复轮训
2. 轮巡时不断判断，这个数据是新产生的，还是以前的
3. 可能其他数据的消费者也需要操作数据



### performanceObserver.observe(options)

例子

```js
observer.observe({entryTypes: ["mark", "frame"]});

const entryHandler = (list) => {
    if (observer) {
        observer.disconnect()
    }

    for (const entry of list.getEntries()) {
        console.log(entry)
    }
}

const observer = new PerformanceObserver(entryHandler)
observer.observe({ type: 'largest-contentful-paint', buffered: true })
```

### PerformanceObserver.disconnect()

断开连接，不再执行回调

### PerformanceObserver.takeRecords()

`返回`存储在性能观察器中的**`性能指标的列表`，`并将其清空`**。

### 几个首屏时间

1. TTFB：Time To First Byte，`首字节时间 `
2. FP：First Paint，首次绘制，`绘制Body `
3. FCP：First Contentful Paint，首次有内容的绘制，`第一个dom元素`绘制完成 
   包含页面的基本框架，但没有数据内容
4. FMP：First Meaningful Paint，首次`有意义的绘制 `
   包含页面的所有元素及数据
5. TTI：Time To Interactive，`可交互时间，整个内容渲染完成`

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/967ac78f03094934a9973f63c0dbbfe4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)
