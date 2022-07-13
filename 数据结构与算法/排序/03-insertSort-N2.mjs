import { swap, arr2Str, arr } from "./00-baseUtils.mjs";

function insertSort(arr) {
  //外层循环控制需要排序的趟数(【从1开始】因为将第0位看成了【有序数据】)
  for (let i = 1; i < arr.length; i++) {
    let temp = arr[i];
    //如果前一位(已排序的数据)比当前数据要大，那么就进入循环比较[参考第二趟排序]
    while (i >= 1 && arr[i - 1] > temp) {
      // i >= 1为了应对arr[i]是最小值的情况，不加判断【i-1=0-1】报错
      arr[i] = arr[i - 1]; //往后退一个位置，让当前数据与之前前位进行比较
      i--; //不断往前，直到退出循环
    }
    arr[i] = temp; //退出了循环说明找到了合适的位置了，将当前数据插入合适的位置中
  }
}

insertSort(arr); //O(N2)
arr2Str(arr);
