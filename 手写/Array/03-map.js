function syhMap(callback, thisArg) {
  if (callback instanceof Function) {
    thisArg = thisArg || this;

    const newArr = new Array(thisArg.length);
    // console.log(newArr);

    for (let i = 0; i < thisArg.length; i++) {
      newArr[i] = callback(thisArg[i], i, thisArg);
    }
    return newArr;
  } else {
    throw new Error(`"${callback}"不是回调函数！！`);
  }
}
