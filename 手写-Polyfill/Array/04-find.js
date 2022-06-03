function syhFind(callback, thisArg) {
  if (callback instanceof Function) {
    thisArg = thisArg || this;
    for (let i = 0; i < thisArg.length; i++) {
      const flag = callback(thisArg[i], i, thisArg);
      if (flag) return thisArg[i];
    }
    return undefined;
  } else {
    throw new Error(`"${callback}"不是回调函数！！`);
  }
}
