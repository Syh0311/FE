// ！！！!!!
//1. catch后的then---【catch也返回promise】
//2. then和catch中返回非promise会被包装成promise；
//3. 通过返回【pending状态的promise】终止链式then；
//4. finally不接收来自resolve或者reject的参数，因为finally压根就不知道到底是resolve还是reject了【不知道promise的最终状态】
//5. 状态改变时，会执行finally  【finally只知道promise是否为pending】

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

// const p = new Promise((resolve, reject) => {
//   console.log("promise---");
// }).finally(() => {
//   console.log("finally中代码"); //状态改变时，会执行finally
// });
