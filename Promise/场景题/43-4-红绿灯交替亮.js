// 红灯3秒亮一次，黄灯2秒亮一次，绿灯1秒亮一次；如何让三个灯不断交替重复亮灯？
function red() {
  console.log("red");
}
function green() {
  console.log("green");
}
function yellow() {
  console.log("yellow");
}
function time(fn, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fn();
      resolve();
    }, delay);
  });
}

// function step() {
//   return Promise.resolve()
//     .then(() => time(green, 1000))
//     .then(() => time(yellow, 1000))
//     .then(() => time(red, 1000))
//     .then(() => step());
// }
// step();

//清爽async版
async function stepAsync() {
  await time(green, 1000);
  await time(yellow, 1000);
  await time(red, 1000);
  await stepAsync();
}
stepAsync();
