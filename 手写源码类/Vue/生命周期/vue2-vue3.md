## [掘金-Vue生命周期详解 📌](https://juejin.cn/post/6874855535234170887)

## [vue2 【8+3】](https://cn.vuejs.org/v2/api/#%E9%80%89%E9%A1%B9-%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90)

![image-20220620160539032](D:\Sync\typora图片\image-20220620160539032.png)

分为四个阶段，每个阶段又分为两个

- 创建阶段--beforeCreate，created
- 挂载阶段--beforeMount，mounted
- 运行阶段--beforeUpdate，updated
- 销毁阶段--beforeDestroy，destroyed

额外的

- [activated](https://cn.vuejs.org/v2/api/#activated)

  - **类型**：`Function`

  - **详细**：

    被 keep-alive 缓存的组件激活时调用。

    **该钩子在服务器端渲染期间不被调用。**

  - **参考**：

    - [构建组件 - keep-alive](https://cn.vuejs.org/v2/api/#keep-alive)
    - [动态组件 - keep-alive](https://cn.vuejs.org/v2/guide/components-dynamic-async.html#在动态组件上使用-keep-alive)

- [deactivated](https://cn.vuejs.org/v2/api/#deactivated)

  - **类型**：`Function`

  - **详细**：

    被 keep-alive 缓存的组件失活时调用。

    **该钩子在服务器端渲染期间不被调用。**

  - **参考**：

    - [构建组件 - keep-alive](https://cn.vuejs.org/v2/api/#keep-alive)
    - [动态组件 - keep-alive](https://cn.vuejs.org/v2/guide/components-dynamic-async.html#在动态组件上使用-keep-alive)

- [errorCaptured](https://cn.vuejs.org/v2/api/#errorCaptured)



1. beforeCreate
   - vue实例刚在内存中创建，还未初始化data和methods
2. created
   - 初始化data和methods
   - 此时`$options`已初始化好   见FE内 `myVueRouter`
   - 此时无法与dom进行交互
   - `最好在这里进行异步数据请求`
   - props？
3. beforeMount
   - 已完成`模板编译`，但还未`挂载（mount）`到页面上
   - `虚拟Dom创建完毕`，即将开始渲染
   - 此时`修改`data内数据，`不会触发update`
4. mounted
   - 编译后的模板结果挂载到页面上，可以`显示页面`
   - 数据完成`双向绑定`
5. beforeUpdate
   - 监听的是`视图内数据`变化，
   - 虚拟DOM编译为真实DOM`之前`调用beforeUpdate【在vue实例创建过程中，
   - `dom状态`变更前的执行，此时`data中数据已经最新`，但还`未重新渲染dom`
   - 此时修改data中数据，不会重新渲染【因为还没开始渲染】，
   - 修改data中数据，也不会再触发beforeUpdate，因为beforeUpdate其实是`视图层的数据改变时触发`
6. updated
   - dom已被重新渲染
7. beforeDestroy
   - vue实例销毁之前
8. destroyed
   - vue实例被销毁



## [vue3](https://v3.cn.vuejs.org/api/options-lifecycle-hooks.html#beforecreate) 待补充

![image-20220620160419082](D:\Sync\typora图片\image-20220620160419082.png)

## vue2 vue3 区别 --待补充

## 父子组件生命周期

想象成一个`树结构`，上层是父组件，下层是子组件

1. 创建过程

   ```js
   父beforeCreate -> 父created -> 父beforeMount 
   ->子beforeCreate -> 子created -> 子beforeMount 
   ->子mounted -> 父mounted
   ```

   - beforeMount时已完成`模板编译`，此时解析到`模板内有子组件`，所以开始`递归`子组件的加载

2. 更新过程

   ```js
   父beforeUpdate -> 子beforeUpdate-> 子updated -> 父updated 
   -> nextTick回调
   ```

   

3. 销毁过程

   ```js
   父beforeDestroy -> 子beforeDestroy -> 子destroyed -> 父destroyed
   ```

   - 销毁父组件时，从dom开始销毁，发现有`子组件`，`递归`销毁子组件

4. 总的来说，是一个`递归`的过程  类似于



## 图解

### vue2

![image-20220620155838612](D:\Sync\typora图片\image-20220620155838612.png)

### vue3

![image-20220620155721958](D:\Sync\typora图片\image-20220620155721958.png)
