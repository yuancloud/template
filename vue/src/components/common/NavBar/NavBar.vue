<template>
  <div class="navbar-wrapper">
    <ul class="navbars">
      <li class="navbar-item">
        <div class="navbar"
             :class="{active: selectNav === 0}"
             @click="tabNav(0)">
          <i class="nav-home"></i>
          <span class="nav-name">首页</span>
        </div>
      </li>
      <li class="navbar-item">
        <div class="navbar"
             :class="{active: selectNav === 1}"
             @click="tabNav(1)">
          <i class="nav-classify"></i>
          <span class="nav-name">分类</span>
        </div>
      </li>
      <!--<li class="navbar-item">-->
        <!--<div class="navbar"-->
             <!--:class="{active: selectNav === 2}"-->
             <!--@click="tabNav(2)">-->
          <!--<i class="nav-shopcart"></i>-->
          <!--<span class="nav-name">购物车</span>-->
        <!--</div>-->
      <!--</li>-->
      <li class="navbar-item">
        <div class="navbar"
             :class="{active: selectNav === 3}"
             @click="tabNav(3)">
          <i class="nav-mine"></i>
          <span class="nav-name">我的</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  data() {
    return {
      selectNav: 0
    };
  },
  created() {
    this.listenChange();
  },
  methods: {
    /**
     * navbar 点击切换
     * @param type 0:首页 1:分类 2:购物车 3: 我的
     */
    tabNav(type) {
      switch (type) {
        case 0:
          this.selectNav = 0;
          this.$router.push({ path: '/' });
          break;
        case 1:
          this.selectNav = 1;
          this.$router.push({ path: '/category/category_c/category' });
          break;
        case 2:
          this.selectNav = 2;
          this.$router.push({ path: '/cart/list/list' });
          break;
        case 3:
          this.selectNav = 3;
          this.$router.push({ path: '/customer/mine/mine' });
          break;
        default:
          break;
      }
    },
    /**
     * 监听路由页面变化
     */
    listenChange() {
      this.$root.eventHub.$on('navTab', (navId) => {
        this.tabNav(navId);
      });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixin.styl"
  .navbar-wrapper
    position: fixed
    width: 100%
    bottom: 0
    left: 0
    z-index: 100
    background: white
    border-top:1px solid #f5f5f5
    .navbars
      height: 100%
      .navbar-item
        float: left
        width: 33.3%
        text-align: center
        .navbar
          display: inline-block
          width: 0.4rem
          &.active
            color: #7a79fa
            .nav-home
              bg-image('./home-r-btn')
            .nav-classify
              bg-image('./list-r-btn')
            .nav-shopcart
              bg-image('./shop-r-btn')
            .nav-mine
              bg-image('./me-r-btn')
          .nav-name
            display: block
            width: 0.4rem
            font-size: 0.11rem
            padding-bottom: 0.08rem
          .nav-home
            display: block
            width: 0.22rem
            height: 0.22rem
            margin: 0.07rem 0.095rem
            background-size: 0.22rem 0.22rem
            bg-image('./home-btn')
          .nav-classify
            display: block
            width: 0.22rem
            height: 0.22rem
            margin: 0.07rem 0.1rem
            background-size: 0.22rem 0.22rem
            bg-image('./list-btn')
          .nav-shopcart
            display: block
            width: 0.22rem
            height: 0.22rem
            margin: 0.07rem 0.09rem
            background-size: 0.22rem 0.22rem
            bg-image('./icon-shopping')
          .nav-mine
            display: block
            width: 0.22rem
            height: 0.22rem
            margin: 0.07rem 0.09rem
            background-size: 0.22rem 0.22rem
            bg-image('./me-btn')
</style>
