function mySetInterval(cb, delay = 0) {
  // 1. 初始化变量
  let startTime = Date.now();
  const timer = { id: undefined };

  // 2. 使用RAF开启loop
  function loop() {
    const cur = Date.now();
    if (cur - startTime >= delay) {
      cb();
      startTime = cur;
    }
    timer.id = requestAnimationFrame(loop);
  }
  loop();

  // 3. 返回timer对象
  return timer;
}

function myClearInterval(timer) {
  cancelAnimationFrame(timer.id);
  document.removeEventListener("visibilitychange", onVisibleChange);
}
