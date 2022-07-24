## 四、Node 中的 Event Loop

### 1.Node简介

Node 中的 Event Loop 和浏览器中的是完全不相同的东西。Node.js采用V8作为js的解析引擎，而I/O处理方面使用了自己设计的libuv，libuv是一个基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的API，事件循环机制也是它里面的实现（下文会详细介绍）。



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/11/1683d81674f076eb~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

Node.js的运行机制如下:



- V8引擎解析JavaScript脚本。
- 解析后的代码，调用Node API。
- libuv库负责Node API的执行。它将不同的任务分配给不同的线程，形成一个Event Loop（事件循环），以异步的方式将任务的执行结果返回给V8引擎。
- V8引擎再将结果返回给用户。

### 2.六个阶段

其中libuv引擎中的事件循环分为 6 个阶段，它们会按照顺序反复运行。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段。



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/12/16841bd9860c1ee9~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)



从上图中，大致看出node中的事件循环的顺序：

外部输入数据-->轮询阶段(poll)-->检查阶段(check)-->关闭事件回调阶段(close callback)-->定时器检测阶段(timer)-->I/O事件回调阶段(I/O callbacks)-->闲置阶段(idle, prepare)-->轮询阶段（按照该顺序反复运行）...

- timers 阶段：这个阶段执行timer（setTimeout、setInterval）的回调
- I/O callbacks 阶段：处理一些上一轮循环中的少数未执行的 I/O 回调
- idle, prepare 阶段：仅node内部使用
- poll 阶段：获取新的I/O事件, 适当的条件下node将阻塞在这里
- check 阶段：执行 setImmediate() 的回调
- close callbacks 阶段：执行 socket 的 close 事件回调

注意：**上面六个阶段都不包括 process.nextTick()**(下文会介绍)

接下去我们详细介绍`timers`、`poll`、`check`这3个阶段，因为日常开发中的绝大部分异步任务都是在这3个阶段处理的。

#### (1) timer

timers 阶段会执行 setTimeout 和 setInterval 回调，并且是由 poll 阶段控制的。 同样，**在 Node 中定时器指定的时间也不是准确时间，只能是尽快执行**。

#### (2) poll

poll 是一个至关重要的阶段，这一阶段中，系统会做两件事情

1.回到 timer 阶段执行回调

2.执行 I/O 回调

并且在进入该阶段时如果没有设定了 timer 的话，会发生以下两件事情

- 如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制
- 如果 poll 队列为空时，会有两件事发生
  - 如果有 setImmediate 回调需要执行，poll 阶段会停止并且进入到 check 阶段执行回调
  - 如果没有 setImmediate 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去

当然设定了 timer 的话且 poll 队列为空，则会判断是否有 timer 超时，如果有的话会回到 timer 阶段执行回调。

#### (3) check阶段

setImmediate()的回调会被加入check队列中，从event loop的阶段图可以知道，check阶段的执行顺序在poll阶段之后。 我们先来看个例子:

```javascript
console.log('start')
setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(function() {
    console.log('promise1')
  })
}, 0)
setTimeout(() => {
  console.log('timer2')
  Promise.resolve().then(function() {
    console.log('promise2')
  })
}, 0)
Promise.resolve().then(function() {
  console.log('promise3')
})
console.log('end')
//start=>end=>promise3=>timer1=>timer2=>promise1=>promise2
```

- 一开始执行栈的同步任务（这属于宏任务）执行完毕后（依次打印出start end，并将2个timer依次放入timer队列）,会先去执行微任务（**这点跟浏览器端的一样**），所以打印出promise3
- 然后进入timers阶段，执行timer1的回调函数，打印timer1，并将promise.then回调放入microtask队列，同样的步骤执行timer2，打印timer2；这点跟浏览器端相差比较大，**timers阶段有几个setTimeout/setInterval都会依次执行**，并不像浏览器端，每执行一个宏任务后就去执行一个微任务（关于Node与浏览器的 Event Loop 差异，下文还会详细介绍）。

### 3.Micro-Task 与 Macro-Task

Node端事件循环中的异步队列也是这两种：macro（宏任务）队列和 micro（微任务）队列。

- 常见的 macro-task 比如：setTimeout、setInterval、 setImmediate、script（整体代码）、 I/O 操作等。
- 常见的 micro-task 比如: process.nextTick、new Promise().then(回调)等。

### 4.注意点

#### (1) setTimeout 和 setImmediate

二者非常相似，区别主要在于调用时机不同。

- setImmediate 设计在poll阶段完成时执行，即check阶段；
- setTimeout 设计在poll阶段为空闲时，且设定时间到达后执行，但它在timer阶段执行

```lua
setTimeout(function timeout () {
  console.log('timeout');
},0);
setImmediate(function immediate () {
  console.log('immediate');
});
复制代码
```

- 对于以上代码来说，setTimeout 可能执行在前，也可能执行在后。
- 首先 setTimeout(fn, 0) === setTimeout(fn, 1)，这是由源码决定的 进入事件循环也是需要成本的，如果在准备时候花费了大于 1ms 的时间，那么在 timer 阶段就会直接执行 setTimeout 回调
- 如果准备时间花费小于 1ms，那么就是 setImmediate 回调先执行了

但当二者在异步i/o callback内部调用时，总是先执行setImmediate，再执行setTimeout

```javascript
const fs = require('fs')
fs.readFile(__filename, () => {
    setTimeout(() => {
        console.log('timeout');
    }, 0)
    setImmediate(() => {
        console.log('immediate')
    })
})
// immediate
// timeout
```

在上述代码中，setImmediate 永远先执行。因为两个代码写在 IO 回调中，IO 回调是在 poll 阶段执行，当回调执行完毕后队列为空，发现存在 setImmediate 回调，所以就直接跳转到 check 阶段去执行回调了。

#### (2) process.nextTick

这个函数其实是独立于 Event Loop 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其他 microtask 执行。

```javascript
setTimeout(() => {
 console.log('timer1')
 Promise.resolve().then(function() {
   console.log('promise1')
 })
}, 0)
process.nextTick(() => {
 console.log('nextTick')
 process.nextTick(() => {
   console.log('nextTick')
   process.nextTick(() => {
     console.log('nextTick')
     process.nextTick(() => {
       console.log('nextTick')
     })
   })
 })
})
// nextTick=>nextTick=>nextTick=>nextTick=>timer1=>promise1
```

## 五、Node与浏览器的 Event Loop 差异

**浏览器环境下，microtask的任务队列是每个macrotask执行完之后执行。而在Node.js中，microtask会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行microtask队列的任务**。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/12/16841bad1cda741f~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)



接下我们通过一个例子来说明两者区别：

```javascript
setTimeout(()=>{
    console.log('timer1')
    Promise.resolve().then(function() {
        console.log('promise1')
    })
}, 0)
setTimeout(()=>{
    console.log('timer2')
    Promise.resolve().then(function() {
        console.log('promise2')
    })
}, 0)
复制代码
```

浏览器端运行结果：`timer1=>promise1=>timer2=>promise2`

浏览器端的处理过程如下：



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/12/16841d6392e8f537~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)



Node端运行结果分两种情况：

- 如果是node11版本一旦执行一个阶段里的一个宏任务(setTimeout,setInterval和setImmediate)就立刻执行微任务队列，这就跟浏览器端运行一致，最后的结果为`timer1=>promise1=>timer2=>promise2`
- 如果是node10及其之前版本：要看第一个定时器执行完，第二个定时器是否在完成队列中。
  - 如果是第二个定时器还未在完成队列中，最后的结果为`timer1=>promise1=>timer2=>promise2`
  - 如果是第二个定时器已经在完成队列中，则最后的结果为`timer1=>timer2=>promise1=>promise2`(下文过程解释基于这种情况下)

1.全局脚本（main()）执行，将2个timer依次放入timer队列，main()执行完毕，调用栈空闲，任务队列开始执行；

2.首先进入timers阶段，执行timer1的回调函数，打印timer1，并将promise1.then回调放入microtask队列，同样的步骤执行timer2，打印timer2；

3.至此，timer阶段执行结束，event loop进入下一个阶段之前，执行microtask队列的所有任务，依次打印promise1、promise2

Node端的处理过程如下：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/12/16841d5f85468047~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

## 参考

[面试题：说说事件循环机制(满分答案来了)](https://juejin.cn/post/6844904079353708557)
