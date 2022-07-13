import { swap, arr2Str, arr } from "./00-baseUtils.mjs";

function bubbleSort(arr) {
  let count = 0; //记录时间复杂度
  //外部for是对比的次数
  for (let i = 0; i < arr.length; i++) {
    let num = 0; //num=0说明本次循环没进行交换，则已完成排序
    for (let j = 0; j < arr.length - i; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
        count += 1;
        num += 1;
      }
    }
    if (num === 0) {
      break; //冒泡排序优化
    }
  }
  // console.log(count);
}

bubbleSort(arr); //O(N2)
arr2Str(arr);

/**
算法思路
  1. 比较相邻的元素。如果第一个比第二个大，就交换它们两个；
  2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对，这样在最后的元素应该会是最大的数；
  3. 针对所有的元素重复以上的步骤，除了最后一个；
  4. 重复步骤1~3，直到数组有序，排序完成。

算法分析
  - 平均时间复杂度: T(n) = O(n²)
  - 最坏时间复杂度: T(n) = O(n²)：当输入的数据是反序时
  - 最好时间复杂度: T(n) = O(n)：当输入的数据已经有序时，只需遍历 一遍用于确认数据已有序。
  - 空间复杂度: O(1)
  - 稳定性: 稳定
*/
