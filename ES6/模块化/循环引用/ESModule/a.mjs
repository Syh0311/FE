// a.mjs
import { bar } from "./b.mjs";
console.log("a.mjs");
console.log(bar());

// 需要使用函数声明做变量提升
function foo() {
  return "foo";
}
export { foo };
