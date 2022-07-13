function syhForEach(callback, thisArg) {
  thisArg = thisArg || this;
  if (callback instanceof Function) {
    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
      // callback.apply(thisArg, [this[i], i, this]);
    }
  } else {
    throw new Error(`"${callback}"不是回调函数！！`);
  }
}

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
