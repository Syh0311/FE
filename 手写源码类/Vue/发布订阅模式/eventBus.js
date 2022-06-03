/**
  1. 发布订阅者模式
    - 是一个事件中心调度模式，订阅者和发布者是没有直接关联的，通过调度中心进行关联，二者是【解耦的】
    - 包括 发布者、订阅者、发布订阅中心；发布订阅中心为重点；
      1. 订阅者(Subscriber)把自己想订阅的事件【注册】到调度中心，
      2. 当发布者(Publisher)发布该事件到调度中心，由【调度中心】统一调度订阅者注册到调度中心的处理代码。

  2. 观察者模式
    - 观察者模式中观察者和被观察者是关联在一起的，耦合在一起。

 */
function eventsMixin(Vue) {
  var hookRE = /^hook:/;

  // 先on了 才能emit
  // 订阅者订阅事件，将回调函数注册到调度中心【发布订阅中心 vm._events】 当发布者发布该事件到调度中心时，由【调度中心】执行回调
  Vue.prototype.$on = function (event, fn) {
    var vm = this; // new Vue() 实例 即【调度中心】
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn); // 订阅者注册多个事件到调度中心时 再来调自己
      }
    } else {
      // 节省个if 将回调函数注册到调度中心
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm;
  };

  // 订阅者只订阅一次 即执行后删除这个订阅事件
  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on() {
      // 发布者发布【emit】事件后，调用on，on内部将其自身off
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on); // 为了更严谨的off
    return vm;
  };

  // 订阅者取消订阅
  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // 1. all off不传任何参数，取消当前订阅者所有订阅内容
    if (!arguments.length) {
      vm._events = Object.create(null); // {}
      return vm;
    }
    // 2. array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn); //调用自身 处理单个
      }
      return vm;
    }
    // 3. specific event 边界情况
    var cbs = vm._events[event];

    // 3.1 cbs为0
    if (!cbs) {
      return vm;
    }

    // 3.2 没传取消订阅哪个fn 则清空当前事件下所有fn
    if (!fn) {
      vm._events[event] = null; // 为啥不直接delete？？
      return vm;
    }
    // 4. specific handler 边界情况
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      // cb.fn === fn 情况即$once
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break; // 其实还是删一个
      }
    }
    return vm;
  };

  // 发布者发布事件时，由【调度中心】执行cbs
  Vue.prototype.$emit = function (event) {
    var vm = this;
    // 1. 如果不是生成模式 边界情况判断 先不看
    if (process.env.NODE_ENV !== "production") {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip('Event "' + lowerCaseEvent + '" is emitted in component ' + formatComponentName(vm) + ' but the handler is registered for "' + event + '". ' + "Note that HTML attributes are case-insensitive and you cannot use " + "v-on to listen to camelCase events when using in-DOM templates. " + 'You should probably use "' + hyphenate(event) + '" instead of "' + event + '".');
      }
    }
    // 2. 发布者发布事件后，【调度中心】执行cbs
    var cbs = vm._events[event]; //需要先
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = 'event handler for "' + event + '"';
      for (var i = 0, l = cbs.length; i < l; i++) {
        // 带错误处理的invoke 【执行回调函数】
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm;
  };
}
