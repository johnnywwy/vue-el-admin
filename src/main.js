import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import './plugins/element.js'

//引入全局配置文件
import $conf from './common/config/config'

Vue.prototype.$conf = $conf

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
