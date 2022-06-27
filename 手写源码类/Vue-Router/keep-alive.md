## Keep-alive的实现原理

**原理：**

Vue.js内部将DOM节点抽象成了一个个的`VNode`节点，`keep-alive`组件的缓存也是基于`VNode`节点的而不是直接存储`DOM`结构。它将满足条件（`pruneCache与pruneCache`）的组件在`cache`对象中缓存起来，在需要重新渲染的时候再将`vnode`节点从`cache`对象中取出并渲染。

- 常用的两个属性 `include/exclude`，允许组件有条件的进行缓存。
- 两个生命周期 `activated/deactivated`，用来得知当前组件是否处于活跃状态。
- `keep-alive`的中还**运用了 LRU(最近最少使用) 算法**，选择最近最久未使用的组件予以淘汰


作者：GhostFJ
链接：https://juejin.cn/post/7088305435370848263
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。