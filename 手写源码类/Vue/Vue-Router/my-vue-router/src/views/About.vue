<template>
  <div class="about">
    <h1>这是about组件</h1>
    {{ String }}
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
};
</script>
<style scoped>
</style>
