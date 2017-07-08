<template>
  <div class="checklist">
    <div class="selectList">
      <div class='selectItem' v-for="(dataItem, index) in dataListArr" @click='selectItem(index)'>
        <div>
          <span>{{dataItem.toJSON().goodsName}}</span>
        </div>
        <div>{{dataItem.toJSON().describe}}</div>
      </div>
    </div>
    <div class="pageNumber">
      <el-pagination small layout="prev, pager, next" :total="count" :current-page.sync="currentPage" @current-change='currentChange'>
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 10,
      currentPage: 1,
      dataListArr: []
    };
  },
  activated() {
    this.dataListArr = []
    this.init()
    this.monitor()
  },
  methods: {
    currentChange(index) {
      this.dataListArr = []
      this.currentPage = index
      const query = new AV.Query('ListTest')
      query.limit(20)
      query.skip(20 * (index - 1))
      query.find()
        .then(result => {
          this.dataListArr = result
        })
    },
    init() {
      const query = new AV.Query('ListTest')
      query.limit(20)
      query.find()
        .then(result => {
          this.dataListArr = result
        })
      query.count()
        .then(count => {
          this.count = (Math.floor(count / 20) + 1) * 10
        })
    },
    selectItem(index) {
      this.$root.$emit('selectItem', this.dataListArr[index].id)
    },
    monitor() {
      const self = this
      this.$root.$on('deleteItem', result => {
        self.init()
      })
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.checklist
  width 100%
  height 100%
  box-sizing border-box
  border-right 1px solid #4bb8fe
  .selectList
    clear both
    width 100%
    height 95%
    overflow-x hidden
    overflow-y auto
    .selectItem
      width 100%
      height 6%
      box-sizing border-box
      border-bottom 1px solid #cacaca
      &>div
        width 100%
        height 50%
        text-align left
        color #4bb8fe
        box-sizing border-box
        padding-left 3%
      &>:nth-child(1)
        text-align left
        font-size 1em
        line-height 1.5em
      &>:nth-last-child(1)
        font-size .8em
        line-height 2em
  .pageNumber
    width 100%
    height 5%
    box-sizing border-box
    padding-top 5%
</style>
