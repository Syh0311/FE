import { window, obj, add, foo, Bar } from "./00-testData.mjs";

/**
一、bind相较于call的特殊之处：
  1. new bindFn()时，
    - 忽略thisArg，此时bind不再具备绑定this功能，只有提前添加参数功能；
    - 相当于函数柯里化，先传递部分参数；
    - 见case4
  2. thisArg是null或undefined时
    - bindFn执行作用域的this作为新函数的this；
      - 咋处理？？
      - 原bind是直接报错
    - call与apply是window！！

二、验证时
  - 可直接修改myCall为call验证
参考：
  1. https://www.cnblogs.com/echolun/p/12178655.html 
    - 错的
  2. https://zhuanlan.zhihu.com/p/54285383
    - 错的
  2. https://github.com/sisterAn/JavaScript-Algorithms/issues/81
    - 错的
  4. 都错在了case5最后的26和18上

*/

Function.prototype.myBind = function (thisArg, ...args1) {
  // 1. 边界条件 异常
  if (typeof this !== "function") throw "不是函数";

  // 2. 保存bind的函数
  const self = this;

  // 3. 返回待执行的函数，判断是否要new
  return function _fn(...args2) {
    // 3.1 如果要new，直接new本来的函数
    if (this instanceof _fn) return new self(...args1, ...args2);

    // 3.2 正常流程  再走一遍call的流程就行
    return self.call(thisArg, ...args1, ...args2);
  };
};

// 测试 ————————————————————————
// case1 -- 基础测试
console.log("case1 -----------------");
const bindFn = add.myBind(obj, 1);
console.log(bindFn(20)); //500+1+20

// case2 -- thisArg为undefined或者null，bind报错
// console.log("case2 -----------------");
// const bindFn2 = add.myBind(null, 1);
// console.log(bindFn2(20)); //100000+1+20

// case3 -- thisArg为原始值，转化为对象
console.log("case3 -----------------");
const bindFn3 = add.myBind(100, 1);
console.log(bindFn3(20)); //100000+1+20

// case4 -- new bindFoo()，忽略thisArg
console.log("case4 -----------------");
let bindFoo = Bar.myBind(foo, "Jack");
let obj2 = new bindFoo(20); // new的还是原来的Bar
// undefined
// Jack
// 20
obj2.habit; // shopping
obj2.friend; // kevin

// case5
console.log("case5 -----------------");
var z = 0;
var obj3 = {
  z: 1,
};

function fn(x, y) {
  this.name = "听风是风";
  console.log(this.z);
  console.log(x);
  console.log(y);
}
fn.prototype.age = 26;

var bound = fn.myBind(obj3, 2);
var person = new bound(3); //undefined 2 3

console.log(person.name); //听风是风
console.log(person.age); //26
person.__proto__.age = 18;
var person = new fn();
console.log(person.age); //18
