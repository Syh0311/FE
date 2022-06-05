// https://zhuanlan.zhihu.com/p/42898378

const { check, target } = require("./00-dataObject");

const isObject = (obj) => {
  return typeof obj === "object" && obj != null;
};

const cloneDeep = (obj, hash = new WeakMap()) => {
  if (!isObject(obj)) {
    return obj;
  }

  if (hash.has(obj)) {
    // 避免成环
    return hash.get(obj);
  }

  const type = [Date, RegExp, Set, Map, WeakMap, WeakSet];
  if (type.includes(obj.constructor)) {
    return new obj.constructor(obj);
  }

  const allDesc = Object.getOwnPropertyDescriptors(obj); // 遍历传入参数所有键的特性
  const cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc); // 继承原型
  hash.set(obj, cloneObj);

  for (let key of Reflect.ownKeys(obj)) {
    // Reflect.ownKeys(obj) 可枚举、不可枚举、Symbol类型

    // 注意：writable 为 false 的属性会赋值失败，因此 writable 为 false 的属性是浅拷贝
    cloneObj[key] = isObject(obj[key]) ? cloneDeep(obj[key], hash) : obj[key];
  }

  return cloneObj;
};

// 测试
let obj = {
  bigInt: BigInt(12312),
  set: new Set([2]),
  map: new Map([
    ["a", 22],
    ["b", 33],
  ]),
  num: 0,
  str: "",
  boolean: true,
  unf: undefined,
  nul: null,
  boolObj: new Boolean(true),
  numObj: new Number(2),
  strObj: new String(2),
  symbolObj: Object(Symbol(1)),
  obj: {
    name: "我是一个对象",
    id: 1,
  },
  arr: [0, 1, 2], //可加循环引用到内部
  func: function () {
    console.log("我是一个函数");
  },
  date: new Date(0),
  reg: new RegExp("/我是一个正则/ig"),
  [Symbol("1")]: 1,
};

Object.defineProperty(obj, "inenumerable", {
  enumerable: false,
  value: [1, [2]],
});

obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj));
obj.loop = obj;

const map = new Map([
  ["a", 22],
  ["b", 33],
]);
const b = { map: map };
b.map.set("b", b);
let cloneObj = cloneDeep(b);

check(obj, cloneObj);
console.log("[ cloneObj ]", cloneObj);
console.log(cloneObj.map.get("b") === b);
console.log(cloneObj.map.get("b") === b);

// set相同吗？  false
// map相同吗？  false
// obj相同吗？  false
// arr相同吗？  false
// date相同吗？  false
// reg相同吗？  false
// innumerable相同吗？  true
// loop相同吗？  false
