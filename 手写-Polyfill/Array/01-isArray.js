const arr = [1, 2, 3];

//isArray是直接定义在Array上的静态方法
Array.myIsArray = function (arr) {
  if (typeof arr != "object" || arr === null) return false;
  const str = Object.prototype.toString.call(arr);
  console.log("[ str ]", str);
  return str === "[object Array]";
};

console.log(Array.myIsArray(arr));

console.log(Array.myIsArray.toString()); //函数内容
console.log(Object.prototype.toString.call(Array.myIsArray)); //[object Function]
