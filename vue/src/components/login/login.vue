<template>
  <div class='login'>
    <backBar></backBar>
    <div class='logo-wrapper'>
      <img src='./logo.png' alt='logo'>
    </div>
    <div class='username-wrapper'>
      <label>+86</label>
      <input class='username' type='number' placeholder='请输入手机号' v-model='username' @change.lazy='checkPhoneNum' maxlength='11'>
    </div>
    <div class='verifyCode-wrapper'>
      <label>验证码</label>
      <input class='verifyCode' type='verifyCode' placeholder='请输入验证码' v-model='verifyCode' @keyup.enter='login'>
      <span class='get-verify-code' @click='getVerifyCode'>获取验证码</span>
    </div>
    <div class='btn-login-wrapper'>
      <button class='btn-login' @click='login'>登录</button>
      <p class="aggrement">登录表示您同意<span @click="goAggrement">《用户协议》</span></p>
    </div>
    <div class='wechat-wrapper' @click="wechatLogin" v-show="false">
      <img src='./wechat.png' alt='微信logo'>
      <span class='text'>微信登录</span>
    </div>
  </div>
</template>
<script>
import AV from 'leancloud-storage';
//  const AV = window.AV;
import app from 'common/js/app';
import { Toast } from 'mint-ui';
import ctx from 'common/js/front.context.g';
import backBar from '../common/BackBar/BackBar';
export default {
  data() {
    return {
      username: '',
      verifyCode: '',
      linkToPath: '/'
    };
  },
  components: {
    'backBar': backBar
  },
  created() {
    console.log(ctx.getCurrentUser());
    console.log(this.username);
  },
  activated() {
    if (this.$route.query.linkToPath) {
      this.linkToPath = this.$route.query.linkToPath;
    }
  },
  methods: {
    /**
     * 登录
     */
    login() {
      if (!this.username) {
        Toast({
          message: '请输入用户名!',
          position: 'bottom',
          duration: 1500
        });
        return;
      } else if (!this.verifyCode) {
        Toast({
          message: '请输入验证码!',
          position: 'bottom',
          duration: 1500
        });
        return;
      }
      AV.User.signUpOrlogInWithMobilePhone(this.username, this.verifyCode).then((result) => {
        // 登录成功
        // 缓存token
        ctx.setStorage('token', { token: result.id });
        this.$router.push({ path: this.linkToPath });
      }, (e) => {
        // 失败
        Toast({
          message: e.message,
          position: 'bottom',
          duration: 1500
        });
      });
    },
    /**
     * 获取验证码
     */
    getVerifyCode() {
      if (!this.username) {
        Toast({
          message: '请先填写手机号',
          position: 'bottom',
          duration: 1500
        });
        return;
      }
      ctx.sendSms(this.username).then((success) => {
        Toast({
          message: '验证码已发送至您的手机',
          position: 'bottom',
          duration: 1500
        });
      }).catch((e) => {
        Toast({
          message: e.message,
          position: 'bottom',
          duration: 1500
        });
      });
    },
    /**
     * 校验手机号
     */
    checkPhoneNum() {
      if (!this.username) return;
      let isPhone = ctx.checheckPhoneNum(this.username);
      if (!isPhone) {
        this.username = '';
        Toast({
          message: '手机号不合法',
          position: 'bottom',
          duration: 1500
        });
      }
    },
    /**
     * 微信登录
     */
    wechatLogin() {
      ctx.wechatAutho((res) => {
        alert(JSON.stringify(res));
        let params = {
          params: {
            code: res.code
          }
        };
        this.$http.get(app.url.getUserInfo, params).then((res) => {
          ctx.setStorage('wechatUserInfo', res);
          AV.User.signUpOrlogInWithAuthData({
            openid: res.openid,
            access_token: res.access_token,
            expires_at: new Date()
          }, 'weixin').then((res) => {
            alert(JSON.stringify(res));
            console.log('wechat login success');
          }, (e) => {
            console.log(JSON.stringify(e));
          });
        });
      }, (e) => {
        alert(JSON.stringify(e));
      });
    },
    /**
     * 跳转用户协议
     */
    goAggrement() {
      console.log('跳转用户协议');
      this.$router.push({ name: 'customer/view_agreement/agreement' });
    }
  }
};
</script>
<style lang='stylus' rel='stylesheet/stylus'>
  @import '../../common/stylus/mixin.styl'
  .login
    position: relative
    height: 100%
    font-size: 0
    z-index: 300
    background: #fff
    .logo-wrapper
      text-align: center
      padding: 0.4rem 0
      img
        width: 1.5rem
    .username-wrapper
      display: inline-block
      width: 70%
      height: 0.4rem
      border: 1px solid #a32397
      box-sizing: border-box
      padding: 0.12rem 0
      font-size: 0
      border-radius: 0.04rem
      text-align: left
      label
        display: inline-block
        font-size: 0.14rem
        padding: 0 0.2rem 0 0.15rem
        color: #000
      .username
        display: inline-block
        width: 1rem
        font-size: 0.12rem
        margin: 0
        background: #fff
        color: #000
    .verifyCode-wrapper
      position: relative
      display: inline-block
      width: 70%
      height: 0.4rem
      border: 1px solid #a32397
      box-sizing: border-box
      padding: 0.12rem 0
      font-size: 0
      border-radius: 0.04rem
      text-align: left
      margin-top: 0.1rem
      label
        display: inline-block
        font-size: 0.14rem
        padding: 0 0.1rem 0 0.1rem
        color: #000
      .verifyCode
        display: inline-block
        width: 1rem
        font-size: 0.12rem
        margin: 0
        background: #fff
        color: #000
      .get-verify-code
        display: inline-block
        position: absolute
        top: 0
        right: 0
        height: 0.38rem
        width: 0.6rem
        line-height: 0.38rem
        font-size: 0.1rem
        color: #fff
        background: #a32397
        text-align: center
    .btn-login-wrapper
      height: 0.8rem
      text-align: center
      padding-top: 0.3rem
      .btn-login
        display: inline-block
        width: 70%
        height: 0.3rem
        line-height: 0.3rem
        margin: 0
        padding: 0
        background: #fff
        color: #a32397
        border: 1px solid #a32397
        border-radius: 0.02rem
      .aggrement
        height : .3rem
        width : 100%
        text-align : center
        color : #9a9a9a
        line-height : .3rem
        font-size : .12rem
        &>span
          color :#a32397
          text-decoration:underline

    .wechat-wrapper
      position: absolute
      bottom: 0.6rem
      left: 1.625rem
      width: 0.5rem
      height: 0.8rem
      text-align: center
      img
        display: block
        width: 0.3rem
        height: 0.3rem
        padding: 0 0.1rem
        font-size: 0.3rem
      .text
        display: block
        font-size: 0.1rem
        padding-top: 0.1rem
        color: #000
</style>
