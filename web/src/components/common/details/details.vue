<template>
  <div class="details" v-show="isShow">
    <div class="detailsTitle">商品ID: {{details.goodsId}}</div>
    <div class="operation">
      <el-button size="small" v-show='!isEditOrSave' :plain="true" @click='editHandle'>编辑</el-button>
      <el-button size="small" v-show='isEditOrSave' :plain="true" @click='saveHandle'>保存</el-button>
      <el-button size="small" :plain="true" @click='deleteHandle'>删除</el-button>
    </div>
    <div class="goodsInfo">
      <div>商品名:&nbsp;
        <input type="text" @change="goodsNameChange" :value="details.goodsName" :disabled='isDisabled'>
      </div>
      <div>现价:&nbsp;¥
        <input type="text" @change="newPriceChange" :value="details.newPrice" :disabled='isDisabled'>
      </div>
      <div>原价:&nbsp;¥
        <input type="text" @change="oldPriceChange" :value="details.oldPrice" :disabled='isDisabled'>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  data() {
    return {
      selectItemId: '',
      details: {},
      isShow: false,
      isDisabled: true,
      isEditOrSave: false,
      modify: {}
    }
  },
  activated() {
    this.init()
  },
  methods: {
    init() {
      const self = this
      const query = new AV.Query('ListTest')
      this.$root.$on('selectItem', result => {
        query.equalTo('objectId', result)
          .find()
          .then(data => {
            self.details = data[0].toJSON()
            self.isShow = true
          })
      })
    },
    newPriceChange(e) {
      this.modify.newPrice = Number(e.target.value)
    },
    oldPriceChange(e) {
      this.modify.oldPrice = Number(e.target.value)
    },
    goodsNameChange(e) {
      this.modify.goodsName = e.target.value
    },
    editHandle() {
      this.isEditOrSave = !this.isEditOrSave
      this.isDisabled = false
    },
    saveHandle() {
      let newObj = AV.Object.createWithoutData('ListTest', this.details.objectId)
      for (let key in this.modify) {
        newObj.set(key, this.modify[key])
      }
      newObj.save()
        .then(result => {
          this.$message('修改成功')
        }, err => {
          this.$message(err)
        })
      this.isEditOrSave = !this.isEditOrSave
      this.isDisabled = true
    },
    deleteHandle() {
      const deleteObj = AV.Object.createWithoutData('ListTest', this.details.objectId);
      deleteObj.destroy().then(success => {
        this.isShow = false
        this.$root.$emit('deleteItem', this.details.objectId)
        this.$message('删除成功')
      }, err => {
        this.$message(err)
      });
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.details
  width 100%
  height 100%
  text-align left
  box-sizing border-box
  padding-top 5%
  padding-left 5%
  .detailsTitle
    width 100%
    height 5%
  .operation
    width 100%
    height 5%
    // line-height 2em
  .goodsInfo
    width 95%
    height 90%
    box-sizing border-box
    border-top 1px solid #cacaca
    padding-top 3%
    overflow-y auto
    &>div
      margin-bottom 2%
</style>
