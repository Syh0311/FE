## 深拷贝时数据分类

object 的属性名【键】有两种类型：
一. 字符串类型
二. Symbol 类型 【独一无二】 Symbol(obj)调用 obj.toString()

object【属性名-键】对应的值【或者说 obj 本身，因为要递归】情况分为

1. 基本数据类型

   ```
   - null undefined number bignit string symbol boolean
   ```
   
1. 基本数据类型的包装类型与【Error RegExp Date】

   ```
   - 共六种 -- return new obj.constructor(obj);
   - Number String Boolean
   - new Number(1)      Object(1);
   - new String('syh')  Object('syh')
   - new Boolean(true)  Object(true)
   ```

2. WeakMap WeakSet

   ```
   - 无法遍历 无法复制 直接返回
   ```

3. Map Set

   ```
   - 作为object 需要对其进行【循环引用检查】
   - cloneObj = new Set()/Map(); 后马上加到【checkMap内】
   - forEach时将其【value,?key】赋值给 cloneObj
   ```

4. 普通的 Array Object

   ```
   - 1. 以Symbol()作为键的情况 【Reflex.ownKeys】
   - 2. 循环引用检查
   ```

6. 奇特的【'object'】  Promise实例

   ```
   - new Promise()
   - Promise.resolve()
   - Promise 实例的拷贝比较简单，因为它存储的事当前的状态，如果在 then 方法中不对当前状态做任何处理，那么它会返回一个保存当前状态的新的实例对象。所以拷贝 Promise ，调用它的 then 方法，然后什么也不做就行了。
   ```

7. 函数类型

   ```
   - new Function(`return ${obj.toString()}`)();
   - eval(`(${fn.toString()})`); //需要加括号
   - 涉及到curry化，this，闭包等问题，无法克隆相等价值的函数
   ```

6. 奇特的 Object(Symbol('syh')) 平时应该用不到

   ```
   - Object(Symbol('syh')).constructor===Symbol
   - return Object(Symbol(obj.description))
   ```

## 为什么 WeakMap

为什么要这样做呢？，先来看看`WeakMap`的作用：

> WeakMap 对象是一组键/值对的集合，其中的键是弱引用的。其键必须是对象，而值可以是任意的。

什么是弱引用呢？

> 在计算机程序设计中，弱引用与强引用相对，是指不能确保其引用的对象不会被垃圾回收器回收的引用。 一个对象若只被弱引用所引用，则被认为是不可访问（或弱可访问）的，并因此可能在任何时刻被回收。

我们默认创建一个对象：`const obj = {}`，就默认创建了一个强引用的对象，我们只有手动将`obj = null`，它才会被垃圾回收机制进行回收，如果是弱引用对象，垃圾回收机制会自动帮我们回收。

举个例子：

如果我们使用`Map`的话，那么对象间是存在强引用关系的：

```js
let obj = { name: "ConardLi" };
const target = new Map();
target.set(obj, "code秘密花园");
obj = null;
```

虽然我们手动将`obj`，进行释放，然是`target`依然对`obj`存在强引用关系，所以这部分内存依然无法被释放。

再来看`WeakMap`：

```js
let obj = { name: "ConardLi" };
const target = new WeakMap();
target.set(obj, "code秘密花园");
obj = null;
```

如果是`WeakMap`的话，`target`和`obj`存在的就是弱引用关系，当下一次垃圾回收机制执行时，这块内存就会被释放掉。

设想一下，如果我们要拷贝的对象非常庞大时，使用`Map`会对内存造成非常大的额外消耗，而且我们需要手动清除`Map`的属性才能释放这块内存，而`WeakMap`会帮我们巧妙化解这个问题。

我也经常在某些代码中看到有人使用`WeakMap`来解决循环引用问题，但是解释都是模棱两可的，当你不太了解`WeakMap`的真正作用时。我建议你也不要在面试中写这样的代码，结果只能是给自己挖坑，即使是准备面试，你写的每一行代码也都是需要经过深思熟虑并且非常明白的。

能考虑到循环引用的问题，你已经向面试官展示了你考虑问题的全面性，如果还能用`WeakMap`解决问题，并很明确的向面试官解释这样做的目的，那么你的代码在面试官眼里应该算是合格了。

## 参考

[如何写出一个惊艳面试官的深拷贝?](https://juejin.cn/post/6844903929705136141)

[Lodash中的cloneDeep](https://juejin.cn/post/6844904046692679693#heading-34)  【带Promise】
