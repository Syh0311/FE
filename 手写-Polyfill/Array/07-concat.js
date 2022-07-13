/**
find特点：
  1. 找到时返回找到的【第一个】元素
  2. 找不到时返回 undefined
*/
Array.prototype.myConcat = function (...args) {
  const result = [...this];
  for (let item of args) {
    if (Array.isArray(item)) {
      result.push(...item);
    } else {
      result.push(item);
    }
  }
  return result;
};
