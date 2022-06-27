//!!!！！！
//知识点：promise状态改变了回触发then，将其加到微任务队列；
const promise = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    console.log("timerStart");
    resolve("success");
    console.log("timerEnd");
  }, 0);
  console.log(2);
});
promise.then((res) => {
  console.log(res);
});
console.log(4);

// 结果
// 1
// 2
// 4
// "timerStart"
// "timerEnd"
// "success"
