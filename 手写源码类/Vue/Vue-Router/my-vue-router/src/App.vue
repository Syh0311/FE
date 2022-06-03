<template>
  <div id="app">
    <div id="nav">
      <router-link to="/home">Home</router-link> |
      <router-link to="/about">About</router-link>|
      <button @click="pushRoute">pushAbout</button>
      <!-- <router-link to="/home">hash-Home</router-link> |
      <router-link to="/about">hash-About</router-link>|

      <router-link to="/home">history-Home</router-link> |
      <router-link to="/about">history-About</router-link> -->
    </div>
    <router-view-syh />

    <CountDown time="1000"></CountDown>
  </div>
</template>


<script>
import CountDown from "./views/CountDown";
export default {
  name: "App",
  components: { CountDown },
  methods: {
    pushRoute() {
      this.$router.push("/about");
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
