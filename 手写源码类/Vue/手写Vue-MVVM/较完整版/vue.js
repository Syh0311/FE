class Vue {
  constructor(options) {
    this.$options = options;
    this.$el = options.el;
    this.$data = options.data;

    //
    if (!this.$el) throw new Error("未传入el");

    //数据劫持-通知变化
    new Observer(this.$data);
    //解析指令初始化视图-订阅数据变化
    new Compile(this.$el, this);

    //
    this.proxy(this, this.$data);
  }
  proxy(obj, sourceObj) {
    //将vm.$data上属性代理到vm上
    for (let key in sourceObj) {
      Object.defineProperty(obj, key, {
        get() {
          return sourceObj[key];
        },
        set(val) {
          sourceObj[key] = val;
        },
      });
    }
  }
}

//策略模式--多态？？--单例模式？？
//单一职责原则
const compileUtil = {
  getVal(expr, vm) {
    const arr = expr.split("."); //person.age情况
    return arr.reduce((data, currentExpr) => data[currentExpr], vm.$data);
    //reduce代替以下代码，reduce相当于foreach的进阶版！！！
    let temp = vm.$data;
    arr.forEach((currentExpr) => {
      temp = temp[currentExpr];
    });
    return temp;
  },

  setVal(vm, expr, newVal) {
    const arr = expr.split(".");
    arr.reduce((data, currentVal, index, arr) => {
      if (index == arr.length - 1) {
        data[currentVal] = newVal;
      }
      return data[currentVal];
    }, vm.$data);
  },

  text(node, expr, vm) {
    //两种情况 <div v-text='preason.name'></div>     {{person.name}}
    let value;
    if (expr.indexOf("{{") !== -1) {
      value = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
        // console.log(args);
        return this.getVal(args[1], vm);
      });
    } else {
      value = this.getVal(expr, vm);
    }
    this.updater.textUpdater(node, value);
    //只能应对第一种情况
    // const value = this.getVal(expr, vm);
    // this.updater.textUpdater(node, value);
  },

  html(node, expr, vm) {
    const value = this.getVal(expr, vm);
    this.updater.htmlUpdater(node, value);
  },

  modle(node, expr, vm) {
    const value = this.getVal(expr, vm);
    // 将当前节点对应的信息放入到watcher中，vue已经对vue.$data中数据做响应式处理，之后再做compile，指令解析时会触发响应式中get方法，new Watcher时在Dep上添加target属性，指向watcher实例，watcher实例中也调用了get方法，从而将watcher实例添加到get的闭包内的dep上【所以watcher内又：watcher.target=null】
    new Watcher(vm, expr, (value) => this.updater.modleUpdater(node, value));

    // 视图==>数据==>视图
    node.addEventListener(
      "input",
      (e) => {
        const newVal = e.target.value;
        this.setVal(vm, expr, newVal);
      },
      false
    );

    // 数据==>视图
    this.updater.modleUpdater(node, value);
  },

  on(node, expr, vm, event) {
    //fn需要绑定到vm上
    const fn = vm.$options.methods[expr].bind(vm);
    node.addEventListener(event, fn, false);
  },

  updater: {
    //都是数据==>视图的更新
    textUpdater(node, value) {
      node.textContent = value;
    },
    htmlUpdater(node, value) {
      node.innerHTML = value;
    },
    modleUpdater(node, value) {
      node.value = value;
    },
  },
};

class Compile {
  constructor(el, vm) {
    this.vm = vm; //？？
    this.elm = document.querySelector(el); //没判断
    //1. 获取文档碎片，放到内存中，减少页面回流与重绘
    const fragment = this.node2Fragement(this.elm);
    // console.log(fragment);

    //2. 模板编译
    this.compile(fragment);

    //3. 追加子元素到父元素上
    this.elm.appendChild(fragment);
  }

  isElementNode(node) {
    return node.nodeType === 1;
  }

  node2Fragement(el) {
    //使用文档碎片收集，减少页面回流与重绘
    const f = document.createDocumentFragment();
    let firstChild;
    //!!!
    while ((firstChild = el.firstChild)) {
      f.appendChild(firstChild); //appendChild会将原有结点直接移到到另一个父节点下！！！
    }
    return f;
  }

  compile(fragment) {
    const childNodes = fragment.childNodes;
    // console.log(Array.isArray(childNodes)); //false 类数组，但是实现了iterator接口
    childNodes.forEach((el) => {
      if (this.isElementNode(el)) {
        // console.log("是元素结点", el);

        this.compileElement(el);
        el.childNodes.length && this.compile(el);
      } else {
        // console.log("是文本结点", el.nodeValue);
        this.compileText(el);
      }
    });
  }

  compileElement(node) {
    const attributes = node.attributes;
    [...attributes].forEach((attr) => {
      // console.log(typeof attr);//attr是个obj
      const { name, value } = attr;
      if (this.isDirective(name)) {
        //v-modle v-text v-html 【v-on:click  v-bind:src】情况  v-bind还没写
        const [, directive] = name.split("-");
        const [dirName, event] = directive.split(":");
        //更新数据，数据驱动试图
        compileUtil[dirName](node, value, this.vm, event);
        //删除相关指令
        node.removeAttribute(name);
      } else if (this.isEventName(name)) {
        // @click情况
        const [, event] = name.split("@");
        compileUtil["on"](node, value, this.vm, event);
      }
    });
  }

  compileText(node) {
    // console.log(node.textContent);
    const content = node.textContent;
    //使用正则处理大括号{{}}
    if (/\{\{(.+?)\}\}/.test(content)) {
      compileUtil["text"](node, content, this.vm);
    }
  }

  isDirective(attrName) {
    return attrName.startsWith("v-");
  }

  isEventName(attrName) {
    return attrName.startsWith("@");
  }
}
