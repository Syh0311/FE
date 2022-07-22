/**
  await 结合 try 的执行顺序！！
  【script start】 在 【error---】之前打印
  可理解为：
    1. await中同步代码仍然同步执行，异步代码才加到相应队列
    2. await之后代码加到微任务队列
*/

async function async1() {
  try {
    await Promise.reject("error---");
  } catch (e) {
    console.log(e);
  }
  console.log("async1");
  return Promise.resolve("async1 success");
}
async1()
  .then((res) => console.log(res))
  .catch((err) => {
    console.log("catch---", err);
  });
console.log("script start");

// 答案
// script start
// error---
// async1
// async1 success
