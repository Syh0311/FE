class Publisher {
  constructor() {
    this.events = {};
  }

  on(event, fn) {
    (this.events[event] || (this.events[event] = [])).push(fn);
  }

  emit(event) {
    const cbs = this.events[event];
    if (!cbs) return;

    // 把事件名去掉
    const args = [...arguments].slice(1);
    const args2 = Array.prototype.slice.call(arguments, 1);
    const args3 = toArray(arguments, 1);
    cbs.forEach((cb) => {
      cb.call(this, args3);
    });
  }

  off(event, fn) {
    // 1. 调度中心没注册这个事件
    const cbs = this.events[event];
    if (!cbs) return this;

    // 2. 没传特点函数，删除整个事件
    if (!fn) {
      this.events[event] = null;
      return this;
    }

    // 3. 删除单个
    for (let i = 0, len = cbs.length; i < len; i++) {
      if (cbs[i] === fn) {
        cbs.splice(i, 1);
        break;
      }
    }
  }

  once(event, fn) {
    const vm = this;
    function on() {
      vm.off(event, on); //自删除
      fn.apply(vm, arguments);
    }
    vm.on(event, on);

    //为啥不直接这样写？？
    // this.on(event, fn);
    // this.emit(event, fn);
    // this.off(event, fn);

    return this;
  }
}

// const testPublisher = new Publisher();

// testPublisher.on("syh", (args) => {
//   console.log(args);
//   console.log("[ 11111111111 ]");
// });

// testPublisher.on("syh", (args) => {
//   console.log(args);
//   console.log("[ 22222222222 ]");
// });

// testPublisher.emit("syh", "123456");
function toArray(list, start) {
  start = start || 0;
  // 类数组有 length属性
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret;
}
export default Publisher;
