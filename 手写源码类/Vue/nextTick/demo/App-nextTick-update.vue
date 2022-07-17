<template>
  <div id="app">
    <section>
      <p>
        要修改的数据 ==> name：<span ref="name">{{ name }}</span>
      </p>
    </section>

    <section>
      <span>nextTick的插队现象</span>
      <br /><br />
      <span>micro1 -> 修改data -> nextTick1 -> micro2 ->nextTick2</span>
      <br /><br />

      <button @click="btnclick">点我！</button>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "syh",
    };
  },

  mounted() {
    console.log("mounted");
  },

  beforeUpdate() {
    console.log("beforeUpdate:" + this.$refs.name.innerHTML);
    debugger;
  },

  updated() {
    console.log("updated:" + this.$refs.name.innerHTML);
    debugger;
  },

  methods: {
    // case1: micro1 -> 修改data -> nextTick1 -> micro2 ->nextTick2
    btnclick() {
      // 前置准备 —————————————————————————
      const nameSpan = this.$refs.name;
      const microFn1 = () => console.log("micro1:" + nameSpan.innerHTML);
      const microFn2 = () => console.log("micro2:" + nameSpan.innerHTML);

      const nextFn1 = () => console.log("晚于updated、micro1 早于micro2");
      const nextFn2 = () => console.log(nameSpan.innerHTML);

      const macroFn = () => console.log("宏任务：" + nameSpan.innerHTML);
      // ———————————————————————————————————

      // 1. 修改数据前的微任务
      queueMicrotask(microFn1);

      // 2. 开始修改数据
      this.name = "改变";

      console.log(nameSpan); // 同步打印虚拟dom
      console.log(nameSpan.innerHTML); // 同步打印dom的文本

      // 3. 修改数据后的微任务
      queueMicrotask(microFn2);

      // 4. 开始nextTick 晚于updated、micro1 早于micro2
      this.$nextTick(nextFn1);
      this.$nextTick(nextFn2);

      // 5. 宏任务
      setTimeout(macroFn);
    },
  },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
#app {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  background: beige;
  width: 60%;
  height: 60%;
  border-radius: 5px;
  box-shadow: 5px 6px 15px gray;

  padding: 20px;
  overflow: hidden;

  font-size: 17px;
  font-weight: 700;
}

#app section {
  margin: 10px;
  padding: 10px;
  border: 2px solid deeppink;
  border-radius: 10px;
}
</style>
