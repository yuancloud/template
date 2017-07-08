import Router from 'vue-router';
import Vue from 'vue';
//import config from '../../config/project.config';
import home from 'components/setting/default/index.g';
import runall from 'components/home/runall.g';
Vue.use(Router);

const routerJSON = require('../../static/json/router.g.json');
let routerMode = 'hash';
// switch (config.buildType) {
//     case 'wx':
//         // routerMode = 'history';
//         routerMode = 'hash';
//         break;
//     case 'app':
//         routerMode = 'hash';
//         break;
//     default:
//         routerMode = 'hash';
//         break;
// }

let routersArr = [{
        path: '/',
        name: 'home',
        component: home
    },
    {
        path: '/runall',
        name: 'runall',
        component: runall
    }
];

let routerJsonArr = routerJSON.routerList;

routerJsonArr.forEach((value, index) => {
    value = value.substring(0, value.length - 4);
    routersArr.push({
        path: `/${value}`,
        name: value,
        component: require(`../components/${value}`)
    });
});

let router = new Router({
    mode: routerMode,
    routes: routersArr,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
});

router.beforeEach((to, from, next) => {
    //路由切换回滚到顶部
    // window.scrollTo(0, 0);
    // 路由改变时重新初始化微信SDK 否则会导致签名失败
    // if (config.buildType === 'wx') {
    //     ctx.initWechatSDK();
    // }
    // 校验登录状态 未跳转到登录页面
    // if (to.path !== '/' && to.path !== '/category/category_c/category' && to.path !== '/item/goods_detail/goods_detail' && to.path !== '/login' && !ctx.getCurrentUser()) {
    //     next({ name: 'login' });
    // } else {
    //     next();
    // }
    next();
});

export default router;