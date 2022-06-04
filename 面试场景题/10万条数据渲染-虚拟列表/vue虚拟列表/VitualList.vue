<template>
  <!-- 
    外层div添加滚动监听事件，
    监听事件做的事情：
    1. 获取外层div的scrollTop值；【因为其内独第一个div能将其撑起来】
    2. 根据scrollTop值计算出滚动到  列表中第几个元素
    3. 重新求计算属性getPartItems，获得要渲染的区间
    4. 数据驱动视图，更新视图显示内容
  -->
  <div class="VirtualList" ref="VirtualList" @scroll="handleScroll">
    <!-- 
      内部两个同级div
      第一个负责撑起滚动条，使得监听事件能获取到外层div得到scrollTop
      第二个显示虚拟列表数据 【position：absolute】
    -->
    <div :style="{ height: items.length * size + 'px' }"></div>
    <div class="container" ref="container" :style="{ top: divTwoTop }">
      <p
        v-for="(v, i) in getPartItems"
        :key="i + 'syh'"
        class="item"
        :style="{ height: size + 'px' }"
      >
        {{ v.name }}
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    items: { type: Array },
    remain: { type: Number },
    size: { type: Number }, //传入的每项的高度
  },
  computed: {
    getPartItems: function ({ items, start, remain }) {
      return items.slice(start, start + remain);
    },
  },
  data() {
    return {
      start: 0,
      divTwoTop: 0,
    };
  },

  mounted() {
    this.$refs.VirtualList.style.height = this.size * this.remain + "px";
  },

  methods: {
    handleScroll() {
      const fatherScrollTop = this.$refs.VirtualList.scrollTop;

      //从第几个item开始显示
      this.start = fatherScrollTop / this.size;

      //动态更改定位的top值，保证不会随父元素一起滚动
      this.divTwoTop = fatherScrollTop + "px";
    },
  },
};
</script>

<style>
.VirtualList {
  position: relative;
  overflow: auto;
  width: 200px;
}
.container {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
}
.item {
  line-height: 40px;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
}
</style>