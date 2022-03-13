// 来自https://juejin.cn/post/6844903496550989837

// 2.WebWorker线程——————————————————————————————————————
var myTask = `
   //Step2. WebWorker线程【接受】数据
    onmessage = function (e) {
        var data = e.data;
        data.push('hello,syh');
        console.log('WebWorker----', data); // WebWorker---- [1, 2, 3, "hello"]
   //Step3. WebWorker线程【发送】数据
        postMessage(data);
    };
`;
// 1.本地线程——————————————————————————————————————
// 只需调用Worker() 构造函数并传入一个要在 worker 线程内运行的脚本的URI，即可创建一个新的worker。
var blob = new Blob([myTask]);
var myWorker = new Worker(window.URL.createObjectURL(blob));

// Step1. 本地线程【发送】数据
var arr = [1, 2, 3];
myWorker.postMessage(arr);

//Step2和Step3在webWorker中执行

// Step4. 本地线程【接受】数据
myWorker.onmessage = function (e) {
  var data = e.data;
  console.log("newArr-----", data); // newArr----- [1, 2, 3, "hello"]
  console.log("原本arr不变，不修改这个线程数据---", arr); // arr: [1, 2, 3]
};

console.log("同步代码先打印，不阻塞本地线程-----");

setTimeout(() => {
  console.log("setTimeout也先打印，不阻塞本地线程---");
}, 0);
//淘宝canvas在用， https://fed.taobao.org/blog/taofed/do71ct/canvas-performance
