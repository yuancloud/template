import axios from 'axios';
import {getStorage} from 'common/js/util';
import {Toast} from 'mint-ui';
const instance = axios.create({
  // baseURL: 'http://lztogether.leanapp.cn/',
  timeout: 5000,
  withCredentials: false,
  auth: {
    username: '',
    password: ''
  },
  headers: {
    'Accept': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded'
    // 'X-CSRFToken': getCookie('csrftoken')
  }
});
// 请求之前
instance.interceptors.request.use(config => {
// Serialize.decode(config);
  let username, password;
  // 如果未登录过滤授权
  if (getStorage('user')) {
    username = getStorage('user').username;
    password = getStorage('user').password;
  }
  if (username && password) {
    config.auth.username = username;
    config.auth.password = password;
    console.log('auth' + config.auth);
  } else {
    delete config.auth;
  }
  return config;
});
// 请求完成
instance.interceptors.response.use(response => {
  return response.data;
}, err => {
  // console.log(err.response.data);
  if (err.response) {
    // 封装错误拦截提示
    if (err.response.data.reason) {
      Toast({
        message: err.response.data.reason,
        position: 'bottom',
        duration: 1000
      });
    }
    axios.post('/v1/error', err.response);
    return Promise.reject(err.response.data);
  }
  return Promise.reject({code: 1024, message: err.message});
});

function plugin(Vue) {
  if (plugin.installed) {
    return;
  }
  Vue.prototype.$http = instance;
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

export default plugin;
