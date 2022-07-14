/**
在01的基础上添加异步，添加then的多次调用【非链式】

1. 主要是then
  - onFulfilled,onRejected需在【then方法】调用的那一轮【事件循环】的下一轮调用
  - 所以可以使用
    1. 宏任务队列：setTimeout、setImmediate等；
    2. 微任务队列：queueMicrotask 、MutationObserver、process.nextTick等
  - 此处使用setTimeout

2. 问题
  - func里setTimeout后，then还是同步，此时PromiseState为pending，then什么也不干就过了；之后状态时【func下setTimeout内改变状态】，then已经执行过
  - 所以需要【状态改变】才执行then 【官方是 状态改变才将then添加到微任务队列】

3. 总结
  - 异步即先有then累积着【一个或多个】，当状态变更时(调用resolve、reject)执行累积的then
  - 所以需要有两个队列保存成功和失败的回调，状态改变时 遍历调用回调

三个部分均参考：
  - https://juejin.cn/post/7043758954496655397

*/

class MyPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  constructor(func) {
    // 1. 初始化变量
    this.PromiseState = MyPromise.PENDING;
    this.PromiseResult = null;
    // 初始化两个队列，调用then且pending状态下添加进来
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    // 2. 执行func，  需使用try/catch兜底
    try {
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (reason) {
      this.reject(reason);
    }
  }

  // resolve和reject都需先判断实例状态
  resolve(value) {
    // 1. 判断 实例状态
    if (this.PromiseState !== MyPromise.PENDING) return;

    // 2. 使用setTimeout异步
    setTimeout(() => {
      // 2.1 变更状态，保存value
      this.PromiseState = MyPromise.FULFILLED;
      this.PromiseResult = value;
      // 2.2 执行队列中保存的回调
      this.onFulfilledCallbacks.forEach((cb) => cb(value));
    });
  }

  reject(reason) {
    // 1. 判断 实例状态
    if (this.PromiseState !== MyPromise.PENDING) return;
    // 2. 使用setTimeout异步
    setTimeout(() => {
      // 2.1 变更状态，保存value
      this.PromiseState = MyPromise.FULFILLED;
      this.PromiseResult = value;
      // 2.2 执行队列中保存的回调
      this.onRejectedCallbacks.forEach((cb) => cb(reason));
    });
  }

  then(onFulfilled, onRejected) {
    // 1. 参数检验 --> 值穿透
    typeof onFulfilled !== "function" && (onFulfilled = (value) => value);
    typeof onRejected !== "function" &&
      (onRejected = (reason) => {
        throw reason;
      });

    // 2. 判断PromiseState，传递PromiseResult
    // 状态分两种情况 -->  1. 未变化； 2. 已变化【包裹setTimeout】
    if (this.PromiseState === MyPromise.PENDING) {
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    } else if ((this.PromiseState = MyPromise.FULFILLED)) {
      setTimeout(() => onFulfilled(this.PromiseResult));
    } else {
      setTimeout(() => onRejected(this.PromiseResult));
    }
  }
}

// 测试————————————————————————————————————
console.log(1);
let promise1 = new MyPromise((resolve, reject) => {
  console.log(2);
  setTimeout(() => {
    console.log("A", promise1.PromiseState);
    resolve("这次一定");
    console.log("B", promise1.PromiseState);
    console.log(4);
  });
});
promise1.then(
  (result) => {
    console.log("C", promise1.PromiseState);
    console.log("fulfilled:", result);
  },
  (reason) => {
    console.log("rejected:", reason);
  }
);
console.log(3);

// 1
// 2
// 3
// A pending
// B pending
// 4
// C fulfilled
// fulfilled: 这次一定
