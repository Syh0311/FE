/**
 不会马上调用fn，只有到了delay时才调用fn 第一次
*/
export function throttle(fn, delay = 500) {
  if (!(fn instanceof Function)) throw "第一个参数应为函数";
  let timer;
  return function () {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null; //重新计时
    }, delay);
  };
}

/**
  立马调用fn，delay时再调用fn一次
  与正常的throttle比起来，这个
  - 表现上：
    1. 立马执行一次fn；
    2. 停止后【比如不再拖动】，立即执行版马上停了，正常的还得再执行几次【就算已经不拖动了】【因为立即执行版的定时器里不执行函数，值给timer赋值】
  - 代码书写上：变动了执行fn的位置
*/
export function throttleRightnow(fn, delay = 500) {
  if (!(fn instanceof Function)) throw "第一个参数应为函数";
  let timer;
  return function () {
    // 1. 如果timer为空值，则执行fn
    if (!timer) fn.apply(this, arguments);

    // 2. 如果timer还在，直接return，不再设置定时器【保证永远只有一个定时器在等待】
    if (timer) return;

    // 3. 赋值timer，定时器内只【将timer恢复为null】。通过【判断条件】执行fn
    timer = setTimeout(() => {
      timer = null;
    }, delay);
  };
}
