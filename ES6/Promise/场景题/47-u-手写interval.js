class Interval {
  constructor(fn, delay) {
    this.fn = fn;
    this.delay = delay;
    this.cancle = false;
  }
  timer() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.fn());
      }, this.delay);
    });
  }
  startInterval() {
    if (this.cancle) return new Promise(() => {});
    let p = Promise.resolve();
    p = p.then(() => this.timer()).then(() => this.startInterval());
    // p = p.then(this.timer).then(this.startInterval); //写成传函数体形式，执行timer的地方就变了【timer中this不是实例了！！！!!!】
    return p;
  }
  clearInterval() {
    this.cancle = true;
  }
  restart() {
    this.cancle = false;
    this.startInterval();
  }
}

let i = 0;
function fn() {
  console.log(i++);
}

let myInter = new Interval(fn, 10);
myInter.startInterval();

setTimeout(() => {
  myInter.clearInterval();
}, 2000);

//2.用setTimeout写
// function test(fn, delay = 1000) {
//   setTimeout(() => {
//     fn();
//     test(fn, delay);
//   }, delay);
// }
// test(fn);
