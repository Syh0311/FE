<template>
  <div id="app">
    <button @click="btn++">{{ btn }}</button>
    <p ref="name">{{ name }}</p>
    <button @click="clickCase1">clickCase1</button><br />
    <button @click="clickCase2">clickCase2</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      btn: 10,
      name: "syh",
    };
  },

  mounted() {
    console.log("mounted");
  },

  beforeUpdate() {
    console.log("beforeUpdate:" + this.$refs.name.innerHTML);
    // debugger;
  },

  updated() {
    console.log("updated:" + this.$refs.name.innerHTML);
    // debugger;
  },

  methods: {
    // case1: promise1 -> 修改data -> nextTick1 -> promise2 ->nextTick2
    clickCase1() {
      const that = this;
      // Promise1 (对应图中callBack1)
      new Promise((resolve) => resolve()).then(function promise1Fn() {
        // debugger;
        console.log("Promise1:" + that.$refs.name.innerHTML);
      });
      // 数据改变准备更新 （对应图中第二行代码）
      that.name = "改变";
      // 同步打印虚拟dom
      console.log(that.$refs.name);
      // debugger;
      // 同步打印dom的文本
      console.log(that.$refs.name.innerHTML);
      // Promise2 (对应图中callBack2)
      new Promise((resolve) => resolve()).then(function promise2Fn() {
        // debugger;
        console.log("Promise2:" + that.$refs.name.innerHTML);
      });
      // nextTick 插队到updated之后 所以早于promise2(对应图中nextTickCallBack)
      const next1 = that.$nextTick(function next1Fn() {
        // debugger;
        console.log(
          "nextTickFn1-【插队】到updated后:" + that.$refs.name.innerHTML
        );
      });
      const next2 = that.$nextTick(
        function next2Fn() {
          console.log("[ next2Fn ]");
          // console.log(that);
        },
        {
          name: "syh",
        }
      );
      // const next3 = that
      //   .$nextTick(undefined, { name: "syh" })
      //   .then((res) => console.log(res));
      // console.log(next1);
      // console.log(next2);
      // console.log(next3);

      // 宏任务
      setTimeout(function macroFn() {
        // debugger;
        console.log("宏任务：" + that.$refs.name.innerHTML);
      }, 0);
    },

    // case2: nextTick -> 修改data -> nextTick
    clickCase2() {
      this.$nextTick(() => {
        console.log(this.$refs.name.innerHTML); // syh
      });
      this.name = "clickCase2";

      // 第二个nextTick刷新了callBacks  为啥刷新了？
      this.$nextTick(() => {
        console.log(this.$refs.name.innerHTML); // clickCase2
      });
    },
  },
};
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  position: absolute;
  overflow: hidden;
}
</style>
