export default {
  state: {
    user: {},
    token: false,

  },
  getters: {},
  mutations: {
    //初始化 用户信息
    initUser(state) {
      let user = window.sessionStorage.getItem('user')
      if (user) {
        state.user = JSON.parse(user)
        state.token = state.user.token
      }
    },
    //登录
    login(state, user) {
      //保存登录状态
      state.user = user
      state.token = user.token
      //  存储到本地
      window.sessionStorage.setItem('user', JSON.stringify(state.user))
      window.sessionStorage.setItem('token', state.token)

    },
    //退出
    logout(state) {
      //清除登录状态
      state.user = {}
      //清除本地存储
      state.token = false
      window.sessionStorage.clear()
      //  跳转页面
    }
  },
  action: {}
}