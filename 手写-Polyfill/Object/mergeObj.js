let obj1 = {
  a: 1,
  b: 2,
  c: {
    d: 1,
    e: 11,
  },
};
let obj2 = {
  a: 1241,
  b: 2457,
  c: {
    d: 235634,
    f: 11241,
  },
};
function mergeObj(obj1, obj2) {
  let obj = JSON.parse(JSON.stringify(obj1));
  for (let key of Object.keys(obj2)) {
    if (obj[key]) {
      if (typeof obj[key] !== "object") {
        obj[key] = obj2[key];
      } else if (typeof obj2[key] !== "object") {
        obj[key] = obj2[key];
      } else {
        obj[key] = mergeObj(obj[key], obj2[key]);
      }
    } else {
      obj[key] = obj2[key];
    }
  }
  return obj;
}
let result = mergeObj(obj1, obj2);
// console.log(result);
let map = new Map();
map.set(1, 11);
map.set(2, 22);
console.log(...map);
console.log({ ...map });
console.log(typeof map);
console.log([...map]);
console.log(typeof { ...map });
console.log({ ...obj1 });
