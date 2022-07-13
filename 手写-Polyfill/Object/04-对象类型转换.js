/**
a == 1 && a == 2 如何为true
即对象转原始类型，转换过程：
  1. 如果有[Symbol.toPrimitive]指向的方法，优先调用再返回
  2. 调用valueOf()，如果转换为原始类型，则返回
  3. 调用toString()，如果转换为原始类型，则返回
  4. 如果都没有返回原始类型，则报错
*/
const a = {
  value: 0,

  //1.最先尝试
  [Symbol.toPrimitive]() {
    return 6; //7
  },

  //2.使用valueOf()
  valueOf() {
    return "5"; //'51'
  },

  //3.最后尝试toString()
  toString() {
    this.value += 1;
    return this.value;
  },

  //4.上边三个全部注释掉
  // [object Object]1
};
console.log(a + 1);
console.log(a == 6 && a == 6); //true
// console.log(a == 1 && a == 2); //true
