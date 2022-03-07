{
  // tasks是宏任务队列【执行完宏任务之后，执行宏任务内的微任务，微任务执行完后，执行下一个宏任务】
  tasks: [
    //宏任务1
    {
      script: "主代码块",
    },
    //宏任务2
    {
      //click之后
      script: "click回调函数",
      // microtasks是微任务队列
      microtasks: [
        {
          script: "Promise",
        },
        {
          script: "MutationObserver",
        },
      ],
    },
    //宏任务3
    {
      script: "setTimeout",
    },
  ];
}
