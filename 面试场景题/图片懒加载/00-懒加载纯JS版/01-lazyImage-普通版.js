// scrool + getBoundingClientRect

class LazyImage {
  constructor(selector) {
    // 1. 初始化数组与 已加载图片数量
    this.lazyImages = Array.prototype.slice.call(document.querySelectorAll(selector));
    this.loadedCount = 0;

    // 2. 直接开始
    this.inViewShow(); // 需要先初始化以下，要不然只有滚动了才开始加载

    this.throttleFn = throttle(this.inViewShow.bind(this));
    document.addEventListener("scroll", this.throttleFn);
  }

  inViewShow() {
    const { lazyImages, isIntersect } = this;

    // 判断图片是否出现在【可视区域】内，将其对 队列中删除，因为scroll事件一直在做for循环，如果不删掉，本身已经加载出图片的还得再改一次

    // lazyImages.length 是动态变化的，不缓存其值
    for (let i = 0; i < lazyImages.length; i++) {
      const cur = lazyImages[i];

      // 两个判断条件
      if (cur.dataset.src && isIntersect(cur)) {
        cur.src = cur.dataset.src;
        delete cur.dataset.src;
        // cur.removeAttribute("data-src"); //也可

        this.loadedCount++;
      }
    }

    // 收尾工作
    if (lazyImages.length === this.loadedCount) {
      console.log("全部加载完成----------");
      document.removeEventListener("scroll", this._throttleFn);
      this.lazyImages = null;
    }
  }

  isIntersect(img) {
    // 元素相对于【窗口的左上角】
    const rect = img.getBoundingClientRect();
    // 两个判断条件分别可以处理 从上往下 和 从下往上 两种滚动方式
    return rect.top < document.documentElement.clientHeight && rect.bottom > 0;
  }
}

function throttle(fn, delay = 15) {
  let timer = null;
  return function () {
    if (timer) return;

    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}
