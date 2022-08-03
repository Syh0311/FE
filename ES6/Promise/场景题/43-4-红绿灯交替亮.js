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
// 以上为题给条件————————————————————

/**
分析：
  1. 与mergePromise基本一致；
  2. 注意：要求按顺序打印的话，传入的得是【返回promise的函数】，而非直接就是promise【无法按顺序，只能得到有序结果，像是Promise.all()等】
  3. 所以这的 sleep 接受 (fn,delay)，应该返回函数【返回的函数执行后才返回promise】
  4. 或者只是这三个，不用arr处理，那样直接在then里边写上就行

解法：直接跟 mergePromise哪一样就行；
  - 不过这儿只是打印，不用收集结果，所以只需要一个then就行
  法一：reduce；
    - 最后接到头上，形成环；
  法二：async/await；
    - 最后 await lightLoopAsync()
*/

// 返回 【能返回promise的函数】
function sleep(fn, delay) {
  return function () {
    return new Promise((resolve) => {
      setTimeout(() => {
        fn();
        resolve();
      }, delay);
    });
  };

  // 一行代码版
  return () => new Promise((resolve) => setTimeout(() => resolve(fn()), delay));
}
const arr = [sleep(red, 3000), sleep(yellow, 2000), sleep(green, 1000)];

// 普通链式调用版【arr不得不放外边，要想当做参数传入，再来个闭包就行】
function lightLoop() {
  const p = arr.reduce((pre, cur) => pre.then(cur), Promise.resolve());

  p.then(lightLoop); //再接上 头，开始循环
}
// lightLoop();

async function lightLoopAsync() {
  for (let item of arr) {
    await item();
  }
  await lightLoopAsync();
}
lightLoopAsync();
