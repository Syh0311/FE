// 入口文件
// 1. 引入时 检查是否支持web worker
// 2. 返回两个函数 分别是立即执行的run 和 能够缓存的create
import { create } from "./create";
import { run } from "./run";

const createWrapper = () => {
  if (!window.Worker) {
    console.error("This browser does not support Workers.");
    return null;
  }
  if (!(window.URL.createObjectURL || window.webkitURL.createObjectURL)) {
    console.error("This browser does not have URL.createObjectURL method.");
    return null;
  }
  return { create, run };
};

const WorkerWrapper = createWrapper();

export default WorkerWrapper;

/**
 整体逻辑总结
 1. 入口导出 run create
 2. run运行fn(action,[arg]?)   create返回对象
 3. run内调用createDisposableWorker，createDisposableWorker内创建new Worker，并根据其两个API(onmessage,onerror)，对Promise做相应处理
 4. create对象中保存actions，postMessage内运行run
 5. postAll内运行postMessage
 6. register和unregister 负责添加删除 action
 7. 所以所有的都经过run run调用了createDisposableWorker，而这个函数本身只调用了worker两个API

 重点的createDisposableWorker函数解读？？！！
 */

/**
 学到了
 1. 通过函数校验options是否合法
 2. postMessage调用了run  postAll调用了postMessage 【代码复用】
 3. post内 1.filter是解构出message 2.结果pop()出来
 4. postAll内 Promise.all时用actions.map() 返回 promise数组

 5. register和unregister内 添加删除元素时函数的复用
 6. 增加action时，使用reduce 减少变量声明
 */

/**
 这个库一些小问题【吹毛求疵了属于是】

 1. 没使用class，而是直接返回了对象
 2. import时 立马判断是否支持web worker【没必要】
 3. postAll还能接受参数，但是接受的参数只是一次性执行的
    应该再加个条件是否要添加到actionis内【使用register】
 4. register时边界条件判断缺失
 */
