Array.prototype.myReduce = function (cb, initial) {
  // 1.
  if (!(cb instanceof Function)) throw "传入第一个参数应为函数";
  // 2.
  const arr = this,
    len = arr.length;
  let startIndex, result;

  // 初始化变量，之后用一个for循环即可
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

const arr = [1, 2, 3];
const result = arr.myReduce((pre, cur, arr) => pre * cur, 10);
console.log("[ result ]", result);
