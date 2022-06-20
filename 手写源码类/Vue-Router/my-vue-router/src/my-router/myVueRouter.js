// import install from 'my-vue-router/node_modules/vue-router/src/install'
import install from "./utils/install.js";
import switchPage from "./utils/switchPage.js";

class HistoryRoute {
  constructor() {
    this.current = null;
  }
}

class myVueRouter {
  constructor(options) {
    this.routes = options.routes || [];
    this.mode = options.mode || "hash";

    // 将routes转化为key:value形式
    this.routesMap = this.createMap(this.routes);
    // console.log("[ this.routesMap ]", this.routesMap);

    // 路由中需要存放当前的路径，来表示当前的路径状态 为了方便管理
    this.history = new HistoryRoute();

    // 初始化 this.history.current
    this.init();
  }

  init() {
    if (this.mode == "hash") {
      location.hash == "" && (location.hash = "/syh"); //没有则初始化

      const fn = () => (this.history.current = location.hash.slice(1));
      window.addEventListener("load", fn);
      window.addEventListener("hashchange", fn);
    } else {
      !location.pathname && (location.pathname = "/syh"); //没有则初始化

      const fn = () => (this.history.current = location.pathname);
      window.addEventListener("load", fn);
      window.addEventListener("popstate", fn);
    }
  }

  push(to) {
    switchPage(this, to);
    history.pushState(null, "", to); //修改网址
  }

  createMap(routes) {
    // const result = {};
    // routes.forEach((route) => {
    //   result[route.path] = route.component;
    // });
    // return result;

    // 更高级的写法  别一直用forEach
    return routes.reduce((pre, current) => {
      pre[current.path] = current.component;
      return pre;
    }, {});
  }
}

myVueRouter.install = install;
export default myVueRouter;

// 为什么是beforeCreate而不是created呢？因为如果是在created操作的话，$options已经初始化好了。

// 父组件和子组件的执行顺序
// 加载渲染过程 3 3 1 1
// 父beforeCreate -> 父created -> 父beforeMount ->子beforeCreate -> 子created -> 子beforeMount -> 子mounted -> 父mounted

// 销毁过程
// 父beforeDestroy -> 子beforeDestroy -> 子destroyed -> 父destroyed
