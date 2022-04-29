//promise状态改变为reject，需要被then的第二个参数或者catch处理，若没有被处理，则抛出错误
const promise = new Promise((resolve, reject) => {
  console.log(1);
  reject("error");
  console.log(2);
});
promise.then(
  () => {
    console.log(3);
  },
  (err) => {
    console.log(err);
  }
);
console.log(4);
