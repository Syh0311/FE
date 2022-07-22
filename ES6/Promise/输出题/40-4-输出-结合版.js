const p1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve("resolve3");
    console.log("timer1");
  }, 0);
  resolve("resovle1");
  resolve("resolve2");
})
  .then((res) => {
    console.log(res);
    setTimeout(() => {
      console.log(p1); //【处理then之后】的最终状态
    }, 1000);
    return "syh";
  })
  .finally((res) => {
    console.log("finally", res);
  });

// 答案
// resovle1
// finally undefined
// timer1
// Promise { undefined }
