<template>
  <div id="app">
    <keep-alive>
      <router-view class="router-view"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'app',
  };
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
    text-align: center;
    color: #2c3e50;
  }
  .router-view {
    width: 100%;
    /*height: 100%;*/
    padding-bottom: 0.5rem;
    box-sizing: border-box;
  }
</style>
