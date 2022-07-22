/**
  ！！
  1. then 和 catch 的【期望参数】都是函数;
  2. 若参数不是函数，则对onFulfilled赋值为【onFulfilled = (value)=> value】，发生【值穿透】；
  3. 但是就算值穿透了，then和catch还是进了微任务队列；
  4. 错误穿透 就相当于then的第二个参数不是函数，包装了下，所以发生了错误穿透

问题：发生值穿透、错误穿透的机理【手写promise哪】
*/

Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .catch(4)
  .then((res) => console.log(res));

// 答案
// 1
