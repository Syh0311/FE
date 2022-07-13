import { ajax1, ajax2, ajax3, ajax4 } from "./00-baseData.mjs";

/**
注意三点：
  1. 传入参数需可迭代，此处以数组为例；
  2. 传入非promise转换为promise；
  3. allSettled 永远返回resolve；
  4. 【count === len】 与【count++】
    - 都得写在then和catch里，不能偷懒写外边；
    - 外边直接for循环完了
    - 可简写为 ++count === len
*/
function allSettled(arr) {
  if (!Array.isArray(arr)) throw "传入参数不是数组";

  return new Promise((resolve, reject) => {
    const len = arr.length;
    const result = Array(len);
    let count = 0;

    for (let i = 0; i < len; i++) {
      Promise.resolve(arr[i])
        .then((value) => {
          result[i] = { status: "fullfilled", value };
          ++count === len && resolve(result);
        })
        .catch((reson) => {
          result[i] = { status: "reject", reson };
          if (++count === len) resolve(result);
        });
    }
  });
}

allSettled([1111, ajax1(), ajax2(), ajax3(), ajax4()]).then((data) => {
  console.log("[ data ]", data);
});
