const a = {
  value: 0,

  //1.最先尝试
  [Symbol.toPrimitive]() {
    return 6; //7
  },

  //2.object上没有Symbol.toPrimitive属性--【对象的Symbol.toPrimitive属性，指向一个方法】，使用valueOf()
  valueOf() {
    return "5"; //'51'
  },

  //3.对象上没有定义valueOf，尝试toString()
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
