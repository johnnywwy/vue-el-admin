import Vue from 'vue'
import Router from 'vue-router'
import routes from './common/config/router'

Vue.use(Router)


// const RouterPush = Router.prototype.push
// Router.prototype.push = function push(to) {
//   return RouterPush.call(this, to).catch(err => err)
// }

const router = new Router({routes})


//全局前置守卫
router.beforeEach((to, from, next) => {

  let token = window.sessionStorage.getItem('token')
  if (token) {//  已登录

    //防止重复登录
    if (to.path === '/login') {
      Vue.prototype.$message.error('请勿重复登录')
      return next({name: from.name ? from.name : 'index'})
    }
    //非重复登录，放行
    next()
  } else {
    //跳过登录页验证
    if (to.path === '/login') {
      return next()
    }
    //  未登录
    Vue.prototype.$message.error('请先登录')
    next({path: '/login'})
  }


})
export default router