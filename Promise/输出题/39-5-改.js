//!!!！！！
//catch 和 then 【值穿透】 都会进微任务队列，但是不执行

Promise.resolve(1)
  .then(() => console.log(1))
  .then(() => console.log(3))
  .then(() => console.log(5))
  .then(() => console.log(7));

// 1.catch情况 【catch不打印6，但是8在7后边，说明catch进了微任务队列】
Promise.resolve(1)
  .then(() => console.log(2))
  .then(() => console.log(4))
  .catch(() => console.log(6))
  .then(() => console.log(8));

// 2.【值穿透】情况--【8依然在最后，说明虽然值穿透，但进了微任务队列】
// Promise.resolve(1)
//   .then(2)
//   .then(4)
//   .catch(6)
//   .then((res) => console.log(res, 8));
