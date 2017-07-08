import AV from 'leancloud-storage';
import Router from 'vue-router';
import Vue from 'vue';
import config from '../../static/json/config.g.json';
import ctx from 'common/js/front.context.g';
// import home from 'components/home/home/home';
import login from 'components/login/login';
import pictureManagement from 'components/common/PictureManagement/PictureManagement'
Vue.use(Router);

const routerJSON = require('../../static/json/router.g.json');
let routerMode;
switch (config.project_build_type) {
    case 'wx':
        // routerMode = 'history';
        routerMode = 'hash';
        break;
    case 'app':
        routerMode = 'hash';
        break;
    default:
        routerMode = 'hash';
        break;
}

let routersArr = [
    //   {
    //   path: '/',
    //   name: 'home',
    //   component: home
    // },
    {
        path: '/login',
        name: 'login',
        component: login
    },
    {
        path: '/pictureManagement',
        name: 'pictureManagement',
        component: pictureManagement
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
    if (config.project_build_type === 'wx') {
        ctx.initWechatSDK();
    }
    // 校验登录状态 未跳转到登录页面
    if (to.path !== '/' && to.path !== '/category/category_c/category' && to.path !== '/item/goods_detail/goods_detail' && to.path !== '/customer/view_agreement/agreement' && to.path !== '/login' && !ctx.getCurrentUser()) {
        next({ name: 'login' });
    } else if (to.path === '/order/order_submit/goods_order_submit' || to.path === '/order/order_submit/service_order_submit') {
        let user = new AV.Query('_User');
        user.get(AV.User.current().id).then((user) => {
            if (!user.get('mobilePhoneVerified'))
                next({ name: 'customer/verify_mobiel_phone/verify_mobiel_phone' });
            else
                next();
        });
    } else {
        next();
    }
});

export default router;