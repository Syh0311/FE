function isArray(arr) {
  // console.log(arr.toString()); //数组内元素拼接
  const obj2Str = Object.prototype.toString.apply(arr);
  return obj2Str == "[object Array]";
}

const arr = [1, 2, 3];
console.log(isArray(arr));

const obj = {};
console.log(obj.toString()); //[object Object]

// console.log(isArray.toString()); //函数内容
console.log(Object.prototype.toString.call(isArray)); //[object Function]
