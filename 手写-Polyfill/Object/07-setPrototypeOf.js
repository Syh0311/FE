/**
Object.setPrototypeOf(obj,prototype)
  - 用作设置一个对象的原型
  - 用来代替obj.__proto__ = prototype

也就是说，想【obj.__proto__ = prototype】时，
  1. obj已存在
    - 使用Object.setPrototypeOf(obj,prototype)
  2. obj不存在
    - 使用const obj = Object.create(prototype)
总之，不要直接对obj.__proto__赋值

参考：
  - https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
  - 链接里还有很多可以看的！！？？
*/

Object.prototype.setPrototypeOf = function (obj, proto) {
  if (obj.__proto__) {
    obj.__proto__ = proto;
    return obj;
  }
  // 对象上没有 __proto__，返回新的实例
  let Fn = function () {
    for (let key in obj) {
      Object.defineProperty(this, key, {
        value: obj[key],
      });
    }
  };
  Fn.prototype = proto;
  return new Fn();
};
