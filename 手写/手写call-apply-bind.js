// 测试数据
const window = {
  c: 100000,
};

const obj = {
  c: 500,
};

function add(a, b) {
  // console.log(this);
  return a + b + this.c;
}

//call
Function.prototype.myCall = function (thisArg, ...args) {
  const fn = this;
  thisArg = thisArg || window;

  thisArg.tempFn = fn;
  const res = thisArg.tempFn(...args);
  delete thisArg.tempFn;
  return res;
};
console.log(add.myCall(obj, 1, 20)); //500+1+20
console.log(add.myCall(null, 1, 20)); //100000+1+20

//apply  相较于call，只有接收参数不同，内部代码完全一样
Function.prototype.myApply = function (thisArg, args) {
  const fn = this;
  thisArg = thisArg || window;

  thisArg.tempFn = fn;
  const res = thisArg.tempFn(...args);
  delete thisArg.tempFn;
  return res;
};
console.log(add.myApply(obj, [1, 20])); //500+1+20
console.log(add.myApply(null, [1, 20])); //100000+1+20

//bind  函数外保存 thisArg   this【fn】
Function.prototype.myBind = function (thisArg, ...args1) {
  const fn = this;
  return function (...args2) {
    thisArg = thisArg || window;
    thisArg.tempFn = fn;
    const res = thisArg.tempFn(...args1, ...args2);
    delete thisArg.tempFn;
    return res;
  };
};
const bindFn = add.myBind(obj, 1);
console.log(bindFn(20)); //500+1+20

const bindFn2 = add.myBind(null, 1);
console.log(bindFn2(20)); //100000+1+20
