function allSettled(arr) {
  const onSuccess = (data) => ({ status: "fulfilled", value: data });
  const onErr = (err) => ({ status: "reject", reason: err });
  return new Promise((resolve, reject) => {
    let len = arr.length;
    const data = Array(len);
    let index = 0;
    for (let i = 0; i < arr.length; i++) {
      arr[i]()
        .then((res) => {
          index++;
          data[i] = onSuccess(res);
          index === arr.length && resolve(data);
        })
        .catch((err) => {
          index++;
          data[i] = onErr(err);
          index === arr.length && resolve(data);
        });
    }
  });
}

allSettled([ajax1, ajax2, ajax3, ajax4]).then((data) => {
  console.log(data);
});

function time(delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}
function ajax1() {
  return time(2000).then(() => {
    console.log(1);
    return 1;
  });
}
// ajax1().then((res) => {
//   console.log(res);
// });
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
    // return 4;
    throw "ajax4抛出的异常---";
  });
}
