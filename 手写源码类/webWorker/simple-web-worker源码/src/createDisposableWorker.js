/**
 *
 * @param {*} response
 * @returns
 */
export const createDisposableWorker = (response) => {
  // 1. 初始化blob worker
  const URL = window.URL || window.webkitURL;
  const blob = new Blob([response], { type: "application/javascript" }); // eslint-disable-line

  const objectURL = URL.createObjectURL(blob);
  // 2. 每次函数执行都new一个Worker
  const worker = new Worker(objectURL); // eslint-disable-line

  // 3. worker对象新增[post]属性 没必要加到worker上，返回就直接又返回了
  worker.post = (message) =>
    new Promise((resolve, reject) => {
      worker.onmessage = (event) => {
        URL.revokeObjectURL(objectURL);
        resolve(event.data);
      };

      worker.onerror = (e) => {
        console.error(`Error: Line ${e.lineno} in ${e.filename}: ${e.message}`);
        reject(e);
      };
      worker.postMessage({ message });
    });

  // 4. 返回整个worker 只返回post就可以
  return worker;
};
