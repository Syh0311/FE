function loadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`加载【${url}】失败---`));
    img.src = url;
  });
}

//test--调用
loadImg
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
