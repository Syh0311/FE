/**
  ！！
  返回任意一个非 promise 的值都会被包裹成 promise 对象，
  因此这里的
  return new Error('error!!!')
  被包裹为
  【return Promise.resolve(new Error('error!!!'))】。

  若想返回错误---应该
    1. throw new Error('errMsg');
    2. return Promise.reject(new Error('errMsg'))
 */

Promise.resolve()
  .then(() => {
    return new Error("error----");
  })
  .then((res) => {
    console.log("then: ", res);
  })
  .catch((err) => {
    console.log("catch: ", err);
  });

// 答案
// then: Error: error----
