//!!!！！！
// Promise 的 .then 或者 .catch 可以被调用多次【一个promise，好几个then，状态改变后，这几个then都会执行】

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("err");
    resolve("success");
    console.log("timer");
  }, 1000);
});
const start = Date.now();

// promise.then((res) => {
//   console.log("同一个promise的第一个then--");
//   console.log(res, Date.now() - start);
// });
// promise.then((res) => {
//   console.log("同一个promise的第二个then--");
//   console.log(res, Date.now() - start);
// });

promise.catch((res) => {
  console.log("同一个promise的第一个catch--");
  console.log(res, Date.now() - start);
});
promise.catch((res) => {
  console.log("同一个promise的第二个catch--");
  console.log(res, Date.now() - start);
});

// 结果
// timer;
// success >1000;
// success >1000;
