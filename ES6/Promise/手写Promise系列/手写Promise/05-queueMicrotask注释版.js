/**
与setTimeout版区别，
  1. resolve与reject中
    - 只需要遍历队列，执行函数即可；
    - 因为队列中保存是【能够执行queueMicrotask(fn)】的函数，执行此函数即执行queueMicrotask(fn)，将fn添加到微任务队列
  1. then中，不同promise状态：
    - 已变更：直接执行对应的函数，即执行 queueMicrotask(fn)
    - 未变更：将能把包裹【queueMicrotask(fn)】的函数推入promise的两个队列中

then(onFulfilled,onRejected)接收的两个参数都是用户自己写的，所以需要：
  1. 参数检验；
  2. resolvePromise中判断 promise2 === x；
     x是onFulFilled(value)或onRejected(reason)的结果

resolvePromise只关注三种情况即可
  1. promise2 === x
  2. x为对象或者函数 【包含 x instanceof promise】
  3. 其他

参考：
  - https://juejin.cn/post/6945319439772434469
*/
class MyPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";
  constructor(executor) {
    // 1. 初始化
    this.PromiseState = MyPromise.PENDING;
    this.PromiseResult = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    // 2. 执行executor 使用try/catch兜底
    try {
      executor(this.resolve, this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve = (value) => {
    // 1. 状态未变更
    if (this.PromiseState !== MyPromise.PENDING) return;

    // 2. 修改状态 保存值value 遍历队列
    this.PromiseState = MyPromise.FULFILLED;
    this.PromiseResult = value;
    this.onFulfilledCallbacks.forEach((cb) => cb());
  };

  reject(reason) {
    // 1. 状态未变更
    if (this.PromiseState !== MyPromise.PENDING) return;

    // 2. 修改状态 保存原因reason 遍历队列
    this.PromiseState = MyPromise.REJECTED;
    this.PromiseResult = reason;
    this.onRejectedCallbacks.forEach((cb) => cb());
  }

  then(onFulfilled, onRejected) {
    // 1. then的参数检验
    typeof onFulfilled !== "function" && (onFulfilled = (value) => value);
    typeof onRejected !== "function" &&
      (onRejected = (reason) => {
        throw reason;
      });

    // 2. then需要返回promise
    const promise2 = new MyPromise((resolve, reject) => {
      // 2.1 promise不同状态对应的不同处理情况 【只有onFulfilled，onRejected不同，所以可进一步合并，此处为了便于理解不合并】
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.PromiseResult);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.PromiseResult);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      if (this.PromiseState === MyPromise.FULFILLED) {
        fulfilledMicrotask(); // 直接执行，即执行queueMicrotask(fn)
      } else if (this.PromiseState === MyPromise.REJECTED) {
        rejectedMicrotask(); // 直接执行，即执行queueMicrotask(fn)
      } else if (this.PromiseState === MyPromise.PENDING) {
        // 不直接执行，将执行的权利交到resolve和reject哪【遍历执行】
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    });
    return promise2;
  }
}
function resolvePromise(promise2, x, resolve, reject) {
  // 1. promise2 === x情况
  if (promise2 === x) return reject(new TypeError("Chaining cycle detected for promise"));
  // 2. thenable 和 其他
  if ((x != null && typeof x === "object") || typeof x === "function") {
    let then;
    // 1. 尝试获取then
    try {
      then = x.then; //改成var又少了一行
    } catch (err) {
      return reject(err); //不用往下了，就算再往下也是再走下resolve(x)
    }
    // 2. 判断then是否为函数
    if (typeof then !== "function") return resolve(x);
    // 3. 如果是，执行之； 需【1.绑定this 2.避免多次调用】
    let called = false; // 避免多次调用
    // onFulfilled 和 onRejected写外边，能复用
    const onFulfilled = (value) => {
      if (called) return;
      called = true;
      resolvePromise(promise2, value, resolve, reject); // 开始递归
    };
    const onRejected = (reason) => {
      if (called) return;
      called = true;
      reject(reason);
    };
    try {
      then.call(x, onFulfilled, onRejected);
    } catch (err) {
      onRejected(err); //复用
    }
  } else {
    resolve(x);
  }
}
