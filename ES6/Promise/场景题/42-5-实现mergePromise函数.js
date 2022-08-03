// 题目描述——————————————————————————————————
const time = (timer) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timer);
  });
};
const ajax1 = () =>
  time(2000).then(() => {
    console.log(1);
    return 1;
  });
const ajax2 = () =>
  time(1000).then(() => {
    console.log(2);
    return 2;
  });
const ajax3 = () =>
  time(1000).then(() => {
    console.log(3);
    return 3;
  });

mergePromise([ajax1, ajax2, ajax3]).then((data) => {
  console.log("done");
  console.log(data); // data 为 [1, 2, 3]
});

// 要求分别输出
// 1
// 2
// 3
// done
// [1, 2, 3]

// 以上为题目描述——————————————————————————————————

/**
思考：
  1. Promise.all、race、any接收的为 promise 组成的数组，所以只能保证 输出的结果是有序的，但是各个promise直接是【竟态运行】的，不能够保证输出顺序；
  2. 所以这里题目给的入参就是【函数组成的数组，函数运行返回promise】，而非promise对象

整体逻辑：
  1. 题目要求有序，有要求最后有【结果数组】。有序通过链式调用解决，结果数组通过 链式调用 的下一个 then 收集
  2. 所以需要两个then，第一个then为了【运行数组中异步函数】，第二个then为了【收集第一个then的运行结果】
  3. 需注意的是：没法在一个then里解决问题，因为必须要then之后才能拿到 异步运行结果，然后第二个then添加到 result 中

题解：
  法一：直接for循环
    - 把函数依次套到前一个的后边，需要一个 dummy 头;
    - 注意 第二个then 返回 result;
    - 最后 return 【dummy头】；
  法二：逻辑一样，for循环改成 reduce；
  法三：一行reduce：
    - then本身就接受参数；
    - concat不改变原数组，返回新数组！！；

  法四：async/await 解决；
    - 注意：这不能 for await of。因为这个数组里是函数，for await 的数组应该是promise
*/
function mergePromise(arr) {
  // 1. 初始化结果数组 与 dummy 头
  let result = []; // 用let声明是为了 reduce 一行代码
  let p = Promise.resolve();

  // 注意arr里都是函数，如果是promise，啥都不干就开始竟态了
  // 法一：直接 for循环
  // for (let item of arr) {
  //   // 往 p 后边接
  //   p = p
  //     .then(() => item()) //函数
  //     .then((res) => {
  //       result.push(res);
  //       return result;
  //     });
  // }
  // return p;

  // 法二：reduce
  // return arr.reduce((pre, cur) => {
  //   return pre
  //     .then(() => cur())
  //     .then((res) => {
  //       result.push(res);
  //       return result;
  //     });
  // }, p);

  // 法三：一行reduce
  return arr.reduce((pre, cur) => pre.then(cur).then((res) => (result = result.concat(res))), p);
}

// 法四：async/await
async function mergePromiseAsync(arr) {
  const result = [];
  for (let item of arr) {
    result.push(await item());
  }
  return result;
}
