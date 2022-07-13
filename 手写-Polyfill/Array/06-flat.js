/**
flat特点：
  1. 不改变当前数组，返回新数组
  2. 默认传参depth=1

法一： some + concat【自带一层flat】 + 扩展运算符
  - 当输入无限大时，some保证了不需要那么多次循环，
  - concat自带一层flat

法二：reduce + 递归  【高级】
  - 递归函数接收两个参数  recursive(arr,times) 
  - reduce内初始值[]，判断每项是否时数组，如果是，开始递归
  - 递归函数参数里包含次数，以此次数作为递归出口
*/

const three = [1, [22, [333, [4444, [55555]]]]];

// 法一：
Array.prototype.myFlat = function (depth = 1) {
  let newArr = Array.from(this);
  let times = 0;
  while (newArr.some((item) => Array.isArray(item))) {
    newArr = [].concat(...newArr);
    if (++times >= depth) break;

    // // 一行concat代替下边所有【for循环 + tempArr】
    // let tempArr = [];
    // for (let el of newArr) {
    //   if (Array.isArray(el)) {
    //     tempArr.push(...el);
    //   } else {
    //     tempArr.push(el);
    //   }
    // }
    // newArr = tempArr;
  }
  return newArr;
};
const newArr = three.myFlat(3);
console.log("[ newArr ]", newArr);

// reduce且控制flat深度？？!!!
Array.prototype.reduceFlat = function (depth = 1) {
  const result = recursive(this, 0);
  return result;

  function recursive(arr, times) {
    // 1. 递归出口
    if (times == depth) return arr;

    // 2. reduce判断【每一个值】是否需要再flat，需要且在
    const result = arr.reduce((pre, cur, arr) => {
      if (Array.isArray(cur)) {
        // 做了一层递归，times + 1
        return pre.concat(recursive(cur, times + 1));
      } else {
        return pre.concat(cur);
      }
    }, []); // reduce的初始化的值为[]

    return result;
  }
};
const newArr2 = three.reduceFlat(3);
console.log("[ newArr2 ]", newArr2);
