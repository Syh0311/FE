/**
三种情况：
  1. 传入的值是promise，直接返回；
  2. 传入的值带then属性；【可省略】
  3. 其他跟promise一点关系都没的情况

参考：https://juejin.cn/post/7044088065874198536
*/

myPromiseResolve = function (value) {
  // 如果这个值是一个 promise ，那么将返回这个 promise
  if (value instanceof Promise) {
    return value;
  } else if (value instanceof Object && "then" in value) {
    // 如果这个值是thenable（即带有`"then" `方法），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；
    return new Promise((resolve, reject) => {
      value.then(resolve, reject);
    });
  }

  // 否则返回的promise将以此值完成，即以此值执行resolve()`方法 (状态为fulfilled)
  return new Promise((resolve) => {
    resolve(value);
  });
};
