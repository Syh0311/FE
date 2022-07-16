

## 一、什么是重排-重绘及触发条件

### 页面渲染过程

![render.png](D:\Sync\typora图片\78e105621ef1444ead7032551bd83878tplv-k3u1fbpfcp-zoom-in-crop-mark3024000.awebp)

### 重排-reflow

重排也叫`回流`，回流是直译，私以为翻译成重排更合适点。

当渲染树`render tree`中的一部分(或全部)因为元素的规模尺寸，布局，隐藏等改变而需要重新构建。这就称为**回流(reflow)**。每个页面至少需要一次回流，就是在页面第一次加载的时候，这时候是一定会发生回流的，因为要构建`render tree`。在回流的时候，浏览器会使渲染树中受到影响的部分失效，并重新构造这部分渲染树，完成回流后，浏览器会重新绘制受影响的部分到屏幕中，该过程称为**重绘**。

#### 触发重排的操作

**大致分为以下三种情况：**

1. DOM 节点的`几何属性`发生变化：

   - `页面首次渲染`（无法避免且开销最大的一次）；
   - width、height、padding、margin、left、top、border 等；
   - 元素`字体大小变化`(font-size)；
   - 激活`CSS`伪类（例如：`:hover`）；
   - DOM 节点的`增减或移动`；
   - 浏览器窗口大小发生变化（resize）

2. 读写DOM节点的offset族、scroll族和client族属性时； 

   - `获取这些属性时`，浏览器返回 DOM节点最新的布局信息，所以需要`立即`做出重排重绘操作；

3. 调用某些方法：

   - `调用这些方法时`，浏览器返回 DOM节点最新的布局信息，所以需要`立即`做出重排重绘操作；

   - getBoundingClientRect()；
   - getComputedStyle();
   - scrollTo();
   - scrollIntoView();

![image-20220716154902815](D:\Sync\typora图片\image-20220716154902815.png)

### 重绘-repaint

#### 触发条件

DOM节点`仅仅发生了样式的变化`【如颜色修改等改变元素的外观，风格】，而`没有几何属性的改变`，此时仅需重绘即可；

所以说重排一点会重绘，而重绘不一定会重排。

## [二、浏览器-优化机制](https://juejin.cn/post/7064077572132323365#heading-11)

由于每次重排都会造成额外的计算消耗，因此大多数浏览器都会通过队列化修改并批量执行来优化重排过程。浏览器会将修改操作放入到队列里，直到过了一段时间或者操作达到了一个阈值，才会进行批量修改并清空队列。但是，**在获取布局信息的时候，会强制刷新队列**，比如当你访问以下属性或者使用以下方法：

- clientTop、clientLeft、clientWidth、clientHeight
- offsetTop、offsetLeft、offsetWidth、offsetHeight
- scrollTop、scrollLeft、scrollWidth、scrollHeight
- getComputedStyle()
- getBoundingClientRect
- 具体可以访问这个网站：[paulirish](https://link.juejin.cn?target=https%3A%2F%2Fgist.github.com%2Fpaulirish%2F5d52fb081b3570c81e3a)

以上属性和方法都需要返回最新的布局信息，因此浏览器不得不清空队列，触发回流重绘来返回正确的值。因此，我们在修改样式的时候，**最好避免使用上面列出的属性，他们都会刷新渲染队列。**

## 三、如何减少重排-重绘

### 合并对`DOM`样式的修改，采用`css class`来修改

```js
const el = document.querySelector('.box')
el.style.margin = '5px'
el.style.borderRadius = '12px'
el.style.boxShadow = '1px 3px 4px #ccc'
复制代码
```

建议使用`css class`

```js
.update{
  margin: 5px;
  border-dadius: 12px;
  box-shadow: 1px 3px 4px #ccc
}
const el = document.querySelector('.box')
el.classList.add('update')
复制代码
```

**如果需要对DOM进行多次访问，尽量使用局部变量缓存该DOM**

**避免使用table布局，可能很⼩的⼀个⼩改动会造成整个table的重新布局**

**CSS选择符从右往左匹配查找，避免节点层级过多**

### DOM离线处理，减少回流重绘次数

**离线的DOM不属于当前DOM树中的任何一部分，这也就意味着我们对离线DOM处理就不会引起页面的回流与重绘。**

- 使用`display: none`，上面我们说到了 (`display: none`) 将元素从渲染树中完全移除，元素既不可见，也不是布局的组成部分，之后在该DOM上的操作不会触发回流与重绘，操作完之后再将`display`属性改为显示，只会触发这一次回流与重绘。

​       提醒⏰：`visibility : hidden` 的元素只对重绘有影响，不影响重排。

- 通过 [documentFragment](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FDocumentFragment) 创建一个 `dom` 文档片段,在它上面批量操作 `dom`，操作完成之后，再添加到文档中，这样只会触发一次重排。

```js
const el = document.querySelector('.box')
const fruits = ['front', 'nanjiu', 'study', 'code'];
const fragment = document.createDocumentFragment();
fruits.forEach(item => {
  const li = document.createElement('li');
  li.innerHTML = item;
  fragment.appendChild(li);
});
el.appendChild(fragment);
复制代码
```

- 克隆节点，修改完再替换原始节点

```js
const el = document.querySelector('.box')
const fruits = ['front', 'nanjiu', 'study', 'code'];
const cloneEl = el.cloneNode(true)
fruits.forEach(item => {
  const li = document.createElement('li');
  li.innerHTML = item;
  cloneEl.appendChild(li);
});
el.parentElement.replaceChild(cloneEl,el)
复制代码
```

### DOM脱离普通文档流

使用`absoult`或`fixed`让元素脱离普通文档流，使用绝对定位会使的该元素单独成为渲染树中 `body` 的一个子元素，重排开销比较小，不会对其它节点造成太多影响。

### CSS3硬件加速（GPU加速）

使用css3硬件加速，可以让`transform、opacity、filters`这些动画不会引起回流重绘 。但是对于动画的其它属性，比如`background-color`这些，还是会引起回流重绘的，不过它还是可以提升这些动画的性能。

**常见的触发硬件加速的css属性：**

- transform
- opacity
- filters
- Will-change

### [composite-设置图层](https://juejin.cn/post/6844903553795014663#heading-16)

渲染步骤中就提到了`composite`概念。

可以简单的这样理解，浏览器渲染的图层一般包含两大类：`普通图层`以及`复合图层`

首先，普通文档流内可以理解为一个复合图层（这里称为`默认复合层`，里面不管添加多少元素，其实都是在同一个复合图层中）

其次，absolute布局（fixed也一样），虽然可以脱离普通文档流，但它仍然属于`默认复合层`。

然后，可以通过`硬件加速`的方式，声明一个`新的复合图层`，它会单独分配资源 （当然也会脱离普通文档流，这样一来，不管这个复合图层中怎么变化，也不会影响`默认复合层`里的回流重绘）

可以简单理解下：**GPU中，各个复合图层是单独绘制的，所以互不影响**，这也是为什么某些场景硬件加速效果一级棒

可以`Chrome源码调试 -> More Tools -> Rendering -> Layer borders`中看到，黄色的就是复合图层信息

如下图。可以验证上述的说法

![img](D:\Sync\typora图片\1611938b2d83a384tplv-t2oaga2asx-zoom-in-crop-mark3024000.awebp)

**如何变成复合图层（硬件加速）**

将该元素变成一个复合图层，就是传说中的硬件加速技术

- 最常用的方式：`translate3d`、`translateZ`
- `opacity`属性/过渡动画（需要动画执行的过程中才会创建合成层，动画没有开始或结束后元素还会回到之前的状态）
- `will-chang`属性（这个比较偏僻），一般配合opacity与translate使用（而且经测试，除了上述可以引发硬件加速的属性外，其它属性并不会变成复合层）， 作用是提前告诉浏览器要变化，这样浏览器会开始做一些优化工作（这个最好用完后就释放）
- <video><iframe><canvas><webgl>等元素
- 其它，譬如以前的flash插件

**absolute和硬件加速的区别**

可以看到，absolute虽然可以脱离普通文档流，但是无法脱离默认复合层。 所以，就算absolute中信息改变时不会改变普通文档流中render树， 但是，浏览器最终绘制时，是整个复合层绘制的，所以absolute中信息的改变，仍然会影响整个复合层的绘制。 （浏览器会重绘它，如果复合层中内容多，absolute带来的绘制信息变化过大，资源消耗是非常严重的）

而硬件加速直接就是在另一个复合层了（另起炉灶），所以它的信息改变不会影响默认复合层 （当然了，内部肯定会影响属于自己的复合层），仅仅是引发最后的合成（输出视图）

**复合图层的作用？**

一般一个元素开启硬件加速后会变成复合图层，可以独立于普通文档流中，改动后可以避免整个页面重绘，提升性能

但是尽量不要大量使用复合图层，否则由于资源消耗过度，页面反而会变的更卡

**硬件加速时请使用index**

使用硬件加速时，尽可能的使用index，防止浏览器默认给后续的元素创建复合层渲染

具体的原理时这样的： **webkit CSS3中，如果这个元素添加了硬件加速，并且index层级比较低， 那么在这个元素的后面其它元素（层级比这个元素高的，或者相同的，并且releative或absolute属性相同的）， 会默认变为复合层渲染，如果处理不当会极大的影响性能**

简单点理解，其实可以认为是一个隐式合成的概念：**如果a是一个复合图层，而且b在a上面，那么b也会被隐式转为一个复合图层**，这点需要特别注意

另外，这个问题可以在这个地址看到重现（原作者分析的挺到位的，直接上链接）：

[web.jobbole.com/83575/](https://link.juejin.cn?target=http%3A%2F%2Fweb.jobbole.com%2F83575%2F)

## 参考

1. [介绍回流与重绘（Reflow & Repaint），以及如何进行优化?](https://juejin.cn/post/7064077572132323365)
2. [什么是重绘和重排/回流？ 如何去避免？](https://juejin.cn/post/6976644294740279310)

3. [从浏览器多进程到JS单线程，JS运行机制最全面的一次梳理](https://juejin.cn/post/6844903553795014663#heading-16)
   - 设置图层 -- 普通图层和复合图层
