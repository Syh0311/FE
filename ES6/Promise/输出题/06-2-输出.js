const fn = () =>
  new Promise((resolve, reject) => {
    console.log(1);
    resolve("success");
  });
console.log("start");
fn().then((res) => {
  console.log(res);
});

// 答案
// "start"
// 1
// "success"
