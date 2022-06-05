/**
 需要考虑到的
 1. 基本数据类型
 2. Symbol
 3. Date
 4. 正则
 5. Map Set WeakMap WeakSet
 6. Error
 7. Array Object的循环引用【Map Set的循环引用？？】
 */

// import { target } from "./00-dataObject";
const { target, check } = require("./00-dataObject");

function deepClone(obj, hash = new WeakMap()) {
  if (hash.has(obj)) {
    return obj;
  }
  let res = null;
  const reference = [Date, RegExp, Set, WeakSet, Map, WeakMap, Error];

  if (reference.includes(obj?.constructor)) {
    res = new obj.constructor(obj);
  } else if (Array.isArray(obj)) {
    res = [];
    obj.forEach((e, i) => {
      res[i] = deepClone(e);
    });
  } else if (typeof obj === "object" && obj !== null) {
    res = {};
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        res[key] = deepClone(obj[key]);
      }
    }
    hash.set(obj, res);
  } else {
    res = obj;
  }
  return res;
}

const obj2 = deepClone(target);
console.log("[ obj2 ]", obj2);
