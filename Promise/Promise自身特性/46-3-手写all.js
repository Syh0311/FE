function myAll(arr) {
  return new Promise((resolve, reject) => {
    const len = arr.length;
    const data = Array(len);
    let index = 0;
    for (let i = 0; i < len; i++) {
      arr[i]
        .then((res) => {
          data[i] = res;
          index++;
          if (index === len) {
            resolve(data);
          }
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
}

myAll([ajax1(), ajax2(), ajax3(), ajax4()])
  // myAll([ajax1, ajax2, ajax3, ajax4])
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });

function time(timer) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timer);
  });
}
function ajax1() {
  return time(2000).then(() => {
    console.log(1);
    return 1;
  });
}

function ajax2() {
  return time(1000).then(() => {
    console.log(2);
    return 2;
  });
}
async function ajax3() {
  await time(1000);
  console.log(3);
  return 3;
}

function ajax4() {
  return time(1000).then(() => {
    console.log(4);
    return 4;
    // throw "ajax4抛出的异常---";
  });
}
