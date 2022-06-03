function merge(leftArr, rightArr) {
  console.log(leftArr, rightArr);
  const arr = [];
  while (leftArr.length > 0 && rightArr.length > 0) {
    if (leftArr[0] > rightArr[0]) {
      arr.push(rightArr.shift());
    } else {
      arr.push(leftArr.shift());
    }
  }
  const restArr = leftArr.length == 0 ? rightArr : leftArr;
  arr.push(...restArr);
  // arr.push(...leftArr, ...rightArr); //或者  不管谁为空，直接加进去

  console.log(arr);
  return arr;
  return arr.push(...restArr); //返回的是新数组的长度！！！
}
function mergeSort(arr) {
  //1. 递归出口
  if (arr.length === 1) return arr;
  //2.递归体
  const mid = arr.length >> 1;
  const left = arr.slice(0, mid);
  const right = arr.slice(mid); //left没取到mid,right需要取到

  const leftArr = mergeSort(left);
  const rightArr = mergeSort(right);
  const res = merge(leftArr, rightArr);

  return res;
}

var arr = mergeSort([32, 12, 56, 78, 76, 45, 36]);
// console.log(arr); // [12, 32, 36, 45, 56, 76, 78]
