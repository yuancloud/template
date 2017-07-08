/**
* BUTTON
*/
<template>
  <div class="border-button">
    <button @click="click($event)"><slot></slot></button>
  </div>
</template>
<script>
  export default {
    props: {
      /**
       * 点击回调
       */
      click: {
        type: Function
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .border-button
    position: absolute
    width: 100%
    left: 0
    bottom: 0.3rem
    text-align: center
    padding: 0 0.2rem
    box-sizing: border-box
    button
      display: inline-block
      width: 100%
      height: 0.4rem
      line-height: 0.4rem
      border-radius: 0.02rem
      border: none
      color: #fff
      text-align: center
      background: #00b38b
</style>
