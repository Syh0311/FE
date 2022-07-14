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
      executor(this.resolve, this.reject.bind(this));
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

  reject(reason) {
    if (this.PromiseState !== MyPromise.PENDING) return;

    this.PromiseState = MyPromise.REJECTED;
    this.PromiseResult = reason;
    this.onRejectedCallbacks.forEach((cb) => cb());
  }
  then(onFulfilled, onRejected) {
    typeof onFulfilled !== "function" && (onFulfilled = (value) => value);
    typeof onRejected !== "function" &&
      (onRejected = (reason) => {
        throw reason;
      });

    const promise2 = new MyPromise((resolve, reject) => {
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
        fulfilledMicrotask();
      } else if (this.PromiseState === MyPromise.REJECTED) {
        rejectedMicrotask();
      } else if (this.PromiseState === MyPromise.PENDING) {
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    });
    return promise2;
  }
}
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) return reject(new TypeError("Chaining cycle detected for promise"));

  if ((x != null && typeof x === "object") || typeof x === "function") {
    let then;
    try {
      then = x.then;
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
