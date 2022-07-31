import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router.js'
import './plugins/element.js'
import store from './store'

import {Message} from 'element-ui'


// 添加请求拦截器
// eslint-disable-next-line no-undef
axios.interceptors.request.use((config) => {
  console.log(config)
  // 在发送请求之前做些什么
  return config;
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error);
});


// 添加响应拦截器
// eslint-disable-next-line no-undef
axios.interceptors.response.use((response) => {
  // 对响应数据做点什么
  console.log('相应拦截器 成功')
  return response;
}, (err) => {
  // 全局错误提示
  if (err.response && err.response.data && err.response.data.errorCode) {
    Message.error(err.response.data.msg)
  }
  return Promise.reject(err);
});

//引入拖拽排序
import VueDND from 'awe-dnd'

Vue.use(VueDND)

//引入全局配置文件
import $conf from './common/config/config'

Vue.prototype.$conf = $conf

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
