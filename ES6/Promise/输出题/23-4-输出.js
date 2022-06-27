// !!!！！！

//finally总结【两点】

//1. finally()方法的回调函数不接受任何的参数【因为finally压根不知道promise的状态是啥，只知道状态改变了】

//2. 除非通过【返回pending状态的promise】停止then链式调用，否则finally返回的都是上一个【then或者catch的返回值】

Promise.resolve("1")
  .then((res) => {
    console.log(res);
  })
  .finally(() => {
    console.log("finally");
  });
Promise.resolve("2")
  .finally(() => {
    console.log("finally2");
    // return new Promise(() => {});
    return Promise.resolve("finally2----");
  })
  .then((res) => {
    console.log("finally2后面的then函数", res);
  });

// 答案
// 1
// finally2    【finally2在finally前边】
// finally
// finally2后面的then函数 2
