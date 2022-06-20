function mountObserver() {
  if (!window.MutationObserver) {
    // 不支持 MutationObserver 的话
    console.warn("MutationObserver 不支持，首屏时间无法被采集");
    return;
  }

  // 每次 dom 结构改变时，都会调用里面定义的函数
  const observer = new window.MutationObserver(() => {
    const time = getTimestamp() - this.startTime; // 当前时间 - 性能开始计算时间

    const body = document.querySelector("body");
    let score = 0;

    if (body) {
      score = traverseEl(body, 1, false);
      this.observerData.push({ score, time });
    } else {
      this.observerData.push({ score: 0, time });
    }
  });

  // 设置观察目标，接受两个参数: target：观察目标，options：通过对象成员来设置观察选项
  // 设为 childList: true, subtree: true 表示用来监听 DOM 节点插入、删除和修改时
  observer.observe(document, { childList: true, subtree: true });

  this.observer = observer;

  if (document.readyState === "complete") {
    // MutationObserver监听的最大时间，10秒，超过 10 秒将强制结束
    this.unmountObserver(10000);
  } else {
    win.addEventListener(
      "load",
      () => {
        this.unmountObserver(10000);
      },
      false
    );
  }
}

export default mountObserver;
