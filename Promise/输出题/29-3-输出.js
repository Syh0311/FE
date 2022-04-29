async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  setTimeout(() => {
    console.log("timer");
  }, 0);
  console.log("async2");
}
async1();
console.log("start");

// 答案
// async1 start
// async2
// start
// async1 end
// timer
