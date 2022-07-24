// v-lazy.js
// Vue.use(fn || obj.install)
export default {
  install(Vue) {
    // 默认图片
    const defaultSrc = require("./default.gif");

    // binding 是v-lazy='xx'内的xx
    const lazyLoad = (el, binding) => {
      el.src = defaultSrc; // 给图片添加一个默认图
      const lazyObserver = new IntersectionObserver((entries, observer) => {
        // observer 是 new 出来的实例
        entries.forEach((entry) => {
          const img = entry.target;

          if (entry.isIntersecting) {
            img.src = binding.value;
            observer.unobserve(entry.img); // 取消观察
          }
        });
      });
      lazyObserver.observe(el);
    };
    Vue.directive("lazy", {
      inserted: lazyLoad,
      updated: lazyLoad,
    });
  },
};
