<template>
  <div class="header border-1px">
    <span v-show="showBack" class="iconfont icon-fanhui" @click="goBack"></span>
    <h1 class="title">
      <slot></slot>
    </h1>
  </div>
</template>
<script>
  export default {
    props: {
      showBack: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl"
  .header
    position: relative
    width: 100%
    height: 0.44rem
    line-height: 0.44rem
    font-size: 0.14rem
    z-index:100
    background: #ffffff
    border-1px(#f5f5f5)
    box-shadow: 0 0.02rem 0.05rem #d0d0d0
    .title
      width: 100%
      height: 100%
      text-align: center
      font-weight: 700
    .icon-fanhui
      position: absolute
      top: 0
      left: 0
      padding: 0 0.1rem
      font-size: 0.16rem
</style>
