<template>
  <div class="recommend-list">
    <div class="recommend-item" v-for="goods in goodsList" @click="goGoodsDetail(goods.objectId,goods.servicetype,goods.store)">
      <img v-lazy="goods.rotationpic1 ? goods.rotationpic1.url : '' " alt="商品图片">
      <div class="shop-info">
        <h2 class="goods-name">{{goods.name}}</h2>
        <h2 class="goods-price">¥ {{goods.price}}</h2>
      </div>
    </div>
  </div>
</template>
<script>
  import app from 'common/js/app';
  import AV from 'leancloud-storage';
  import { Lazyload } from 'mint-ui';
  export default {
    data() {
      return {
        goodsList: [],
        categoryIdArr: [],
        categoryParentArr: [],
        categoryDataArr: [],
        hotDataArr: [],
        lazyImg:require('./logo.png')
      };
    },
    props: ["num"],
    created() {
      this.getRecommendList();
    },
    methods: {
      /**
       * 获取推荐列表
       */
      getRecommendList() {
      /*首页展示推荐列表*/
      if (this.num == 1 && this.$store.state.isEnabled) {
        let query =new AV.Query('Item');
        query.limit(300);
        query.find().then((res) => {
          this.goodsList = JSON.parse(JSON.stringify(res));
        });
      }
      /*
      * 当ios未上线的时候
      * */
      if (this.num == 1 && !this.$store.state.isEnabled) {
        let query =new AV.Query('Item');
        query.limit(300);
        query.doesNotExist('servicetype');
        query.find().then((res) => {
          this.goodsList = JSON.parse(JSON.stringify(res));
        });
      }
      /*联众点评展示推荐列表*/
      if (this.num == 2) {
        let query = new AV.Query('Item');
        let itemList = [];
        query.include('category.parent.parent.parent');
        query.find().then((res)=>{
          res.forEach((item)=>{
          if(item.get('category')){
            if(item.get('category').get('parent')){
              if(item.get('category').get('parent').get('parent')){
                if(item.get('category').get('parent').get('parent').get('parent')){
                  if(item.get('category').get('parent').get('parent').get('parent').get('name')==='联众点评'){
                    itemList.push(item)
                  }
                }
              }
            }
          }
          this.goodsList = JSON.parse(JSON.stringify(itemList));
        })
        })
      }
      /*约我服务展示推荐列表*/
      if (this.num == 3) {
        let itemList=[];
        let query = new AV.Query('Item');
        query.include('category.parent.parent');
        query.limit(1000);
        query.find().then((res)=>{
          res.forEach((item)=>{
            if(item.get('category')){
              if(item.get('category').get('parent')){
                if(item.get('category').get('parent').get('parent')){
                  if(item.get('category').get('parent').get('parent').get('name')==='约我服务'){
                    itemList.push(item)
                  }
                }
              }
            }
          })
          this.goodsList = JSON.parse(JSON.stringify(itemList));
        });


      }
      /*健康超市展示推荐列表*/
      if (this.num == 4) {
        let itemList = [];
        let query4 = new AV.Query('Item');
        query4.include('category.parent.parent.parent');
        query4.find().then((res) => {
          res.forEach((item) => {
            if(item.get('category')){
              if(item.get('category').get('parent')){
                if(item.get('category').get('parent').get('parent')){
                  if(item.get('category').get('parent').get('parent').get('parent')){
                    if(item.get('category').get('parent').get('parent').get('parent').get('name') === '健康超市'){
                      itemList.push(item);
                    }
                  }
                }
              }
            }
          });
          this.goodsList = JSON.parse(JSON.stringify(itemList));
      });
      }

  },
  /**
   * 跳转到商品详情
   * @param goodsId 商品ID
   */
    goGoodsDetail(Id, type,store) {
    if(type){
      this.$router.push({ path: '/item/view_service_detail_c/service_detail', query: { objectId: Id } })
    }else if(store){
      this.$router.push({ path: '/item/serve_detail_b/serve_detail', query: { serveId: Id } });
    }else{
      this.$router.push({ path: '/item/goods_detail/goods_detail', query: { goodsId: Id } });
    }
  }
  }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl"
  .recommend-list
    display: flex
    justify-content: space-between
    flex-wrap: wrap
    width: 100%
    background: #f5f5f5
    overflow hidden
    .recommend-item
      height: 1.9rem
      width: 49%
      margin-top: 0.1rem
      box-sizing: border-box
      font-size: 0.12rem
      color: #000
      border-1px(#e0e0e0)
      background: #ffffff
      overflow hidden
      &:nth-child(1)
        margin-top: 0
      &:nth-child(2)
        margin-top: 0
      & > img
        height:1.45rem
        overflow: hidden
      & > img[lazy=loading]
        height: 1.45rem
        overflow: hidden
        background-image url('./logo.png')
        background-repeat no-repeat
        background-size 100% 100%
    .shop-info
      display: flex
      height: 0.45rem
      justify-content space-between
      padding: 0 0.15rem 0 0.09rem
      .goods-name
        width:1.2rem
        height: 0.45rem
        line-height: 0.45rem
        font-size: 0.1rem
        color: #333333
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        text-align: left
      .goods-price
        height: 0.45rem
        line-height: 0.45rem
        text-align: left
        color: #ff5252
        font-size: 0.14rem
        font-weight: 700
        white-space: nowrap
</style>
