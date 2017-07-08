<template>
    <div class="grid-title">
      <span class="grid-title-text"><slot></slot></span>
      <span class="required" v-show="required">必填</span>
    </div>
</template>
<script>
    export default {
        props: {
            'required': {
                type: Boolean,
                default: false
            }
        }
    };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .grid-title
    width: 100%
    height: 0.5rem
    line-height: 0.5rem
    text-align: left
    padding: 0 0.1rem
    box-sizing: border-box
    font-size: 0
    .grid-title-text
      display: inline-block
      font-size: 0.16rem
      color: #000
    .required
      display: inline-block
      width: 0.4rem
      height: 0.14rem
      font-size: 0.1rem
      text-align: center
      line-height: 0.14rem
      margin: 0.15rem 0.01rem 0.15rem 0.1rem
      color: #d59392
      border: 0.01rem solid #d59392
      border-radius: 0.08rem
</style>
