const impossibleCircle = [Number, String, Boolean, Error, RegExp, Date];
function deepClone(obj, checkMap = new WeakMap()) {
  // 1. 递归出口 --【1. primitive 2. map.has(obj) 3.fn】
  if (typeof obj != "object" || obj === null) return obj;
  if (checkMap.has(obj)) return checkMap.get(obj);
  if (typeof obj === "function") return obj;

  // 2. 初始化变量
  const objConstructor = obj.constructor;

  // 3. 若是为WeakMap、WeakSet  不可复制
  if ([WeakMap, WeakSet].includes(objConstructor)) return obj;

  // 4. RegExp Date String Number Boolean Error 无循环引用
  if (impossibleCircle.includes(objConstructor)) return new objConstructor(obj);

  // 5.Promise实例情况
  if (objConstructor === Promise) return obj.then();

  // 此时情况只剩map set array object 声明cloneObj并加到checkMap中
  const cloneObj = new objConstructor();
  checkMap.set(obj, cloneObj);

  // 6. 若是Map Set 【可能有循环引用
  switch (objConstructor) {
    case Set:
      obj.forEach((value) => cloneObj.add(deepClone(value, checkMap)));
      break;
    case Map: // 注意回调的参数
      obj.forEach((value, key) => cloneObj.set(key, deepClone(value, checkMap)));
      break;
    case Array || Object: //能这样写不？？
      Reflect.ownKeys(obj).forEach((key) => (cloneObj[key] = deepClone(obj[key], checkMap)));
      break;
    default:
      break;
  }
  return cloneObj;
}

//验证————————————————————————————————————————————
const cloneObj = deepClone(target);
console.log("[ cloneObj ]", cloneObj);
// check(target, cloneObj);
