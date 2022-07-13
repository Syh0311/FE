/**
map特点：
  1. cb(val,index,arr)
  2. 返回新数组
*/

Array.prototype.myMap = function (cb) {
  if (!(cb instanceof Function)) throw "传入参数不是函数";

  const newArr = [...this];
  const len = newArr.length;
  for (let i = 0; i < len; i++) {
    newArr[i] = cb(newArr[i], i, newArr);
  }
  return newArr;
};

const arr = [1, 2, 3];
const na = arr.myMap((el) => el * 2);
console.log("[ na ]", na);
