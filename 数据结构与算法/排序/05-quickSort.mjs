import { swap, arr2Str, arr } from "./00-baseUtils.mjs";

function quickSort(arr) {
  function recursiveQuick(arr, L, R) {
    let i = L;
    let j = R;

    //支点
    // let pivot = arr[Math.floor((L + R) / 2)];
    let pivot = arr[(L + R) >> 1];

    //左右两端进行扫描，只要两端还没有交替，就一直扫描
    while (i <= j) {
      //寻找直到比支点大的数
      while (pivot > arr[i]) i++;
      //寻找直到比支点小的数
      while (pivot < arr[j]) j--;

      //此时已经分别找到了比支点小的数(右边)、比支点大的数(左边)，它们进行交换
      if (i <= j) {
        swap(arr, i, j);
        i++;
        j--;
      }
    }
    //上面一个while保证了第一趟排序支点的左边比支点小，支点的右边比支点大了。
    //“左边”再做排序，直到左边剩下一个数(递归出口)
    if (L < j) recursiveQuick(arr, L, j);
    //“右边”再做排序，直到右边剩下一个数(递归出口)
    if (i < R) recursiveQuick(arr, i, R);
  }
  recursiveQuick(arr, 0, arr.length - 1);
  return arr;
}

quickSort(arr); //O(nlog(n))  常用
arr2Str(arr);
