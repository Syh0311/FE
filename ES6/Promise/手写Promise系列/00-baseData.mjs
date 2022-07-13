function sleep(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

async function ajax1() {
  await sleep(2000);
  console.log(1);
  return 1;
}

async function ajax2() {
  await sleep(1000);
  console.log(2);
  return 2;
}
async function ajax3() {
  await sleep(1000);
  console.log(3);
  return 3;
}

async function ajax4() {
  // return Promise.reject("4--------------");
  await sleep(1000);
  console.log(4);
  throw "4 err--------------";
  return 4;
}

export { sleep, ajax1, ajax2, ajax3, ajax4 };
