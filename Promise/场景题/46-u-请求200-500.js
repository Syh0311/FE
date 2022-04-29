function ajax() {
  const delay = Math.random() * 1000;
  return new Promise((resolve, rejetc) => {
    setTimeout(() => {
      console.log(delay);
      resolve(delay);
    }, delay);
    setTimeout(() => {
      rejetc("超时--");
    }, 0);
  });
}

function time(fn, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fn());
    }, delay);
  });
}

function timing(timer) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject();
    }, timer);
  });
}

let p = ajax();
// Promise.race([p, timing(200)]).then(err);

const arr = [p, time(ajax, 200), time(ajax, 500)];
Promise.any(arr)
  .then((res) => {
    console.log("race----", res);
  })
  .catch((err) => {
    console.warn("err---", err);
  });

// function solution(fn) {
//   let flag;
//   let p;
//   p = fn().then((res) => {
//     flag = true;
//     // console.log(res);
//   });
//   setTimeout(() => {
//     let flag2;
//     if (!flag) {
//       p = fn().then((res) => {
//         flag2 = true;
//         // console.log(res);
//       });
//       setTimeout(() => {
//         if (!flag2) {
//           fn().then((res) => {
//             // flag = true;
//           });
//         }
//       }, 500);
//     }
//   }, 200);
// }

// solution(ajax);
