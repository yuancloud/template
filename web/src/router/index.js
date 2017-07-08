import Vue from 'vue'
import Router from 'vue-router'

import home from '../components/home/home.vue'
import login from '../components/login/login'

import { Message } from 'element-ui'

const routerJSON = require('../../static/json/router.g.json')

Vue.use(Router)

let routersArr = [{
    path: '/',
    name: 'home',
    component: home
}, {
    path: '/login',
    name: 'login',
    component: login
}]

let routerJsonArr = routerJSON.routerList
routerJsonArr.forEach((value, index) => {
    let valueStr = value.slice(0, -4)
    routersArr.push({
        path: `/${valueStr}`,
        name: valueStr,
        component: require(`../components/${value}`)
    })
})

let router = new Router({ routes: routersArr })

router.beforeEach((to, from, next) => {
    // to.name !== 'home' && to.name !== 'classify' && to.name !== 'lzHomeHome' && to.name !== 'lzShopHome' && to.name !== 'goodsDetail' &&  && to.name !== 'passwordReset' && to.name !== 'passwordFind' && to.name !== 'registerNow'
    // let user = ''

    if (to.name !== 'login' && !AV.User.current()) {
        Message('请先登录')
        next({ name: 'login' });
    } else {
        next();
    }
})

export default router
