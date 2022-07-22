/**
  ！！
  Promise.any()
  只要有一个成功，就触发resolve
  全部失败才触发 reject
*/

function runAsync(x) {
  const p = new Promise((r) => setTimeout(() => r(x, console.log(x)), 1000));
  return p;
}
function runReject(x) {
  const p = new Promise((res, rej) => setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x));
  return p;
}
Promise.any([runReject(0), runReject(1), runReject(2), runReject(3)])
  .then((res) => console.log("result: ", res))
  .catch((err) => console.log("catch: ", err));

// 0
// 1
// 2
// 3
// catch:  [AggregateError: All promises were rejected]
