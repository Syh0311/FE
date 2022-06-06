/**
  object的属性名【键】有两种类型：
    一. 字符串类型
    二. Symbol类型  【独一无二】  Symbol(obj)调用obj.toString()

  object【属性名-键】对应的值【或者说obj本身，因为要递归】情况分为
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
const target = {
  // 一：字符串类型的 属性名【键】
  // 1.基本数据类型
  bigInt: BigInt(12312),
  num: 0,
  str: "",
  boolean: true,
  unf: undefined,
  nul: null,

  // 2.基本数据类型 包装类
  numObj2: Object(2),
  boolObj: new Boolean(true),
  numObj: new Number(2),
  strObj: new String(2),
  date: new Date(0),
  reg: new RegExp("/我是一个正则/ig"),
  // error: new Error("syh"),//太长影响调试，先注释掉

  // 3.WeakMap WeakSet
  weakMap: new WeakMap([
    [new Number(1), 1],
    [new Number(2), 2],
  ]),
  weakSet: new WeakSet([new Number(1), new Number(2)]),

  // 4. set map
  set: new Set([1, 2, 3, 4, 5]),
  map: new Map([
    ["a", 22],
    ["b", 33],
    ["c", { a: 10 }],
  ]),

  // 5. arr object
  arr: [0, 1, 2, new WeakSet([new Number(1), new Number(2)])], //可加循环引用到内部
  obj: {
    name: "syh",
    age: 18,
    objInner: {
      s: {},
      y: {},
      h: {},
    },
  },

  // 6. function
  func: function () {
    console.log("普通函数");
  },
  arrowFunc: () => console.log("箭头函数"),

  // 7. 奇特的Object(Symblo('syh'))
  symbolObj: Object(Symbol("syh")),

  // 二. Symbol(key)类型的 属性名【键】
  [Symbol("syh")]: "syh",
  [Symbol("map")]: new Map([["syh", "syh"]]),
};

// 加循环引用
// target.self = target;
// target.map.set("self", target);
// target.set.add(target);
// target.arr.push(target);

function isObj(obj) {
  return typeof obj === "object" && obj != null;
}

/**
 *
 * @param {*} obj
 * @param {*} cloneObj
 * @param {*} checkedSet
 * @returns
 *
 */
function check(obj, cloneObj, checkedSet = new WeakSet(), curFullPath = "") {
  // 1. 基本数据类型 与 checkedSet已有
  if (!isObj(obj)) return;
  if (checkedSet.has(obj)) return;

  // 2. 【对象】马上添加到chheckedSet内
  checkedSet.add(obj);

  // 2. 遍历对象
  let backUp = curFullPath;
  for (let key of Reflect.ownKeys(obj)) {
    if (!isObj(obj[key])) continue;

    // 有点神奇- `${Symbol}`模板字符串 尝试将其转为字符串，但无法转换
    const curPart = typeof key === "symbol" ? `symbol[${key.description}]` : key;
    curFullPath += curFullPath === "" ? curPart : " -> " + curPart;
    console.log(curFullPath, `相等吗--- `, obj[key] === cloneObj[key]);

    check(obj[key], cloneObj[key], checkedSet, curFullPath);

    curFullPath = backUp; //还原回来
  }
}

module.exports = { target, check };
