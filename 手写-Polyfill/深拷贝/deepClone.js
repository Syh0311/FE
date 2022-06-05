const target = {
  field1: 1,
  field2: undefined,
  field3: {
    child: "child",
  },
  field4: [2, 4, 8],
  empty: null,
  map: new Map([
    [1, 1],
    [2, 2],
  ]),
  set: new Set([1, 2, 3, 3]),
  bool: new Boolean(true),
  num: new Number(2),
  str: new String(2),
  symbol: Object(Symbol(1)),
  date: new Date(),
  reg: /\d+/,
  error: new Error(),
  func1: () => {
    console.log("code秘密花园");
  },
  func2: function (a, b) {
    return a + b;
  },
};
target.self = target;

function deepClone(obj, map = new Map()) {
  // 1. 判断是否为基本数据类型
  if (typeof obj !== "object" || obj === null) return obj;

  // 2. 判断是否在map中，解决循环引用
  if (map.has(obj)) return map.get(obj);

  // 3. 开始克隆，新的对象马上加到map中
  const cloneObj = Array.isArray(obj) ? [] : {};
  map.set(obj, cloneObj); //声明之后 马上添加到map，要不【循环引用】永远循环在forEach

  // 4.遍历对象
  Object.keys(obj).forEach((key) => {
    cloneObj[key] = deepClone(obj[key], map);
  });

  // 5. 返回克隆后的对象
  // map.set(obj, cloneObj); //声明之后 马上添加到map，要不【循环引用】后永远到不了这一步
  return cloneObj;
}

const obj2 = deepClone(target);
console.log("[ obj2 ]", obj2);
