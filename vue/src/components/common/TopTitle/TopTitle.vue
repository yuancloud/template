<template>
  <div class="top-header">
    <div class="top-btn">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
    },
    methods: {
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .top-header
    width : 100%
    height : .56rem
    background-color : #f5f5f5
    border-bottom : .01rem solid #d0d0d0
    padding-top : .16rem
    .top-btn
      height : .4rem
      margin : .0rem auto
      width : 80%
      background-color : #b14ea8
      top : .16rem
      border-radius : .6rem
      color : #ffffff
      line-height : .4rem
      font-size : .17rem
</style>
