function myAllSettled(promises) {
  const data = [];
  return new Promise(async (resolve, reject) => {
    //async  加到箭头函数上
    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i];
      try {
        const res = await promise;
        data.push({ status: "fullfilled", value: res });
      } catch (err) {
        data.push({ status: "rejected", reason: err });
      }
    }
    resolve(data);
  });
}

myAllSettled([ajax1(), ajax2(), ajax3(), ajax4()])
  // myAllSettled([ajax1, ajax2, ajax3, ajax4])
  .then((data) => {
    console.log("%c [ data ]-22", "font-size:13px; background:pink; color:#bf2c9f;", data);
  });

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
  // return Promise.reject("4--------------");
  await time(1000);
  console.log(4);
  throw "4--------------";
  return 4;
}
