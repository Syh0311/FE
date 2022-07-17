/**
主要有两个变量，三个函数    (源代码 src/core/util 路径下)

一、两个变量
  1. callbacks
    - 用来保存【包裹(真实回调)和错误处理】的函数；
  2. pending
    - 初始化为false，用来将flushCallbacks添加到微任务队列；

二、三个函数之一：flushCallbacks
  - 作用是被nextTIck添加到微任务队列中，等待执行；
  - 执行此函数 即遍历执行callbacks内所有回调
  - 需注意：
    1. callbacks需要复制下，避免nextTick中自调用，又将其添加到callbacks中，callbacks一直增加，循环无法停止；
    2. 还原pending，为下一次事件循环做准备；
    3. 还原callbacks  --> callbacks.length = 0

三、三个函数之二：timerFunc
  - 是一个将 flushCallbacks 添加到微任务或者宏任务队列的工具函数
  - 根据不同代码环境，分四种情况
      1. Promise.resolve().then(flushCallbacks)
      2. MutationObserver(flushCallbacks)
      3. setImmediate(flushCallbacks)
      4. setTimeout(flushCallbacks,0)

四、三个函数之三：nextTick(cb, ctx)
  - 接收(cb, ctx)两个参数，干了这三件事
  1. 将cb推入callbacks
    - 此处没有做参数检验，也没有将cb直接推入，而是将一个【包含异常处理 (通过_resolve闭包)】的【待执行函数】 添加到callbacks中；
    - 此函数包裹cb，执行此函数即执行cb；
    - 好处是能给cb的执行加写其他情况处理，如手写promise哪的try/catch异常捕获；
    - 此处的if/else是为了增加未传入参数(cb === undefined)的兜底操作
  2. 判断pending状态
    - false(初始值)：
      1. 修改pending为true；
      2. 执行timerFunc，将 flushCallbacks 添加到微任务队列，等待执行
    - true：啥也不干
  3. 判断是否有cb，
    - 如果没有则执行将 _resolve赋值为 pending状态下的promise，对未传入参数(cb === undefined)情况进行兜底操作
    - 这儿直接对cb做参数检验不就行了？？

nextTick的运行机制：
  第一次调用nextTick时：
    - pending设为true，执行timerFunc，将 flushCallbacks 作为【等待执行的微任务】添加到微任务队列，flushCallbacks执行则 遍历执行callbacks中所有回调
    - 即把执行callbacks中多个cb的权利放到了微任务队列中
    - 注：一般情况下，第一次调用nextTick都是 修改了 data中数据后，如修改了【this.name】
      1. this.name被修改，触发setter；
      2. setter触发闭包 dep.notify() 遍历通知所有watcher；
      3. watcher调用 watcher.update()；
      4. update内调用queueWatcher(this)；
      5. queueWatcher(this)内调用nextTick(flushSchedulerQueue)； 【此时第一次调用nextTick】
      6. flushSchedulerQueue负责视图更新
  第二次调用nextTick时：
    - 前提是在同一次事件循环内；
    - 此时pending为true （同一个事件循环内，微任务flushCallbacks还没执行），所以nextTick只将【包装后，添加闭包-错误处理(cb为undefined)】的【回调函数】添加到callbacks中，等待遍历执行

*/

const callbacks = [];
let pending = false;

function flushCallbacks() {
  // 1. 为了下一次事件循环 还原pending
  pending = false;

  // 2. 复制cbs，避免nextick中调用nextick导致nextTick循环的情况 【callbacks会无限扩大 for循环无法终止】
  const copies = callbacks.slice(0);

  // 3. 为了下一次事件循环 还原callbacks
  callbacks.length = 0;

  // 4. 执行copies内回调  此处实现了nextTick的插队
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

let timerFunc = () => Promise.resolve().then(flushCallbacks);
// let timerFunc = () => queueMicrotask(flushCallbacks);

export function nextTick(cb, ctx) {
  let _resolve;

  // 1. 将回调推入callbacks
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, "nextTick"); // vue中封装的错误处理
      }
    } else if (_resolve) {
      _resolve(ctx); // _resolve对于这个函数是个闭包
    }
  });
  // 2. 判断pending状态
  if (!pending) {
    pending = true;
    timerFunc();
  }

  // 3. 推入到 callbacks 的回调的兜底操作
  if (!cb && typeof Promise !== "undefined") {
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}
