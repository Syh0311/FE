let a = 20;
const b = 30;
var c;

function multiply(e, f) {
  var g = 20;
  return e * f * g;
}
c = multiply(20, 30);

//全局执行上下文
GlobalExectionContext = {
  ThisBinding: "<Global Object>",

  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 在这里绑定标识符
      a: "< uninitialized >",
      b: "< uninitialized >",
      multiply: "< func >",
    },
    outer: "<null>",
  },

  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Object", //还有'Declarative'【声明】
      // 在这里绑定标识符
      c: undefined,
    },
    outer: "<null>",
  },
};

//函数执行上下文【调用时才创建，在此之前保存在堆内存中，函数的父级作用域中保存着函数的内存地址】
FunctionExectionContext = {
  ThisBinding: "<Global Object>",

  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 在这里绑定标识符
      Arguments: { 0: 20, 1: 30, length: 2 },
    },
    outer: "<GlobalLexicalEnvironment>",
  },

  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 在这里绑定标识符
      g: undefined,
    },
    outer: "<GlobalLexicalEnvironment>",
  },
};
