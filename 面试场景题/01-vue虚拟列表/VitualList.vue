<template>
  <div id="VirtualList" ref="VirtualList" @scroll="handleScroll">
    //滚动条显示
    <div :style="{ height: items.length * size + 'px' }"></div>
    <div id="container" ref="container" :style="{ top: offsetTop }">
      <div
        v-for="(v, i) in itemList"
        :key="i"
        class="item"
        :style="{ height: size + 'px' }"
      >
        {{ v.name }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    size: { type: Number },
    remain: { type: Number },
    items: { type: Array },
  },
  computed: {
    itemList: function () {
      return this.items.slice(this.start, this.end);
    },
  },
  data() {
    return {
      start: 0,
      end: this.remain,
      offsetTop: 0,
    };
  },
  methods: {
    handleScroll() {
      //从第几个item开始显示
      this.start = this.$refs.VirtualList.scrollTop / this.size;
      //开始位置加上要显示几个 = end
      this.end = this.start + this.remain;
      //动态更改定位的top值，保证不会随父元素一起滚动
      this.offsetTop = this.$refs.VirtualList.scrollTop + "px";
    },
  },
  mounted() {
    this.$refs.VirtualList.style.height = this.size * this.remain + "px";
  },
};
</script>
<style>
#VirtualList {
  overflow: auto;
  width: 200px;
  position: relative;
}
#container {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.item {
  line-height: 40px;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
}
</style>