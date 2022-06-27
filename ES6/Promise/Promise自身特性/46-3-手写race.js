function myRace(arr) {
  //1. 如果传的迭代是空的，则返回的 promise 将永远等待。
  if (arr.length == 0) return new Promise(() => {});

  //2.返回promise，一旦arr中promise接受或拒绝， 返回的也【相应的】接收拒绝
  return new Promise((resolve, reject) => {
    arr.forEach((el) => {
      el()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  });
}

myRace([ajax1, ajax2, ajax3, ajax4])
  .then((data) => {
    console.log("myRace--", data);
  })
  .catch((err) => {
    console.log("race-err", err);
  });

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
  return time(100).then(() => {
    console.log(4);
    // return 4;
    throw "ajax4抛出的异常---";
  });
}
