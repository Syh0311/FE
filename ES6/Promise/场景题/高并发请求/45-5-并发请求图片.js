// 题给条件 ————————————————————————————————————
/**
  1. 有8个图片资源的url，已经存储在数组urls中；
  2. 而且已经有一个函数 loadImg，输入一个url链接，返回一个Promise，该Promise在图片下载完成的时候resolve，下载失败则reject；
  3. 但有一个要求，任何时刻【同时下载的链接数量不可以超过3个】；
  4. 请写一段代码实现这个需求，要求【尽可能快速地】将所有图片下载完成。
*/
var urls = ["https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting1.png", "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting2.png", "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting3.png", "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting4.png", "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting5.png", "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn6.png", "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn7.png", "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn8.png"];
function loadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      console.log("一张图片加载完成");
      resolve(img);
    };
    img.onerror = function () {
      reject(new Error("Could not load image at" + url));
    };
    img.src = url;
  });
}
// 题给条件 ————————————————————————————————————
/**
本题 limitLoad 函数需要全部手写，题目没提示 入参是啥，也没说返回啥
所以需要自己思考入参和返回值：
  - 入参：url数组，处理url的函数，limit
  - 返回值：带顺序的结果数组

更具体的见【46-5-高并发.js】
*/

function limitLoad(urls, handler, limit) {
  const promises = urls.splice(0, limit).map((url, index) => {
    return handler(url).then(() => {
      return index; // 返回在 promises 中索引
    });
  });
  // 注意这里要将整个变量过程返回，这样得到的就是一个Promise，可以在外面链式调用
  return urls
    .reduce((pre, url) => {
      return pre
        .then(() => {
          return Promise.race(promises); // 返回已经完成的下标
        })
        .then((fastestIndex) => {
          // 替换
          promises[fastestIndex] = handler(url).then(() => {
            return fastestIndex; // 返回在 promises 中索引
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }, Promise.resolve()) // 初始化传入
    .then(() => {
      // 最后三个用.all来调用
      return Promise.all(promises);
    });
}

limitLoad(urls, loadImg, 3)
  .then((res) => {
    console.log("图片全部加载完毕");
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });
