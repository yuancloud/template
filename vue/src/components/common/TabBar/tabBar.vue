<template>
  <div class='tabBar'>
    <span class="iconfont icon-llmainpageback" @click="goBack"></span> {{title}}
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  activated() {
  },
  props: {
    'title': {
      type: String
    },
    'backPath': {
      type: String
    }
  },
  methods: {
    goBack() {
      if (!!this.backPath) {
        this.$router.push({ name: this.backPath })
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.tabBar
  text-align: center
  width: 100%
  height: .44rem
  line-height: .44rem
  box-sizing: border-box
  padding: 0 .2rem
  background: url('http://ac-U2t6qtit.clouddn.com/02a7ff544c8181c4eebd') no-repeat;
  background-size 100% .44rem
  color: #fff
  font-size: .18rem
  font-weight: bold
  &>span
    font-size: .18rem
    position: absolute
    left: .2rem
    top: 0
</style>
