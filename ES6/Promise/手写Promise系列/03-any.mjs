// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any
import { ajax1, ajax2, ajax3, ajax4 } from "./00-baseData.mjs";

/**
注意：
  1. 传入参数需可迭代，此处以数组为例；
  2. 传入参数长度为0时，reject出 AggregateError类型错误；
    - AggregateError 用于将多个错误包装为一个错误
    - new AggregateError(errors,message)
  3. 只要有一个成功就成功，
    - 全部错了则reject出 AggregateError类型错误，
    - 错误内容为所有reason;
  4. 非promise类型包装为promise类型
*/
function myAny(arr) {
  // 1.传入参数不可迭代
  if (!Array.isArray(arr)) throw "传入参数不是数组";

  // 2. arr长度为0
  return new Promise((resolve, reject) => {
    const len = arr.length;
    const reasons = Array(len);
    let count = 0;

    for (let i = 0; i < len; i++) {
      Promise.resolve(arr[i])
        .then((value) => resolve(value))
        .catch((reason) => {
          reasons[i] = reason;
          ++count === len && reject(new AggregateError(reasons, "All Promises were rejected"));
        });
    }
  });
}

myAny([Promise.reject("some error"), ajax4()])
  .then((data) => {
    console.log("myAny--", data);
  })
  .catch((err) => {
    console.log("[ err ]", err);
  });

// AggregateError
// Promise.any([Promise.reject("some error"), ajax4()]).catch((err) => {
//   console.log("[ err ]", err);
//   // console.log(err instanceof AggregateError); // true
//   // console.log(err.message); // "All Promises were rejected"
//   // console.log(err.name); // "AggregateError"
//   // console.log(err.errors); // [ 'some error', '4 err--------------' ]
// });
