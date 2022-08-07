import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router.js'
import './plugins/element.js'
import store from './store'

import {Message} from 'element-ui'

let loading = null
let requestCount = 0

//显示loading
function showLoading() {
  if (requestCount === 0) {
    loading = Message({
      message: '加载中...',
      duration: 0
    })
  }
  requestCount++
}

//隐藏loading
function hideLoading() {
  if (requestCount > 0) {
    requestCount--
  }
  if (loading && requestCount === 0) {
    loading.close()
  }
}


// 添加请求拦截器
// eslint-disable-next-line no-undef
axios.interceptors.request.use((config) => {
  //添加header头
  let token = window.sessionStorage.getItem('token')
  if (config.token === true) {
    config.headers['token'] = token
  }

  //显示loading
  if (config.loading === true) {
    showLoading()
  }
  // 在发送请求之前做些什么
  // hideLoading()
  return config;
}, (error) => {
  //隐藏Loading
  hideLoading()
  // 对请求错误做些什么
  return Promise.reject(error);
});


// 添加响应拦截器
// eslint-disable-next-line no-undef
axios.interceptors.response.use((response) => {

  //隐藏Loading
  hideLoading()

  return response;
}, (err) => {

  // 全局错误提示
  if (err.response && err.response.data && err.response.data.errorCode) {
    Message.error(err.response.data.msg)
  }
  //隐藏Loading
  hideLoading()

  return Promise.reject(err);
});

//引入拖拽排序
import VueDND from 'awe-dnd'

Vue.use(VueDND)

//引入全局配置文件
import $conf from './common/config/config'

Vue.prototype.$conf = $conf


//引入自定义指令
Vue.directive('auth', {
  inserted(el, binding) {
    let user = window.sessionStorage.getItem('user')
    user = user ? JSON.parse(user) : {}
    if (!user.super) {
      let rules = user.ruleNames ? user.ruleNames : []
      let v = rules.find(item => item === binding.value)
      if (!v) {
        el.parentNode.removeChild(el)
      }
    }

  },
})


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
