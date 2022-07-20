// TDZ测试：
var temp = 1;

if (true) {
  // temp = "a"; // ReferenceError
  let temp;
  console.log(temp);
}

// 全局执行上下文内——————————————————————————
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
