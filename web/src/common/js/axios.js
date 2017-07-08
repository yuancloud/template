import axios from 'axios'

const instance = axios.create({
  // baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});

let plugin = Vue => {
  if (plugin.instance) {
    return
  }
  Vue.prototype.$http = instance
}

if (typeof window != 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
