/**
  关键是 resolve(1)和resolve(2)谁先执行 ！！
  1. V8引擎对代码预解析，此时就将then绑定到了对象的promise上；
  2. 开始执行代码，只要promise状态改变(如resolve(value) )，此时改变promise状态，遍历实例中绑定的所有then；
  3. 所有promise(1) 在 promise(2) 之前
*/
const first = () =>
  new Promise((resolve, reject) => {
    console.log(3);
    let p = new Promise((resolve, reject) => {
      console.log(7);
      setTimeout(() => {
        console.log(5);
        resolve(6);
        console.log(p);
      }, 0);
      resolve(1);
    });
    resolve(2);
    p.then((arg) => {
      console.log(arg);
    });
  });
first().then((arg) => {
  console.log(arg);
});
console.log(4);

// 答案
// 3
// 7
// 4
// 1
// 2
// 5
// Promise { 1 }
