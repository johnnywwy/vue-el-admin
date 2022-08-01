export default {
  state: {
    navBar: {
      active: '0',
      list: []
    },
    rules: [

    ]
  },
  getters: {},
  mutations: {
    //  创建菜单
    createNavBar(state, menus) {
      let list = menus.map(item => {
        let submenu = item.child.map(v => {
          return {
            icon: v.icon,
            name: v.name,
            pathname: v.desc
          }
        })
        return {
          name: item.name,
          subActive: '0',
          submenu: submenu
        }
      })
      state.navBar.list = list
      window.sessionStorage.setItem('navBar', JSON.stringify(state.navBar))
    },
    //  初始化菜单
    initNavBar(state) {
      let navBar = window.sessionStorage.getItem('navBar')
      navBar = navBar ? JSON.parse(navBar) : {
        active: '0',
        list: []
      }
      state.navBar = navBar
    }

  },
  action: {}
}