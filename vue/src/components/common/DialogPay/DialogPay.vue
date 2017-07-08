<template>
  <div class="dialog-pay" @click.self="close($event)">
    <div class="dialog-pay-wrapper">
      <div class="pay-title">
        <h1>付款详情</h1>
        <span class="iconfont icon-wrong" @click="close($event)"></span>
      </div>
      <div class="pay-info">
        <div>
          <span class="text">会员账号</span>
          <span class="username">{{vipInfo.username}}</span>
        </div>
        <div>
          <span class="text">需支付</span>
          <span class="total-price">¥ {{orderInfo.totalPrice}}</span>
        </div>
      </div>
      <div class="pay-type-wrapper">
        <ul class="pay-types">
          <li class="pay-type-item" v-show="isRecharge">
            <span class="iconfont icon-huiyuanqia"></span>
            <span class="title">会员卡余额</span>
            <span class="vip-blance">¥{{balance}}</span>
            <v-radio :click="VIPSelect" :checked="vipChecked"></v-radio>
          </li>
          <li class="pay-type-item">
            <span class="iconfont icon-weixin"></span>
            <span class="title">微信支付</span>
            <v-radio :click="wechatSelect" :checked="wechatChecked"></v-radio>
          </li>
          <li class="pay-type-item" v-show="buildType === 'app'">
            <span class="iconfont icon-zhifubao"></span>
            <span class="title">支付宝支付</span>
            <v-radio :click="alipaySelect" :checked="alipayChecked"></v-radio>
          </li>
        </ul>
      </div>
    </div>
    <div class="pay-submit" @click="payConfirm">确认支付</div>
  </div>
</template>
<script>
  // import pingpp from 'pingpp-js';
  import radio from 'components/common/radio/radio';
  import app from 'common/js/app';
  import {getStorage} from 'common/js/util';
  import AV from 'leancloud-storage';
  import { Toast } from 'mint-ui';
  import ctx from 'common/js/front.context.g';
  export default {
    data() {
      return {
        show: true,
        vipInfo: {
          username: ''
        },
        vipChecked: true,
        wechatChecked: false,
        alipayChecked: false,
        payChanel : 'balance',
        orderInfo: {},
        payInfo: {},
        balance:''
      };
    },
    components: {
      'v-radio': radio
    },
    computed: {
      buildType() {
        return window.buildType;
      }
    },
    activated(){
      this.sv_getBalanceNum();
    },
    watch: {
      orderObjectId () {
        this.getVipInfo();
        this.getOrderInfo();
      }
    },
    props: {
      orderObjectId: {
        type: String,
        default: ''
      },
      close: {
        type: Function,
        defalut: () => {
        }
      },
      isRecharge: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      /**
       *
       * @param select 选中状态
       * @constructor
       */
      VIPSelect(select) {
        this.vipChecked = select;
        this.wechatChecked = false;
        this.alipayChecked = false;
        this.payChanel = 'balance';
      },
      /**
       *
       * @param select 选中状态
       * @constructor
       */
      wechatSelect(select) {
        this.wechatChecked = select;
        this.vipChecked = false;
        this.alipayChecked = false;
        if (window.buildType === 'wx') {
          // 公众号支付
          this.payChanel = 'wx_pub';
        } else if (window.buildType === 'app') {
          this.payChanel = 'wx';
        }
      },
      /**
       *
       * @param select 选中状态
       * @constructor
       */
      alipaySelect(select) {
        this.alipayChecked = select;
        this.vipChecked = false;
        this.wechatChecked = false;
        this.payChanel = 'alipay';
      },
      /**
       * 立即支付
       */
      payConfirm() {

        if (this.payChanel==='balance'){
          if(this.balance >= this.orderInfo.totalPrice){
            console.log(this.balance);
            console.log(this.orderInfo.totalPrice);
            this.recordOrderInfo();
          }else{
            Toast({
              message: '余额不足请更换支付方式',
              position: 'bottom',
              duration: 2000
            });
          }

        }else{
          this.recordOrderInfo();
          switch (window.buildType) {
            case 'wx':
              this.placeWecahtOrder().then((res) => {
                window.wx.chooseWXPay({
                  timestamp: res.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                  nonceStr: res.nonceStr, // 支付签名随机串，不长于 32 位
                  package: res.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                  signType: res.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                  paySign: res.paySign, // 支付签名
                  success: (res) => {  // 支付成功后的回调函数
                  this.goOrderDetail();
          }
        });
        });
          break;
        case 'app':
          switch (this.payChanel) {
            case 'wx':
              this.placeWecahtOrder().then((res) => {
                let params = {
                  partnerid: res.partnerid, // merchant id
                  prepayid: res.prepayid, // prepay id
                  noncestr: res.noncestr, // nonce
                  timestamp: res.timestamp, // timestamp
                  sign: res.sign // signed string
                };
              window.Wechat.sendPaymentRequest(params, () => {
                this.goOrderDetail();
          }, (reason) => {
            alert(reason);
          });
        });
          break;
        case 'alipay':
          this.placeAlipayOrder().then((res) => {
            window.cordova.plugins.alipay.payment(res.payInfo, (res) => {
            this.goOrderDetail();
        }, (e) => {
            alert(e.message);
          });
        });
          break;
        default:
          break;
        }
          break;
        default:
          break;
        }
        }


      },
      /**
       * 获取会员信息
       */
      getVipInfo() {
//          if (getStorage('wechatUserInfo')) {
//            this.vipInfo.username = getStorage('wechatUserInfo').nickname;
//          }
          this.vipInfo.username = AV.User.current().get('username');
//        this.$http.get(app.url.account).then((res) => {
//          res.username = getStorage('user').username;
//          this.vipInfo = res;
//        });
      },
      /**
       * 获取订单信息
       */
      getOrderInfo() {
        let query = new AV.Query('Order');
        query.get(this.orderObjectId).then((res) => {
          this.orderInfo = JSON.parse(JSON.stringify(res));
//          alert(JSON.stringify(this.orderInfo));
        });
      },
      /**
       * 微信统一下单
       */
      placeWecahtOrder() {
        let params = {
          params: {
            body: 'lztogether',
            bookingNo: this.orderInfo.orderno,
            totalFee: this.orderInfo.totalPrice * 100
          }
        };
        if (window.buildType === 'wx') {
          params.params.openId = getStorage('wechatUserInfo').openid;
          params.params.payType = 'wx';
        } else if (window.buildType === 'app') {
          params.params.payType = 'app';
        }
        return this.$http.get(app.url.wechatUnifiedOrder, params);
      },
      placeAlipayOrder() {
        let params = {
          params: {
            bookingNo: this.orderInfo.orderno,
            totalFee: this.orderInfo.totalPrice
          }
        };

        return this.$http.get(app.url.alipayUnifiedOrder, params);
      },
      /**
       * 跳转到订单详情
       */
      goOrderDetail() {
        // 暂时按运费判断订单类型（商品订单|服务订单） 以后会按订单类型判断
        if (this.orderInfo.shippingCompany) {

          this.$router.push({path: '/order/view_order_c/order_detail', query: {orderObjectId: this.orderObjectId}});
        } else {
          this.$router.push({path: '/order/list_order_user/order_detail', query: {orderObjectId: this.orderObjectId}});
        }
      },
      /**
       * 记录订单信息
       */
      recordOrderInfo() {
        let transfer = new AV.Object('Transfer');
        let order = AV.Object.createWithoutData('Order', this.orderObjectId);

        transfer.set('order', order);
        transfer.set('orderno', this.orderInfo.orderno);
        if(!this.isRecharge){
          transfer.set('categoryType', 6);
        }
        transfer.set('totalPrice', this.orderInfo.totalPrice);
        transfer.set('payType', this.payChanel);

        transfer.save().then((res) => {
          if(this.payChanel=='balance'){
            let params = {
              orderId: this.orderObjectId
            };
            AV.Cloud.run('accountPay', params).then((res) => {
              console.log(res);
              Toast({
                message: '支付成功',
                position: 'bottom',
                duration: 2000
              });
          if (this.orderInfo.shippingCompany) {
            this.close();
            this.$router.push({path: '/order/view_order_c/order_detail', query: {orderObjectId: this.orderObjectId}});
          } else {
            this.$router.push({path: '/order/list_order_user/order_detail', query: {orderObjectId: this.orderObjectId}});
          }
            });
          }
          console.log('记录订单信息成功');
        }, (e) => {
          console.log('记录订单信息失败');
        });
      },
      /*获取同行卡充值和消费总金额*/
      sv_getBalanceNum(){
        let params = {
          userId: ctx.getCurrentUser().toJSON().objectId
        };
        AV.Cloud.run('getBalance', params).then((res) => {
          this.balance = res.balance;
        });
      }

    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl"
  .dialog-pay
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: rgba(0, 0, 0, 0.5)
    z-index: 1000
    .dialog-pay-wrapper
      position: absolute
      width: 100%
      min-height: 3rem
      left: 0
      bottom: 0
      background: #fff
      padding: 0 0.1rem
      box-sizing: border-box
      .pay-title
        width: 100%
        height: 0.4rem
        line-height: 0.4rem
        font-size: 0.16rem
        color: #000
        & > h1
          text-align: center
          font-size .2rem
          color #333
        .icon-wrong
          position: absolute
          top: 0
          left: 0.15rem
      .pay-info
        & > div
          width: 100%
          height: 0.4rem
          line-height: 0.4rem
          border-1px(#dfdfdf)
          .text
            display: block
            float: left
            color: #000
            font-size: 0.16rem
            font-family PingFangSC Regular
          .username
            display: block
            float: right
            color: #676767
            font-family PingFangSC Regular
            font-size .16rem
          .total-price
            display: block
            float: right
            color: #EE7E32
            font-size .24rem
            font-family PingFangSC Regular
      .pay-type-wrapper
        .pay-types
          .pay-type-item
            display: flex
            font-size: 0.12rem
            height: 0.4rem
            line-height: 0.4rem
            border-1px(#dfdfdf)
            .title
              color #000
              font-size .14rem
              font-family PingFangSC Regular
            .vip-blance
              padding: 0 0.05rem
            .icon-huiyuanqia
              color: #2aaf90
            .icon-weixin
              color: rgb(23, 211, 0)
            .icon-zhifubao
              color: rgb(17, 258, 235)
            :nth-child(1)
              flex: 0 0 0.3rem
              height: 100%
            :nth-child(2)
              flex: 1
              text-align: left
            :last-child
              flex: 0 0 0.2rem
    .pay-submit
      position fixed
      bottom 0
      left 0
      height: .58rem
      line-height: 0.58rem
      text-align: center
      color: #fff
      font-family PingFangSC Regular
      font-size .2rem
      width 100%
      background: #7a79f1
</style>
