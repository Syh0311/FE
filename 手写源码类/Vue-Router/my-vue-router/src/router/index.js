import Vue from "vue";
// import VueRouter from "vue-router";
import VueRouter from "../my-router/myVueRouter.js"; //修改代码

import Home from "../views/Home.vue";
import About from "../views/About.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
];
const router = new VueRouter({
  mode: "history",
  routes,
});
export default router;
