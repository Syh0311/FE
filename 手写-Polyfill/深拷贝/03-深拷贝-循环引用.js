const { target, check } = require("./00-dataObject");

function deepClone(obj, map = new WeakMap()) {
  // 1. 判断是否为基本数据类型
  if (typeof obj !== "object" || obj === null) return obj;

  // 2. 判断是否在map中，解决循环引用  【使用WeakMap】
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

const clone = deepClone2(target);
console.log(clone === target);
clone.a = 11111111111111111;
console.log(clone.d === target.d);
