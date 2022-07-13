/**
  new做了什么
  1. 创建新对象并将对象的__proto__指向构造函数的prototype；
  2. 构造函数中this赋值为此对象；
  3. 执行构造函数；
  4. 如果构造函数本身就返回对象，则返回构造函数中对象，否则返回新对象。

  手写的注意点：
  1. 判断fn是否为函数，且不能为箭头函数【fn.name】；
  2. 创建新对象并指派原型时更优雅的做法【Object.create()】;
  3. 执行构造函数内函数【call/apply】；
  4. 返回值：函数本身有非空对象的返回值，则使用该返回值；

  箭头函数不能作为构造函数的原因：
  1. this指向问题；
  2. 没prototype undefined；
 */
function myNew(fn, ...args) {
  // 1. 边界情况，传入非函数或者时箭头函数
  if (typeof fn != "function" || fn.prototype == undefined) {
    throw new Error(`${fn} is not a function or ${fn.name} is an arrow function`);
  }

  const obj = Object.create(fn.prototype);
  const res = fn.call(obj, ...args);
  return res || obj;
}

//测试——————————————————————————
function testFn(name) {
  this.name = name;
}
const arrowFn = (name) => {
  this.name = name;
};
// 1. 普通函数
const obj = myNew(testFn, "syh");
console.log(obj);
console.log(obj instanceof testFn); //true

// 2. 箭头函数
try {
  myNew(arrowFn, "sy");
} catch (err) {
  console.log("[ err ]", err);
}
//——————————————————————————
