const { check, target } = require("./00-dataObject");
// 开启循环引用
target.self = target;
target.map.set("self", target);
target.set.add(target);
target.arr.push(target);

// const impossibleCircle = [Number, String, Boolean, Error, RegExp, Date];
function deepClone(obj, checkMap = new WeakMap()) {
  // 0. 递归出口 --【1. primitive 2. map.has(obj) 3.fn】
  if (typeof obj != "object" || obj === null) return obj;
  if (checkMap.has(obj)) return checkMap.get(obj);
  if (typeof obj === "function") return obj;

  // 1. 初始化变量
  const objConstructor = obj.constructor;

  // 2. 若是为WeakMap、WeakSet  不可复制
  if ([WeakMap, WeakSet].includes(objConstructor)) return obj;

  // 3. 若是为symbol的对象 -- Object(Symblo('syh'))
  // 奇怪的情况 Symbol没法new  【平时应该没这个场景】
  if (objConstructor === Symbol) return Object(Symbol(obj.description));

  // 4. RegExp Date String Number Boolean Error 无循环引用
  if ([Number, String, Boolean, Error, RegExp, Date].includes(objConstructor)) return new objConstructor(obj);

  // 5.Promise实例情况
  if (objConstructor === Promise) return obj.then();

  // 6. 此时情况只剩map set array object
  // 声明cloneObj并【立马加到】checkMap中
  const cloneObj = new objConstructor();
  checkMap.set(obj, cloneObj);

  if (objConstructor === Set) {
    obj.forEach((val) => cloneObj.add(deepClone(val, checkMap)));
  } else if (objConstructor === Map) {
    obj.forEach((val, key) => cloneObj.set(key, deepClone(val, checkMap)));
  } else {
    /**
    Array、Object情况
    
    Object.entries(obj).forEach(([key, val]) => (cloneObj[key] = deepClone(val, checkMap)));

    Objeck.entries()只能遍历可枚举 和正常属性
    此处还需要再加上Object.getOwnPropertySymbols(obj)
    两个和到一块才能将【正常属性 Symbol属性】都遍历到
    使用Reflect.ownKeys(obj)获得可枚举、不可、Symbol

    具体见 遍历对象的几个方法.md
  */
    Reflect.ownKeys(obj).forEach((key) => (cloneObj[key] = deepClone(obj[key], checkMap)));
  }
  return cloneObj;
}

//验证————————————————————————————————————————————
const cloneObj = deepClone(target);
console.log("[ cloneObj ]", cloneObj);
check(target, cloneObj);
