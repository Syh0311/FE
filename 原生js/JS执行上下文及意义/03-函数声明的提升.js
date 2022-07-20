/**
一、三种函数创建方式
  1. 函数声明            function case1(){}
  2. 函数表达式(var)     var case2 = function(){}
  4. 函数表达式(let)     let case3 = function(){}

二、两种函数提升的区别
  1. function case1(){}
  2. var case2 = function(){}
*/

// 一、三种函数创建方式
// case1 函数声明创建函数【函数声明提升！！！】
console.log(case1()); //case1,case1
function case1() {
  console.log("case1");
  return "case1";
}
console.log(case1()); //case1,case1

// // case2 使用var关键词 【借助了var的变量提升！】
// console.log(case2);  //undefined
// console.log(case2);  //case2 is not a function！！！
// var case2 = function () {
//   console.log('case2');
//   return 'case2'
// }
// console.log(case2());  //case2,case2

// // case3. 使用let关键词【没函数表达式提升了！！】
// console.log(case3); //Cannot access 'case3' before initialization，浏览器知道下边let了！！！
// let case3 = function () {
//   console.log('case3');
//   return 'case3'
// }
// console.log(case3());

//二、【函数表达式 var】与【函数声明】的提升区别：

// // case1 【函数声明是整个函数提升】！！
// console.log(case1());
// function case1() {
//   console.log('case1');
//   return 'case1'
// }
// // 等于
// function case1() {
//   console.log('case1');
//   return 'case1'
// }
// console.log(case1());

// // case2 var是【变量提升】；
// console.log(case2);  //undefined
// console.log(case2);  //case2 is not a function！！！
// var case2 = function () {
//   console.log('case2');
//   return 'case2'
// }
// // 相当于
// var case2
// console.log(case2);  //undefined
// console.log(case2);  //case2 is not a function！！！
// case2 = function () {
//   console.log('case2');
//   return 'case2'
// }
