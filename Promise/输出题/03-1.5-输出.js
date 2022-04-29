// 和【Promise第二题】相似，只不过在promise中并没有resolve或者reject
// 因此promise.then并不会执行，它只有Promise【状态改变后】才会执行

const promise = new Promise((resolve, reject) => {
  console.log(1);
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);
