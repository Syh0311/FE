/**
在02-异步_then多次调用.js 的基础上添加了then的【链式调用】

  1. then方法返回promise对象
  2. thenable：如果 x 有 then 方法且看上去像一个 Promise ，解决程序即尝试使 promise 接受 x 的状态；否则其用 x 的值来执行 promise 。

then(onFulfilled,onRejected)接收的两个参数都是用户自己写的，所以需要：
  1. 参数检验；
  2. resolvePromise中判断 promise2 === x；
     x是onFulFilled(value)或onRejected(reason)的结果

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
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    // 2. 导出(resolve，reject)  try/catch兜底
    try {
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (err) {
      this.reject(err);
    }
  }

  resolve(value) {
    // 1. 判断 实例状态
    if (this.PromiseState !== MyPromise.PENDING) return;
    // 2. 开启异步
    setTimeout(() => {
      // 2.1 修改状态，保存value
      this.PromiseState = MyPromise.FULFILLED;
      this.PromiseResult = value;
      // 2.2 执行队列中回调
      this.onFulfilledCallbacks.forEach((cb) => cb());
    });
  }
  reject(reason) {
    // 1. 判断 实例状态
    if (this.PromiseState !== MyPromise.PENDING) return;
    // 2. 开启异步
    setTimeout(() => {
      // 2.1 修改状态，保存value
      this.PromiseState = MyPromise.REJECTED;
      this.PromiseResult = reason;
      // 2.2 执行队列中回调
      this.onRejectedCallbacks.forEach((cb) => cb());
    });
  }
  then(onFulfilled, onRejected) {
    // 1. 参数校验  --> 值穿透
    typeof onFulfilled !== "function" && (onFulfilled = (value) => value);
    typeof onRejected !== "function" &&
      (onRejected = (reason) => {
        throw reason;
      });

    // 2. 判断实例当前状态【1.未改变 2. 已改变】
    //    将此部分包裹在新的promise内 用以返回
    const promise2 = new MyPromise((resolve, reject) => {
      const caseFulFilled = () => {
        try {
          const x = onFulfilled(this.PromiseResult);
          resolvePromise(promise2, x, resolve, reject);
        } catch (err) {
          reject(err);
        }
      };
      const caseRejected = () => {
        try {
          const x = onRejected(this.PromiseResult);
          resolvePromise(promise2, x, resolve, reject);
        } catch (err) {
          reject(err);
        }
      };
      if (this.PromiseState === MyPromise.PENDING) {
        // this.onFulfilledCallbacks.push(onFulfilled);// 原
        // this.onRejectedCallbacks.push(onRejected);// 原
        // 换成推入带一系列处理的回调
        this.onFulfilledCallbacks.push(caseFulFilled);
        this.onRejectedCallbacks.push(caseRejected);
      } else if (this.PromiseState === MyPromise.FULFILLED) {
        // setTimeout(() => onFulfilled(this.PromiseResult));// 原
        setTimeout(caseFulFilled);
      } else {
        // setTimeout(() => onRejected(this.PromiseResult));// 原
        setTimeout(caseRejected);
      }
    });

    return promise2;
  }
}

/**
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中【onFulfilled或onRejected】的【返回值】
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 * 
不同情况：
  【零】、循环引用
    - promise2 === x，抛出typeError
  
  一、x为promise实例 --> 写的时候可忽略，因为包含在二中，因为【x为promise实例】情况本身就是【带有then属性的对象】这一情况的分支】
    此时promise2接收x的状态，x状态分三种情况：
    1. pending    --> 较难理解
      - 此时promise2保持为pending直至x状态改变！！
    2. fulfilled
      - 以相同值执行promise2
    3. rejected
      - 以相同原因拒绝promise2
  
  二、x为对象或者函数  --> 对象可理解为promise实例
    - 因为函数和对象都可能【携带】then属性的方法，即函数和对象都可能thenable
    - 所以【尝试去拿】这个then，拿不出来则reject(报错)
    - 拿出来后判断then是否为函数
      - 不是：直接【以x为参数】执行promise  --> resolve(x)
      - 是：
      1. 将 x 作为函数的作用域this；为啥？？
      2. 传递两个回调函数作为参数(onFulfilled,onRejected)；
      3. 需保证(onFulfilled,onRejected)只调用一次

      4. 对于拿到成功的结果【value】，继续递归resolvePromise(promise2, value, resolve, reject)
        - 这个递归就是对promise.then的结果再【剥开一层】，将可能存在的嵌套的promise【剥开成正常值】
        - 两个地方进行了这样的递归，因为最后resolve的得是正常值(非promise)
        1. x本身是promise时
        2. x.then成功的结果
      5. 对于失败的【reason】，直接reject(reason)

  三、其他情况
    - 直接以x为参数执行promise --> resolve(x)
 */
function resolvePromise(promise2, x, resolve, reject) {
  // 零. promise2 === x 循环了，抛错
  if (promise2 === x) return reject(new TypeError("Chaining cycle detected for promise"));
  // 一、x为promise类型 【合并到二中】
  // if (x instanceof MyPromise) {
  //   if (x.PromiseState === MyPromise.PENDING) {
  //     // x处于pending状态，则promise2保持等待状态直至x状态改变！！
  //     x.then((value) => {
  //       resolvePromise(promise2, value, resolve, reject);
  //     }, reject);
  //   } else if (x.PromiseState === MyPromise.FULFILLED) {
  //     resolve(x.PromiseResult);
  //   } else {
  //     reject(x.PromiseResult);
  //   }
  // } else
  if ((x != null && typeof x === "object") || typeof x === "function") {
    // 二、x为对象或者函数
    // 1. 取出then
    let then;
    try {
      then = x.then;
    } catch (err) {
      reject(err);
      return; //不用往下了，就算再往下也是再走下resolve(x)
    }

    // 2. 判断then是否为函数
    if (typeof then !== "function") {
      resolve(x);
    } else {
      let called = false; // 避免多次调用
      try {
        const onFulfilled = (value) => {
          // 确保只调用一次
          if (called) return;
          called = true;

          resolvePromise(promise2, value, resolve, reject);
        };
        const onRejected = (reason) => {
          // 确保只调用一次
          if (called) return;
          called = true;

          reject(reason);
        };
        then.call(x, onFulfilled, onRejected);
      } catch (err) {
        // 确保只调用一次
        if (called) return;
        called = true;

        reject(err);
      }
    }
  } else {
    // 三、其他情况
    resolve(x);
  }
}
