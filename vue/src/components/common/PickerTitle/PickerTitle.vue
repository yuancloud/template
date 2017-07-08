<template>
  <div class="picker-title">
    <span class="confirm" @click="cancle($event)">取消</span>
    <span class="cancle" @click="confirm($event)">确定</span>
  </div>
</template>
<script>
  export default {
    props: {
      cancle: {
        type: Function,
        default: () => {
        }
      },
      confirm: {
        type: Function,
        default: () => {
        }
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .picker-title
    width: 100%
    height: 0.35rem
    padding: 0 0.06rem
    background: #eee
    box-sizing: border-box
    .confirm
      display: block
      width: 0.46rem
      height: 0.29rem
      line-height: 0.29rem
      float: left
      margin: 0.03rem 0
      color: #000
      font-size: 0.12rem
      text-align: center
      border-radius: 0.04rem
      background: #fff
    .cancle
      display: block
      width: 0.46rem
      height: 0.29rem
      line-height: 0.29rem
      float: right
      margin: 0.03rem 0
      color: #fff
      font-size: 0.12rem
      text-align: center
      border-radius: 0.04rem
      background: #007af0

</style>
