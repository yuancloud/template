<template>
  <div class="counter">
    <div class="plus" @click="plus">+</div>
    <div class="count">{{count}}</div>
    <div class="reduce" @click="reduce">-</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        count: 1
      };
    },
    created() {
    },
    methods: {
      plus() {
        this.count++;
        this.getCount(this.count);
      },
      reduce() {
        if (this.count > 1) this.count--;
        this.getCount(this.count);
      }
    },
    props: {
      getCount: {
        type: Function,
        default: () => {
        }
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .counter
    display: inline-block
    width: 0.8rem
    height: 0.2rem
    line-height: 0.2rem
    .plus
      float: left
      width: 0.25rem
      border: 1px solid #f2f2f2
      text-align: center
      box-sizing: border-box
    .count
      float: left
      width: 0.3rem
      text-align: center
      border-top: 1px solid #f2f2f2
      border-bottom: 1px solid #f2f2f2
      box-sizing: border-box
    .reduce
      float: left;
      width: 0.25rem
      border: 1px solid #f2f2f2
      text-align: center
      box-sizing: border-box
</style>
