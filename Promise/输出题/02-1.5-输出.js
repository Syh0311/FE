const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve("success");
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);

// 执行过程：
// 从上至下，先遇到new Promise，执行其中的同步代码1
// 再遇到resolve('success')， 将promise的状态改为了resolved并且将值保存下来
// 继续执行同步代码2
// 跳出promise，往下执行，碰到promise.then这个微任务，将其加入微任务队列
// 执行同步代码4
// 本轮宏任务全部执行完毕，检查微任务队列，发现promise.then这个微任务且状态为resolved，执行它。
