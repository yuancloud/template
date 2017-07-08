<template>
  <div class="title">
    <div class="logo"></div>
    <div class="title-list">
      <div class="title-msg" v-show="false">
        <span class="iconfont icon-xiaoxi1"></span>消息
      </div>
      <div class="loginState">
        <span @click="goLogin" v-show="isLogin">登录</span>
        <span v-show="!isLogin">
          <span>{{username}}</span>
          <span @click="signOut">退出</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// import ctx from '../../../common/js/front.context.g.js'
export default {
  data() {
    return {
      isLogin: false,
      username: ''
    }
  },
  created() {
    // console.log(ctx.getCurrentUser().toJSON().mobilePhoneNumber)
    // this.username = ctx.getCurrentUser().toJSON()
    // console.log(AV.User.current().toJSON())
    this.isCurrentUser()
    this.$root.$on('cuerrentUser', result => {
      this.isLogin = false
      this.isCurrentUser()
    })
  },
  activated() {
  },
  methods: {
    isCurrentUser() {
      if (AV.User.current()) {
        if (AV.User.current().toJSON().nickname == '未设置') {
          this.username = AV.User.current().toJSON().username
        } else {
          this.username = AV.User.current().toJSON().nickname
        }
      } else {
        this.isLogin = true
      }
    },
    signOut() {
      this.isLogin = true
      localStorage.removeItem('AV/U2t6qtitHAEY03hCEqk51X9n-gzGzoHsz/currentUser')
      this.$router.push({ name: 'login' })
    },
    goLogin() {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../../common/stylus/mixin.styl'
.title
  width 100%
  height 8%
  border-1px(#9c4294)
  box-sizing border-box
  padding .5em 2em
  background-color #fff
  overflow hidden
  .logo
    width 10em
    height 3em
    background-size cover
    float left
  .title-list
    float right
    width 20em
    height 3em
    &>div
      width 5em
      float left
      color #9c4294
      line-height 4em
      font-size .8em
      text-align center
      cursor pointer
      box-sizing border-box
    &>.loginState
      width 10em
      float right
      &>:nth-last-child(1)
        &>:nth-child(1)
          float left
          width 7em
          overflow hidden
        &>:nth-last-child(1)
          float right
          width 3em
</style>
