import add from "./add.js";
function minus(a, b) {
  const c = add(a, b);
  // console.log("[ c ]", c);
  console.log("minus(a,b)返回的还是a");
  return c - b;
  // 返回的还是a
}
export default minus;
