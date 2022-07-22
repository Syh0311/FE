// start 在 async2 之后打印 ！！

async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
async1();
console.log("start");

// 解析
// await，阻塞async1后面代码的执行

// 结果
// 'async1 start'
// 'async2'
// 'start'
// 'async1 end'
