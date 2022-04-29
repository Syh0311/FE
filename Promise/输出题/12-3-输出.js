//相较于11，添加了catch，处理抛出的错误
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
    console.log("timer1");
  }, 1000);
  console.log("promise1里的内容");
});
const promise2 = promise1
  .then(() => {
    throw new Error("error---");
  })
  .catch((err) => {
    console.log(err);
  });
console.log("promise1", promise1);
console.log("promise2", promise2);
setTimeout(() => {
  console.log("timer2");
  console.log("promise1", promise1);
  console.log("promise2", promise2);
}, 2000);

// 参考答案：
// 'promise1里的内容'
// 'promise1' Promise{<pending>}
// 'promise2' Promise{<pending>}
// 'timer1'
//  Error: error-- at xxx
// 'timer2'
// 'promise1' Promise{<resolved>: "success"}
// 'promise2' Promise{<rejected>: Error: error--}
