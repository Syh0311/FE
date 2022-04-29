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

  //全改成await

  let flag;
  for (let i = 0; i < 100; i++) {
    flag = false;
    console.log(i);
    const p = axiosGet(i).then((res) => {
      console.log(res, task.length);
      ans.push(res);
      task.splice(task.indexOf(p), 1);
    });
    task.push(p);

    if (task.length === max) {
      console.log("task.length === max-----");
      await Promise.race(task);
    }
  }
  console.log(task.length);
  await Promise.allSettled(task);
  return ans;
}

asyncProcess().then((res) => {
  console.log(res);
});
