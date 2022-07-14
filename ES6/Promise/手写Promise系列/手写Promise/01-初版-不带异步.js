/**
需考虑情况
  1. Promise接收函数作为参数，此函数接受两个函数作为参数；
    - new Promise(func(resolve,reject))； 
    - func初始化时即运行，所以需要try/catch；
    - 这也解释了new Promise时代码是同步的
  2. promise状态只能变更一次；
  3. resolve，reject的this绑定；
    class中this绑定的两种方式：
    - 使用箭头函数；  此处resolve
    - 使用bind；     此处reject
  4. 内部报错处理 throw等；
  5. then方法参数非函数时
    - 接受两个参数  then(onFulfilled,onRejected)；
    - resolve，三元后对其重新赋值；
    - reject，三元后对其重新赋值。

三个部分均参考：
  - https://juejin.cn/post/7043758954496655397

*/

class MyPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  constructor(func) {
    // 1. 初始化状态
    this.PromiseState = MyPromise.PENDING;
    this.PromiseResult = null;

    // 2. 将两个方法导出，用以改变promise实例状态
    //    注：因func本身运行可能报错，所以需要try/catch
    try {
      func(this.resolve, this.reject.bind(this));
    } catch (reason) {
      this.reject(reason);
    }
  }

  resolve = (value) => {
    // 1. promise实例状态只能变更一次
    if (this.PromiseState !== MyPromise.PENDING) return;

    // 2. 变更状态，保存value到PromiseResult
    this.PromiseState = MyPromise.FULFILLED;
    this.PromiseResult = value;
  };

  reject(reason) {
    // 1. promise实例状态只能变更一次
    if (this.PromiseState !== MyPromise.PENDING) return;

    // 2. 变更状态，保存reason到PromiseResult
    this.PromiseState = MyPromise.REJECTED;
    this.PromiseResult = reason;
  }

  then(onFulfilled, onRejected) {
    // 1. then参数检验：不是函数时，值穿透【即重写函数】
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    // 2. 判断PromiseState，回调函数二选一； this.PromiseResult作为参数传递
    if (this.PromiseState === MyPromise.FULFILLED) onFulfilled(this.PromiseResult);
    if (this.PromiseState === MyPromise.REJECTED) onRejected(this.PromiseResult);
  }
}

// 测试——————————————————————————————————————————————
// case1 -- resolve情况
console.log("case1 --------------");
const p1 = new MyPromise((resolve, reject) => {
  resolve("成功啦！！！");
});
p1.then((value) => {
  console.log("[ value ]", value);
}, undefined);

// // case2 -- reject情况
console.log("case2 --------------");
const p2 = new MyPromise((resolve, reject) => {
  reject("失败啦~~~");
});
p2.then(undefined, (reason) => {
  console.log("[ reason ]", reason);
});

// // case3 -- func中抛出异常情况
console.log("case3 --------------");
const p3 = new MyPromise((resolve, reject) => {
  throw "some err";
});
p3.then(undefined, (reason) => {
  console.log("[ reason ]", reason);
});

// // case4 -- then接受参数不是函数情况
console.log("case4 --------------");
const p4 = new MyPromise((resolve, reject) => {
  resolve("case4  --  成功啦");
});
p4.then(undefined); // 什么也不打印，因为只是将值接着往下传了【值穿透
console.log("then非函数时值穿透，当前then啥也不干--");

// ————————————————此时还未异步，setTimeout无效 【then先同步执行了
// const p1 = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("成功啦！！！");
//   }, 1000);
// });
// p1.then((value) => {
//   console.log("[ value ]", value);
// }, undefined);
