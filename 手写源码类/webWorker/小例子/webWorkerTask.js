//Step2. WebWorker线程【接受】数据
onmessage = function (e) {
  var data = e.data;
  data.push("hello,syh");
  console.log("WebWorker----", data); // WebWorker---- [1, 2, 3, "hello"]
  //Step3. WebWorker线程【发送】数据
  postMessage(data);
};
