var temp = 1;
var temp2 = 2;

if (true) {
  // temp = "a"; // ReferenceError
  let temp;
  console.log(temp);
}
if (true) {
  let temp2;
  temp2 = "a";
  console.log(temp2);
}

// 这不就等于是有变量提升了吗，结合词法环境【与之对应的为变量环境】解释
// https://juejin.cn/post/6844903682283143181
// https://blog.bitsrc.io/understanding-execution-context-and-execution-stack-in-javascript-1c9ea8642dd0

GlobalExectionContext = {
  ThisBinding: "<Global Object>",

  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 在这里绑定标识符
      temp: "< uninitialized >",
    },
    outer: "<null>",
  },

  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 在这里绑定标识符
      temp: undefined,
    },
    outer: "<null>",
  },
};
