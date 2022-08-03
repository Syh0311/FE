// 题目就这一句话
// 算是红绿灯跟 mergePromise的简版
// 其实顺序放错了，应该从简单到难

// 为了能够按顺序打印，都是返回promise的函数
function print1() {
  return new Promise((resolve) =>
    setTimeout(() => {
      console.log(1);
      resolve();
    }, 1000)
  );
}
function print2() {
  return new Promise((resolve) => setTimeout(() => resolve(console.log(2)), 1000));
}
function print3() {
  return new Promise((resolve) => setTimeout(() => resolve(console.log(3)), 1000));
}

function loop() {
  print1().then(print2).then(print3).then(loop);
}
// loop();

async function loopAsync() {
  await print1();
  await print2();
  await print3();
  await loopAsync();
}
loopAsync();
