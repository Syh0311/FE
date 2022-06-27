//promise创建过程中---本身的执行器代码是同步的
//Promise的三种状态： pending、fulfilled、rejected

//1.
const promise1 = new Promise((resolve, reject) => {
  console.log("promise1");
  // return resolve("resolve----");
});
console.log("1", promise1);
//promise1
//1 Promise {<pending>}

//2.
const promise2 = new Promise((resolve, reject) => {
  console.log("promise2");
  return resolve("resolve----");
});
console.log("2", promise2);
//promise2
//2 Promise {<fulfilled>: 'resolve----'}
