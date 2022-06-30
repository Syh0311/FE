function deepClone(obj, map = new WeakMap()) {
  if (map.has(obj)) return map.get(obj);
  if (typeof obj != "object" || obj === null || typeof obj === "function") return obj;

  const Ctor = obj.constructor;
  if ([WeakMap, WeakSet].includes(Ctor)) return obj;

  if ([Number, String, Boolean, Date, Error, RegExp]) return new Ctor(obj);

  if (Ctor === Promise) return obj.then();

  const cloneObj = new Ctor();
  map.set(cloneObj, obj);

  if (Ctor === Set) {
    obj.forEach((val) => cloneObj.add(deepClone(val, map)));
  } else if (Ctor === Map) {
    obj.forEach((val, key) => cloneObj.set(key, deepClone(val, map)));
  } else {
    Reflect.ownKeys(obj, (key) => (cloneObj[key] = deepClone(obj[key], map)));
  }
  return cloneObj;
}

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
  if ([Number, String, Boolean, Error, RegExp, Date].includes(objConstructor)) return new objConstructor(obj);

  // 5. Promise实例情况
  if (objConstructor === Promise) return obj.then();

  // 6. 此时情况只剩map set array object
  // 声明cloneObj并【立马加到】checkMap中
  const cloneObj = new objConstructor();
  checkMap.set(obj, cloneObj);

  if (objConstructor === Set) {
    obj.forEach((value) => cloneObj.add(deepClone(value, checkMap)));
  } else if (objConstructor === Map) {
    obj.forEach((val, key) => cloneObj.set(key, deepClone(val, checkMap)));
  } else {
    Reflect.ownKeys(obj).forEach((key) => (cloneObj[key] = deepClone(obj[key], checkMap)));
  }
  return cloneObj;
}
