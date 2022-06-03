class myVueRouter {}

// install 一般是给每个vue实例添加东西
// 在这里就是给每个组件添加$route和$router。
let Vue;
myVueRouter.install = function (v) {
  Vue = v;

  Vue.mixin({
    beforeCreate() {
      if (this.$options && this.$options.router) {
        // 如果是根组件
        this._root = this; //把当前实例挂载到_root上
        this._router = this.$options.router;
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
    },
  });

  Vue.component("router-link", {
    render(h) {
      return h("a", {}, "首页");
    },
  });
  Vue.component("router-view", {
    render(h) {
      return h("h1", {}, "首页视图");
    },
  });
};

export default myVueRouter;

// 为什么是beforeCreate而不是created呢？因为如果是在created操作的话，$options已经初始化好了。

// 父组件和子组件的执行顺序
// 加载渲染过程 3 3 1 1
// 父beforeCreate -> 父created -> 父beforeMount ->子beforeCreate -> 子created -> 子beforeMount -> 子mounted -> 父mounted

// 销毁过程
// 父beforeDestroy -> 子beforeDestroy -> 子destroyed -> 父destroyed
