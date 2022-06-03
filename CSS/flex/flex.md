## flex

### justify-content

1. flex-start;
2. flex-end;
3. center;
4. 以下几个均为均匀排列元素
5. space-between;   首个元素放置于起点，末尾元素放置于终点
6. space-around;     同一个元素`周围【左右】`保持相等距离
7. space-evenly;       每个元素之间的间隔相等
8. stretch;                 'auto'-sized 的元素会被拉伸以适应容器的大小

### **align-items**

1. flex-start;
2. flex-end;
3. center;
4. baseline; 元素在容器的基线位置显示。
5. stretch;  元素被拉伸以填满整个容器。

### **flex-direction**

注意当flex`以列为方向时`，`justify-content`控制纵向对齐，`align-items`控制横向对齐。

1. row
2. row-reverse;
3. column;
4. column-reverse;

### 控制单个元素

### order

第十四关

有时候仅仅调转行或列的方向是不够的。在这些情况，我们可以设置单个元素的`order`属性。元素的属性默认值为0，但是我们设置这个属性为正数或负数。

用`order`来调整青蛙的顺序。

### align-self

另一个你可以使用的控制单个元素的属性是`align-self`。这个属性接受和`align-items`一样的那些值。

第16关  只让黄色的在下边中间

```css
#pond {
  display: flex;
  align-items: flex-start;
}

.yellow {
align-self:flex-end;
}
```

### flex-wrap

- `nowrap`: 所有的元素都在一行。
- `wrap`: 元素自动换成多行。
- `wrap-reverse`: 元素自动换成逆序的多行。

### **flex-flow**

flex-direction 和 flex-wrap的结合

### align-content

多行的逻辑

- `flex-start`: 多行都集中在顶部。
- `flex-end`: 多行都集中在底部。
- `center`: 多行居中。
- `space-between`: 行与行之间保持相等距离。
- `space-around`: 每行的周围保持相等距离。
- `stretch`: 每一行都被拉伸以填满容器。

### flex属性

### flex-grow

设置 flex 项[主尺寸](https://www.w3.org/TR/css-flexbox/#main-size) 的 flex 增长系数。

### flex-shrink

指定了 flex 元素的收缩规则。flex 元素仅在默认宽度之和大于容器的时候才会发生收缩，其收缩的大小是依据 flex-shrink 的值。

### flex-basis

指定了 flex 元素在主轴方向上的初始大小。如果不使用  [`box-sizing`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing) 改变盒模型的话，那么这个属性就决定了 flex 元素的内容盒（content-box）的尺寸。







容器成员属性如下：

- `order`
- `flex-grow`
- `flex-shrink`
- `flex-basis`
- `flex`
- `align-self`

### order

定义项目的排列顺序。数值越小，排列越靠前，默认为0

```
1.item {
2    order: <integer>;
3}
```

### flex-grow

上面讲到当容器设为`flex-wrap: nowrap;`不换行的时候，容器宽度有不够分的情况，弹性元素会根据`flex-grow`来决定

定义项目的放大比例（容器宽度>元素总宽度时如何伸展）

默认为`0`，即如果存在剩余空间，也不放大

```
1.item {
2    flex-grow: <number>;
3}
```

如果所有项目的`flex-grow`属性都为1，则它们将等分剩余空间（如果有的话）



![img](https://static.vue-js.com/48c8c5c0-9838-11eb-ab90-d9ae814b240d.png)

预览



如果一个项目的`flex-grow`属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍



![img](https://static.vue-js.com/5b822b20-9838-11eb-ab90-d9ae814b240d.png)

弹性容器的宽度正好等于元素宽度总和，无多余宽度，此时无论`flex-grow`是什么值都不会生效

### flex-shrink

定义了项目的缩小比例（容器宽度<元素总宽度时如何收缩），默认为1，即如果空间不足，该项目将缩小

```
1.item {
2    flex-shrink: <number>; /* default 1 */
3}
```

如果所有项目的`flex-shrink`属性都为1，当空间不足时，都将等比例缩小

如果一个项目的`flex-shrink`属性为0，其他项目都为1，则空间不足时，前者不缩小



![img](https://static.vue-js.com/658c5be0-9838-11eb-85f6-6fac77c0c9b3.png)

预览



在容器宽度有剩余时，`flex-shrink`也是不会生效的

### flex-basis

设置的是元素在主轴上的初始尺寸，所谓的初始尺寸就是元素在`flex-grow`和`flex-shrink`生效前的尺寸

浏览器根据这个属性，计算主轴是否有多余空间，默认值为`auto`，即项目的本来大小，如设置了`width`则元素尺寸由`width/height`决定（主轴方向），没有设置则由内容决定

```
1.item {
2   flex-basis: <length> | auto; /* default auto */
3}
```

当设置为0的是，会根据内容撑开

它可以设为跟`width`或`height`属性一样的值（比如350px），则项目将占据固定空间

### flex

`flex`属性是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`，也是比较难懂的一个复合属性

```
1.item {
2  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
3}
```

一些属性有：

- flex: 1 = flex: 1 1 0%
- flex: 2 = flex: 2 1 0%
- flex: auto = flex: 1 1 auto
- flex: none = flex: 0 0 auto，常用于固定尺寸不伸缩

`flex:1` 和 `flex:auto` 的区别，可以归结于`flex-basis:0`和`flex-basis:auto`的区别

当设置为0时（绝对弹性元素），此时相当于告诉`flex-grow`和`flex-shrink`在伸缩的时候不需要考虑我的尺寸

当设置为`auto`时（相对弹性元素），此时则需要在伸缩时将元素尺寸纳入考虑

注意：建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值

### align-self

允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性

默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`

```
.item {
    align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

效果图如下：



![img](https://static.vue-js.com/6f8304a0-9838-11eb-85f6-6fac77c0c9b3.png)

预览