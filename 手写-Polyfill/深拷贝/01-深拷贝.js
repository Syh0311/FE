function deepClone(obj) {
  if (typeof obj === "object" && typeof obj !== null) {
    const cloneObj = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      cloneObj[key] = deepClone(obj[key]);
    }
    return cloneObj;
  } else {
    return obj;
  }
}

// test
const obj = {
  a: 1,
  b: ["e", "f", "g"],
  c: { h: 20 },
  d: function () {},
  flag: true,
};
// const clone = deepClone(obj);
// console.log(clone === obj);
// console.log(clone);
// console.log(obj);

function deepClone2(obj, map = new Map()) {
  if (typeof obj == "object" && typeof obj != null) {
    if (map.has(obj)) {
      return map.get(obj);
    }
    const cloneObj = Array.isArray(obj) ? [] : {};
    map.set(obj, cloneObj);
    Object.keys(obj).forEach((key) => {
      cloneObj[key] = deepClone2(obj[key], map);
    });
    return cloneObj;
  } else {
    return obj;
  }
}

const clon2e = deepClone2(obj);
console.log(clon2e === obj);
clon2e.a = 1111;
console.log(clon2e);
console.log(obj);
