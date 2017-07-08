import 'mint-ui/lib/style.css';
import 'common/stylus/index.styl';

import AV from 'leancloud-storage';
import App from './App';
import Mint from 'mint-ui';
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'common/js/axios';
import faker from 'faker'
import router from './router';
import store from './store';
const config = require('../static/json/config.g.json');

Vue.config.productionTip = false;
Vue.use(Mint);
Vue.use(axios);
//business01@lztogether.com 自动化测试
// const APP_ID = 'Y882ysbqp8Ci36a3p8gNePfk-gzGzoHsz';
// const APP_KEY = 'keF1fnxFQ6atMujLSTLeTIz2';

//liuganghao@live.cn test 18888888888 320175
//const APP_ID = '2kYU5ORb65PfCvAPujD6Ntd8-gzGzoHsz';
//const APP_KEY = 'upeSs70fgPAfdFv7ey3w57wv';

//jiangenbo  18888888888 759029
const APP_ID = config.lean_app_id;
const APP_KEY = config.lean_app_key;

//inchmx@gmail.com test 15311370851 440023
// const APP_ID = 'eAPvXceOY87VDhmV9nxzfQc3-gzGzoHsz';
// const APP_KEY = 'yldO56djEhhPSotgGARUvabP';
AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});
faker.locale = 'zh_CN'
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
    data: {
        eventHub: new Vue()
    }
});
