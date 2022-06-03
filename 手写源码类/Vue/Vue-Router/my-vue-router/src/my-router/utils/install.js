import switchPage from "./switchPage.js";
// install 一般是给每个vue实例添加东西
// 在这里就是给每个组件添加$route和$router。

let Vue;
function install(v) {
  Vue = v;

  Vue.mixin({
    beforeCreate() {
      // 1. 给所有组件添加 _root _router
      if (this.$options && this.$options.router) {
        // 如果是根组件
        this._root = this; //_root指向根组件
        this._router = this.$options.router; // 挂载 _router

        // 将_router.history进行响应式 即history变化会触发其dep中所有watcher 通着watcher update 【此处通知router-view 更新】!!!！！！
        Vue.util.defineReactive(this, "whatever", this._router.history); // obj,key,
        console.log("[ Vue.util ]", Vue.util);
      } else {
        //如果是子组件
        this._root = this.$parent && this.$parent._root;
      }

      // 给所有vue组件添加$router 访问每个页面的 $router都是同一个
      Object.defineProperty(this, "$router", {
        get() {
          return this._root._router;
        },
      });

      // 添加$route代理
      Object.defineProperty(this, "$route", {
        get() {
          return this._root._router.history.current;
        },
      });
    },
  });

  // 添加组件
  Vue.component("router-link", {
    props: {
      to: String,
    },
    render(h) {
      //render中this是vue组件  this.to是直接绑定到组件上的属性
      const router = this._self._root._router;
      const mode = router.mode;
      const to = mode === "hash" ? "#" + this.to : this.to;

      return h(
        "a",
        {
          attrs: { href: to },
          on: {
            click: (e) => {
              if (mode === "hash") return;
              e.preventDefault(); //阻止默认a标签刷新网页
              switchPage(router, to); //MVVM
              history.pushState(null, "", to); //修改网址
            },
          },
        },
        this.$slots.default // 节点相关信息
      );
    },
  });

  Vue.component("router-view-syh", {
    // render(h) {
    //   return h("h1", {}, "首页视图");
    // },
    render(h) {
      // render函数里的this指向的是一个Proxy代理对象，代理Vue组件
      // console.log(this);
      // console.log(this._self);
      // console.log(this._self._root == this._root); //true
      const current = this._root._router.history.current;
      const routesMap = this._root._router.routesMap;
      const curComponent = routesMap[current];
      return h(curComponent);
    },
  });
}

export default install;
