import { ajax1, ajax2, ajax3, ajax4 } from "./00-baseData.mjs";
/**
race特点
  - 第一个出结果的返回，无论对错
注意点：
  1. 传入参数需可迭代，此处以数组为例；
  2. 传入arr为空的话，则永远等待；
  3. 非promise包装为promise
*/
function myRace(arr) {
  // 1.
  if (Array.isArray(arr)) throw "传入参数不是数组";
  // 2. 如果传的迭代是空的，则返回的 promise 将永远等待。
  if (arr.length == 0) return new Promise(() => {});

  // 3.返回promise，一旦arr中promise接受或拒绝， 返回的也【相应的】接收拒绝
  return new Promise((resolve, reject) => {
    arr.forEach((el) => {
      Promise.resolve(el)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  });
}

myRace([ajax1(), ajax2(), ajax3(), ajax4()])
  .then((data) => {
    console.log("[ data ]", data);
  })
  .catch((err) => {
    console.log("[ err ]", err);
  });
