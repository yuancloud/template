// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './common/stylus/index.styl'
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './common/js/axios'
import config from '../static/json/config.g'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(axios)

// leancloud初始化
AV.setProduction(config.lean_stg);
const APP_ID = config.lean_app_id;
const APP_KEY = config.lean_app_key;
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

// 加入AV调试模式
export default process.env.NODE_ENV !== 'production' ? window.AV = AV : [];


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})
