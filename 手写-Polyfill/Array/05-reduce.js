function syhReduce(callback, initial) {
  if (callback instanceof Function) {
    if (initial) {
      let result = initial;
      for (let i = 0; i < this.length; i++) {
        result = callback(result, this[i], i, this);
      }
      return result;
    } else {
      let result = this[0];
      for (let i = 1; i < this.length; i++) {
        result = callback(result, this[i], i, this);
      }
      return result;
    }
  } else {
    throw new Error(`"${callback}"不是回调函数！！`);
  }
}

Array.prototype.reduce = function (callback, init) {
  if (typeof callback != "function") {
    throw new Error("传入参数不是函数--");
  }

  const arr = this;
  let result;

  if (init) {
    result = init;
    for (let i = 0; i < arr.length; i++) {
      result = callback(result, arr[i], arr);
    }
  } else {
    result = arr[0];
    for (let i = 1; i < arr.length; i++) {
      result = callback(result, arr[i], arr);
    }
  }

  return result;
};
