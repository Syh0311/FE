/**
推荐看queueMicrotask版，这个极致压缩，阅读成本太高
总共85行，压缩了then中promise的处理情况，  
  1. 将then里边【状态的三种情况】要写的四个函数从两种压缩成一种
    - 通过pushToMicrotask(callback)() 添加
    - 此函数第一次调用用以选择onFullfiled或onRejected，第二次调用将微任务添加到微任务队列
    - 箭头函数返回箭头函数，还得多扫两眼才能看出来  
  
  2. 一样的套路，把resolvePromise里的【成功、失败、报错 三种情况】要写的【两个函数】压缩成一个
 
*/
class MyPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";
  constructor(executor) {
    this.PromiseState = MyPromise.PENDING;
    this.PromiseResult = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }
  resolve = (value) => {
    if (this.PromiseState !== MyPromise.PENDING) return;
    this.PromiseState = MyPromise.FULFILLED;
    this.PromiseResult = value;
    this.onFulfilledCallbacks.forEach((cb) => cb());
  };
  reject = (reason) => {
    if (this.PromiseState !== MyPromise.PENDING) return;
    this.PromiseState = MyPromise.REJECTED;
    this.PromiseResult = reason;
    this.onRejectedCallbacks.forEach((cb) => cb());
  };
  then(onFulfilled, onRejected) {
    typeof onFulfilled !== "function" && (onFulfilled = (value) => value);
    typeof onRejected !== "function" &&
      (onRejected = (reason) => {
        throw reason;
      });
    const promise2 = new MyPromise((resolve, reject) => {
      const pushToMicrotask = (callback) => () => {
        queueMicrotask(() => {
          try {
            const x = callback(this.PromiseResult);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      if (this.PromiseState === MyPromise.FULFILLED) {
        pushToMicrotask(onFulfilled)();
      } else if (this.PromiseState === MyPromise.REJECTED) {
        pushToMicrotask(onRejected)();
      } else if (this.PromiseState === MyPromise.PENDING) {
        this.onFulfilledCallbacks.push(pushToMicrotask(onFulfilled));
        this.onRejectedCallbacks.push(pushToMicrotask(onRejected));
      }
    });
    return promise2;
  }
}
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) return reject(new TypeError("Chaining cycle detected for promise"));
  if ((x != null && typeof x === "object") || typeof x === "function") {
    try {
      var then = x.then; //改成var又少了一行
    } catch (err) {
      return reject(err); //不用往下了，就算再往下也是再走下resolve(x)
    }
    if (typeof then !== "function") return resolve(x);
    let called = false; // 避免多次调用
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
      onRejected(err);
    }
  } else {
    resolve(x);
  }
}
// 一、pushToMicrotask代理了以下
// const fulfilledMicrotask = () => {
//   queueMicrotask(() => {
//     try {
//       const x = realOnFulfilled(this.value);
//       resolvePromise(promise2, x, resolve, reject);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };
// const rejectedMicrotask = () => {
//   queueMicrotask(() => {
//     try {
//       const x = realOnRejected(this.reason);
//       resolvePromise(promise2, x, resolve, reject);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// 二、onFulfilled、onRejected向外一层，使得onRejected能够复用
// const onFulfilled = (value) => {
//   if (called) return;
//   called = true; // 这两个函数放外边,又少了三行
//   resolvePromise(promise2, value, resolve, reject);
// };
// const onRejected = (reason) => {
//   if (called) return;
//   called = true;
//   reject(reason); // 这两个函数放外边,又少了三行
// };
