import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    shopcartList: [],
    goodsSelectAll: false,
    username: '',
    password: '',
    selectedAddressId: '',
    navbarType: 0,
    GPSCity:'',
    distance:'',
    isEnabled:false
  },
  getters: {
    /**
     * 获取购物车店铺全选状态
     * @param state
     * @returns {boolean}
     */
    getSelectStoreState: state => {
      let i = state.shopcartList.length;
      while (i--) {
        if (!state.shopcartList[i].partner_info.select) {
          return false;
        }
        if (state.shopcartList[i].partner_info.select === true && i === 0) {
          return true;
        }
      }
    },
    /**
     * 获取购物车选中商品
     * @param state
     * @returns {Array}
     */
    getSelectGoods: state => {
      let goodsList = [];
      state.shopcartList.forEach((item) => {
        item.product_list.forEach((product) => {
          if (product.select) {
            goodsList.push(product);
          }
        });
      });
      return goodsList;
    },
    /**
     * 获取购物车选中商品ID
     * @param state
     * @returns {Array}
     */
    getSelectGoodsId: state => {
      let goodsIdList = [];
      state.shopcartList.forEach((item) => {
        item.product_list.forEach((product) => {
          if (product.select) {
            goodsIdList.push(product.id);
          }
        });
      });
      return goodsIdList;
    },
    /**
     * 获取选中商品总价
     * @param state
     * @returns {number}
     */
    getShopcartTotalPrice: state => {
      let totalPrice = 0;
      state.shopcartList.forEach((item) => {
        item.product_list.forEach((product) => {
          if (product.select) {
            totalPrice += product.purchase_info.price * product.quantity;
          }
        });
      });
      return totalPrice;
    },
    /**
     * 获取购物车选中商品数量
     * @param state
     * @returns {number}
     */
    getShopcatGoodsCount: state => {
      let goodsSelectCount = 0;
      state.shopcartList.forEach((item) => {
        item.product_list.forEach((goods) => {
          if (goods.select) {
            goodsSelectCount++;
          }
        });
      });
      return goodsSelectCount;
    }
  },
  mutations: {
    /**
     * 设置UserInfo
     * @param state
     * @param username
     * @param password
     */
    setUser(state, {username, password}) {
      state.username = username;
      state.password = password;
    },
    /**
     * 更新登录状态
     * @param state
     * @param loginState
     */
    updateLoginState(state, loginState) {
      state.loginState = loginState;
      console.log('login success');
    },
    /**
     * 更新购物车数据
     * @param state
     * @param shopcartList
     */
    updateShopcartList(state, shopcartList) {
      state.shopcartList = shopcartList;
      console.log('shopcartList update success');
      // console.log(state.shopcartList);
    },
    /**
     * 更新商品选中状态
     * @param state
     * @param storeId 店铺ID
     * @param index 选中商品的下标
     */
    updateGoodsSelectState(state, {storeId, index}) {
      let newShopcartList = state.shopcartList.map((item) => {
        if (item.partner_info.id === storeId) {
          item.product_list[index].select = !item.product_list[index].select;
          let i = item.product_list.length;
          while (i--) {
            if (!item.product_list[i].select) {
              item.partner_info.select = false;
              return;
            }
            if (item.product_list[i].select === true && i === 0) {
              item.partner_info.select = true;
            }
          }
        }
        return item;
      });
      state = newShopcartList;
    },
    /**
     * 更新店铺选中状态
     * @param state
     * @param storeId 店铺ID
     */
    updateStoreSelectState(state, storeId) {
      // 遍历购物车改变店铺和商品的选中状态
      let newShopcrtList = state.shopcartList.map((item) => {
        if (item.partner_info.id === storeId) {
          item.partner_info.select = !item.partner_info.select;
          // 如果是选中商铺则选中该商铺中的所有商品 反之。。。
          for (let key in item.product_list) {
            item.product_list[key].select = item.partner_info.select;
          }
        }
        return item;
      });
      state.shopcartList = newShopcrtList;
    },
    /**
     * 全选||反选商品
     * @param state
     * @param type true:全选 false：反选
     */
    setAllGoodsSelect(state, type) {
      let newShopcartList = state.shopcartList.map((item) => {
        item.partner_info.select = type;
        for (let key in item.product_list) {
          item.product_list[key].select = type;
        }
        return item;
      });
      state.shopcartList = newShopcartList;
    },
    /**
     * 设置当前选中的收货地址ID
     */
    setCurrentAddressId(state, addressId) {
      state.selectedAddressId = addressId;
    },
    /**
     * 设置tabnav切换显示
     * @param state
     * @param num 显示状态
     * */
    setNavBar(state, num) {
      state.navbarType = num;
    },
    /*
    * 获取定位的城市
    * */
    getGPSCity(state,city){
      state.GPSCity = city;
    },
    /*
    * 主店距离使用者的距离
    * */
    getDistance(state,distance){
      state.distance = distance;
      console.log(state.distance);
    },
    /*
    * 获取快乐同行的展示和隐藏字段:isEnabled
    * */
    getIsEnabled(state,isEnabled){
      state.isEnabled = isEnabled;
      console.log(state.isEnabled);
    }
  }
});
export default store;
