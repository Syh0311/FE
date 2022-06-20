/* @flow */
/* globals MutationObserver */
// src/core/util下

const callbacks = [];
let pending = false; // 标记是否已经向任务队列中添加了一个任务，如果已经添加了就不能再添加了

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

//  定义timerFunc
let timerFunc = Promise.resolve().then(flushCallbacks);

//接受回调函数与对应的this
export function nextTick(cb, ctx) {
  let _resolve;
  // 1. callbacks推入的是个执行cb的函数
  callbacks.push(() => {
    if (cb) {
      cb.call(ctx);
    } else if (_resolve) {
      _resolve(ctx); // _resolve对于这个函数是个闭包
    }
  });

  // 2. pending默认false，
  // 2.1 第一次调用nextTick后 pending设为true，执行timerFunc
  // 2.2 timerFunc执行后将`flushCallbacks`作为微任务添加到微任务队列 等待执行【callbacks队列内的`同步函数`】
  // 2.3 第二次再调用nextTick 就只将cb推入callbacks队列
  // 2.4 同步代码和flushCallbacks之前的微任务执行完后 执行flushCallbacks
  if (!pending) {
    pending = true; // 第一次的标识
    timerFunc(); //内部的微任务flushCallbacks 将pending还原
  }

  // 3. cb为undefined 则赋值_resolve 返回Promise 使其能够正常返回值
  if (!cb && typeof Promise !== "undefined") {
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}
