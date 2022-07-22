// ！！
// return 2被包装成【resolve(2)】，不走catch，所以第二个then中的res是第一个then的返回值

Promise.resolve(1)
  .then((res) => {
    console.log(res);
    return 2;
  })
  .catch((err) => {
    return 3;
  })
  .then((res) => {
    console.log(res);
  });

// 结果
// 1
// 2
