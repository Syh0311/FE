function debounce(fn, delay = 500) {
  if (!(fn instanceof Function)) throw "第一个参数应为函数";
  let timer;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

/**
  非立即执行版：n秒内所有触发当做最后一次触发，较为简单；
  立即执行版：【总结：我杀了我自己（timer杀timer）】
*/
function debounceRightnow(fn, delay = 500) {
  if (!(fn instanceof Function)) throw "第一个参数应为函数";
  let timer;
  return function () {
    // 1. timer为空值时，执行fn
    if (!timer) fn.apply(this, arguments);

    // 2. 取消定时器，还下一个上
    if (timer) clearTimeout(timer);

    // 3. 重新更新timer，需保证只有一个定时器等待执行【此处通过两个if确保】
    timer = setTimeout(() => {
      timer = null;
    }, delay);
  };
}

export { debounce, debounceRightnow };
