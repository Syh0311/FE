/**
  ！！
  1. finally不接收来自resolve或者reject的参数，因为finally压根就不知道到底是resolve还是reject了【不知道promise的最终状态】
  2. finally中做一些【收尾工作】
*/

const promise = new Promise((resolve, reject) => {
  reject("error");
  resolve("success2");
});
promise
  .then((res) => {
    console.log("then1: ", res);
  })
  .then((res) => {
    console.log("then2: ", res);
  })
  .catch((err) => {
    console.log("catch: ", err);
    return "catch 返回的值"; //返回的【非promise被包装成promise】
    // return new Promise(() => {});//返回【pending状态的promise】，终止了接下来的then
  })
  .then((res) => {
    console.log("then3: ", res);
  })
  .finally((res) => {
    console.log(res); //finally不接收来自resolve或者reject的参数，因为finally压根就不知道到底是resolve还是reject了【不知道promise的最终状态】
    console.log("finally中代码");
  });
