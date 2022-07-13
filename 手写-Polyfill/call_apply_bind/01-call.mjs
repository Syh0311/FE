import { window, obj, add } from "./00-testData.mjs";

/**
一、call的两点特殊之处【MDN】
  1. 非严格模式下，thisArg为null或者undefined时，指向全局对象；
    - 浏览器默认是严格模式，所以直接给报错了
  2. thisArg为原始值时被包装为对象

二、手写时两个注意点
  1. thisArg的默认值，ES6的函数默认参数值只有当参数为undefined时才取后者【如果是null，就按null算】
    - 所以不能使用ES6的函数默认值
  2. thisArg上添加 tempFn 这个属性时可能对象本身就有这个属性，此时就覆盖了，所以需要一个更稳妥的方式【用Symbol代替】

三、验证时
  - 可直接修改myCall为call验证
*/
Function.prototype.myCall = function (thisArg, ...args) {
  // 0. 边界条件 异常
  if (typeof this !== "function") throw "不是函数";

  // 1. thisArg前处理 【1.指向window；2.包装即原始值】
  thisArg = thisArg || window;
  if (typeof thisArg != "object") thisArg = new Object(thisArg);

  // 2. thisArg添加属性，指向函数
  thisArg.tempFn = this;

  // 3. 执行函数后删除属性
  const result = thisArg.tempFn(...args);
  delete thisArg.tempFn;

  // 4. 返回结果
  return result;
};

// 使用Symbol作为键  更稳妥
Function.prototype.myCall2 = function (thisArg, ...args) {
  // 1. thisArg前处理 【1.指向window；2.包装即原始值】
  thisArg = thisArg || window;
  if (typeof thisArg != "object") thisArg = new Object(thisArg);

  // 2. thisArg添加属性，指向函数
  const tempFn = Symbol("tempFn");
  thisArg[tempFn] = this;

  // 3. 执行函数后删除属性
  const result = thisArg[tempFn](...args);
  delete thisArg[tempFn];

  // 4. 返回结果
  return result;
};

console.log(add.myCall(obj, 1, 20)); //500+1+20
console.log(add.myCall(null, 1, 20)); //100000+1+20

// console.log(add.myCall2(obj, 1, 20)); //500+1+20
// console.log(add.myCall2(null, 1, 20)); //100000+1+20
