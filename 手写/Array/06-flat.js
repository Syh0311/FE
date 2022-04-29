function syhFlat(recursiveTime) {
  recursiveTime = recursiveTime || 1;

  let res = Array.from(this); //深拷贝
  //法一
  // while (recursiveTime > 0) {
  //   for (let i = 0; i < res.length; i++) {
  //     if (res[i] instanceof Array) {
  //       //先加再删，注意加的位置【i+1】
  //       res.splice(i + 1, 0, ...res[i]);
  //       res.splice(i, 1);
  //     }
  //   }
  //   recursiveTime--;
  // }
  // return res;

  //法二--更好点-因为当输入无限大时，不要while那么多次，使用arr中嵌套次数作为while条件，保证了while都是必要的！！
  let i = 1;
  while (res.some((item) => Array.isArray(item))) {
    // res = [].push(...res);//push返回的是添加的数组数列---所以报错
    res = [].concat(...res);
    i++;
    if (i > recursiveTime) break;
  }
  return res;
}

const two = [1, [22, 22], [33, 33]];
const three = [1, [22, 22, [222]], [33, 33, [333]]];

Array.prototype.flat = function (depth) {
  depth = depth || 1;
  let arr = this;
  let count = 0;
  while (arr.some((item) => Array.isArray(item))) {
    // arr = [].concat(...arr); // concat接收多个数值或【数组】为参数，返回新数组

    // 一行concat代替下边所有【for循环 + tempArr】
    let tempArr = [];
    for (let el of arr) {
      if (Array.isArray(el)) {
        tempArr.push(...el);
      } else {
        tempArr.push(el);
      }
    }
    arr = tempArr;

    if (++count == depth) break;
  }
  console.log("[ arr ] >", arr);
  return arr;
};

// reduce且控制flat深度？？？!!!
Array.prototype.faltReduceDeep = function (depth) {
  let arr = this;

  function flat(arr, times) {
    if (times == depth) return arr;

    const result = arr.reduce((pre, cur, arr) => {
      if (Array.isArray(cur)) {
        return pre.concat(cur.flat(cur, times + 1));
      } else {
        return pre.concat(cur);
      }
    }, []);
    return result;
  }

  const result = flat(arr, 0);
  console.log("[ result ] >", result);
  return result;
};

two.flat(11);
three.flat(11);
// const result = three.faltReduceDeep(1);！！！!!!
// console.log(result);
