class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(watcher) {
    this.subs.push(watcher);
    console.log(this.subs);
  }
  notify() {
    this.subs.forEach((w) => w.update());
  }
}

class Watcher {
  constructor(vm, expr, cb) {
    // 观察新值和旧值的变化,如果有变化 更新视图
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    // 先把旧值存起来
    this.oldVal = this.getOldVal();
  }
  getOldVal() {
    Dep.target = this; //先指向watcher实例上
    let value = compileUtil.getVal(this.expr, this.vm); //这次get有两个目的：1.watcher中保存旧数据，下次对比用；2.触发数据劫持get中dep，将这个watcher加入到dep中
    Dep.target = null; //获取视图后清空target
  }
  update() {
    // console.log("update-----------");
    let newVal = compileUtil.getVal(this.expr, this.vm);
    if (newVal === this.oldVal) return;
    this.cb(newVal);
    //加入有3个地方绑定同一个值【同一个指令下的】，当修改了其中一处时，三处都执行watcher.update()，通过其中回调函数修改视图。
  }
}

class Observer {
  constructor(obj) {
    this.observe(obj);
  }
  observe(obj) {
    if (typeof obj !== "object" || obj === "null") return;
    const keys = Object.keys(obj);
    keys.forEach((key) => this.defineReactive(obj, key, obj[key]));
  }
  defineReactive(obj, key, value) {
    //1.先观察value，因为value可能就是对象
    this.observe(value);
    //2.new 一个Dep 收集所有watcher
    const dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      get() {
        //2.1订阅数据变化，往【dep】中添加观察者，编译时候会去obj上取值，取值就会触发get
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set: (newVal) => {
        //set转换为箭头函数，要不然this指向obj了
        if (newVal === value) return;
        //观察新值，如果新值是obj，需要重新观察内部定义其响应式，深度优先递归
        this.observe(newVal);
        console.log("设置了新值" + value + "-->" + newVal);
        value = newVal;
        // 通知变化 -- 数据==>视图
        dep.notify();
      },
    });
  }
}
