## Vue.extend + $destroy

1. Vue.extend
2. new MyVue
3. [$destroy](https://juejin.cn/post/6844904196840357902)
   - [vue的组件销毁](https://www.jianshu.com/p/81fd3ea96828)

```js
const PopupItem = Vue.extend(LayerInfo);
new PopupItem({
  el: "#popup_inner", // 挂载到div上 为啥会【替换整个div？？】
  propsData: {
    layerId: name,
  },
  methods: {
    destroyVueSFC() {
      console.log(this);
      // vm.$destroy干了啥？？
      this.$destroy();
      this.$el.parentNode.parentNode.removeChild(this.$el.parentNode);
    },
  },
});
```

