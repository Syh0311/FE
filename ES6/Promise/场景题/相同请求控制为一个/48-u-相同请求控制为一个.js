/**
相同请求控制为一个
  1. 若第一个成功，之后的以成功结果返回或者不处理；
  2. 若第一个失败，将其reject，请求第二个。
  - 本质上就是 控制请求的并发，将并行转换为串行】通过在外边套一层Promise实现

函数入参与返回值
  入参： 要发送的请求函数；
  返回值：带闭包的函数

整体逻辑：
  一、缓存处理
    1. 对象为空：将其初始化
    2. 对象不为空：则判断是否有缓存
      - 有缓存：直接将其resolve  【return不再执行之后】
      - 没缓存：添加到对象的 executors队列中，等待执行
  二、处理并发，将并发的请求 变成串行
    - 只有当 executors 长度为1时，才发起请求
    - 如果不这样处理，【每次执行返回的闭包】 都会发起真正请求，就是并行了；
    - 现在限制为【只有第一次执行返回的闭包 是发起请求】，第一次出错了才会【通过递归】再次发送请求

应用场景：
  - 骗人的抢购，把连点的并发直接变成串行了  
参考：
  https://juejin.cn/post/7052700635154219015
*/

function cacheAsync(fn) {
  let cache = null; // fn对应的闭包

  return async function (params) {
    return new Promise((resolve, reject) => {
      // 一、缓存处理
      if (!cache) {
        // 1. cache初始化
        cache = {
          hit: null,
          executors: [{ resolve, reject }],
        };
      } else {
        // 2.1 若命中缓存
        if (cache.hit !== null) return resolve(cache.hit);

        // 2.2 未命中缓存
        cache.executors.push({ resolve, reject });
      }
      // 二、处理并发，将并发的请求 变成串行
      const { executors } = cache;

      // 只有第一次是真正的发出请求
      if (executors.length !== 1) return;
      startProcess();
      async function startProcess() {
        // 1. 递归出口：串行时 executors 数组可能已经为空，此时不再执行
        if (executors.length === 0) return;

        // 2. try/catch 发起请求
        try {
          // 在这儿 才真正发起请求 【也只在这儿有发起请求操作】
          const res = await fn(params);

          // 成功则：
          // 1. 清空队列，resolve所有的结果
          while (executors.length) {
            const { resolve } = executors.shift();
            resolve(res);
          }
          // 2. 缓存结果
          cache.hit = res;
        } catch (err) {
          // 失败则：
          // 1. 弹出当前请求对应的executor 并将其 reject
          const { reject } = executors.shift();
          reject(err);

          // 2. 重新开始下一个请求
          startProcess(); // 失败重试，降级为串行
        }
      }
    });
  };
}

function mockFetch() {
  const delay = Math.random() * 1000;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      delay > 500 ? reject(delay) : resolve(delay);
    }, delay);
  });
}

const fetch2 = cacheAsync(mockFetch, "test2");

// 【并发】 6个相同的请求
console.log(fetch2(2));
console.log(fetch2(2));
console.log(fetch2(2));
console.log(fetch2(2));
console.log(fetch2(2));
console.log(fetch2(2));
