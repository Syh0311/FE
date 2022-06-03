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

function bubbleSort(arr, method) {
  method = method || "ab";
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
  arr2Str(arr);
}

function selectSort(arr) {
  //记录循环次数
  for (let i = 0; i < arr.length; i++) {
    let pos = 0; //记录最大数组下标
    for (let j = 0; j < arr.length - i; j++) {
      // arr[j] > arr[pos] && (pos = j);
      pos = arr[j] > arr[pos] ? j : pos;
    }
    swap(arr, pos, arr.length - i - 1);
  }
  arr2Str(arr);
}

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
  arr2Str(arr);
}
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
  arr2Str(arr);
}

// bubbleSort(arr); //O(N2)
// selectSort(arr); //O(N2)
// insertSort(arr); //O(N2)
quickSort(arr); //O(nlog(n))  常用
