// size:每一个item的高度   remain:要显示几个  items:获取到的数组
<template>
  <div id="home">
    <VirtualList :size="40" :remain="8" :items="items"></VirtualList>
  </div>
</template>
<script>
import VirtualList from "../components/VirtualList.vue";
export default {
  components: {
    VirtualList,
  },
  data() {
    return {
      items: [],
    };
  },
  created() {
    for (let i = 0; i < 10000; i++) {
      this.items.push({ name: "我是第" + i + "个", id: i });
    }
  },
};
</script>