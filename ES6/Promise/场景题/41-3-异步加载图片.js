// 题目描述：使用Promise封装一个异步加载图片的方法
// 就这一句，没了

function loadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img); // 成功返回 img
    img.onerror = (err) => reject(new Error(`加载【${url}】失败---`));

    img.src = url; // 为啥不在成功时候修改src？？
  });
}

loadImg
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
