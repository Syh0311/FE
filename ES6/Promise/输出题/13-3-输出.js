// 改变状态之后的代码正常执行 ！！！!!!
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success1");
    reject("error");
    console.log("改变状态之后的代码正常执行-----");
  }, 0);
});
promise
  .then((res) => {
    console.log("resolve: ", res);
  })
  .catch((err) => {
    console.log("catch: ", err);
  });
// 解析
//Promise的状态只有第一次更改生效，且更改后不影响执行之后代码

// 结果;
// 改变状态之后的代码正常执行-----
// "then: success1"
