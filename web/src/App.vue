<template>
<div id="app">

  <div class="login-box" v-show="loginStatus">
    <span>{{username}}</span>
    <span @click="signOut">退出</span>
  </div>

  <div class="men_bar_container" v-show="loginStatus">
    <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-submenu v-if="items.lists.length" :index="(index+1).toString()" v-for="(items, index) in this.navListData" :key="index">
        <template slot="title">{{items.name}}</template>
        <el-menu-item :index="items.link" v-for="(items, key) in items.lists" key="key">{{items.name}}</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>

  <div class="main_contents" ref='contents'>
    <keep-alive>
      <router-view class="router-view"></router-view>
    </keep-alive>
  </div>

</div>
</template>
<script>
// 菜单数据
import AdministratorMenus from './mock/administrator.json';
import NormalMenus from './mock/normal.json';

export default {
  replace: false,
  name: 'app',
  data() {
    return {
      loginStatus: false,
      username: '',
      navListData: null,
      activeIndex: '1'
    }
  },
  components: {

  },
  created() {

    // 判断用户权限
    this.checkUserRole();

    // 判断是否登录
    this.isLogin();

    // 显示用户信息
    this.showUserInfo();

    // 暂时未知
    this.$root.$on('cuerrentUser', result => {
      this.loginStatus = true;
      this.showUserInfo();
    })

  },
  mounted() {

  },
  activated() {

  },
  deactivated() {

  },
  methods: {
    handleSelect(key, keyPath) {
      var url_router = key.split('.')[0]; // 去除.vue后缀名
      this.$router.push({
        name: url_router
      })
    },
    setUserMensList(menusData) {
      let ul_obj = {};
      let nava_data_array = [];
      menusData.forEach((value) => {
        if (ul_obj[value.group]) {
          ul_obj[value.group].push({
            name: value.name,
            desc: value.desc,
            link: value.link
          });
        } else {
          ul_obj[value.group] = [];
        }
      });

      for (var key in ul_obj) {
        if (ul_obj.hasOwnProperty(key)) {
          // 过来空的
          if (ul_obj[key].length) {
            nava_data_array.push({
              name: key,
              lists: ul_obj[key],
            })
          }
        }
      }
      this.navListData = nava_data_array;
    },
    // 菜单方法
    getUserMenus(typeUsers) {
      switch (typeUsers) {
        case 'Administrator':
          this.setUserMensList(AdministratorMenus.menuItemList)
          break;
        case 'Normal':
          this.setUserMensList(NormalMenus.menuItemList)
          break;
        default:
          this.setUserMensList(NormalMenus.menuItemList)
      }
    },
    showUserInfo() {
      if (AV.User.current()) {
        if (AV.User.current().toJSON().nickname == '未设置') {
          this.username = AV.User.current().toJSON().username
        } else {
          this.username = AV.User.current().toJSON().nickname
        }
      }
    },
    isLogin() {
      if (AV.User.current()) {
        this.loginStatus = true;
      } else {
        this.loginStatus = false;
      }
    },
    signOut() {
      this.loginStatus = false;
      localStorage.removeItem('AV/U2t6qtitHAEY03hCEqk51X9n-gzGzoHsz/currentUser')
      this.$router.push({
        name: 'login'
      });
    },
    checkUserRole() {
      var that = this;
      var roleQuery = new AV.Query(AV.Role);
      roleQuery.equalTo('users', AV.User.current());
      roleQuery.find().then(function(roles) {
        // roles 是一个 AV.Role
        // 数组，这些 AV.Role 表示当前用户所拥有的角色
        // 临时模拟
        if (roles.length == 0) {
          that.getUserMenus('Normal'); //
        } else {
          that.getUserMenus('Administrator');
        }
      }, function(error) {
        console.log(error);
      });
    }
  }
}
</script>
<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
    text-align: center;
    color: #2c3e50;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0;
}

#app .login-box {
    position: absolute;
    width: 200px;
    height: 60px;
    right: 26px;
    color: #bfcbd9;
    font-size: 14px;
    line-height: 60px;
    z-index: 10000;
    font-weight: bold;
}
#app > .main_contents {
    width: 100%;
}

</style>
