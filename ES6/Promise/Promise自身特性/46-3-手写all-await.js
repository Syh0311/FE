function myAll(promises) {
  const data = [];
  let len = promises.length;
  let index = 0;
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < len; i++) {
      try {
        const res = await promises[i];
        data[i] = res;
        index++;
        if (index == len) resolve(data);
      } catch (err) {
        reject(err);
      }
    }
  });
}

myAll([ajax1(), ajax2(), ajax3(), ajax4()])
  // myAll([ajax1, ajax2, ajax3, ajax4])
  .then((data) => {
    console.log("%c [ data ]-22", "font-size:13px; background:pink; color:#bf2c9f;", data);
  })
  .catch((err) => {
    console.log("%c [ err ]-25", "font-size:13px; background:pink; color:#bf2c9f;", err);
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
