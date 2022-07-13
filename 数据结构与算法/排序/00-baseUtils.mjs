function swap(arr, i, j) {
  //因为元素交换使用过多，故抽离出来
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

function arr2Str(arr) {
  const str = arr.join(" ");
  console.log(str);
  console.log(str === "1 2 4 5 11 12 12 21 23 24 34 41 58 67 123 143 7682");
  return str;
}

const arr = [21, 1, 12, 23, 41, 11, 12, 34, 4, 2, 5, 24, 67, 123, 7682, 143, 58];

export { swap, arr2Str, arr };
