## 一、为什么选择Vue

(因为boss让的，简单容易上手，默默吐槽)

以下为Vue官网推荐理由

1. MVVM框架
2. 单页面应用：SPA
3. 轻量化、易学习
4. 渐进式，兼容性：Vue 的核心库只关注视图层，对其他的框架拥有最大程度的兼容性
5. 组件化
6. 虚拟DOM
7. 社区支持
8. 未来走向

------

## 二、Vue和jq的区别

Vue：MVVC，以数据驱动，操作数据更新DOM， jq操作DOM去组合业务逻辑。事件驱动

------

## 三、项目性能优化

代码编写阶段：

- `data`中不要写入太多数据
- `v-if`和`v-show`，选择合适的来使用
- `v-for`加`key`，使用事件委托/代理

组件

- `SPA`页面可以使用`keep-alive`缓存组件
- 路由懒加载，异步组件
- 防抖、节流

编译、打包

- UI按需导入
- 图片懒加载
- 代码压缩、图片压缩
- `splitChunks`抽离公共文件
- `cdn`加载第三方模块
- `Tree Shaking`

网络

- 开启`gzip`
- 使用缓存
- 服务端渲染

------

## 四、Vue没有完全遵循MVVM思想

严格的 MVVM 要求 View 不能和 Model 直接通信，而 Vue 提供了$refs 这个属性，让 Model 可以直接操作 View，违反了这一规定，所以说 Vue 没有完全遵循 MVVM。

------

## 五、vue 中使用了哪些设计模式

1. 工厂模式 - 传入参数即可创建实例

虚拟 DOM 根据参数的不同返回基础标签的 Vnode 和组件 Vnode

1. 单例模式 - 整个程序有且仅有一个实例

vuex 和 vue-router 的插件注册方法 install 判断如果系统存在实例就直接返回掉

1. 发布-订阅模式 (vue 事件机制)
2. 观察者模式 (响应式数据原理)
3. 装饰模式: (@装饰器的用法)
4. 策略模式 策略模式指对象有某个行为,但是在不同的场景中,该行为有不同的实现方案-比如选项的合并策略

------

## 六、Vue生命周期

### 1、生命周期

| 生命周期      | 描述                               |
| ------------- | ---------------------------------- |
| beforeCreate  | 组件实例被创建之初                 |
| created       | 组件实例已经完全创建               |
| beforeMount   | 组件挂载之前                       |
| mounted       | 组件挂载到实例上去之后             |
| beforeUpdate  | 组件数据发生变化，更新之前         |
| updated       | 组件数据更新之后                   |
| beforeDestroy | 组件实例销毁之前                   |
| destroyed     | 组件实例销毁之后                   |
| activated     | keep-alive 缓存的组件激活时        |
| deactivated   | keep-alive 缓存的组件停用时调用    |
| errorCaptured | 捕获一个来自子孙组件的错误时被调用 |

**beforeCreate

- 初始化`vue`实例，进行数据观测，此时组件的选项对象还未创建，**el 和 data 并未初始化**，因此无法访问methods， data， computed等上的方法和数据。

**created**

- 完成数据观测，属性与方法的运算，`watch`、`event`事件回调的配置，完成了`data` 数据的初始化
- 可调用`methods`中的方法，访问和修改data数据触发响应式渲染dom，可通过`computed`和`watch`完成数据计算
- 此时`vm.$el `并没有被创建

**created -> beforeMount**

- 判断是否存在`el`选项，若不存在则停止编译，直到调用`vm.$mount(el)`才会继续编译
- 优先级：`render `> `template `> `outerHTML`
- `vm.el`获取到的是挂载DOM的

**beforeMount**

- 在此阶段可获取到`vm.el`
- 此阶段`vm.$el`虽已完成DOM初始化，但并未挂载在el选项(html页面元素)上

**beforeMount -> mounted**

- 此阶段`vm.el`完成挂载，vm.$el生成的`DOM`替换了`el`选项所对应的`DOM`

**mounted**

- `vm.el`已完成DOM的挂载与渲染，此刻打印`vm.$el`，发现之前的挂载点及内容已被替换成新的`DOM`

**beforeUpdate**

- 更新的数据必须是被渲染在模板上的（`el`、`template`、`render`之一）
- 此时`view`层还未更新
- 若在`beforeUpdate`中再次修改数据，不会再次触发更新方法

**updated**

- 完成`view`层的更新
- 若在`updated`中再次修改数据，会再次触发更新方法（`beforeUpdate`、`updated`）
- 避免在此期间更改状态，因为这可能会导致更新无限循环

**beforeDestroy**

- 实例被销毁前调用，此时实例属性与方法仍可访问

**destroyed**

- 完全销毁一个实例。可清理它与其它实例的连接，解绑它的全部指令及事件监听器
- 并不能清除DOM，仅仅销毁实例

### 2、应用场景

| 生命周期      | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| beforeCreate  | 执行时组件实例还未创建，通常用于插件开发中执行一些初始化任务 |
| created       | 组件初始化完毕，各种数据可以使用，常用于异步数据获取         |
| beforeMount   | 未执行渲染、更新，dom未创建                                  |
| mounted       | 初始化结束，dom已创建，可用于获取访问数据和dom元素           |
| beforeUpdate  | 更新前，可用于获取更新前各种状态                             |
| updated       | 更新后，所有状态已是最新                                     |
| beforeDestroy | 销毁前，可用于一些定时器或订阅的取消                         |
| destroyed     | 组件已销毁，作用同上                                         |

### 3、父子组件生命周期执行顺序

**初始化：**

![挂载阶段](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f586b0bd5079433492263bd0fba56bfc~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

原理：子组件作为父组件的DOM子节点，父组件实例化完成后要挂载这个父组件，调用父组件的render方法方向有子组件，则去 创建渲染子组件并缓存（因为可能有多层），子组件都完成完成父组件的挂载 子组件挂载完成后，父组件还未

**更新** 同理：先完成子组件的更新，再完成父组件

> 父beforeUpdate -> 子beforeUpdate -> 子updated -> 父updated

**销毁**

> 父beforeDestroy -> 子beforeDestroy -> 子destroyed -> 父destroyed

------

## 七、Vue的CSS隔离

使用：在`<style> `标签加上`scoped`就可以实现样式隔离，只会作用在当前组件

原理：`chrome`上观察可以看见，后面多了个属性类似：`[data-v-02asd93]`，后面的一串字符是`hash`值，作为唯一标识

实现：处理vue文件同时需要`vue-loader`和`VueLoaderPlugin`插件，缺一不可，通过`hash-sum`模块计算出源文件对应的唯一的`cacheKey`

```js
// sub-vue\node_modules\vue-loader\lib\index.js
  const id = hash(
    isProduction
      ? (shortFilePath + '\n' + source.replace(/\r\n/g, '\n'))
      : shortFilePath
  )
```

`_scpoedId`是在`style-post-loader`处理时加上的

`postcss`跟babel有点类似，它可以处理一些css语法，如变量，自动加上浏览器前缀之类。它也是可以把css解析为`css-ast`，然后通过插件机制对不同的节点类型进行编辑，通过`generate`重新生成新的css。而vue则通过自定义一个`postcss-plugin`来给css加上`_scopedId`和实现`/deep/`能力

> 这里只是简单了解了一下，实际上这个流程是与webpack非常相关的，应该要去深入了解下源码和流程

------

## 八、Vue的常用修饰符

1. **表单修饰符**

- `lazy`：光标离开标签的时候，才会将值赋予给value，也就是在change事件之后再进行信息同步
- `trim`：去除首空格
- `number`：转数字

1. **事件修饰符**

- `stop`：阻止冒泡，相当于调用了`event.stopPropagation`方法
- `prevent`：阻止默认行为
- `capture`：事件捕获，使事件触发从包含这个元素的顶层开始往下触发
- `once`：绑定了事件以后只能触发一次，第二次就不会触发
- `self`：只当在 event.target 是当前元素自身时触发处理函数
- `passive`：在移动端，当我们在监听元素滚动事件的时候，会一直触发onscroll事件会让我们的网页变卡，因此我们使用这个修饰符的时候，相当于给onscroll事件整了一个.lazy修饰符
- `native`：让组件变成像html内置标签那样监听根元素的原生事件，否则组件上使用 v-on 只会监听自定义事件

1. **鼠标、键盘修饰符**

- `left、right、middle`：鼠标左、右、中键点击
- (`keycode`)：对应键盘码

1. **v-bind修饰符**

- `sync`：对`props`进行一个双向绑定
  - 使用`sync`的时候，子组件传递的事件名格式必须为`update:value`，其中`value`必须与子组件中`props`中声明的名称完全一致
  - 注意带有`.sync `修饰符的 v-bind 不能和表达式一起使用
  - 将` v-bind.sync` 用在一个字面量的对象上，例如 `v-bind.sync="{ title: doc.title }"`，是无法正常工作的
- `prop`：设置自定义标签属性，避免暴露数据，防止污染HTML结构
- `camel`：将命名变为驼峰命名法，如将view-Box属性名转换为 viewBox

------

## 九、v-for中key的作用

当 Vue.js 用 `v-for` 正在更新已渲染过的元素列表时，它默认用“**就地复用**”策略。

如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序， 而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素，最小化element的移动，尝试尽最大程度在同适当的地方对相同类型的`element`，做`patch`或者`reuse`。

如果使用了`key`，Vue会根据keys的顺序记录`element`，曾经拥有了key的element如果不再出现的话，会被直接`remove`或者`destoryed`

即:

1. key的作用主要是为了更高效的对比虚拟DOM中每个节点是否是相同节点;
2. vue的在`patch`过程中两个节点是否是相同节点，`key`是一个必要条件，如果不加上key，会认为是相同节点，重复更新，浪费资源

> 从源码中可以知道，**Vue判断两个节点是否相同时主要判断两者的key和元素类型等**，因此如果不设置key,它的值就是undefined，则可能永 远认为这是两个相同的节点，只能去做更新操作，这造成了大量的dom更新操作，明显是不可取的。

------

## 十、new Vue后的流程

- 组件关系
  - `initProxy`：作用域代理，拦截组件内访问其它组件的数据。
  - `initLifecycle`：建立父子组件关系，在当前组件实例上添加一些属性和生命周期标识。如`[Math Processing Error]parent,parent,refs,$children,_isMounted`等。
- 组件实例
  - `initEvents`：对父组件传入的事件添加监听，事件是谁创建谁监听，子组件创建事件子组件监听
  - `initRender`：声明`[Math Processing Error]slots`和`slots`和`createElement()`等。
- 数据初始化
  - `initInjections`：注入数据，初始化inject，一般用于组件更深层次之间的通信。
  - `initState`：重要）数据响应式：初始化状态。很多选项初始化的汇总：`data,methods,props,computed`和`watch`。
  - `initProvide`：提供数据注入。

> 思考：为什么先注入再提供呢？
>
> 1. 首先来自祖辈的数据要和当前实例的data,等判重，相结合，所以注入数据的`initInjections`一定要在`InitState`的上面。
> 2. 从上面注入进来的东西在当前组件中转了一下又提供给后代了，所以注入数据也一定要在上面。

**源码：**

```js
Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++
    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    // 合并属性，判断初始化的是否是组件，这里合并主要是 mixins 或 extends 的方法
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else { // 合并vue属性
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      // 初始化proxy拦截器
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    // 初始化组件生命周期标志位
    initLifecycle(vm)
    // 初始化组件事件侦听
    initEvents(vm)
    // 初始化渲染方法
    initRender(vm)
    callHook(vm, 'beforeCreate')
    // 初始化依赖注入内容，在初始化data、props之前
    initInjections(vm) // resolve injections before data/props
    // 初始化props/data/method/watch/methods
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }
    // 挂载元素
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
```

------

## 十一、Keep-alive的实现原理

**原理：**

Vue.js内部将DOM节点抽象成了一个个的`VNode`节点，`keep-alive`组件的缓存也是基于`VNode`节点的而不是直接存储`DOM`结构。它将满足条件（`pruneCache与pruneCache`）的组件在`cache`对象中缓存起来，在需要重新渲染的时候再将`vnode`节点从`cache`对象中取出并渲染。

- 常用的两个属性 `include/exclude`，允许组件有条件的进行缓存。
- 两个生命周期 `activated/deactivated`，用来得知当前组件是否处于活跃状态。
- `keep-alive`的中还**运用了 LRU(最近最少使用) 算法**，选择最近最久未使用的组件予以淘汰

------

## 十二、Vue自定义指令

指令本质上是装饰器，是 `vue `对 `HTML `元素的扩展，给 `HTML`元素增加自定义功能。vue 编译 `DOM`时，会找到指令对象，执行指令的相关方法。

### 1、实现

- 全局注册

  主要是通过`Vue.directive方`法进行注册 `Vue.directive`第一个参数是指令的名字（不需要写上v-前缀），第二个参数可以是对象数据，也可以是一个指令函数

```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()  // 页面加载完成之后自动让输入框获取到焦点的小功能
  }
})
```

- 局部注册

  局部注册通过在组件`options`选项中设置`directive`属性

```js
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus() // 页面加载完成之后自动让输入框获取到焦点的小功能
    }
  }
}
```

### 2、说明

自定义指令也像组件那样存在钩子函数：

- `bind`：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置
- `inserted`：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
- `update`：所在组件的 `VNode `更新时调用，但是可能发生在其子 `VNode `更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新
- `componentUpdated`：指令所在组件的 `VNode `及其子 `VNode `全部更新后调用
- `unbind`：只调用一次，指令与元素解绑时调用

所有的钩子函数的参数都有以下：

- `el`：指令所绑定的元素，可以用来直接操作 `DOM`
- `binding`：一个对象，包含以下 `property`：
  - `name`：指令名，不包括 `v- `前缀。
  - `value`：指令的绑定值，例如：`v-my-directive="1 + 1" `中，绑定值为 2。
  - `oldValue`：指令绑定的前一个值，仅在 `update `和 `componentUpdated `钩子中可用。无论值是否改变都可用。
  - `expression`：字符串形式的指令表达式。例如 `v-my-directive="1 + 1" `中，表达式为` "1 + 1"`。
  - `arg`：传给指令的参数，可选。例如` v-my-directive:foo` 中，参数为 `"foo"`。
  - `modifiers`：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为` { foo: true, bar: true }`
- `vnode`：`Vue` 编译生成的虚拟节点
- `oldVnode`：上一个虚拟节点，仅在 `update `和 `componentUpdated `钩子中可用

> 除了 el 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 `dataset `来进行

### 3、使用

```js
//会实例化一个指令，但这个指令没有参数 
`v-xxx`

// -- 将值传到指令中
`v-xxx="value"`  

// -- 将字符串传入到指令中，如`v-html="'<p>内容</p>'"`
`v-xxx="'string'"` 

// -- 传参数（`arg`），如`v-bind:class="className"`
`v-xxx:arg="value"` 

// -- 使用修饰符（`modifier`）
`v-xxx:arg.modifier="value"` 
```

### 4、原理

1. 在生成 `ast `语法树时，遇到指令会给当前元素添加 `directives `属性
2. 通过 `genDirectives `生成指令代码
3. 在 `patch`前将指令的钩子提取到 `cbs `中,在 `patch`过程中调用对应的钩子
4. 当执行指令对应钩子函数时，调用对应指令定义的方法

------

## 十三、Proxy 与 Object.defineProperty 对比

1. `Object.definedProperty`的作用是劫持一个对象的属性，劫持属性的`getter`和`setter`方法，在对象的属性发生变化时进行特定的操作。而 `Proxy`劫持的是整个对象。
2. `Proxy`会返回一个代理对象，我们只需要操作新对象即可，而`Object.defineProperty`只能遍历对象属性直接修改。
3. `Object.definedProperty`不支持数组，更准确的说是不支持数组的各种`API`，因为如果仅仅考虑`arry[i] = value` 这种情况，是可以劫持的，但是这种劫持意义不大。而`Proxy`可以支持数组的各种API。
4. 尽管`Object.defineProperty`有诸多缺陷，但是其**兼容性**要好于`Proxy`。

------

## 十四、虚拟DOM和diff算法

### 1、虚拟DOM：

用JS去按照DOM结构来实现的树形结构对象，也可以叫做DOM对象，`Virtual DOM` 本质就是用一个原生的 JS 对象去描述一个 DOM 节点，是对真实 DOM 的一层抽象。

优点：

1. 保证性能下限
2. 无需手动操作DOM
3. 跨平台

缺点：

1. 无法进行极致优化
2. 首次渲染会慢一点

**Vue虚拟节点：**

```js
// body下的 <div id="v" class="classA"><div> 对应的 oldVnode 就是

{
  el:  div  //对真实的节点的引用，本例中就是document.querySelector('#id.classA')
  tagName: 'DIV',   //节点的标签
  sel: 'div#v.classA'  //节点的选择器
  data: null,       // 一个存储节点属性的对象，对应节点的el[prop]属性，例如onclick , style
  children: [], //存储子节点的数组，每个子节点也是vnode结构
  text: null,    //如果是文本节点，对应文本节点的textContent，否则为null
}
```

### 2、diff算法：

1. 用JS对象模拟DOM（虚拟DOM）
2. 把此虚拟DOM转成真实DOM并插入页面中（render）
3. 如果有事件发生修改了虚拟DOM，比较两棵虚拟DOM树的差异，得到差异对象（diff）
4. 把差异对象应用到真正的DOM树上（patch）、

**解释说明：**

在js中,渲染真实DOM的开销是非常大的, 比如我们修改了某个数据,如果直接渲染到真实DOM, 会引起整个dom树的重绘和重排。那么有没有可能实现只更新我们修改的那一小块dom而不要更新整个dom呢？

此时我们就需要先根据真实dom生成虚拟dom， 当虚拟dom某个节点的数据改变后会生成有一个新的Vnode, 然后新的Vnode和旧的Vnode作比较，发现有不一样的地方就直接修改在真实DOM上，然后使旧的Vnode的值为新的Vnode。

**两个特点**：

**深度优先，同层比较，** 即：

- 比较只会在同层级进行, 不会跨层级比较
- 在diff比较的过程中，循环从两边向中间比较

**细节概述**：

`diff`的过程就是调用`patch`函数，比较新旧节点，一边比较一边给真实的DOM打补丁。在采取diff算法比较新旧节点的时候，比较只会在同层级进行。

首先在patch方法中，首先进行树级别的比较

- new Vnode不存在就删除 old Vnode
- old Vnode 不存在就增加新的Vnode

都存在就执行diff更新

当确定需要执行diff算法时，比较两个Vnode，包括三种类型操作：

**属性更新**，**文本更新**，**子节点更新**

具体：

- 新老节点均有子节点，则对子节点进行diff操作，调用`updatechidren`
- 老节点没有子节点而新节点有子节点，先清空老节点的文本内容，然后为其新增子节点
- 新节点没有子节点，而老节点有子节点的时候，则移除该节点的所有子节点
- 新老节点都没有子节点的时候，进行文本的替换

**函数说明：**

```
patch
```

diff时调用patch函数，patch接收两个参数vnode，oldVnode，分别代表新旧节点

patch函数内第一个if判断`sameVnode(oldVnode, vnode)`就是判断这两个节点是否为同一类型节点

```
patchVnode
```

对于同类型节点调用`patchVnode(oldVnode, vnode)`进一步比较:

```
updateChildren
```

将Vnode的子节点Vch和oldVnode的子节点oldCh提取出来。

oldCh和vCh各有两个头尾的变量StartIdx和EndIdx，它们的2个变量相互比较，一共有4种比较方式。如果4种比较都没匹配，如果设置了key，就会用key进行比较，在比较的过程中，变量会往中间靠，一旦StartIdx>EndIdx表明oldCh和vCh至少有一个已经遍历完了，就会结束比较。

**一图总结**

![diff算法](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/602dbdc1508742f8bc751ce8ab3423b4~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

------

## 十五、Vue做权限管理

1. **接口权限**：使用`jwt`，登录完拿到`token`，将`token`存起来，通过`axios`请求拦截器进行拦截，每次请求的时候头部携带`token`

2. **路由权限**

   a.  初始化全部路由，并标记权限信息，跳转由路由守卫进行校验

   b.  初始化挂载不需要权限的路由，登录后，获取用户权限信息，筛选有权限访问的路由，在全局路由守卫里进行调用`addRoutes`添加路由

3. **菜单权限**：页面与路由解耦

   a.  菜单与路由分离，菜单由后端返回

   b.  菜单和路由都由后端返回

4. **按钮权限**

   a.  `v-if`

   b.  自定义指令

------

## 十六、Vue2.0 响应式数据的原理

**官网：**

当你把一个普通的 JavaScript 对象传入 Vue 实例作为 `data`选项，Vue 将遍历此对象所有的 `property`，并使用 `Object.defineProperty` 把这些 `property `全部转为 `getter/setter`。`Object.defineProperty `是 ES5 中一个无法 shim 的特性，这也就是 Vue 不支持 IE8 以及更低版本浏览器的原因。

这些 `getter/setter` 对用户来说是不可见的，但是**在内部它们让 Vue 能够追踪依赖**，在 `property `被访问和修改时通知变更。这里需要注意的是不同浏览器在控制台打印数据对象时对` getter/setter `的格式化并不同，所以建议安装 vue-devtools 来获取对检查数据更加友好的 用户界面。

**每个组件实例都对应一个** `watcher`**实例**，它会在**组件渲染的过程中把“接触”过的数据** `property `**记录为依赖**。之后当依赖项的 `setter`触发时，会通知 `watcher`，从而使它关联的组件重新渲染。

![vue2响应式](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f09ecad0b484de285f7a40b983e3f8b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

> 整体思路是**数据劫持**+**发布订阅模式**

对象内部通过 `defineReactive `方法，使用 `Object.defineProperty`将属性进行劫持（只会劫持已经存在的属性），

数组则是通过**重写数组方法**来实现。当页面使用对应属性时，每个属性都拥有自己的 `dep`属性，存放他所依赖的 `watcher`（依赖收集），当属性变化后会通知自己对应的 watcher 去更新(派发更新)。

相关代码：

```js
class Observer {
  // 观测值
  constructor(value) {
    this.walk(value);
  }
  walk(data) {
    // 对象上的所有属性依次进行观测
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = data[key];
      defineReactive(data, key, value);
    }
  }
}
// Object.defineProperty数据劫持核心 兼容性在ie9以及以上
function defineReactive(data, key, value) {
  observe(value); // 递归关键
  // --如果value还是一个对象会继续走一遍odefineReactive 层层遍历一直到value不是对象才停止
  //   思考？如果Vue数据嵌套层级过深 >>性能会受影响
  Object.defineProperty(data, key, {
    get() {
      console.log("获取值");

      //需要做依赖收集过程 这里代码没写出来
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      console.log("设置值");
      //需要做派发更新过程 这里代码没写出来
      value = newValue;
    },
  });
}
export function observe(value) {
  // 如果传过来的是对象或者数组 进行属性劫持
  if (
    Object.prototype.toString.call(value) === "[object Object]" ||
    Array.isArray(value)
  ) {
    return new Observer(value);
  }
}
```

------

## 十七、Vue监测数组

数组考虑性能原因没有用 `defineProperty `对数组的每一项进行拦截，而是选择对 7 种数组（`push,shift,pop,splice,unshift,sort,reverse`）方法进行重写(**AOP 切片思想**)

所以在 Vue 中修改数组的索引和长度是无法监控到的。需要通过以上 7 种变异方法修改数组才会触发数组对应的 `watcher` 进行更新

实际上调用 `$set` 修改数组，内部也是用的`splice`方法

> 扩展：Vue为什么没有劫持数组所有内容（下标）

1. 数组对象的 `length` 属性c`onfigurable`为false

   无法通过`Object.defineProperty()`方法劫持 length 属性的读取和设置方法。

2. 实现复杂 比较对象的属性，数组下标变化地相对频繁，并且改变数组长度的方法也比较灵活，一旦数组的长度发生变化，那么在无法自动感知的情况下，开发者只能手动更新新增的数组下标，这可是一个很繁琐的工作。

3. 性能负担

`Object.defineProperty()` 方法存在以下缺陷：

每次只能设置一个具体的属性，导致需要遍历对象来设置属性，同时也导致了无法探测新增属性；

属性描述符 `configurable` 对其的影响是致命的。

------

## 十八、vue-router路由钩子，执行顺序

钩子函数种类有:**全局守卫**、**路由守卫**、**组件守卫**

**完整导航解析流程**：

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave `守卫。
3. 调用全局的 `beforeEach `守卫。
4. 在重用的组件里调用 `beforeRouteUpdate `守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve `守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach `钩子。
11. 触发 `DOM `更新。
12. 调用 `beforeRouteEnter `守卫中传给 `next `的回调函数，创建好的组件实例会作为回调函数的参数传入

------

## 十七、Vue-rouer路由模式和实现原理

### 1、hash 模式

1. `location.hash `的值实际就是 URL 中#后面的东西 它的特点在于：hash 虽然出现 URL 中，但不会被包含在 HTTP 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面。
2. 可以为 hash 的改变添加监听事件

```
window.addEventListener("hashchange", funcRef, false);
```

每一次改变 hash`（window.location.hash）`，都会在浏览器的访问历史中增加一个记录，利用 `hash`的以上特点，就可以来实现前端路由“更新视图但不重新请求页面”的功能了

对于`hash`模式会创建`hashHistory`对象,在访问不同的路由的时候,会发生两件事:

- `HashHistory.push()`将新的路由添加到浏览器访问的历史的栈顶,
- `HasHistory.replace()`替换到当前栈顶的路由

特点：兼容性好但是不美观， SEO不好

### 2、history 模式

`location.pathname`, k可以用`onpopState`监听

利用了 `HTML5 History Interface `中新增的 `pushState()` 和` replaceState()` 方法结合`window.popstate`事件（监听浏览器前进后退）。

`pushState()`可以改变url地址且不会发送请求,`replaceState()`可以读取历史记录栈,还可以对浏览器记录进行修改

```
window.history.pushState(null, null, path);
window.history.replaceState(null, null, path);
```

这两个方法应用于浏览器的历史记录站，在当前已有的 `back`、`forward`、`go` 的基础之上，它们提供了对历史记录进行修改的功能。这两个方法有个共同的特点：**当调用他们修改浏览器历史记录栈后，虽然当前 URL 改变了，但浏览器不会刷新页面**，这就为单页应用前端路由“更新视图但不重新请求页面”提供了基础。

特点：虽然美观，但是刷新会出现 404 需要后端进行配置

> 我们可以使用 `popstate` 事件来监听 url 的变化，从而对页面进行跳转（渲染）；
>
> `history.pushState()` 或 `history.replaceState()` 不会触发 `popstate` 事件，这时我们需要手动触发页面跳转（渲染）。

#### 区别

1. `hash`模式较丑，history模式较优雅
2. `pushState`设置的新URL可以是与当前URL同源的任意URL；而`hash`只可修改#后面的部分，故只可设置与当前同文档的URL
3. `pushState`设置的新URL可以与当前URL一模一样，这样也会把记录添加到栈中；而hash设置的新值必须与原来不一样才会触发记录添加到栈中
4. `pushState`通过`stateObject`可以添加任意类型的数据到记录中；而hash只可添加短字符串
5. `pushState`可额外设置title属性供后续使用
6. `hash`兼容IE8以上，history兼容IE10以上
7. `history`模式需要后端配合将所有访问都指向index.html，否则用户刷新页面，会导致404错误

### 3、实现

```js
<script>
        // hash路由原理***************************
        // 监听hashchange方法
        window.addEventListener('hashchange',()=>{
            div.innerHTML = location.hash.slice(1)
        })
        // history路由原理************************
        // 利用html5的history的pushState方法结合window.popstate事件（监听浏览器前进后退）
        function routerChange (pathname){
            history.pushState(null,null,pathname)
            div.innerHTML = location.pathname
        }
        window.addEventListener('popstate',()=>{
            div.innerHTML = location.pathname
        })
</script>
```

------

## 十八、Vuex

`vuex` 是专门为 vue 提供的全局状态管理系统，用于多个组件中数据共享、数据缓存等。（无法持久化、**内部核心原理是通过创造一个全局实例 new Vue**）

**Vuex是通过全局注入store对象，来实现组件间的状态共享。**

设计思想：将数据存放到全局的`store`，再将`store`挂载到每个`vue`实例组件中，利用`Vue.js`的细粒度数据响应机制来进行高效的状态更新。

### 1、vuex的store是如何挂载注入到组件中呢？

1. 使用`Vue.use(vuex)`时，会调用vuex的install方法，装载vuex

```js
export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}
```

1. `applyMixin`方法使用vue混入机制，vue的生命周期`beforeCreate`钩子函数前混入`vuexInit`方法，

```js
Vue.mixin({ beforeCreate: vuexInit });
 
function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
}
```

这样分析源码，我们知道了`vuex`是利用vue的`mixin`混入机制，在`beforeCreate`钩子前混入`vuexInit`方法，`vuexInit`方法实现了`store`注入`vue`组件实例，并注册了`vuex store`的引用属性`$store`。`store`注入过程如下图所示：

![store注入](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4b6fc15dcb942e8b0e50bedee84e92a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

\

### 2、vuex的state和getters是如何映射到各个组件实例中响应式更新状态呢？

```
store`实现的源码在`src/store.js
```

1. 在源码中找到resetStoreVM核心方法，

Vuex的`state`状态是响应式，是**借助vue的data是响应式**，**将state存入vue实例组件的data中**；**Vuex的getters则是借助vue的计算属性computed**实现数据实时监听。

1. `computed`计算属性监听`data`数据变更主要经历以下几个过程：

![computed](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9238cecff3c48e2a006ab876d29e60a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

------

## 十九、Vue.mixin 的使用场景和原理

在日常的开发中，我们经常会遇到在不同的组件中经常会需要用到一些相同或者相似的代码，这些代码的功能相对独立，可以通过 Vue 的 mixin 功能**抽离公共的业务逻辑**，**原理类似“对象的继承”** ，当组件初始化时会调用 `mergeOptions `方法进行合并，采用策略模式针对不同的属性进行合并。当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”。

------

## 二十、Vue.set 方法原理

了解 Vue 响应式原理的同学都知道在两种情况下修改数据 Vue 是不会触发视图更新的

1. 在实例创建之后添加新的属性到实例上（给响应式对象新增属性）
2. 直接更改数组下标来修改数组的值

**Vue.set 或者说是$set 原理如下**

因为响应式数据 我们给对象和数组本身都增加了`__ob__`属性，代表的是 `Observer`实例。当给对象新增不存在的属性 首先会把**新的属性进行响应式跟踪** **然后会触发对象__ob__的 dep 收集到的 watcher 去更新**，**当修改数组索引时我们调用数组本身的 splice 方法去更新数组**

------

## 二十一、Vue.extend 作用和原理

官方解释：Vue.extend 使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。

其实就是一个子类构造器, 是 Vue 组件的核心 api 实现思路就是使用原型继承的方法返回了 Vue 的子类 并且利用 `mergeOptions `把传入组件的 `options `和父类的 `options`进行了合并

```js
export default function initExtend(Vue) {
  let cid = 0; //组件的唯一标识
  // 创建子类继承Vue父类 便于属性扩展
  Vue.extend = function (extendOptions) {
    // 创建子类的构造函数 并且调用初始化方法
    const Sub = function VueComponent(options) {
      this._init(options); //调用Vue初始化方法
    };
    Sub.cid = cid++;
    Sub.prototype = Object.create(this.prototype); // 子类原型指向父类
    Sub.prototype.constructor = Sub; //constructor指向自己
    Sub.options = mergeOptions(this.options, extendOptions); //合并自己的options和父类的options
    return Sub;
  };
}
```

------

## 二十二、Vue 模板编译原理

Vue 的编译过程就是将 `template` 转化为 `render` 函数的过程 分为以下三步

第一步是将 模板字符串 转换成` element ASTs`（解析器）

第二步是对 AST 进行静态节点标记，主要用来做虚拟DOM的渲染优化（优化器）

第三步是 使用 `element ASTs` 生成 render 函数代码字符串（代码生成器）

```js
export function compileToFunctions(template) {
  // 我们需要把html字符串变成render函数
  // 1.把html代码转成ast语法树  ast用来描述代码本身形成树结构 不仅可以描述html 也能描述css以及js语法
  // 很多库都运用到了ast 比如 webpack babel eslint等等
  let ast = parse(template);
  // 2.优化静态节点
  // 这个有兴趣的可以去看源码  不影响核心功能就不实现了
  //   if (options.optimize !== false) {
  //     optimize(ast, options);
  //   }

  // 3.通过ast 重新生成代码
  // 我们最后生成的代码需要和render函数一样
  // 类似_c('div',{id:"app"},_c('div',undefined,_v("hello"+_s(name)),_c('span',undefined,_v("world"))))
  // _c代表创建元素 _v代表创建文本 _s代表文Json.stringify--把对象解析成文本
  let code = generate(ast);
  //   使用with语法改变作用域为this  之后调用render函数可以使用call改变this 方便code里面的变量取值
  let renderFn = new Function(`with(this){return ${code}}`);
  return renderFn;
}
```

------

## 二十三、生命周期钩子是如何实现的

Vue 的生命周期钩子核心实现是利用**发布订阅模式**先把用户传入的的生命周期钩子订阅好（内部采用数组的方式存储）然后在创建组件实例的过程中会依次执行对应的钩子方法（发布）

```js
export function callHook(vm, hook) {
  // 依次执行生命周期对应的方法
  const handlers = vm.$options[hook];
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm); //生命周期里面的this指向当前实例
    }
  }
}

// 调用的时候
Vue.prototype._init = function (options) {
  const vm = this;
  vm.$options = mergeOptions(vm.constructor.options, options);
  callHook(vm, "beforeCreate"); //初始化数据之前
  // 初始化状态
  initState(vm);
  callHook(vm, "created"); //初始化数据之后
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
};
```

------

## 二十四、函数式组件使用场景和原理

函数式组件与普通组件的区别

1. 函数式组件需要在声明组件是指定 `functional:true`
2. 不需要实例化，所以没有`this`,`this`通过`rende`r函数的第二个参数`context`来代替
3. 没有生命周期钩子函数，不能使用计算属性，`watch`
4. 不能通过`$emit `对外暴露事件，调用事件只能通过`context.listeners`.`click`的方式调用外部传入的事件
5. 因为函数式组件是没有实例化的，所以在外部通过`ref`去引用组件时，实际引用的是`HTMLElement`
6. 函数式组件的`props`可以不用显示声明，所以没有在`props`里面声明的属性都会被自动隐式解析为prop,而普通组件所有未声明的属性都解析到$attrs里面，并自动挂载到组件根元素上面(可以通过`inheritAttrs`属性禁止)

优点

1.由于函数式组件不需要实例化，无状态，没有生命周期，所以渲染性能要好于普通组件

2.函数式组件结构比较简单，代码结构更清晰

**使用场景**：

一个简单的展示组件，作为容器组件使用 比如 router-view 就是一个函数式组件

“高阶组件”——用于接收一个组件作为参数，返回一个被包装过的组件

相关代码：

```js
if (isTrue(Ctor.options.functional)) {
  // 带有functional的属性的就是函数式组件
  return createFunctionalComponent(Ctor, propsData, data, context, children);
}
const listeners = data.on;
data.on = data.nativeOn;
installComponentHooks(data); // 安装组件相关钩子 （函数式组件没有调用此方法，从而性能高于普通组件）
```

## 二十五、虚拟DOM底层

Vue2的路径：[template-explorer.vuejs.org/#](https://link.juejin.cn?target=https%3A%2F%2Ftemplate-explorer.vuejs.org%2F%23eyJzcmMiOiI8ZGl2PkhlbGxvIFdvcmxkPC9kaXY%2BIiwib3B0aW9ucyI6e319)

Vue3的路径：[vue-next-template-explorer.netlify.app/#](https://link.juejin.cn?target=https%3A%2F%2Fvue-next-template-explorer.netlify.app%2F%23eyJzcmMiOiI8ZGl2PkhlbGxvIFdvcmxkITwvZGl2PiIsIm9wdGlvbnMiOnsib3B0aW1pemVJbXBvcnRzIjpmYWxzZX19)

### 1、基础原理

[Vue核心之虚拟DOM](https://juejin.cn/post/6844903895467032589)

1. 用`js`对象模拟`DOM`

   参考`element.js`代码

```js
/**
 * Element virdual-dom 对象定义
 * @param {String} tagName - dom 元素名称
 * @param {Object} props - dom 属性
 * @param {Array<Element|String>} - 子节点
 */
function Element(tagName, props, children) {
    this.tagName = tagName
    this.props = props
    this.children = children
    // dom 元素的 key 值，用作唯一标识符
    if(props.key){
       this.key = props.key
    }
    var count = 0
    children.forEach(function (child, i) {
        if (child instanceof Element) {
            count += child.count
        } else {
            children[i] = '' + child
        }
        count++
    })
    // 子元素个数
    this.count = count
}

function createElement(tagName, props, children){
 return new Element(tagName, props, children);
}

module.exports = createElement;
```

1. 渲染用 JS 表示的 DOM 对象

   `render`函数根据 tagName 构建一个真正的 DOM 节点，然后设置这个节点的属性，最后递归地把自己的子节点也构建起来。

   将构建好的 DOM 结构添加到页面 `body`：类似使用`document.body.appendChild(ulRoot);`

```js
/**
 * render 将virdual-dom 对象渲染为实际 DOM 元素
 */
Element.prototype.render = function () {
    var el = document.createElement(this.tagName)
    var props = this.props
    // 设置节点的DOM属性
    for (var propName in props) {
        var propValue = props[propName]
        el.setAttribute(propName, propValue)
    }

    var children = this.children || []
    children.forEach(function (child) {
        var childEl = (child instanceof Element)
            ? child.render() // 如果子节点也是虚拟DOM，递归构建DOM节点
            : document.createTextNode(child) // 如果字符串，只构建文本节点
        el.appendChild(childEl)
    })
    return el
} 
```

1. `diff`算法

   **深度优先遍历**

### 4、Vue3重写Vdom

1. `patch flag` **优化静态树**

   可以发现创建动态 dom 元素的时候，Vdom 除了模拟出来了它的基本信息之外，还给它加了一个标记： `1 /* TEXT */`

   这个标记就叫做 `patch flag`（补丁标记）

   当`diff`算法走到 `_createBlock `函数的时，**会忽略所有的静态节点，只对有标记的动态节点进行对比**

2. **patch flag 优化静态属性**

   Vue3 在 `Vdom `的更新时，**只会关注它有变化的部分**。这样的优化使 Vue3 既跳出了 Vdom 的性能瓶颈，又依然保留了可以手写` render function `的灵活性。相当于 Vue3 既有 react 的灵活性，又有基于模板的性能保证。

3. **静态树的提升** 和 **静态属性的提升**

   所有的静态元素都被放在了 `_createBlock` 函数之外了，也就是说他们只会在页面初始的时候被渲染一次，而在更新的时候，静态元素是不予搭理的

4. **事件缓存**

   默认情况下事件被认为是动态变量，所以每次更新视图的时候都会追踪它的变化。但是正常情况下，我们的 @click 事件在视图渲染前和渲染后，都是同一个事件，基本上不需要去追踪它的变化，所以 Vue 3.0 对此作出了相应的优化叫事件监听缓存

```js
<div id="app">
    <p @click="handleClick">前端好好玩</p>
</div>


// 编译后
import { 
  createVNode as _createVNode, 
  openBlock as _openBlock, 
  createBlock as _createBlock 
} from "vue"

const _hoisted_1 = { id: "app" }

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createBlock("div", _hoisted_1, [
    _createVNode("p", {
      onClick: _cache[1] || 
      (_cache[1] = (...args) => (_ctx.handleClick && _ctx.handleClick(...args)))
    }, "前端好好玩")
  ]))
}
// 可以看到onClick有一个_cache判断缓存赋值的操作，从而变成静态节点
```


作者：GhostFJ
链接：https://juejin.cn/post/7088305435370848263
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。