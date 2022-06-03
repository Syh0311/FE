function deepClone(obj, map = new Map()) {
  //第一坑：if的判断条件
  // if (typeof obj != "object" || typeof obj == null) {
  if (typeof obj == "object" && typeof obj != null) {
    if (map.has(obj)) {
      return map.get(obj);
    }
    const cloneObj = Array.isArray(obj) ? [] : {};
    //第二坑，添加到map中的时机【声明过 立马添加】
    map.set(obj, cloneObj);
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 第三坑，递归时加上map
        cloneObj[key] = deepClone(obj[key], map);
      }
    }
    //第四坑，记得返回cloneObj
    return cloneObj;
  } else {
    return obj;
  }
}
const obj = {
  a: 1,
  b: ["e", "f", "g"],
  c: { h: 20 },
  d: function () {
    console.log(this);
  }, //克隆函数没有意义，堆内存中保存着函数体和父级作用域【调用函数时，将函数执行上下文当道全局执行上下文中，其中词法环境和变量环境指向堆内存中】
};
obj.obj = obj;

const clone = deepClone2(obj);
console.log(clone === obj);
clone.a = 11111111111111111;
console.log(clone.d === obj.d);
// clone.d();
// obj.d();
// console.log(clone);
// console.log(obj);

function deepClone2(obj, map = new Map()) {
  if (typeof obj == "object" && typeof obj != null) {
    if (map.has(obj)) {
      return map.get(obj);
    }
    const cloneObj = Array.isArray(obj) ? [] : {};
    map.set(obj, cloneObj);
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloneObj[key] = deepClone2(obj[key], map);
      }
    }
    return cloneObj;
  } else {
    return obj;
  }
}
