async function fn() {
  // return await 1234
  // 等同于
  return 123;
}
fn().then((res) => console.log(res));

// 123
