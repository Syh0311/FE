/**
  - 使用getPrototypeOf获取原型
  - foo instanceof Foo在语言内部，实际调用的是Foo[Symbol.hasInstance](foo)。
*/
const sInstanceof = (x, y) => {
  //基本数据类型直接返回false【即-不等于function且不等于object】
  if ((typeof x !== "function" && typeof x !== "object") || x === null) return false; //|| x === null是处理object情况下的特殊情况，也可以直接写|| !x

  //查找原型链
  let proto = Object.getPrototypeOf(x);
  while (proto) {
    if (proto === y.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
};

//4.instanceof判断基本数据类型
class primitiveNumber {
  static [Symbol.hasInstance](x) {
    return typeof x === "number";
  }
}
// console.log(111 instanceof primitiveNumber); //true
