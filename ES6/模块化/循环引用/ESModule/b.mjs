// b.mjs
import { foo } from "./a.mjs";
console.log("b.mjs");
console.log(foo());

// 需要使用函数声明做变量提升
function bar() {
  return "bar";
}
export { bar };
