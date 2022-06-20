## [JS 宏任务，微任务，DOM 渲染，requestAnimationFrame 执行顺序比较](https://juejin.cn/post/7084989596034924581)

## [深入解析 EventLoop 和浏览器渲染、帧动画、空闲回调的关系](https://zhuanlan.zhihu.com/p/142742003)

## nextTick 前因后果

### 为什么会有 nextTick 这个东西的存在

1. 因为 vue 采用的**异步更新策略**，当监听到数据发生变化的时候不会立即去更新 DOM，
2. 而是开启一个任务队列，`并缓存在同一事件循环中发生的所有数据变更`;
3. 这种做法带来的好处就是可以将多次数据更新合并成一次，`减少操作DOM的次数`，
4. 如果不采用这种方法，假设数据改变 100 次就要去更新 100 次 DOM，而频繁的`DOM更新是很耗性能的`；

### nexTick 的作用

nextTick 接收一个回调函数作为参数，并将这个回调函数`延迟到DOM更新后才执行`；
**使用场景**：想要操作 `基于最新数据生成的DOM`时，就将这个操作放在 nextTick 的回调中；

### nextTick 做的两件事

1. 根据不同环境生成不同的 timerFunc，将回调作为`微任务/宏任务`添加到事件循环中
2. 通过 flushCallbacks 在`合适的时机`执行`callbabcks`队列中的回调

### nextTick 实现原理

将传入的回调函数包装成异步任务，异步任务又分微任务和宏任务，为了尽快执行所以优先选择微任务；

nextTick 提供了四种异步方法

1. Promise.resolve().then
2. MutationObserver
3. setImmediate
4. setTimeout(fn,0)

**源码位置** core/util/next-tick

简版【没 timerFunc 的其他三种情况】

```js
const callbacks = [];
let pending = false; // 标记是否已经向任务队列中添加了一个任务，如果已经添加了就不能再添加了

function flushCallbacks() {
  // 1. 为了下一次事件循环 还原pending
  pending = false;

  // 2. 复制cbs，避免nextick中调用nextick导致nextTick循环的情况 【callbacks会无限扩大 for循环无法终止】
  const copies = callbacks.slice(0);

  // 3. 为了下一次事件循环 还原callbacks
  callbacks.length = 0;

  // 4. 执行copies内回调  此处实现了nextTick的插队
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

//  定义timerFunc
let timerFunc = Promise.resolve().then(flushCallbacks);

//接受回调函数与对应的this
export function nextTick(cb, ctx) {
  let _resolve;
  // 1. callbacks推入的是个执行cb的函数
  callbacks.push(() => {
    if (cb) {
      cb.call(ctx);
    } else if (_resolve) {
      _resolve(ctx); // _resolve对于这个函数是个闭包
    }
  });
  // 2. pending默认false，
  // 2.1 第一次调用nextTick后 pending设为true，执行timerFunc
  // 2.2 timerFunc执行后将`flushCallbacks`作为微任务添加到微任务队列 等待执行【callbacks队列内的`同步函数`】
  // 2.3 第二次再调用nextTick 就只将cb推入callbacks队列
  // 2.4 同步代码和flushCallbacks之前的微任务执行完后 执行flushCallbacks
  if (!pending) {
    pending = true; // 第一次的标识
    timerFunc(); //内部的微任务flushCallbacks 将pending还原
  }
  // 3. cb为undefined 则赋值_resolve 返回Promise 使其能够正常返回值
  if (!cb && typeof Promise !== "undefined") {
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}
```

### 一些变动

1. flushBatcherQueue --> flushSheldurQueue
2. MutationObserver(flushCallbacks) --> Promise.resolve().then(flushCallbacks)

![image-20220612163951166](D:\Sync\typora图片\image-20220612163951166.png)

## nextTick 与修改 data

![image-20220620102801202](D:\Sync\typora图片\image-20220620102801202.png)

### [update](https://ustbhuangyi.github.io/vue-analysis/v2/data-driven/update.html#%E6%80%BB%E7%BB%93)

### [Vue 源码解读（六）：update 和 patch](https://segmentfault.com/a/1190000040715254)

### nextTick 与 update 【上边的 update 与 patch】

1. case1：
   - promise
   - 修改 data【beforeUpdate 、\_update 、updated】
   - nextTick
   - promise
2. case2：
   - nextTick
   - 修改 data【beforeUpdate 、\_update 、updated】
   - nextTick

首先这里先声明几个概念：

1. 微任务队列按照代码**从上至下**的逻辑顺序依次将任务插入微任务队列。
2. vue 中数据变化会立刻将 beforeUpdate() 、update() 、updated() 插入到微任务队列。

- 这里需要将第 2 点单独说明一下，这些步骤都在微任务队列中，说明是异步执行的任务，因此我们需要区分一点是，当代码改变数据时（如 this.name = ‘xxx’ ），**不会立刻同步执行**虚拟 DOM 更新操作，但是会立刻将更新的微任务全部按顺序插入微任务队列。下面的例子中会重点讲到。

3. **nextTick()** 不讲武德，直接**插队**在 updated() 之后，即在所有更新任务完成后立刻执行。
   - 插队的实现方式 通过`flushCallbacks`将队列中所有的微任务通过 for 循环一块执行了 然后再执行 cb2，
   - 即先有了`flushCallbacks`维护的队列，nextTick 内的回调都进了`这个队列内`，没排在 cb2 之后，所以看起来像是插队了

![image-20220620102814434](D:\Sync\typora图片\image-20220620102814434.png)

### 实例

```vue
<template>
  <div id="app">
    <button @click="btn++">{{ btn }}</button>
    <p ref="name">{{ name }}</p>
    <button @click="click">点击</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      btn: 10,
      name: "syh",
    };
  },

  mounted() {
    console.log("mounted");
  },

  beforeUpdate() {
    console.log("beforeUpdate:" + this.$refs.name.innerHTML);
    debugger;
  },

  updated() {
    console.log("updated:" + this.$refs.name.innerHTML);
    debugger;
  },

  methods: {
    click() {
      const that = this;
      // Promise1 (对应图中callBack1)
      new Promise((resolve) => resolve()).then(function promise1Fn() {
        debugger;
        console.log("Promise1:" + that.$refs.name.innerHTML);
      });
      // 数据改变准备更新 （对应图中第二行代码）
      that.name = "改变";
      // 同步打印虚拟dom
      console.log(that.$refs.name);
      debugger;
      // 同步打印dom的文本
      console.log(that.$refs.name.innerHTML);
      // Promise2 (对应图中callBack2)
      new Promise((resolve) => resolve()).then(function promise2Fn() {
        debugger;
        console.log("Promise2:" + that.$refs.name.innerHTML);
      });
      // nextTick 插队到updated之后 所以早于promise2(对应图中nextTickCallBack)
      const next1 = that.$nextTick(function next1Fn() {
        debugger;
        console.log("nextTickFn1-【插队】到updated后:" + that.$refs.name.innerHTML);
      });
      const next2 = that.$nextTick(
        function next2Fn() {
          console.log("[ next2Fn ]");
          // console.log(that);
        },
        {
          name: "syh",
        }
      );
      // const next3 = that
      //   .$nextTick(undefined, { name: "syh" })
      //   .then((res) => console.log(res));
      // console.log(next1);
      // console.log(next2);
      // console.log(next3);
      // 宏任务
      setTimeout(function macroFn() {
        debugger;
        console.log("宏任务：" + that.$refs.name.innerHTML);
      }, 0);
    },
  },
};
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  position: absolute;
  overflow: hidden;
}
</style>
```

### this.name 修改之后 Vue 做了些啥

1. 触发 name 的 setter；

2. 触发闭包内 dep，dep 通知所有 watcher 更新；

3. watcher 进行更新

   - 调用 watcher 中 update
   - watcher 默认是异步更新，所以调用`queueWatcher(this)`

   ```js
   update () {
       /* istanbul ignore else */
       if (this.lazy) {
           this.dirty = true
       } else if (this.sync) {
           /*同步则执行run直接渲染视图*/
           this.run()
       } else {
           /*异步推送到观察者队列中，下一个tick时调用。*/
           queueWatcher(this)
       }
   }
   ```

4. queueWatcher

   - queueWatcher 内调用 nextTick(`flushSchedulerQueue`)
   - flushSchedulerQueue 函数负责`更新视图`

   ```js
    /*将一个观察者对象push进观察者队列，在队列中已经存在相同的id则该观察者对象将被跳过，除非它是在队列被刷新时推送*/
   export function queueWatcher (watcher: Watcher) {
       // 获取watcher的id
       const id = watcher.id
       // 如果当前watcher已经在队列中，则什么也不做【跳过】
       if (has[id] == null) {
           has[id] = true
           if (!flushing) {
               /*如果没有flush掉，直接push到队列中即可*/  ？？？
               queue.push(watcher)
           } else {
           ...
           }
           // queue the flush
           if (!waiting) {
               waiting = true
               nextTick(flushSchedulerQueue) //直接到这来
           }
       }
   }
   ```

5. nextTick

6. 所以 nextTick 的 callbacks 里函数为

   - 注：callbacks 里函数是单独的带错误处理的函数，这个函数的闭包内带有【具体回调的函数】

   1. flushSchedulerQueue
   2. next1Fn
   3. next2Fn

   ![image-20220620103917039](D:\Sync\typora图片\image-20220620103917039.png)

## Vue 异步更新策略

## 参考文章

### [2017 年-Vue 源码详解之 nextTick](https://segmentfault.com/a/1190000008589736)

#### 一些变动

1. flushBatcherQueue --> flushSheldurQueue
2. MutationObserver(flushCallbacks) --> Promise.resolve().then(flushCallbacks)

#### 原文

仔细跟踪了代码执行过程我们会发现，真正的去遍历 watcher，批处理更新是在 microtask 中执行的，而且用户在修改数据后自己执行的`nextTick(cb)`也会在此时执行 cb，他们都是在同一个 microtask 中执行。根本就不是我最开始想的那样，把回调放在以后的事件循环中去执行。

同时，上面这个过程也深切的揭露出 Vue nextTick 的本质，我不是想要 MO 来帮我真正监听 DOM 更改，我只是想要一个异步 API，用来在当前的同步代码执行完毕后，执行我想执行的异步回调。

之所以要这样，是因为用户的代码当中是可能多次修改数据的，而每次修改都会同步通知到所有订阅该数据的 watcher，而立马执行将数据写到 DOM 上是肯定不行的，那就只是把 watcher 加入数组。等到当前 task 执行完毕，所有的同步代码已经完成，那么这一轮次的数据修改就已经结束了，这个时候我可以安安心心的去将对监听到依赖变动的 watcher 完成数据真正写入到 DOM 上的操作，这样即使你在之前的 task 里改了一个 watcher 的依赖 100 次，我最终只会计算一次 value、改 DOM 一次。一方面省去了不必要的 DOM 修改，另一方面将 DOM 操作聚集，可以提升 DOM Render 效率。

那为什么一定要用 MutationObserver 呢？不，并没有一定要用 MO，只要是 microtask 都可以。在最新版的 Vue 源码里，优先使用的就是`Promise.resolve().then(nextTickHandler)`来将异步回调放入到 microtask 中（MO 在 IOS9.3 以上的 WebView 中有 bug），没有原生 Promise 才用 MO。

这充分说明了 microtask 才是 nextTick 的本质，MO 什么的只是个备胎，要是有比 MO 优先级更高、浏览器兼容性更好的 microtask，那可能就分分钟把 MO 拿下了。

那问题又来了，为什么一定要 microtask？task 可以吗？（macrotask 和 task 是一回事哈，[HTML5 标准里](https://link.segmentfault.com/?enc=4NudCjO9eNWhoipbxJuZEw%3D%3D.LUPf%2FGgGErEbdXT40LnITKNC4op7YaZviLBNqITTwHbSkFJCu47Hl9SaiDjdnYtP3GuwOhHQcF6NNUMXc%2FnFpGvnpTA3hOIfbqS29DEOh47SEytNaP5vSGaEQQtyfYMr)甚至都没有 macrotask 这个词）。

哈，现在刚好有个例子，Vue 一开始曾经改过 nextTick 的实现。我们来看看这两个 jsFiddle：[jsfiddle1](https://jsfiddle.net/k6bgu2z6/4/)点击预览和[jsfiddle2](https://jsfiddle.net/v9q9L0hw/2/)点击预览。

两个 fiddle 的实现一模一样，就是让那个绝对定位的黄色元素起到一个 fixed 定位的效果：绑定 scroll 事件，每次滚动的时候，计算当前滚动的位置并更改到那个绝对定位元素的 top 属性上去。大家自己试试滚动几下，对比下效果，你就会发现第一个 fiddle 中的黄元素是稳定不动的，fixed 很好。而后一个 fiddle 中就有问题了，黄色元素上下晃动，似乎跟不上我们 scroll 的节奏，总要慢一点，虽然最后停下滚动时位置是对的。

上述两个例子其实是在这个[issue](https://link.segmentfault.com/?enc=uO12Xd3YkgLa2q27Yh40Rw%3D%3D.7dYN8azv05zIlL3pdKOJRpzTHnTBgw8UdTZ77%2BoHo23cj2H64FjSmzVnEZ7qtQoG7F68IdqOXJjC5Lz%2F3pPOXA%3D%3D)中找到的，第一个 jsfiddle 使用的版本是 Vue 2.0.0-rc.6，这个版本的 nextTick 实现是采用了 MO，而后因为 IOS9.3 的 WebView 里的 MO 有 bug，于是尤雨溪更改了实现，换成了`window.postMessage`，也就是后一个 fiddle 所使用的 Vue 2.0.0-rc.7。后来尤雨溪了解到`window.postMessage`是将回调放入的 macrotask 队列。这就是问题的根源了。

HTML 中的 UI 事件、网络事件、HTML Parsing 等都是使用的 task 来完成，因此每次 scroll 事件触发后，在当前的 task 里只是完成了把 watcher 加入队列和把清空 watcher 的 flushBatcherQueue 作为异步回调传入 nextTick。

如果 nextTick 使用的是 microtask，那么在 task 执行完毕之后就会立即执行所有 microtask，那么 flushBatcherQueue（真正修改 DOM）便得以在此时立即完成，而后，当前轮次的 microtask 全部清理完成时，执行 UI rendering，把重排重绘等操作真正更新到 DOM 上（后文会细说）。（注意，页面的滚动效果并不需要重绘哈。重绘是当你修改了 UI 样式、DOM 结构等等，页面将样式呈现出来，别晕了。）
如果 nextTick 使用的是 task，那么会在当前的 task 和所有 microtask 执行完毕之后才在以后的某一次 task 执行过程中处理 flushBatcherQueue，那个时候才真正执行各个指令的修改 DOM 操作，但那时为时已晚，错过了多次触发重绘、渲染 UI 的时机。而且浏览器内部为了更快的响应用户 UI，内部可能是有多个 task queue 的：

> For example, a user agent could have one task queue for mouse and key events (the user interaction task source), and another for everything else. The user agent could then give keyboard and mouse events preference over other tasks three quarters of the time, keeping the interface responsive but not starving other task queues, and never processing events from any one task source out of order.

而 UI 的 task queue 的优先级可能更高，因此对于尤雨溪采用的`window.postMessage`，甚至可能已经多次执行了 UI 的 task，都没有执行`window.postMessage`的 task，也就导致了我们更新 DOM 操作的延迟。在重 CPU 计算、UI 渲染任务情况下，这一延迟达到 issue 观测到的 100 毫秒到 1 秒的级别是完全课可能的。因此，使用 task 来实现 nextTick 是不可行的，而尤雨溪也撤回了这一次的修改，后续的 nextTick 实现中，依然是使用的 Promise.then 和 MO。

#### task microtask 和每轮 event loop 之后的 UI Render

我最近认真阅读了一下 HTML5 规范，还是来说一说 task 和 microtask 处理完成之后的 UI 渲染过程，讲一下每次 task 执行和所有 microtask 执行完毕后使如何完成 UI Render 的。

先上[HTML 标准原文](https://link.segmentfault.com/?enc=UBdrAhfWwbg8wEbayHzCQQ%3D%3D.4zxFB4ELvfjjN391QAzXqAwxFUunsG9HRcsFhGZ7VPxCMg7JDNFG6BBCOkBnwInCL%2FwsqVK3b8tvoBCaWlNrQPpGAFCGMPTPipGJBcfxPr8%3D)：
比较典型的 task 有如下这些

> - Events
>
> Dispatching an Event object at a particular EventTarget object is often done by a dedicated task. _Not all events are dispatched using the task queue, many are dispatched during other tasks._
>
> - Parsing
>   The HTML parser tokenizing one or more bytes, and then processing any resulting tokens, is typically a task.
> - Callbacks
>   Calling a callback is often done by a dedicated task.
> - Using a resource
>   When an algorithm fetches a resource, if the fetching occurs in a non-blocking fashion then the processing of the resource once some or all of the resource is available is performed by a task.
> - Reacting to DOM manipulation
>   Some elements have tasks that trigger in response to DOM manipulation, e.g. when that element is inserted into the document.

此外，还包括 setTimeout, setInterval, setImmediate, window.postMessage 等等。
_上述 Reacting to DOM manipulation 并不是说你执行 DOM 操作时就会把这个 DOM 操作的执行当成一个 task。是那些异步的 reacting 会被当做 task。_

[HTML5 标准：task、microtask 和 UI render 的具体执行过程如下](https://link.segmentfault.com/?enc=9Km%2Bt2SMi9Fo6zKVHMhqdg%3D%3D.xnUf9wG12tzXQiDFMzpTPkoY3iCX5VT5KNa%2Bu4QPFPnmRVkE8Zreii3q3L81IwwAMgoVJWZIYhgt5a0OPdjbSOePf6sQa2LMkTHbGYRtr79GQfrQq98wGRPAhHvzhR6Q)：

> An event loop must continually run through the following steps for as long as it exists:
>
> 1.Select the oldest task on one of the event loop's task queues, if any, ignoring, in the case of a browsing context event loop, tasks whose associated Documents are not fully active. The user agent may pick any task queue. If there is no task to select, then jump to the microtasks step below.
>
> 2.Set the event loop's currently running task to the task selected in the previous step.
>
> 3.Run: Run the selected task.
>
> 4.Set the event loop's currently running task back to null.
>
> 5.Remove the task that was run in the run step above from its task queue.
>
> 6.Microtasks: [Perform a microtask checkpoint.](https://link.segmentfault.com/?enc=GfJ9fk1g7IvtBwzchaVKJA%3D%3D.oawdWabgl%2BSta%2Fbe4pMOAWP%2B0PmySO3VUxXt3BmuM3NDMSxImcdHRJR%2FyLFU3mZPLYp8p4HRO443RrAG0vPM53eeFplnpJqzYC4bIDHI69HelUM7KjucwCSg%2B4l0Bbcy) //这里会执行所有的 microtask
>
> 7.Update the rendering: If this event loop is a browsing context event loop (as opposed to a worker event loop), then run the following substeps.

> 7.1 Let now be the value that would be returned by the Performance object's now() method.
> 7.2 Let docs be the list of Document objects associated with the event loop in question, sorted arbitrarily except that the following conditions must be met:
> 7.3 If there are top-level browsing contexts B that the user agent believes would not benefit from having their rendering updated at this time, then remove from docs all Document objects whose browsing context's top-level browsing context is in B.
> 7.4 If there are a nested browsing contexts B that the user agent believes would not benefit from having their rendering updated at this time, then remove from docs all Document objects whose browsing context is in B.
> 7.5 For each fully active Document in docs, run the resize steps for that Document, passing in now as the timestamp. [CSSOMVIEW]
> 7.6 For each fully active Document in docs, run the scroll steps for that Document, passing in now as the timestamp. [CSSOMVIEW]
> 7.7 For each fully active Document in docs, evaluate media queries and report changes for that Document, passing in now as the timestamp. [CSSOMVIEW]
> 7.8 For each fully active Document in docs, run CSS animations and send events for that Document, passing in now as the timestamp. [CSSANIMATIONS]
> 7.9 For each fully active Document in docs, run the fullscreen rendering steps for that Document, passing in now as the timestamp. [FULLSCREEN]
> 7.10 For each fully active Document in docs, run the animation frame callbacks for that Document, passing in now as the timestamp.
> 7.11 For each fully active Document in docs, run the update intersection observations steps for that Document, passing in now as the timestamp. [INTERSECTIONOBSERVER]
> 7.12 For each fully active Document in docs, update the rendering or user interface of that Document and its browsing context to reflect the current state.

> 8.If this is a worker event loop (i.e. one running for a WorkerGlobalScope), but there are no tasks in the event loop's task queues and the WorkerGlobalScope object's closing flag is true, then destroy the event loop, aborting these steps, resuming the run a worker steps described in the Web workers section below.
> 9.Return to the first step of the event loop.

解释一下：第一步，从多个 task queue 中的一个 queue 里，挑出一个最老的 task。（因为有多个 task queue 的存在，使得浏览器可以完成我们前面说的，优先、高频率的执行某些 task queue 中的任务，比如 UI 的 task queue）。
然后 2 到 5 步，执行这个 task。
第六步， [Perform a microtask checkpoint.](https://link.segmentfault.com/?enc=%2FHIgu1dgz6leYKx4u0bAXg%3D%3D.onhzti8QyOl%2FTUolKISRLuxMaue89OIkgTds51fFUzcImVD0N3U46lWyVYXoprU4cBYb47N3XWj63Glw6fvIhm3ICm7R96TT4Tf2gwsOzuIfqpZ2gXXchNBj3GBQx6SI) ，这里会执行完 microtask queue 中的所有的 microtask，如果 microtask 执行过程中又添加了 microtask，那么仍然会执行新添加的 microtask，当然，这个机制好像有限制，一轮 microtask 的执行总量似乎有限制(1000?)，数量太多就执行一部分留下的以后再执行？这里我不太确定。

第七步，Update the rendering：
7.2 到 7.4，当前轮次的 event loop 中关联到的 document 对象会保持某些特定顺序，这些 document 对象都会执行需要执行 UI render 的，但是并不是所有关联到的 document 都需要更新 UI，浏览器会判断这个 document 是否会从 UI Render 中获益，因为浏览器只需要保持 60Hz 的刷新率即可，而每轮 event loop 都是非常快的，所以没必要每个 document 都 Render UI。
7.5 和 7.6 run the resize steps/run the scroll steps 不是说去执行 resize 和 scroll。每次我们 scoll 的时候视口或者 dom 就已经立即 scroll 了，并把 document 或者 dom 加入到 pending scroll event targets 中，而 run the scroll steps 具体做的则是遍历这些 target，在 target 上触发 scroll 事件。run the resize steps 也是相似的，这个步骤是触发 resize 事件。
7.8 和 7.9 后续的 media query, run CSS animations and send events 等等也是相似的，都是触发事件，第 10 步和第 11 步则是执行我们熟悉的 requestAnimationFrame 回调和[IntersectionObserver](https://link.segmentfault.com/?enc=6ryRAK8J8%2Fpe2716Yd0xbQ%3D%3D.bVmXirL15sNXtQ9SY4Az5ujzGdbdu1BCvDuF%2FDtFlqFbr6DH7EvkALGz8miPLBFF6dd1FtXJAXFnx80vnclLLiZo5ZAUvF%2B%2BI87Nb1J6bRZLrx6RJRTIJmif%2F%2BNrYQ9FKcKVArMJBeiBD%2BO0MXbzNQ%3D%3D)回调（第十步还是挺关键的,raf 就是在这执行的！）。
7.12 渲染 UI，关键就在这了。

第九步 继续执行 event loop，又去执行 task，microtasks 和 UI render。

更新：找到一张图，不过着重说明的是整个 event loop，没有细说 UI render。
![image-20220612164018311](D:\Sync\typora图片\image-20220612164018311.png)

### [Update、nextTick 、refs ，虚拟 DOM 与真实 DOM 的联系](https://its201.com/article/weixin_51116314/119814816)

#### 错误

里边 refs 写错了

1. ref 在 dom 元素上是真实 dom，文中写的虚拟 dom
2. ref 在 vue 组件上是 vue 组件实例

### [2022 年-nextTick 实现原理](https://juejin.cn/post/7087866362785169416)

作者：大古 Zio
链接：https://juejin.cn/post/7087866362785169416
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
