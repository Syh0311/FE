// 非严格模式，注意两种情况不同，因为 var和function都挂载到window上，但let不挂载
// case1 ——————————————————————
var name = "syh";
var doSth = function () {
  console.log(this === window); // true
  console.log(this.name); //syh
};
doSth();

// case2 ——————————————————————
let name2 = "syh";
function doSth2() {
  console.log(this === window); // true
  console.log(this.name2); // undefine，let不挂载到window上
}
doSth2();
