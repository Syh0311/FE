import { ajax1, ajax2, ajax3, ajax4 } from "./00-baseData.mjs";

// 两种方式都无法捕获到错误！！  为啥？？
function myAll(arr) {
  return new Promise(async (resolve, reject) => {
    const len = arr.length;
    const data = Array(len);
    let count = 0;

    try {
      for (let i = 0; i < len; i++) {
        data[i] = await arr[i];
        if (++count === len) resolve(data);
      }
    } catch (reson) {
      console.log("[ reson ]", reson);
      reject(reson);
    }
  });

  // return new Promise(async (resolve, reject) => {
  //   for (let i = 0; i < len; i++) {
  //     try {
  //       const res = await promises[i];
  //       data[i] = res;
  //       count++;
  //       if (count == len) resolve(data);
  //     } catch (err) {
  //       reject(err);
  //     }
  //   }
  // });
}

myAll([ajax1(), ajax2(), ajax3(), ajax4()])
  .then((data) => {
    console.log("[ data ]", data);
  })
  .catch((err) => {
    console.log("[ err ]", err);
  });
