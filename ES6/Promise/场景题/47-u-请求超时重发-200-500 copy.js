// 题目描述：请求没收到回应，200ms后再次发送请求，还没收到回应，过500ms再次发送请求

// 1. 模拟请求 与 请求结果
function ajax(index) {
  let delay = Math.random() * 300;
  if (index === 1) delay = 230;
  if (index === 2) delay = 300;
  console.log("[ index ]", index, "---", delay);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([index, delay]);
    }, delay);
    setTimeout(() => {
      reject("超时--");
      // throw "err";
    }, 500);
  });
}

function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

async function retry(fn, arr) {
  let result = null;

  return new Promise((resolve, reject) => {
    single(0);
    async function single(index) {
      // 1. 递归出口
      if (index > arr.length) return;
      try {
        let startTime = Date.now();
        // 200ms 没结果再去请求，如何知道200ms还没结果？？【来一个 标识符，代表已经有结果了！！】
        setTimeout(() => {
          console.log("[ result ]", result);
          result === null && single(index + 1);
        }, arr[index]);

        // 可能有两个fn在执行，如何终止上一个的执行【即上一个不resolve？？第二次里加个 标识符 firstTime 】]
        // 但是如果第二次失败了，有第三次，第三次永远没法 resolve了！！
        result = await fn(index + 1);
        const diff = Date.now() - startTime;
        console.log("[ diff ]", diff);
        if (diff < arr[index]) {
          resolve(diff);
          console.log("resolve----", diff);
        } else {
          result = null; //重新赋值为null
        }
      } catch (err) {
        // index 超过数组长度时 所有都没结果，此时 reject
        if (index > arr.length) {
          reject(err);
          console.log("reject(err)");
          return;
        }
        result === null && single(index + 1);
      }
    }
  });
}

retry(ajax, [200, 500, 700])
  .then((res) => {
    console.log("[ res---- ]", res);
  })
  .catch((err) => {
    console.log("[ err---- ]", err);
  });
