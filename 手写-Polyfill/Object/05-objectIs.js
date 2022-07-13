/**
Object.is(x,y)
1. 与 == 区别：
  1. == 会转换等式两边为布尔值 【如""==false --> true】
2. 与 === 区别：
  1. +0 与 -0 
  2. NaN === NaN

*/
function objectIs(x, y) {
  // 1. 判断x跟y是+0、-0、0三种情况
  if (x === y) return x !== 0 || 1 / x === 1 / y;

  // 2. x!==y有可能是两者都是NaN。而NaN!==NaN  即x!==x则说明其本身为NaN
  return x !== x && y !== y; // 俩都是NaN
  return isNaN(x) && isNaN(y); // 使用现有API
}
console.log(objectIs(0, -0)); // false
console.log(objectIs(0, +0)); //true
console.log(objectIs(-0, -0)); // true
console.log(objectIs(NaN, 0 / 0)); //true
