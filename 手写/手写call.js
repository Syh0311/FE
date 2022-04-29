// 测试数据
const window = {
  c: 100000,
};

const obj = {
  c: 500,
};
let c = 100;

function add(a, b) {
  // console.log(this);
  return a + b + this.c;
}

const add2 = (a, b) => {
  console.log(this);
  return a + b + this.c;
};

//call
Function.prototype.call = function (thisArg, ...args) {
  // console.log(this); //为啥node下 max callback？？？
  thisArg = thisArg || window;
  thisArg.fn = this;
  const res = thisArg.fn(...args);
  delete thisArg.fn;
  return res;
};

const res = add.call(obj, 20, 1);
const res2 = add.call(null, 20, 1);

Function.prototype.apply = function (thisArg, args) {
  thisArg = thisArg || window;
  thisArg.fn = this;
  const res = thisArg.fn(...args);
  delete thisArg.fn;
  return res;
};

Function.prototype.bind = function (thisArg, ...args1) {
  thisArg = thisArg || window;
  const self = this;
  return function (...args2) {
    thisArg.fn = self;
    const res = thisArg.fn(...args1, ...args2);
    delete thisArg.fn;
    return res;
  };
};

console.log(add.apply(obj, [1, 20])); //500+1+20
console.log(add.apply(null, [1, 20])); //100000+1+20

const bindFn = add.bind(obj, 1);
console.log(bindFn(20)); //500+1+20

const bindFn2 = add.bind(null, 1);
console.log(bindFn2(20)); //100000+1+20
