<template>
  <div id="app">
    <keep-alive>
      <router-view class="router-view"></router-view>
    </keep-alive>
    <v-navbar></v-navbar>
    <!--<v-navbarB v-if="this.$store.state.navbarType === 1"></v-navbarB>-->
    <!--<v-navbarC v-if="this.$store.state.navbarType === 2"></v-navbarC>-->
  </div>
</template>

<script>
  import navbar from 'components/common/NavBar/NavBar';
//  import navbarB from 'components/common/NavbarB/navbar';
//  import navbarC from 'components/common/NavbarC/navbar';
  export default {
    components: {
      'v-navbar': navbar,
//      'v-navbarB': navbarB,
//      'v-navbarC': navbarC
    }
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
    height: 100%;
    box-sizing: border-box;
  }
</style>
