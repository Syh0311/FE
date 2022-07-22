// await不能接受【失败状态】的promise，会抛出错误【Uncaught (in promise) error】
async function async1() {
  await async2();
  console.log("async1");
  return "async1 success";
}
async function async2() {
  return new Promise((resolve, reject) => {
    console.log("async2");
    reject("error");
  });
}
async1().then((res) => console.log(res));

// 答案
// 'async2'
// Uncaught (in promise) error
