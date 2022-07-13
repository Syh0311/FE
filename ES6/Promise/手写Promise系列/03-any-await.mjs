// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any
import { ajax1, ajax2, ajax3, ajax4 } from "./00-baseData.mjs";

function myAny(arr) {
  //1. 如果是空，返回reject
  let len = arr.length;
  if (len == 0) return Promise.reject("any传入的数组长度为0~~");

  //2.
  let index = 0;
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < len; i++) {
      try {
        const res = await arr[i];
        resolve(res);
      } catch (err) {
        index++;
        index == len && reject("输入全部失败--");
      }
    }
  });
}

// 成功情况
// myAny([ajax1(), ajax2(), ajax3(), ajax4()]).then((data) => {
//   console.log("myAny--", data);
// });

//失败情况
myAny([Promise.reject(1), Promise.reject(2)])
  .then((data) => {
    console.log("myAny--", data);
  })
  .catch((err) => console.log("err---", err));

// // AggregateError
// Promise.any([Promise.reject(new Error("some error"))]).catch((e) => {
//   console.log(e instanceof AggregateError); // true
//   console.log(e.message); // "All Promises rejected"
//   console.log(e.name); // "AggregateError"
//   console.log(e.errors); // [ Error: "some error" ]
// });
