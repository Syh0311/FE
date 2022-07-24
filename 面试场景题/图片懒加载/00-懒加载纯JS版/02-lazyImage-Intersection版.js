/**
  IntersectionObserver的优点
  1. 不用手动添加、移除scroll事件
  2. 不用手动添加节流
  3. 手动计算还会引起重排与重绘，性能相对来说较差？？
*/

class LazyImage {
  constructor(selector) {
    // 1. 初始化数组
    this.lazyImages = Array.prototype.slice.call(document.querySelectorAll(selector));

    // 2. 判断是否支持 IntersectionObserver
    if ("IntersectionObserver" in window) {
      this.observeEntry();
    } else {
      alert("浏览器不支持 IntersectionObserver");
      return;
    }
  }

  observeEntry() {
    // 1. 初始化对象
    const lazyImgObserver = new IntersectionObserver((entries, observer) => {
      // observer 就是 new出来的实例
      // 为啥 entries 一开始是长度为9的数组，之后变为长度1了？？
      console.log("[ entries--------- ]", entries);

      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          delete lazyImage.dataset.src;

          // 结束IntersectionObserver对【真实DOM元素】的观察
          observer.unobserve(lazyImage);
        }
      });
    });

    // 2. 开始观察
    // 修改成这样就可以了， 调用对象上的方法时候需要注意this指向！！  直接 arr.forEach(lazyImgObserver.observe);不行
    this.lazyImages.forEach(lazyImgObserver.observe.bind(lazyImgObserver));
  }
}
