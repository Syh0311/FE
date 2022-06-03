{
  // tasks是宏任务队列
  tasks: [
    //宏任务1
    {
      script: "主代码块",
    },
    //宏任务2
    {
      script: "innter的click回调函数",
      microtasks: [
        {
          script: "Promise",
        },
        {
          script: "MutationObserver",
        },
      ],
    },
    //宏任务3【触发-事件冒泡】
    {
      script: "outer的click回调函数",
      microtasks: [
        {
          script: "Promise",
        },
        {
          script: "MutationObserver",
        },
      ],
    },
    //宏任务4
    {
      script: "setTimeout",
    },
    //宏任务5
    {
      script: "setTimeout",
    },
  ];
}
