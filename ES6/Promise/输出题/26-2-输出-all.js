// ！！
// Promise.all不熟悉

function runAsync(x) {
  const p = new Promise((r) => setTimeout(() => r(x, console.log(x)), 1000));
  return p;
}
function runReject(x) {
  const p = new Promise((res, rej) => setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x)); //这rej接收多个参数，但只有第一个是往后传的，其他第二个第三个随便都行
  return p;
}
Promise.all([runAsync(1), runReject(4), runAsync(3), runReject(2)])
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

// 答案
// 1
// 3
// 2
// Error: 2
// 4      【数组中的异步依然会执行，但是promise.all已经不执行了】
