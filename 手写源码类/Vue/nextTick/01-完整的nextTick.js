/* @flow */
/* globals MutationObserver */
// src/core/util下

import { noop } from "shared/util";
import { handleError } from "./error";
import { isIE, isIOS, isNative } from "./env";

export let isUsingMicroTask = false;

const callbacks = [];
let pending = false; // 标记是否已经向任务队列中添加了一个任务，如果已经添加了就不能再添加了

function flushCallbacks() {
  // 1. 重新将pending设为false，也就是说callbacks长度只是1？？
  pending = false;
  // 2. 复制cbs，避免nextick中调用nextick 同时能更好的复原cbs
  const copies = callbacks.slice(0);
  // 3. callbacks设置为空
  callbacks.length = 0;
  // 4. 执行回调
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

/**
 定义以何种方式执行flushCallbacks
 优先级
  1. Promise.resolve().then(flushCallbacks)
  2. MutationObserver(flushCallbacks)
  3. setImmediate(flushCallbacks)
  4. setTimeout(flushCallbacks,0)
*/
let timerFunc;

if (typeof Promise !== "undefined" && isNative(Promise)) {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);

    if (isIOS) setTimeout(noop); //ios内可能有问题，使用空计时器强制刷新
  };
  isUsingMicroTask = true;
} else if (
  !isIE &&
  typeof MutationObserver !== "undefined" &&
  (isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === "[object MutationObserverConstructor]")
) {
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter); //更新监听的dom内容
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== "undefined" && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

//接受回调函数与对应的this
export function nextTick(cb, ctx) {
  let _resolve;
  // 1. callbacks推入的是个执行cb的函数
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, "nextTick");
      }
    } else if (_resolve) {
      _resolve(ctx); // _resolve对于这个函数是个闭包
    }
  });
  // 2. pending默认false，立即执行timerFunc 立即将这个cb添加到微任务队列
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== "undefined") {
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}
