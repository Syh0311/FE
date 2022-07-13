import { window, obj, add } from "./00-testData.mjs";

/**
apply与call只有一点不同
  - call接受多个参数，apply接受数组为参数
除此之外，内部写法一模一样
*/
Function.prototype.myApply = function (thisArg, args) {
  // 0. 边界条件 异常
  if (typeof this !== "function") throw "不是函数";

  // 1. 初始化thisArg
  thisArg = thisArg || window;
  if (typeof thisArg != "object") thisArg = new Object(thisArg);

  // 2. thisArg添加属性，指向函数
  const tempFn = Symbol("tempFn");
  thisArg[tempFn] = this;

  // 3. 执行thisArg是属性指向的函数，删除属性
  const result = thisArg[tempFn](...args);
  delete thisArg[tempFn];

  // 4. 返回结果
  return result;
};

console.log(add.apply(obj, [1, 20])); //500+1+20
console.log(add.apply(null, [1, 20])); //100000+1+20
