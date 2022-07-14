import { ajax1, ajax2, ajax3, ajax4 } from "./00-baseData.mjs";

/**
注意：
  1. 传入参数需可迭代，此处以数组为例；
  2. 接收参数如果不是promise则将其转换为promise

1. Promise.all() 返回的也是promise
2. all返回的promise状态变更情况
  - resolve：arr中全部为resolve才resolve；
  - reject：arr中只要有一个reject就reject

*/
function myAll(arr) {
  // 1. 边界情况
  if (!Array.isArray(arr)) throw "传入参数不是数组";

  // 2. 返回Promise
  return new Promise((resolve, reject) => {
    const len = arr.length;
    const result = Array(len);
    let count = 0;

    for (let i = 0; i < len; i++) {
      Promise.resolve(arr[i])
        .then((value) => {
          result[i] = value;
          if (++count === len) resolve(result);
        })
        .catch((reason) => reject(reason));
    }
  });
}
// Promise.all(ajax1());
myAll([1111, ajax1(), ajax2(), ajax3(), ajax4()])
  .then((data) => {
    console.log("[ data ]", data);
  })
  .catch((err) => {
    console.log("[ err ]", err);
  });
