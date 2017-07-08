<template>
  <div class="ListItem">
    <p class="Name">{{title}}
      <span>{{state}}</span>
    </p>
    <div class="Info" @click="toViewDetails">
      <div class="Logo">
        <img :src="logoURL">
      </div>
      <div class="Details">
        <p>{{headline}}</p>
        <p v-for="item in uidataarr">{{item}}</p>
      </div>
    </div>
    <div class="Handle">
      <div v-for="item in uioparr" :class="{clicked: isClicked}" @click.stop="allClick(item)">{{item.opname}}</div>
    </div>
  </div>
</template>

<script>
import AV from 'leancloud-storage'
import { Toast } from 'mint-ui';

export default {
  data() {
    return {
      headline: '',
      state: '',
      logoURL: '',
      title: '',
      uidataarr: [],
      uioparr: [],
      objectId: '',
      isClicked: false
    }
  },
  created() {
    this.searchInit()
  },
  props: {
    uimodel: {
      type: Object
    }
  },
  activated() {
  },
  methods: {
    toViewDetails() {
      // this.$router.push({ name: 'employee/view/tmp2', query: { objectId: this.objectId } })
    },
    allClick(item) {
      if (!this.isClicked) {
        AV.Cloud.run(item.opcode, { objectId: this.objectId })
          .then(result => {
            this.state = result.msg
            this.isClicked = true
            Toast({
              message: '修改成功',
              position: 'middle',
              duration: 1500
            });
          })
          .catch(err => {
            Toast({
              message: '修改失败',
              position: 'middle',
              duration: 1500
            });
            console.log(err)
          })
      }
    },
    searchInit() {
      if (!this.uimodel) return;
      this.title = this.uimodel.title;
      this.logoURL = this.uimodel.logoURL;
      this.state = this.uimodel.state;
      this.headline = this.uimodel.headline;
      this.uidataarr = this.uimodel.contentlist;
      this.objectId = this.uimodel.objectId;
      this.uioparr = !this.uimodel.uioparr ? [] : this.uimodel.uioparr;
    }
  }
}
</script>

<style lang="stylus" scoped="true">
.ListItem
  min-height 1.7rem
  box-sizing border-box
  border-bottom .1rem solid #f5f5f5
  text-align left
  &>.Name
    height .4rem
    box-sizing border-box
    border-bottom .01rem dashed #cacaca
    padding .12rem .15rem
    font-size .14rem
    line-height .15rem
    color #fa6164
    font-weight bold
    position relative
    &>span
      position absolute
      top 0
      right .15rem
      min-width .6rem
      height .3rem
      color #fff
      text-align center
      line-height .3rem
      background-color #dd5233
      font-size .14rem
      font-weight bold
      border-radius 0 0 5px 5px
  &>.Info
    display flex
    width 100%
    box-sizing border-box
    padding .1rem .2rem
    background-color #f8f8f8
    &>.Logo
      width .75rem
      height .75rem
      margin-right .1rem
      &>img
        width .75rem
        height .75rem
        text-align center
        line-height .75rem
    &>.Details
      flex 1
      &>p
        font-size .13rem
        padding .05rem 0
        color #9f9f9f
      &>:nth-child(1)
        font-size .16rem
        color #333
        font-weight bold
  &>.Handle
    height .57rem
    box-sizing border-box
    padding 0 .2rem
    &>div
      float right
      width .7rem
      height .3rem
      line-height .3rem
      border-radius 13.5px
      color #f85a0d
      font-size .14rem
      font-weight bold
      text-align center
      box-sizing border-box
      border .01rem solid #f85a0d
      margin-top .12rem
      margin-left .1rem
    &>.clicked
      width .8rem
      border-color #fff
      color #d4d5d0
      background-color #fff
</style>


