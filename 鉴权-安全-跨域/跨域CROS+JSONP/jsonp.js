//jsonp
function syh(data) {
  //这个函数只是随便一个函数，处理结果还是要靠then解决
  console.log("成功拿到jsonp传输数据-----" + data);
}
const options = {
  url: "http://127.0.0.1:92/",
  params: {},
  callback: "syh",
};

// button2.onclick = jsonp(options);
button2.onclick = jsonp(options)
  .then((res) => console.log(res))
  .then((res) => console.log(res))
  .then((res) => console.log(res))
  .then((res) => console.log(res));

function jsonp({ url, params, callback }) {
  const generateURL = () => {
    let dataStr = "";
    for (let key in params) {
      dataStr += `${key}=${params[key]}&`;
    }
    dataStr += `callback=${callback}`;
    return `${url}?${dataStr}`;
  };
  const finalUrl = generateURL();
  // console.log(finalUrl);
  return new Promise((resolve, reject) => {
    // 初始化回调函数名称
    callback = callback;
    // 创建 script 元素并加入到当前文档中
    let scriptEle = document.createElement("script");
    // scriptEle.src = "http://127.0.0.1:92/?callback=syh";
    scriptEle.src = finalUrl;
    document.body.appendChild(scriptEle);
    // 绑定到 window 上，为了后面调用
    window[callback] = (data) => {
      resolve(data);
      // script 执行完了，成为无用元素，需要清除
      document.body.removeChild(scriptEle);
    };
  });
}
