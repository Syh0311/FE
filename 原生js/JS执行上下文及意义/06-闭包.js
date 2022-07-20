/**
  来个最简单的debounce
  闭包保存的变量在堆内存里，其他的不具体写了，跟【05-JS静态(词法)作用域-hard.js】里差不多
  在这就是返回的匿名函数里引用这debounce里的timer
*/

function debounce(fn, delay) {
  let timer;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}
