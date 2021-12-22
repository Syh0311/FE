function SelfVue (data, el, exp) {
  this.data = data;
  observe(data);
  el.innerHTML = this.data[exp];  // 初始化模板数据的值
  new Watcher(this, exp, function (value) {
      el.innerHTML = value;
  });
  return this;
}






// watcher 
function Watcher(vm, exp, cb) {
  this.cb = cb;
  this.vm = vm;
  this.exp = exp;
  this.value = this.get();  // 将自己添加到订阅器的操作
}

Watcher.prototype = {
  update: function() {
      this.run();
  },
  run: function() {
      var value = this.vm.data[this.exp];
      var oldVal = this.value;
      if (value !== oldVal) {
          this.value = value;
          this.cb.call(this.vm, value, oldVal);
      }
  },
  get: function() {
      Dep.target = this;  // 缓存自己
      var value = this.vm.data[this.exp]  // 强制执行监听器里的get函数
      Dep.target = null;  // 释放自己
      return value;
  }
};

// observe
function defineReactive(data, key, val) {
  observe(val); // 递归遍历所有子属性
  var dep = new Dep(); 
  Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function() {
          if (Dep.target) {  // 判断是否需要添加订阅者
              dep.addSub(Dep.target); // 在这里添加一个订阅者
          }
          return val;
      },
      set: function(newVal) {
          if (val === newVal) {
              return;
          }
          val = newVal;
          console.log('属性' + key + '已经被监听了，现在值为：“' + newVal.toString() + '”');
          dep.notify(); // 如果数据变化，通知所有订阅者
      }
  });
}
Dep.target = null;


// observe递归
function observe(data) {
  if (!data || typeof data !== 'object') {
      return;
  }
  Object.keys(data).forEach(function(key) {
      defineReactive(data, key, data[key]);
  });
};


// Dep 
function Dep () {
  this.subs = [];
}
Dep.prototype = {
  addSub: function(sub) {
      this.subs.push(sub);
  },
  notify: function() {
      this.subs.forEach(function(sub) {
          sub.update();
      });
  }
};
