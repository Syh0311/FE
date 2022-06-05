// https://cloud.tencent.com/developer/article/1983783 错误不少 但有参考价值

const { target, check } = require("./00-dataObject");
target.self = target;
target.map.set("self", target);
target.set.add(target);
target.arr.push(target);

const impossibleCircle = [Number, String, Boolean, Error, RegExp, Date];

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

  /**
   Objeck.entries()只能遍历可枚举 和正常属性
   此处还需要再加上Object.getOwnPropertySymbols(obj)
   两个和到一块才能将【正常属性 Symbol属性】都遍历到
   使用Reflect.ownKeys(obj)获得可枚举、不可、Symbol

   具体见 遍历对象的几个方法.md
  */
  // Object.entries(obj).forEach(([key, val]) => {
  //   cloneObj[key] = deepClone(val, checkMap);
  // });
  Reflect.ownKeys(obj).forEach((key) => {
    cloneObj[key] = deepClone(obj[key], checkMap);
  });

  return cloneObj;
}

//验证————————————————————————————————————————————

const obj2 = deepClone(target);
console.log("[ obj2 ]", obj2);
check(target, obj2);

console.log("------------");

//验证————————————————————————————————————————————
// console.log(target);
console.log(target === obj2.map.get("self")); // false
console.log(obj2 === obj2.map.get("self") && obj2 === obj2.map.get("self")); // true
// obj2.map.get("self").num = 10;
// console.log(obj2.map.get("self").num);
// console.log(target.num);
// console.log("[ target ]", target);
