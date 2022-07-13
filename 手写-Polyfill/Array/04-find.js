/**
find特点：
  1. 找到时返回找到的【第一个】元素
  2. 找不到时返回 undefined
*/
Array.prototype.myFind = function (cb) {
  if (!(cb instanceof Function)) throw "传入参数不是函数";

  const arr = this,
    len = arr.length;
  for (let i = 0; i < len; i++) {
    if (cb(arr[i], i, arr)) return arr[i];
  }

  return undefined;
};
