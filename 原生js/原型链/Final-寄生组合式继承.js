// 1. Son内部调用父类 从而让Son的实例有Father相关属性
function Son() {
  Father.call(this, args); // args为Father接受的相关参数，需要具体情况具体分析
}

// 2. 桥接prototype
function inherits(Son, Father) {
  Son.prototype = Object.create(Father.prototype, {
    constructor: {
      value: Son,
      writable: true,
      configurable: true,
      enumerable: false,
    },
  });

  // 意义是啥？？
  Object.setPrototypeOf(Son, Father); // Son.__proto__ = Father
  // Son.__proto__ = Father
}

//使用————————————————————————————————————
function Father() {}

// 1.Son内调Father
function Son() {
  Father.call(this);
}
// 2. 桥接prototype
inherits(Son, Father);

const son = new Son();

console.log(son instanceof Son);
console.log(son instanceof Father);
console.log(Son instanceof Object);
