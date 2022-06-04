### [懒加载](https://juejin.cn/post/6844903688390049800)



### IntersectionObserver()

> **`IntersectionObserver()`** 构造器创建并返回一个IntersectionObserver对象。 如果指定`rootMargin`则会检查其是否符合语法规定，检查阈值以确保全部在0.0到1.0之间，并且阈值列表会按升序排列。如果阈值列表为空，则默认为一个[0.0]的数组。

`IntersectionObserver` 是一个新的 API，可以自动"观察"元素是否可见，Chrome 51+ 已经支持。由于可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做"交叉观察器"。

#### 简单介绍一下语法

```
let observer = new IntersectionObserver(callback[, options])
复制代码
```

**参数**

- `callback`：当元素可见比例超过指定阈值，会调用这个回调函数，该函数接受两个参数
  - `entries`：一个IntersectionObserverEntry对象的数组，每个被触发的阈值，都或多或少与指定阈值有偏差。
  - `observer`：被调用的IntersectionObserver实例
- `options`(可选)一个可以用来配置observer实例的对象。如果`options`未指定，observer实例默认使用文档视口作为root，并且没有margin，阈值为0%（意味着即使一像素的改变都会触发回调函数）
  - root：监听元素的祖先元素，其边界盒将被视作视口。目标在根的可见区域的的任何不可见部分都会被视为不可见。
  - rootMargin：一个在计算交叉值时添加至根的边界盒中的一组偏移量，类型为字符串(string) ，可以有效的缩小或扩大根的判定范围从而满足计算需要。
  - threshold：规定了一个监听目标与边界盒交叉区域的比例值，可以是一个具体的数值或是一组0.0到1.0之间的数组。若指定值为0.0，则意味着监听元素即使与根有1像素交叉，此元素也会被视为可见. 若指定值为1.0，则意味着整个元素都在可见范围内时才算可见。

**返回值**

一个可以使用规定阈值监听目标元素可见部分与`root`交叉状况的新的`IntersectionObserver` 实例。调用自身的`observe()`方法开始使用规定的阈值监听指定目标。

**方法**

- observe：向IntersectionObserver对象监听的目标集合添加一个元素。`一个监听者有一组阈值和一个根， 但是可以监视多个目标元素，以查看这些目标元素可见区域的变化`。
- unobserve：命令`IntersectionObserver`停止对一个元素的观察。


作者：南玖
链接：https://juejin.cn/post/7100739752982216734
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
