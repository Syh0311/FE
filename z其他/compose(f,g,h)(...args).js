// 实现`compose(f,g,h)(...args) `这个函数的功能等价于：f(g(h(...args)))

function composeFor(f, g, h) {
  const fns = [...arguments];
  return function (...args) {
    const lastFn = fns.at(-1);
    let init = lastFn(...args);

    for (let i = fns.length - 2; i >= 0; i--) {
      init = fns[i](init);
    }
    return init;
  };
}
function composeReduce() {
  const fns = [...arguments];
  return function (...args) {
    const lastFn = fns.at(-1);
    const init = lastFn(...args);

    const result = fns.reduceRight((pre, cur) => {
      if (cur == lastFn) return pre;
      else return cur(pre);
    }, init);
    return result;
  };
}

const add1 = (a, b) => a + b + "-s";
const add2 = (a) => a + "-y";
const add3 = (a) => a + "-h";
const add4 = (a) => a + "-yy";
const add5 = (a) => a + "-hh";

const res1 = composeFor(add5, add4, add3, add2, add1)("111-", "222");
const res2 = composeReduce(add5, add4, add3, add2, add1)("111-", "222");
console.log(res1 === res2);
console.log(res1);
