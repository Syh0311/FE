// 用Promise配合着reduce不停的在promise后面叠加.then

//！！！!!!
//知识点：
// 1.reduce提供了init则从【第0位】开始，否则【第0位】作为init，从【第1位】开始，少循环一次
// 2.手写reduce

const arr = [1, 2, 3];
function time(num, delay = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("[ num ] >", num);
      resolve();
    }, delay);
  });
}

//清爽 async await 版
async function endLessAsync(arr) {
  for (let i = 0; i < arr.length; i++) {
    await time(arr[i]);
  }
  await endLessAsync(arr);
}
endLessAsync(arr);

// 不间断输出 1 2 3   1 2 3   1 2 3

function endLess(arr) {
  let p = Promise.resolve();
  arr.forEach((num) => {
    p = p.then(() => time(num));
  });
  p.then(() => endLess(arr));
}
// endLess(arr);
