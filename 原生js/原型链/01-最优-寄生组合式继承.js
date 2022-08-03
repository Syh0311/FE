/**
继承的两步：
  1. 设置 Son.prototype 【inherits 函数】
    1. 添加 Son.prototype  注意修改 prototype 上 constructor 属性
    2. 设置 Son.__proto__ = Father：
  2. Son内部调用父类 
    - 目的：让 Son 的实例有 Father 相关属性

其他设置 Son.prototype 方式的缺点：
  1. Son.prototype = Father.prototype;
    - 污染父构造函数的prototype属性
  2. Son.prototype = new Father();
    - 原型链继承
    - 可能带了不需要的实例信息
*/

//  桥接的函数 inherits
function inherits(Son, Father) {
  // 1. 添加 prototype
  Son.prototype = Object.create(Father.prototype, {
    constructor: {
      value: Son,
      writable: true,
      configurable: true,
      enumerable: false,
    },
  });

  // 2. 设置 Son.__proto__ = Father  保证 Son 作为对象使用时，能够获取到 Father 的静态方法与静态属性
  Object.setPrototypeOf(Son, Father); // 代替 Son.__proto__ = Father
}

// 使用 ————————————————————————————————————
function Father() {}

// 一、Son内调Father
function Son() {
  Father.apply(this, arguments);
}

// 二、设置Son.prototype
inherits(Son, Father);

// ———————————————————————————————————————

// 测试 ————————————————————————————————————
const son = new Son();

console.log(son instanceof Son);
console.log(son instanceof Father);
console.log(Son instanceof Object);
console.log(Object.getPrototypeOf(Son) === Father);
