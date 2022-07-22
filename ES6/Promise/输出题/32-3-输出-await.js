// 大坑呀【await后跟的东西！！】
// await后边是【pending状态】的promise，所以await后边内容都不执行 【后边链式上的then都不触发】

async function async1() {
  console.log("async1 start");
  await new Promise((resolve) => {
    console.log("promise1");
  });
  console.log("async1 success");
  return "async1 end";
}
console.log("srcipt start");
async1().then((res) => console.log(res));
console.log("srcipt end");

// 结果
// 'script start'
// 'async1 start'
// 'promise1'
// 'script end'
