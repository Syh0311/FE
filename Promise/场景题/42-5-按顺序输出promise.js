// 实现mergePromise函数，把传进去的数组按顺序先后执行，并且把返回的数据先后放到数组data中。

function mergePromise(arr) {
  const data = [];
  let p = Promise.resolve();

  arr.forEach((ajax) => {
    p = p
      .then(ajax) //等价【then(() => ajax())】，then中函数执行
      .then((res) => {
        data.push(res);
        return data; //只有最后一次return有意义
      }); //屁股上加了then【把ajax套到后边】，把所有arr变成一个then了
  });
  setTimeout(() => {
    console.log("syh----"); //为啥会先输出？？？【因为ajax1，time中有settimeout，定时结束后才resolve，此时微任务队列为空，就执行了宏任务的第一个，这也是 函数能按数组顺序输出的 原因】
  }, 0);
  return p;
}

mergePromise([ajax1, ajax2, ajax3]).then((data) => {
  console.log("done");
  console.log(data); //data 为 [1, 2, 3]
});

// 要求分别输出
// 1
// 2
// 3
// done
// [1, 2, 3]  //这个输出all也可以，关键是传入arr的执行顺序

function time(timer) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timer);
  });
}
function ajax1() {
  return time(2000).then(() => {
    console.log(1);
    return 1;
  });
}
// ajax1().then((res) => {
//   console.log(res);
// });
function ajax2() {
  return time(1000).then(() => {
    console.log(2);
    return 2;
  });
}
async function ajax3() {
  await time(1000);
  console.log(3);
  return 3;
}

function ajax4() {
  return time(1000).then(() => {
    console.log(4);
    // return 3;
    // throw "ajax4抛出的异常---";
  });
}
