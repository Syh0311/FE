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
