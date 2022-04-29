//sum(1,2)转sum(1)(2)
function sum(a, b) {
  return a + b;
}
function sum2(a) {
  return function (b) {
    return a + b;
  };
}
// console.log(sum(1, 2) === sum2(2)(1));

function curry(fn) {
  // 获取原函数的参数长度
  const argLen = fn.length;

  // 保存预置参数  【curry运行时时携带的参数】
  const presetArgs = [].slice.call(arguments, 1);

  // 返回一个新函数
  return function () {
    // 新函数调用时会继续传参
    const restArgs = [].slice.call(arguments);
    const allArgs = [...presetArgs, ...restArgs];

    if (allArgs.length >= argLen) {
      // 如果参数够了，就执行原函数
      return fn.apply(this, allArgs);
    } else {
      // 否则继续柯里化【】
      return curry(fn, ...allArgs);
      return curry.call(null, fn, ...allArgs);
    }
  };
}

function fn(a, b, c) {
  return a + b + c;
}
var curried = curry(fn);
const res1 = curried(1, 2, 3); // 6
const res2 = curried(1, 2)(3); // 6
const res3 = curried(1)(2, 3); // 6
const res4 = curried(1)(2)(3); // 6
const res5 = curried(7)(8)(9); // 24
const res6 = curried(7)(8)(9, 1000); // 24
console.log(res1, res2, res3, res4, res5, "res6");

// https://juejin.cn/post/6864378349512065038#heading-29
