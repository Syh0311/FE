/**
！！
Promise.race()
只要数组中第一个发生【状态改变】的，无论成功还是失败
*/
function runAsync(x) {
  const p = new Promise((r) => setTimeout(() => r(x, console.log(x)), 1000));
  return p;
}
function runReject(x) {
  const p = new Promise((res, rej) => setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x));
  return p;
}
Promise.race([runReject(0), runAsync(1), runAsync(2), runAsync(3)])
  .then((res) => console.log("result: ", res))
  .catch((err) => console.log("catch: ", err));

// 0
// Error: 0
// 1
// 2
// 3

//【1 2 3 都会输出】，但是race不要了【虽然没拿第一，但还是跑到了终点】
// 高并发哪就有，race出来的先删掉
