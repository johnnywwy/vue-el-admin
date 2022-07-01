import Vue from 'vue'
import Router from 'vue-router'

import layout from './views/layout'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'layout',
      component: layout,
    },
    {
      path: '/login',
      name: 'login',
      component: ()=>import('./views/login/index.vue'),

    }
  ]
})