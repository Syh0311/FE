<template>
  <div class="">
    <button type="" @click="test">sss</button>
  </div>
</template>
<script>
export default {
  mounted() {
    window.test2 = this.test;
  },
  methods: {
    test() {
      "use strict";
      console.log(scope);    //undefined
      let scope = "local";
      console.log(scope);    //"local"
    },
  },
};
</script>
<style scoped></style>
