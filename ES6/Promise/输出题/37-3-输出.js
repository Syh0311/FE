//!!!！！！
// await 结合 try 的执行顺序

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
