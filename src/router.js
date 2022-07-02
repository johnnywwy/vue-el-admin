import Vue from 'vue'
import Router from 'vue-router'
import routes from './common/config/router'

Vue.use(Router)


const RouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return RouterPush.call(this, to).catch(err => err)
}

export default new Router({
  routes
})