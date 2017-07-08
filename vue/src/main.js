// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Mint from 'mint-ui';
import axios from 'common/js/axios';
import 'mint-ui/lib/style.css';
import 'common/stylus/index.styl';
import store from './store';
import ctx from 'common/js/front.context.g';
import config from '../static/json/config.g';

Vue.config.productionTip = false;
Vue.use(Mint);
Vue.use(axios);

// 初始化leancloud
ctx.initLeanCloud();

// 打包类型wx:微信 app:Cordova APP web:Web
window.buildType = config.project_build_type;
if (window.buildType === 'app') {
  let cordovaScript = document.createElement('script');
  cordovaScript.setAttribute('src', 'cordova.js');
  document.getElementsByTagName('head')[0].appendChild(cordovaScript);
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
  data: {
    eventHub: new Vue()
  }
});

