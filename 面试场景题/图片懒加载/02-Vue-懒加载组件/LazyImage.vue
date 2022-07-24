<template>
  <img
    :class="['lazy', className]"
    :src="defaultImg"
    :data-src="url"
    :data-srcset="`${url}`"
    alt="fordeal"
  />
  <!-- 使用：需要注册全局时间，延时获取体验不太好，知道有这个写法就行
  <LazyImage className="image" :url="url" /> -->
</template>

<script>
export default {
  props: {
    url: {
      type: String,
    },
    defaultImg: {
      type: String,
      default: "default.gif",
    },
    className: {
      type: String,
      default: "",
    },
  },
};
</script>