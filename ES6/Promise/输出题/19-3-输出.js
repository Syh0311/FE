// !!!！！！
//.then 或 .catch 返回的值不能是 promise 本身-----会造成死循环

const promise = Promise.resolve().then(() => {
  return promise;
});
// promise.catch(console.log);
// promise.then(console.log);

// 解析
// .then 或 .catch 返回的值不能是 promise 本身，否则会造成死循环，因此结果会报错。

// 结果
//Uncaught (in promise) TypeError: Chaining cycle detected for promise #<Promise>    【then中】

//TypeError: Chaining cycle detected for promise #<Promise>    【catch中】
