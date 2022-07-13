import { swap, arr2Str, arr } from "./00-baseUtils.mjs";

function selectSort(arr) {
  //记录循环次数
  for (let i = 0; i < arr.length; i++) {
    let pos = 0; //记录最大数组下标
    for (let j = 0; j < arr.length - i; j++) {
      if (arr[i] > arr[pos]) pos = j;
    }
    swap(arr, pos, arr.length - i - 1);
  }
}

selectSort(arr); //O(N2)
arr2Str(arr);

/**
算法分析
平均时间复杂度: T(n) = O(n²)
最坏时间复杂度: T(n) = O(n²)：输入数组按降序排列（完全逆序）
最好时间复杂度: T(n) = O(n)：输入数组按升序排列（基本有序）
空间复杂度: O(1)
稳定性：稳定 
*/
