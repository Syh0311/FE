const { check, target } = require("./00-dataObject");

const impossibleCircle = [Number, String, Boolean, Error, RegExp, Date];
/**
  对象的属性名【键】有两种类型：
    一. 字符串类型
    二. Symbol类型  【独一无二】  Symbol(obj)调用obj.toString()

  对象【属性名-键】对应的值【或者说obj本身，因为要递归】情况分为
    1. 基本数据类型
      - null undefined number bignit string symbol boolean
    2. 基本数据类型的包装类型与【Error RegExp Date】 
      - 共六种 -- return new obj.constructor(obj);
      - Number String Boolean
      - new Number(1)      Object(1);
      - new String('syh')  Object('syh')
      - new Boolean(true)  Object(true)
    3. WeakMap WeakSet 
      - 无法遍历 无法复制 直接返回
    4. Map Set
      - 作为object 需要对其进行【循环引用检查】
      - cloneObj = new Set()/Map(); 后马上加到【checkMap内】
      - forEach时将其【value,?key】赋值给 cloneObj
    5. 普通的 Array Object
      - 1. 以Symbol()作为键的情况 【Reflex.ownKeys】
      - 2. 循环引用检查
    6. 函数类型
      - new Function(`return ${obj.toString()}`)();
      - eval(`(${fn.toString()})`); //需要加括号
      - 涉及到curry化，this，闭包等问题，无法克隆相等价值的函数
    7. 奇特的Object(Symbol('syh')) 平时应该用不到
      - Object(Symbol('syh')).constructor===Symbol
      - return Object(Symbol(obj.description))
*/
function deepClone(obj, checkMap = new WeakMap()) {
  // 0. 递归出口 --【1. primitive 2. map.has(obj) 3.fn】
  if (typeof obj != "object" || obj === null) return obj;
  if (checkMap.has(obj)) return checkMap.get(obj);
  if (typeof obj === "function") return obj;

  // 1. 初始化变量
  const objConstructor = obj.constructor;

  // 2. 判断是否为WeakMap、WeakSet
  if ([WeakMap, WeakSet].includes(objConstructor)) {
    console.log(`${obj}不可复制，不复制，直接返回`);
    return obj;
  }

  // 3. 判断是否为symbol的对象 -- Object(Symblo('syh'))
  // 奇怪的情况 Symbol没法new  【平时应该没这个场景】
  if (objConstructor === Symbol) return Object(Symbol(obj.description));

  // 4. RegExp Date String Number Boolean Error 无循环引用
  if (impossibleCircle.includes(objConstructor)) return new objConstructor(obj);

  // 此时情况只剩map set array object 声明cloneObj并加到checkMap中
  const cloneObj = new objConstructor();
  checkMap.set(obj, cloneObj);

  // 5. 判断是Map Set 【可能有循环引用
  if (objConstructor === Set) {
    // 注意回调的参数
    obj.forEach((value) => {
      cloneObj.add(deepClone(value, checkMap));
    });
    return cloneObj;
  }
  if (objConstructor === Map) {
    obj.forEach((value, key) => {
      // 注意回调的参数
      cloneObj.set(key, deepClone(value, checkMap));
    });
    return cloneObj;
  }

  // 6. Array、Object 【可能有循环引用
  Reflect.ownKeys(obj).forEach((key) => {
    cloneObj[key] = deepClone(obj[key], checkMap);
  });

  return cloneObj;
}

const cloneObj = deepClone(target);
// console.log("[ cloneObj ]", cloneObj);
check(target, cloneObj);
