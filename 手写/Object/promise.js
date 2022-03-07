const promise = (function () {
  let pp = new Promise((resolve, reject) => {
    // console.log("执行器函数是同步的1111111111");
    // resolve("sss");
    setTimeout(resolve, 1000, "setTimeout第三个参数--"); //模拟异步操作
    // console.log("执行器函数是同步的2222222222");
  });

  const fn2 = () =>
    new Promise((resolve, reject) => {
      // resolve(2);
      reject(3);
    });
  var aaa = async () => {
    console.log("async函数内部");

    try {
      const no = await 10;
      console.log(no);
      console.log(11);
      const res = await fetch("https://api.oick.cn/dutang/api.php").then((res) => res.json());
      console.log(res);
      const kong = await new Promise((resolve, reject) => {
        console.log("promisel");
        reject(1);
      });
      console.log(kong);
      console.log("async1 end");
      const res2 = await fn2();
      console.log(res2);
    } catch (err) {
      console.warn(err);
    }
    console.log("await之后");
  };
  // aaa();
  // console.log("async函数后同步代码---");

  let obj2 = {
    0: 1,
    1: 2,
    length: 5,
  };
  const proto = Object.getPrototypeOf(obj2);
  proto.mame = "syh";
  // for (let i in obj2) {
  //   console.log(i);
  // }
  // for (const i of Object.keys(obj2)) {
  //   console.log(i);
  // }
  // for (const i of Object.getOwnPropertyNames(obj2)) {
  //   console.log(i);
  // }
  // for (const i of Object.getOwnPropertySymbols(proto)) {
  //   console.log(i);
  // }
  const p1 = new Promise((resolve) => {
    setTimeout(() => {
      resolve("r3");
      console.log("timer1");
    }, 2000);
    resolve("r1");
    resolve("r2");
  })
    .then((res) => {
      console.log(res);
      setTimeout(() => {
        console.log("timer2");
        console.log(p1);
      }, 1000);
    })
    .finally((res) => {
      console.log("finally", res);
    });
})();
