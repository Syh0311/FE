// 模拟一百条数据
// const message = new Array(100).map((el, index) => "第" + index + "条数据"); //【map跳过数组中索引为undefined的值】，所以这行map无效
const message = new Array(100).fill("").map((el, index) => "第" + index + "条数据");

// 模拟请求一千条数据
function axiosGet(idx) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(message[idx]);
    }, 1000 * Math.random());
  });
}

// async + promise
async function asyncProcess(max = 10) {
  const task = [];
  const ans = [];
  for (let i = 0; i < 100; i++) {
    async function p() {
      const res = await axiosGet(i);
      console.log(res);
      ans.push(res);
      const index = task.indexOf(p);
      return index;
    }
    task.push(p);
    if (task.length == max) {
      const theIndex = await Promise.race(task);
      // console.log(theIndex);
      task.splice(theIndex, 1);
    }
  }
  const res = await Promise.all(task);
  ans.push(...res);
  return ans;
}

asyncProcess().then((res) => {
  console.log(res);
});
