const hello = () => console.log("hello!!!");
async function mySync() {
  const res = await myPromise();
  console.log(res);
}
function myPromise() {
  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("promise--resolve---");
    }, 1000);
  });
  return p;
}

export { hello, mySync };
