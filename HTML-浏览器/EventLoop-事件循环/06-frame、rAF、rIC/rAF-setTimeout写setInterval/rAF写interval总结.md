## rAF - [MDN 描述](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)

**`window.requestAnimationFrame()`** 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。

为了提高性能和电池寿命，因此在大多数浏览器里，当`requestAnimationFrame()` 运行在后台标签页或者隐藏的[`iframe`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe) 里时，`requestAnimationFrame()` 会被暂停调用以提升性能和电池寿命。

### 对比 setInterval

1. 都是宏任务
2. rAF 离开浏览器暂停调用，setInterval 不暂停
3. setInterval 自身的缺点：
   - 回调被跳过；
   - 回调连续执行。

### setInterval 的两个缺点

1. 定时器可能会被跳过；
   - 主线程运行时间超过【2\*delay】，
   - 第一个 delay，计时器线程将【回调 T1】添加到宏任务队列，
   - 第二个 delay，计时器打算添加【回调 T2】到宏任务队列，但里边已经有一个【T1】，就不添加了，T2 丢失
2. 两个定时器连续执行；
   - 上一个定时器【T1】执行时间大于 delay，则在 T1 执行时，T2 已经被添加到宏任务队列等待执行。 当 T1 执行完，会立马执行 T2

### [为什么要用 setTimeout 模拟 setInterval] 下评论

`不要盲目使用` setTimeout 代替 setInterval。

首先这两者都无法保证时间上的精确性。但在实际项目中，通常需要长时间执行的任务都会被优化掉，所以最终它们的回调执行时间并不会与期望时间点偏差太多。

另外，「定时器」通常有两种：

1. 固定地每间隔一定时间触发一次，就像钟表那样；
2. 在前一次触发之后，间隔一段时间再触发下一次；
   - 通常这种在触发时都会需要执行一个比较耗时的异步任务。

对于第一种情况，使用 setInterval 即可，而第二种才应当使用 setTimeout。

## 参考

1. [深入解析你不知道的 EventLoop 和浏览器渲染、帧动画、空闲回调（动图演示）](https://juejin.cn/post/6844904165462769678)
2. [神奇的 requestAnimationFrame](https://segmentfault.com/a/1190000012175376)
3. [为什么要用 setTimeout 模拟 setInterval ？](https://segmentfault.com/a/1190000038829248)
4. [使用 requestAnimationFrame 实现定时器，解决 setInterval 执行次数丢失问题 ](https://www.cnblogs.com/whosmeya/p/14135507.html)
