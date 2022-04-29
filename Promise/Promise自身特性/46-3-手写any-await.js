// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any

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

function time(delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}
function ajax1() {
  return time(2000).then(() => {
    console.log(1);
    return 1;
  });
}
// ajax1().then((res) => {
//   console.log(res);
// });
function ajax2() {
  return time(1000).then(() => {
    console.log(2);
    return 2;
  });
}
async function ajax3() {
  await time(1000);
  console.log(3);
  return 3;
}

function ajax4() {
  return time(1000).then(() => {
    console.log(4);
    // return 4;
    throw "ajax4抛出的异常---";
  });
}
