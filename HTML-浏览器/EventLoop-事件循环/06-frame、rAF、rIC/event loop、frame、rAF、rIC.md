## frame 与 event loop

关系，一个 frame 中可能有多次 event loop，一个 event loop 也可能阻塞线程，执行很长时间，导致【drop frame】，即一个 frame 是 6.1ms（165FPS 下），在此期间可能发生

- requestAnimationFrame
- rendering
- 多次 event loop
- requestIdleCallback【如果还有空余时间的话】

![img](D:\Sync\typora图片\162d853396355715tplv-t2oaga2asx-zoom-in-crop-mark3024000.webp)

一、空的 frame

![image-20220724105928858](D:\Sync\typora图片\image-20220724105928858.png)

二、有 task 和 rAF 的 frame

![image-20220724134505000](D:\Sync\typora图片\image-20220724134505000.png)

## requestAnimationFrame

eventloop 与

`执行 requestAnimationFrame callback 是 rendering 的其中一步。但并不是每轮 eventloop 都会执行 UI Render`。我们仔细看文档：

> For example, if the browser is attempting to achieve a 60Hz refresh rate, then these steps are only necessary every 60th of a second (about 16.7ms). If the browser finds that a top-level browsing context is not able to sustain this rate, it might drop to a more sustainable 30Hz for that set of Documents, rather than occasionally dropping frames. (This specification does not mandate any particular model for when to update the rendering.) Similarly, if a top-level browsing context is in the background, the user agent might decide to drop that page to a much slower 4Hz, or even less.

如果浏览器试图实现 60Hz 的刷新率，那么 UI Render 只需要每秒执行 60 次（每 16.7 ms）。如果浏览器发现『顶层浏览器上下文』无法维持住这个频率，可能会下调到可维持的 30Hz，而不是掉帧。（本规范并不对何时进行 render 做任何规定。）类似的，如果一个顶层浏览器上下文在后台运行，用户代理可能决定将该页面的刷新率降到 4Hz，甚至更低。

由于规范没有做约定，所以浏览器在 render 策略上有充分的自主性。`既有可能出现每一轮 eventloop 后都 【update the rendering】，也有可能出现几十轮 eventloop 都不 update the rendering 的情况`。

而 rAF 是在重新 rendering 之前去调用，这就给了开发者最后一个在 rendering 前做一些事情的机会（如改变 DOM 属性、计算屏幕帧率等），这些改变会马上 rendering 绘制出来

```

我们来分析一下，为什么要在重新渲染前去调用？因为 `rAF` 是官方推荐的用来做一些流畅动画所应该使用的 API，做动画不可避免的会去更改 DOM，而如果在渲染之后再去更改 DOM，那就只能等到下一轮渲染机会的时候才能去绘制出来了，这显然是不合理的。

`rAF`在浏览器决定渲染之前给你最后一个机会去改变 DOM 属性，然后很快在接下来的绘制中帮你呈现出来，所以这是做流畅动画的不二选择。下面我用一个 `setTimeout`的例子来对比。

作者：ssh_晨曦时梦见兮
链接：https://juejin.cn/post/6844904165462769678
```

### rAF 与 setTimeout 区别【主要指动画】

1. 执行时机不同，rAF 在 rendering 之前执行，setTimeout 看心情；
2. 这就导致了以下问题：
   - 一个 frame 中可能有好几个 定时器在跑，执行不必要的`animFrame`；
   - 定时器可能被其之前的其他宏任务阻塞，导致`当前frame中没有执行`，而`下一个frame中执行两次`，从而导致【drop frame】

**具体过程对比：**

一、空的 frame

![image-20220724105928858](D:\Sync\typora图片\image-20220724105928858.png)

二、有 task 之后

![image-20220724110234041](D:\Sync\typora图片\image-20220724110234041.png)

三、使用 setTimeout 执行动画效果【理想状态】

![image-20220724132007709](D:\Sync\typora图片\image-20220724132007709.png)

四、setTimeout 优化

通过 `setTimeout(animFrame,1000 / 60)` 优化

**理想状态**

![image-20220724132030259](D:\Sync\typora图片\image-20220724132030259.png)

非理想状态情况 1：

setTimeout 延后，这一帧没执行`animFrame`，下一帧执行两次`animFrame`

![image-20220724132049323](D:\Sync\typora图片\image-20220724132049323.png)

非理想状态情况 2：任务运行时间过长，浏览器推迟渲染，甚至跳过渲染【drop frame】

![image-20220724132228828](D:\Sync\typora图片\image-20220724132228828.png)

五、使用 rAF

通过 rAF，将`animFrame`放到 frame 最开始执行，此举有两个作用：

1. `提高了animFrame的优先级`；
2. 避免了 setTimeout`真正执行时间不可控`的问题

![image-20220724133851326](D:\Sync\typora图片\image-20220724133851326.png)

`其他 task 放到rendering之后`

![image-20220724134622509](D:\Sync\typora图片\image-20220724134622509.png)

## requestIdleCallback

### [基本使用方式](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback#语法)

1. 使用

   - **requestIdleCallback(callback[, options])**

2. 返回值

   - 一个 ID，可以把它传入 [`Window.cancelIdleCallback()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/cancelIdleCallback) 方法来结束回调

3. 参数

   - `callback`

     一个在事件循环空闲时即将被调用的函数的引用。函数会接收到一个名为 [`IdleDeadline`](https://developer.mozilla.org/zh-CN/docs/Web/API/IdleDeadline) 的参数，这个参数可以获取当前空闲时间以及回调是否在超时时间前已经执行的状态。

   - `options` 可选

     包括可选的配置参数。具有如下属性：`timeout`： 如果指定了 timeout，并且有一个正值，而回调在 timeout 毫秒过后还没有被调用，那么回调任务将`放入事件循环中排队`，`即使这样做有可能对性能产生负面影响`。

判断 `task队列`和`microTask`队列是否都为空，如果是的话，则进行 `Idle` 空闲周期的算法，判断是否要执行 **`requestIdleCallback`** 的回调函数。

### 渲染有序进行

首先看一张图，很精确的描述了这个 API 的意图：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/21/172362067212340f~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

当然，这种有序的 `浏览器 -> 用户 -> 浏览器 -> 用户` 的调度基于一个前提，就是我们要把任务切分成比较小的片，不能说浏览器把空闲时间让给你了，你去执行一个耗时 `10s` 的任务，那肯定也会把浏览器给阻塞住的。这就要求我们去读取 `rIC` 提供给你的 `deadline` 里的时间，去动态的安排我们切分的小任务。浏览器信任了你，你也不能辜负它呀。

### 渲染长期空闲

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/21/17236209c86c248f~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

还有一种情况，也有可能在几帧的时间内浏览器都是空闲的，并没有发生任何影响视图的操作，它也就不需要去绘制页面： 这种情况下为什么还是会有 `50ms` 的 `deadline` 呢？是因为浏览器为了提前应对一些可能会突发的用户交互操作，比如用户输入文字。如果给的时间太长了，你的任务把主线程卡住了，那么用户的交互就得不到回应了。50ms 可以确保用户在无感知的延迟下得到回应。

MDN 文档中的[幕后任务协作调度 API ](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FBackground_Tasks_API) 介绍的比较清楚，来根据里面的概念做个小实验：

屏幕中间有个红色的方块，把 MDN 文档中[requestAnimationFrame](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FrequestAnimationFrame)的范例部分的动画代码直接复制过来。

草案中还提到：

1. 当浏览器判断这个页面对用户不可见时，这个回调执行的频率可能被降低到 10 秒执行一次，甚至更低。这点在解读 EventLoop 中也有提及。
2. 如果浏览器的工作比较繁忙的时候，不能保证它会提供空闲时间去执行 `rIC` 的回调，而且可能会长期的推迟下去。所以如果你需要保证你的任务在一定时间内一定要执行掉，那么你可以给 `rIC` 传入第二个参数 `timeout`。
   这会强制浏览器不管多忙，都在超过这个时间之后去执行 `rIC` 的回调函数。所以要谨慎使用，因为它会打断浏览器本身优先级更高的工作。
3. `最长期限为 50 毫秒`，是根据研究得出的，研究表明，人们通常认为 100 毫秒内对用户输入的响应是瞬时的。 将闲置截止期限设置为 50ms 意味着即使在闲置任务开始后立即发生用户输入，浏览器仍然有剩余的 50ms 可以在其中响应用户输入而不会产生用户可察觉的滞后。
4. 每次调用 `timeRemaining()` 函数判断是否有剩余时间的时候，如果浏览器判断此时有优先级更高的任务，那么会`动态的把这个值设置为 0`，否则就是用预先设置好的 `deadline - now` 去计算。
5. 这个 `timeRemaining()` 的计算非常动态，会根据很多因素去决定，所以不要指望这个时间是稳定的。

作者：ssh\_晨曦时梦见兮
链接：https://juejin.cn/post/6844904165462769678
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

### [合理使用 idle callback](https://developer.mozilla.org/zh-CN/docs/Web/API/Background_Tasks_API#充分利用空闲回调)

因为 idle callbacks 旨在为代码提供一种与事件循环协作的方式，以确保系统充分利用其潜能，不会过度分配任务，从而导致延迟或其他性能问题，因此您应该考虑如何使用它。

- **对非高优先级的任务使用空闲回调。** 已经创建了多少回调，用户系统的繁忙程度，你的回调多久会执行一次（除非你指定了 `timeout`），这些都是未知的。不能保证每次事件循环（甚至每次屏幕更新）后都能执行空闲回调；如果事件循环用尽了所有可用时间，那你可就倒霉了（再说一遍，除非你用了 `timeout`）。
- **空闲回调应尽可能不超支分配到的时间。**尽管即使你超出了规定的时间上限，通常来说浏览器、代码、网页也能继续正常运行，这里的时间限制是用来保证系统能留有足够的时间去完成当前的事件循环然后进入下一个循环，而不会导致其他代码卡顿或动画效果延迟。目前，[`timeRemaining()`](https://developer.mozilla.org/zh-CN/docs/Web/API/IdleDeadline/timeRemaining) 有一个 50 ms 的上限时间，但实际上你能用的时间比这个少，因为在复杂的页面中事件循环可能已经花费了其中的一部分，浏览器的扩展插件也需要处理时间，等等。
- **避免在空闲回调中改变 DOM。** 空闲回调执行的时候，当前帧已经结束绘制了，所有布局的更新和计算也已经完成。如果你做的改变影响了布局， 你可能会`强制停止浏览器并重新计算`，而从另一方面来看，这是不必要的。 如果你的回调需要改变 DOM，它应该使用[`Window.requestAnimationFrame()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)来调度它。
- **避免运行时间无法预测的任务。** 你的空闲回调必须避免做任何占用时间不可预测的事情。比如说，应该避免做任何会影响页面布局的事情。你也必须避免 执行[`Promise` (en-US)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 的`resolve`和`reject`，因为这会在你的回调函数返回后立即引用 Promise 对象对`resolve`和`reject`的处理程序。
- **在你需要的时候要用 timeout，但记得只在需要的时候才用。** 使用 timeout 可以保证你的代码按时执行，但是在剩余时间不足以强制执行你的代码的同时保证浏览器的性能表现的情况下，timeout 就会造成延迟或者动画不流畅。

## 参考

[youtube 视频](https://www.youtube.com/watch?v=cCOL7MC4Pl0)

[`Chrome Developers` Using requestIdleCallback](https://developer.chrome.com/blog/using-requestidlecallback/)

[Web Animation Performance Fundamentals – How to Make Your Pages Look Smooth](https://www.freecodecamp.org/news/web-animation-performance-fundamentals/)

[Rendering Performance](https://web.dev/rendering-performance/)
