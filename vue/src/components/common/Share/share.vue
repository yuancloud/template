<template>
  <div class="share" @click="cancelShare">
    <div class="shareMyshop">
      <div class="shareWays">
        <div class="share-way" v-for="(item, index) in shareWays">
          <span class="shareIcon"></span>
          <p class="way">{{item}}</p>
        </div>
      </div>
      <p class="cancel" @click="cancelShare">取消</p>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        shareWays: ['微信', '朋友圈', '微博']
      };
    },
    props: {
      showShare: {
        type: Boolean,
        default: ''
      }
    },
    methods: {
      cancel() {
        this.showShare = false;
      },
      cancelShare() {
        this.$emit('taggleShow', this.showShare);
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixin.styl"
  .share
    position:fixed
    top:0
    z-index:999
    width:100%
    height:100%
    background:rgba(0,0,0,.4)
    .shareMyshop
      position:absolute
      bottom:0
      background:#fff
      width:100%
      .shareWays
        display:flex
        width:100%
        padding-top:.2rem
        border-bottom:1px solid #d6d7dc
        .share-way
          flex:1
          text-align:center
          .shareIcon
            background-size:.4rem .4rem
          &:nth-child(1)
            .shareIcon
              bg-image('./weixin')
          &:nth-child(2)
            .shareIcon
              bg-image('./pengyouquan')
          &:nth-child(3)
            .shareIcon
              bg-image('./weibo')
          .shareIcon
            display:inline-block
            border-radius:50%
            width:.4rem
            height:.4rem
          .way
            line-height:.36rem
      .cancel
        line-height:.42rem
        font-size:.16rem
</style>
