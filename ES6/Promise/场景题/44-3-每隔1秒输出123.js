// 用Promise配合着reduce不停的在promise后面叠加.then

//！！！!!!
//知识点：
// 1.reduce提供了init则从【第0位】开始，否则【第0位】作为init，从【第1位】开始，少循环一次
// 2.手写reduce

const arr = [1, 2, 3];

// 1. reduce版
// arr.reduce((pre, cur) => {
//   return pre.then((res) => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         console.log(cur);
//         resolve();
//       }, 1000);
//     });
//   });
// }, Promise.resolve());

// //async await 版
// arr.reduce(async (pre, cur) => {
//   const res = await pre;
//   return await new Promise((resolve) => {
//     setTimeout(() => {
//       console.log(cur);
//       resolve();
//     }, 1000);
//   });
// }, Promise.resolve());

// // 精简版
// arr.reduce((pre, cur) => pre.then(() => new Promise((resolve) => setTimeout(resolve, 1000, console.log(cur)))), Promise.resolve());

// 循环版
let p = Promise.resolve();
// arr.forEach((el) => {
//   p = p.then(() => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve(console.log(el));
//       }, 1000);
//     });
//   });
// });

// 不间断输出 1 2 3   1 2 3   1 2 3

function time(num, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      console.log(num);
    }, delay);
  });
}
function endLess(arr) {
  // let p = Promise.resolve();
  for (let i = 0; i < arr.length; i++) {
    p = p.then(() => time(arr[i], 1000));
  }
  p = p.then(() => endLess(arr));
  return p;
}
endLess(arr);
