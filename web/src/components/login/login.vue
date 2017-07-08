<template>
  <div class='newLogin'>
    <div class='logo-wrapper'>
      <img src='./logo.png' alt='logo'>
    </div>
    <div class='username-wrapper'>
      <label>+86</label>
      <input class='username' type='number' placeholder='请输入手机号' v-model='username' @blur.lazy='checkPhoneNum' maxlength='11'>
    </div>
    <div class='verifyCode-wrapper'>
      <label>验证码</label>
      <input class='verifyCode' type='verifyCode' placeholder='请输入验证码' v-model='verifyCode' @keyup.enter='login'>
      <span class='get-verify-code' @click='getVerifyCode'>获取验证码</span>
    </div>
    <div class='btn-login-wrapper'>
      <button class='btn-login' @click='login'>登录</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: '',
      verifyCode: ''
    };
  },
  created() {
  },
  methods: {
    /**
     * 登录
     */
    login() {
      if (!this.username) {
        this.$message('请输入用户名!')
        return;
      } else if (!this.verifyCode) {
        this.$message('请输入验证码!')
        return;
      }
      AV.User.signUpOrlogInWithMobilePhone(this.username, this.verifyCode).then((result) => {
        // 成功
        this.$root.$emit('cuerrentUser', result.toJSON())
        this.$router.push({ name: 'home' });
      }, (errorMsg) => {
        // 失败
        this.$message(JSON.stringify(errorMsg))
      });
    },
    /**
     * 获取验证码
     */
    getVerifyCode() {
      if (!this.username) {
        this.$message('请先填写手机号!')
        return;
      }
      AV.Cloud.requestSmsCode(this.username).then((success) => {
        this.$message('验证码已发送至您的手机!')
      }).catch((e) => {
        this.$message(JSON.stringify(e))
      });
    },
    /**
     * 校验手机号
     */
    checkPhoneNum() {
      if (!this.username) return;
      let isPhone = this.checkPhoneNum2(this.username);
      if (!isPhone) {
        this.username = '';
        this.$message('手机号不合法')
      }
    },
    checkPhoneNum2(phoneNum) {
      let isPhoneNum = false;
      if (phoneNum) {
        var reg = /^1[34578]\d{9}$/;
        isPhoneNum = reg.test(phoneNum);
      } else {
        window.alert('手机号参数不能为空!');
      }
      return isPhoneNum;
    }
  }
};
</script>
<style lang='stylus' rel='stylesheet/stylus'>
  @import '../../common/stylus/mixin.styl'
  .newLogin
    position: relative
    width 100%
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
      height: 0.3rem
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
