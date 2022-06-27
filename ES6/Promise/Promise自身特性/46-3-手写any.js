// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any

function myAny(arr) {
  //1. 如果是空，返回reject
  if (arr.length == 0) return Promise.reject(new AggregateError("No Promise in Promise.any was resolved"));

  //2.
  //2.1 只要有一个成功的，返回resolve(res)；
  //2.2 所有的都失败，返回reject(new AggregateError('some err'))
  return new Promise((resolve, reject) => {
    let index = 0;
    const len = arr.length;
    arr.forEach((el) => {
      el.then((res) => {
        resolve(res);
      }).catch((err) => {
        index++;
        if (index == len) {
          reject(new AggregateError("No Promise in Promise.any was resolved"));
        }
      });
    });
  });
}

myAll([ajax1(), ajax2(), ajax3(), ajax4()]).then((data) => {
  console.log("myAny--", data);
});

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
