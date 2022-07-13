// 测试数据
const window = {
  c: 100000,
};

const obj = {
  c: 500,
};

function add(a, b) {
  console.log(this);
  return a + b + this.c;
}

//bind验证new用的——————————————————
let foo = {
  value: 1,
};
function Bar(name, age) {
  this.habit = "shopping";
  console.log(this.value);
  console.log(name);
  console.log(age);
}
Bar.prototype.friend = "kevin";

export { window, obj, add, foo, Bar };
