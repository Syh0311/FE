// Promise.all不熟悉

function runAsync(x) {
  const p = new Promise((r) => setTimeout(() => r(x, console.log(x)), 1000));
  return p;
}
Promise.all([runAsync(1), runAsync(2), runAsync(3)]).then((res) => console.log(res));

// 答案
// 1
// 2
// 3
// [1, 2, 3] //按传入数组顺序返回
