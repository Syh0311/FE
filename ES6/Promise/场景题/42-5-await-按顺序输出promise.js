// 实现mergePromise函数，把传进去的数组按顺序先后执行，并且把返回的数据先后放到数组data中。

async function mergePromise(arr) {
  const result = [];
  for (let ajax of arr) {
    let res = await ajax();
    result.push(res);
  }
  return result;
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
async function ajax1() {
  await time(2000);
  console.log(1);
  return 1;
}

async function ajax2() {
  await time(1000);
  console.log(2);
  return 2;
}
async function ajax3() {
  await time(1000);
  console.log(3);
  return 3;
}

async function ajax4() {
  await time(1000);
  console.log(4);
  throw "ajax4抛出的异常---";
  return 4;
}
