<template>
  <div class="ListItem">
    <p class="Name">{{title}}
      <span>{{state}}</span>
    </p>
    <div class="Info">
      <div class="Logo">
        <img :src="logoURL">
      </div>
      <div class="Details">
        <p>{{headline}}</p>
        <p v-for="item in uidataarr">{{item}}</p>
      </div>
    </div>
    <div class="Handle">
      <div v-for="item in uioparr" @click="allClick(item)">{{item.opname}}</div>
    </div>
  </div>
</template>

<script>
import AV from 'leancloud-storage'
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
      currentState: 0
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
    allClick(item) {
      AV.Cloud.run(item.opcode, { objectId: this.objectId })
        .then(result => {
          console.log(result)
          this.$root.$emit('doclistItemStateHandle', this.currentState)
        })
        .catch(err => {
          console.log(err)
        })
    },
    searchInit() {
      if (!this.uimodel) return;
      this.title = this.uimodel.title;
      this.logoURL = this.uimodel.logoURL;
      this.state = this.uimodel.state;
      this.headline = this.uimodel.headline;
      this.uidataarr = this.uimodel.contentlist;
      this.objectId = this.uimodel.objectId;
      this.currentState = this.uimodel.currentState;
      // this.uioparr
      /*
        [{opname: '通过'}]
        [{opname: '通过'}, {opname: '转法务'}, {opname: '转财务'}]
        [{opname: '通过'}, {opname: '补资料'}]
      */
      switch (this.uimodel.state) {
        case '草稿':
          this.uioparr = [{ opcode: 'Store_submit', opname: '通过' }, { opcode: 'Store_submit', opname: '补资料' }]
          break
        case '核准中':
          this.uioparr = [{ opcode: 'Store_approve', opname: '通过' }, { opcode: 'Store_approve', opname: '转财务' }, { opcode: 'Store_approve', opname: '转法务' }]
          break
        case '进行中':
          this.uioparr = [{ opcode: 3, opname: '通过' }]
          break
        case '关闭':
          this.uioparr = []
          break
      }
    }
  }
}
</script>

<style lang="stylus" scoped="true">
.ListItem
  min-height 1.8rem
  box-sizing border-box
  border-bottom .1rem solid #f5f5f5
  text-align left
  &>.Name
    height .3rem
    box-sizing border-box
    border-bottom .01rem dashed #cacaca
    line-height .3rem
    padding 0 .2rem
    font-size .14rem
    font-weight bold
    &>span
      float right
      font-size .14rem
      font-weight bold
  &>.Info
    display flex
    box-sizing border-box
    padding .1rem .2rem
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
        font-size .12rem
        padding .05rem 0
      &>:nth-child(1)
        font-size .16rem
        font-weight bold
  &>.Handle
    height .4rem
    background-color #cacaca
    box-sizing border-box
    padding 0 .2rem
    &>div
      float right
      margin-top .075rem
      margin-left .1rem
      width .6rem
      height .25rem
      background-color #fff
      line-height .25rem
      font-size .14rem
      font-weight bold
      text-align center
      box-sizing border-box
      border .01rem solid #9c4294
      color #9c4294
</style>


