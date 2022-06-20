/**
 * 设置精度定时器
 * @param {function} 回调函数
 * @param {number}   延迟时间
 * @return {number}  定时器ID
 */
function setIntervalPrecision(callback, delay) {
  // 生成并记录定时器ID
  let obj = window.interValPrecisionObj || (window.interValPrecisionObj = { num: 0 });
  obj.num++;
  obj["n" + obj.num] = true;
  var intervalId = obj.num;
  // 开始时间
  var startTime = +new Date();
  // 已执行次数
  var count = 0;
  // 延迟时间
  delay = delay || 0;
  (function loop() {
    // 定时器被清除，则终止
    if (!obj["n" + intervalId]) return;

    // 满足条件执行回调
    if (+new Date() > startTime + delay * (count + 1)) {
      count++;
      callback(count);
    }

    requestAnimationFrame(loop);
  })();

  return intervalId;
}

/**
 * 清除精度定时器
 * @param {number} 定时器ID
 */
function clearIntervalPrecision(intervalId) {
  if (window.interValPrecisionObj) {
    delete window.interValPrecisionObj["n" + intervalId];
  }
}

// 测试
// 在控制台上输入下面四行
setIntervalPrecision(function (val) {
  console.log(`setIntervalPrecision ${val}`, new Date().getTime());
}, 1000);

// 几秒之后输入下面代码
function sleep(ms) {
  const end = new Date().getTime() + ms;
  console.log("sleep start");
  while (new Date().getTime() < end) {}
  console.log("sleep end");
}
sleep(3000);
