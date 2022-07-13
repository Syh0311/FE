const arr = [1, 2, 3];

// 1. isArray
Array.myIsArray = function (arr) {
  if (typeof arr != "object" || arr === null) return false;
  const str = Object.prototype.toString.call(arr);
  console.log("[ str ]", str);
  return str === "[object Array]";
};

// console.log(Array.myIsArray(arr));

// 2. forEach
Array.prototype.myForEach = function (cb) {
  // 1. 边界条件处理
  if (!(cb instanceof Function)) throw new Error("传入参数不是函数");
  // 2. 正式的处理
  const arr = this,
    len = arr.length;
  for (let i = 0; i < len; i++) {
    cb(arr[i], i, arr);
  }
};
// arr.myForEach((val, index, arr) => {
//   console.log(val * 2, index, arr);
// });

// 3. map
Array.prototype.myMap = function (cb) {
  if (!(cb instanceof Function)) throw "传入参数不是函数";

  const newArr = [...this];
  const len = newArr.length;
  for (let i = 0; i < len; i++) {
    newArr[i] = cb(newArr[i], i, newArr);
  }
  return newArr;
};
const na = arr.myMap((el) => el * 2);
// console.log("[ na ]", na);

// 4. find
Array.prototype.myFind = function (cb) {
  if (!(cb instanceof Function)) throw "传入参数不是函数";

  const arr = this,
    len = arr.length;
  for (let i = 0; i < len; i++) {
    if (cb(arr[i], i, arr)) return arr[i];
  }

  return undefined;
};

// 5. reduce
Array.prototype.reduce = function (cb, initial) {
  // 1.
  if (!(cb instanceof Function)) throw "传入第一个参数应为函数";
  // 2.
  const arr = this,
    len = arr.length;
  let startIndex, result;

  if (initial) {
    startIndex = 0;
    result = initial;
  } else {
    startIndex = 1;
    result = arr[0];
  }

  for (let i = startIndex; i < len; i++) {
    result = cb(result, arr[i], arr);
  }
  return result;
};

// 6. flat
const three = [1, [2, [3, [4, [5]]]]];
Array.prototype.myFlat = function (depth = 1) {
  let newArr = Array.from(this);
  let times = 0;
  while (newArr.some((item) => Array.isArray(item))) {
    newArr = [].concat(...newArr);
    if (++times >= depth) break;
  }
  console.log("[ newArr ]", newArr);
  return newArr;
};
three.myFlat(3);
console.log("[ three ]", three);
