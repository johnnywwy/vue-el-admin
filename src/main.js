import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import './plugins/element.js'
import store from './store'


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
