//input ["a","b","c","d","e","f","g"];
//output {"a":{"b":{"c":{"d":{"e":{"f":"g"}}}}}}
let input = ["a", "b", "c", "d", "e", "f", "g"];
function dfs(input) {
  const result = input.reduceRight((pre, cur) => {
    const temp = {};
    temp[cur] = pre;
    return temp;
  });
  console.log(result);
}
dfs(input);

function recursive(input) {
  // 递归出口
  if (input.length == 1) return input[0];

  // 递归体
  const obj = {};
  const key = input.shift();
  obj[key] = recursive(input);

  // 当前递归返回值
  return obj;
}
recursive(input);

function recursiveIndex(input, index) {
  // 递归出口
  if (index == input.length - 1) return input[index];

  // 递归体
  const obj = {};
  const key = input[index];
  obj[key] = recursive(input);

  // 当前递归返回值
  return obj;
}
recursiveIndex(input, 0);
