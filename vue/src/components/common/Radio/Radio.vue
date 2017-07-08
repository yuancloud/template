<template>
  <div class="radio" @click="toggle">
    <i class="iconfont" :class="checked?'icon-radio':'icon-radio1'"></i>
  </div>
</template>
<script>
  export default {
    props: {
      checked: {
        type: Boolean,
        default: false
      },
      click: {
        type: Function,
        default: () => {
        }
      }
    },
    methods: {
      toggle() {
        this.isChecked = !this.isChecked;
        this.click(this.isChecked);
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .radio
    width: 0.2rem
    height: 0.4rem
    display: flex
    justify-content: center
    & > i
      font-size: 0.2rem
      color: rgb(25, 149, 245)
</style>
