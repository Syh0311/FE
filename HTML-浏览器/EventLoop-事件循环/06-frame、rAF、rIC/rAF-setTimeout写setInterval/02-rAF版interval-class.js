class rAFInterval {
  // 私有属性与方法
  #cb;
  #delay;
  #startTime;
  #timerId;

  // 构造函数
  constructor(cb, delay = 0) {
    // 1. 初始化变量
    this.#cb = cb;
    this.#delay = delay;
    this.#startTime = Date.now();
    this.#timerId = undefined;

    // 2. rAF执行loop
    this.loop();
  }

  loop() {
    // console.log("[ this ]", this);
    let cur = Date.now();
    if (cur - this.#startTime >= this.#delay) {
      this.#cb();
      this.#startTime = cur;
    }
    this.#timerId = requestAnimationFrame(this.loop.bind(this));
  }

  rAFClearInterval() {
    cancelAnimationFrame(this.#timerId);
  }

  restart() {
    this.loop();
  }
}
