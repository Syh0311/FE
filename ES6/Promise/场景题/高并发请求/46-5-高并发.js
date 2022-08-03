// 1. 模拟一百条数据
//【map跳过数组中索引为undefined的值】，所以这行map无效
// const message = new Array(100).map((el, index) => "第" + index + "条数据");
const message = Array.from(Array(100), (el, index) => "第" + index + "条数据");

// 2. 模拟 数据请求函数
function axiosGet(idx) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(message[idx]);
    }, 1000 - (9 * idx + 100));
  });
}

/**
思路：
  1. 声明一个保存limit个promise的数组，promise执行后返回其在数组中的索引；
  2. 开启for循环，每次循环都 Promise.race(promises)下，这个race返回最先成功的那个在 promises中的索引；
  3. 使用当前任务 替换已经race出来的任务；
  4. 以此类推，若arr长100，limit为30，则需要重复此过程70次；
  5. for循环完之后，使用 Promise.allSettled(promises)执行promises中剩余的；

三种写法：
  法一：for循环；
  法二：reduce；
  法三：async/await

需要自己思考函数参数和返回值
  1. 并发加载图片那个：
    - 参数：url数组，处理url的函数，limit
    - 返回值：有顺序的结果数组

  2. 这儿这个，也可以写成带函数的，不过也可以直接：
    - 参数：带函数的数组，liimit
    - 返回值：有顺序的结果数组

注意：
  - 写的函数接受函数组成的数组；
  - 但是Promise.race()接收的是promise组成的数组
  - 都没考虑 reject 情况
*/
const arr = Array.from(Array(100), (el, index) => () => axiosGet(index));
// async + promise

function limitLoadFor(arr, limit = 10) {
  const len = arr.length;
  const result = Array(len);

  const promises = arr.slice(0, limit).map((item, index) => {
    return item().then((res) => {
      console.log("[ index -- res ]", index, res);
      result[index] = res;
      return index;
    });
  });

  // 先创建个 dummy 头
  let p = Promise.resolve();
  // 一次for循环，替换一次promises中元素
  // 比如 数组长100，limit 30，则替换70次
  for (let i = limit; i < len; i++) {
    let temp = p
      .then(() => {
        return Promise.race(promises);
      })
      .then((fastestIndex) => {
        promises[fastestIndex] = arr[i]().then((res) => {
          console.log("[ index -- res ]", i, res);
          result[i] = res;
          return fastestIndex;
        });
      });
    p = temp; // 往后添加
  }

  return p
    .then(() => {
      // 为啥需要return？？
      return Promise.allSettled(promises);
    })
    .then(() => result);
}

function limitLoadReduce(arr, limit = 10) {
  const len = arr.length;
  const result = Array(len);

  const promises = arr.splice(0, limit).map((item, index) => {
    return item().then((res) => {
      console.log("[ index -- res ]", index, res);
      result[index] = res;
      return index; // 返回 promises 中索引
    });
  });

  return arr
    .reduce((pre, cur, index) => {
      return pre
        .then(() => {
          return Promise.race(promises);
        })
        .then((fastestIndex) => {
          promises[fastestIndex] = cur().then((res) => {
            console.log("[ index -- res ]", index + limit, res);
            result[index + limit] = res;
            return fastestIndex; // 返回 promises 中索引
          });
        });
    }, Promise.resolve())
    .then(() => {
      // 为啥必须得return？？【不 return 就跳过了
      return Promise.allSettled(promises);
    })
    .then(() => result);
}

async function limitLoadAsync(arr, limit = 10) {
  const len = arr.length;
  const result = Array(len);

  const promises = arr.slice(0, limit).map(async (item, index) => {
    const res = await item();
    console.log("[ index -- res ]", index, res);
    result[index] = res;
    return index; // 返回 promises 中索引
  });

  for (let i = limit; i < len; i++) {
    const index = await Promise.race(promises);

    // 替换 promise 【注意是不是拿 函数替换
    promises[index] = arr[i]().then((res) => {
      console.log("[ index -- res ]", i, res);
      result[i] = res;
      return index;
    });
  }
  await Promise.allSettled(promises);
  return result;
}

limitLoadFor(arr, 1).then((result) => {
  console.log("[ result ]", result);
});
