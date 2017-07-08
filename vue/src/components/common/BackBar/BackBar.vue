<template>
  <div class="back"
       @click="goBack">
    <i class="iconfont icon-fanhui1"></i>
  </div>
</template>
<script>
export default {
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .back
    position: fixed
    top: 0.12rem
    left: 0.1rem
    width: 0.25rem
    height: 0.25rem
    border-radius: 50%
    text-align: center
    .icon-fanhui1
      display: inline-block
      width: 0.25rem
      height: 0.2rem
      font-size: 0.25rem
      color: rgba(0, 0, 0, 0.5)
</style>
