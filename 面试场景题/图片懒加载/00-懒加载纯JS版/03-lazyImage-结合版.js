// 不支持 IntersectionObserver 时换成 【scrool + getBoundingClientRect】

class LazyImage {
  constructor(el) {
    // 1. 初始化数组与已加载图片数量
    this.imgs = [...document.querySelectorAll(el)];
    this.loaded = 0;

    // 2. 看是否支持 IntersectionObserver
    if (!("IntersectionObserver" in window)) {
      this.useIntersection();
    } else {
      console.log("浏览器不支持 IntersectionObserver,，使用scroll方案");

      this.useScroll(); // 先初始化一次
      this.throttleFn = throttle(this.useScroll.bind(this), 500);
      document.addEventListener("scroll", this.throttleFn);
    }
  }

  useIntersection() {
    const lazyObserber = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          delete img.dataset.src;

          observer.unobserve(img); //取消观察 真实DOM
        }
      });
    });

    this.imgs.forEach((img) => lazyObserber.observe(img));
  }

  useScroll() {
    const { imgs, isIntersect } = this;
    const len = imgs.length;

    for (let i = 0; i < len; i++) {
      const img = imgs[i];
      if (img.dataset.src && isIntersect(img)) {
        img.src = img.dataset.src;
        delete img.dataset.src;

        this.loaded++;
        console.log("[ this.loaded ]", this.loaded);
      }
    }

    if (this.loaded === len) {
      document.removeEventListener("scroll", this.throttleFn);
      console.log("全部加载完成-------");
    }
  }
  isIntersect(img) {
    const rect = img.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < document.documentElement.clientHeight;
  }
}

function throttle(fn, delay = 20) {
  let timer;
  return function () {
    if (timer) return;

    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}
