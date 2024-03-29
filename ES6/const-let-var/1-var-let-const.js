// 1.var
// 1.1 var的变量提升【hoist】   函数也自带hoist
function hoist() {
  console.log(a); //undefined
  var a = 10;
}
// hoist()

// 2.let
// 2.1 let 没有变量提升
function letNoHoist() {
  console.log(b); //ReferenceError: Cannot access 'b' before initialization
  let b = 10;
}
// letNoHoist()

// 2.2 let的TDZ【temporal dead zoom】
// 也就是只要有let在的作用域，let必须在最前边声明
function tdz(c) {
  var c = 10;
  console.log(c); //10    子作用域里有就不再往上找流
  return function () {
    console.log(c); //ReferenceError: Cannot access 'c' before initialization
    let c = 11;
    console.log(c); //不执行，因为上一步报错函数就停止流！！！
  };
}
// tdz(5)()

// 2.3 let的块级作用域【结合tdz】
function f() {
  var tmp = "syh-outer";
  return function () {
    console.log(tmp);
    if (true) {
      // 1.let
      let tmp = "hello world"; // syh-outer    【因为let只只只只只绑定块级作用域，块级作用域外失效，所以可以正常打印出Data，但是tmp是全局的，再次声明后顶替了之前的】
      console.log(tmp);
      // 2.var
      // var tmp = 'hello world'; //undefined,因为变量提升（hoist）了
    }
  };
}
f()();
