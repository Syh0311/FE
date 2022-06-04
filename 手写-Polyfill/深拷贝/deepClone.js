function deepClone(obj, map = new Map()) {
  if (typeof obj !== "object" || obj === null) return obj;

  if (map.has(obj)) return map.get(obj);

  const cloneObj = Array.isArray(obj) ? [] : {};
  map.set(obj, cloneObj); //声明之后 马上添加到map，要不【循环引用】永远循环在forEach

  Object.keys(obj).forEach((key) => {
    cloneObj[key] = deepClone(obj[key], map);
  });

  // map.set(obj, cloneObj); //声明之后 马上添加到map，要不【循环引用】后永远到不了这一步
  return cloneObj;
}

const obj = {
  a: 1,
  b: ["e", "f", "g"],
  c: { h: 20 },
  d: function () {
    console.log(this);
  }, //克隆函数没有意义，堆内存中保存着函数体和父级作用域【调用函数时，将函数执行上下文当道全局执行上下文中，其中词法环境和变量环境指向堆内存中】
  flag: false,
  map: new Map([
    [1, 1],
    [2, 2],
  ]),
  set: new Set([1, 2, 3, 4, 4]),
  // symbol: new Symbol(),
};
obj.e = obj;
console.log(obj);

const obj2 = deepClone(obj);
console.log("[ obj2 ]", obj2);
console.log(typeof obj2.flag);
obj2.flag = true;

console.log("------------");
console.log(obj2);
console.log("------------");
console.log(obj);
