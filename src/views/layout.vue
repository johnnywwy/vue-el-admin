<template>
  <div>
    <el-container class="nav-container">
      <el-header>
        <a class="logo">
          <h5>{{ $conf.logo }}</h5>
        </a>
        <el-menu
            :default-active="navBar.active"
            mode="horizontal"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
          <el-menu-item
              :index="index|numToString"
              v-for="(item,index) in navBar.list "
              :key="index">
            {{ item.name }}
          </el-menu-item>

          <el-submenu index="100">
            <template slot="title">
              <el-avatar size="small"
                         src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
              <span class="username">summer</span>
            </template>
            <el-menu-item index="100-1">修改</el-menu-item>
            <el-menu-item index="100-2">退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-container>
        <!--侧边布局-->
        <el-aside width="200px">
          <el-row>
            <el-col>
              <el-menu :default-active="slideMenuActive" @select="slideSelect">
                <el-menu-item
                    :index="index|numToString"
                    v-for="(item,index) in slideMenus"
                    :key="index">
                  <i :class="item.icon"></i>
                  <span slot="title">{{ item.name }}</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <!--主内容布局-->
        <el-main>
          <!--面包屑导航-->
          <div v-if="bran.length > 0">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item
                  v-for="(item,index) in bran"
                  :key="index"
                  :to="{path:item.path}"
              >
                {{ item.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <router-view></router-view>
          <template>
            <el-backtop target=".el-main" style="right: 40px;bottom: 80px"></el-backtop>
          </template>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import common from '../common/mixins/common'

export default {
  mixins: [common],
  data() {
    return {
      navBar: [],
      bran: []
    };
  },
  created() {
    //初始化菜单
    this.navBar = this.$conf.navBar
    //获取面包屑导航
    this.getRouterBran()
    //初始化选中菜单
    this.initNavBar()

  },
  computed: {
    slideMenuActive: {
      get() {
        return this.navBar.list[this.navBar.active].subActive || '0'
      },
      set(val) {
        this.navBar.list[this.navBar.active].subActive = val
      }
    },
    slideMenus() {
      return this.navBar.list[this.navBar.active].submenu || []
    }
  },
  watch: {
    '$route'() {
      //本地存储
      localStorage.setItem('navActive', JSON.stringify({
        top: this.navBar.active,
        left: this.slideMenuActive
      }))

      this.getRouterBran()
    }
  },
  methods: {
    //获取面包屑导航
    getRouterBran() {
      let hasName = this.$route.matched.filter(value => value.name)
      let arr = []
      hasName.forEach((value) => {
        if (value.name === 'index' || value.name === 'layout') return
        arr.push({
          name: value.name,
          path: value.path,
          title: value.meta.title,
        })
      })
      if (arr.length > 0) {
        arr.unshift({name: 'index', path: '/index', title: '后台首页'})
      }
      this.bran = arr

    },

    //顶部导航栏
    handleSelect(key) {
      if (key === '100-1') {
        return console.log('修改资料')
      }
      if (key === '100-2') {
        return console.log('退出')
      }
      this.navBar.active = key
      //  默认跳转第一个
      this.slideMenuActive = '0'
      if (this.slideMenus.length > 0) {
        this.$router.push({
          name: this.slideMenus[this.slideMenuActive].pathname
        })
      }
    },

    //侧边导航栏
    slideSelect(key) {
      this.slideMenuActive = key
      //  跳转指定页面
      this.$router.push({
        name: this.slideMenus[key].pathname
      })
    },

    //
    initNavBar() {
      let value = localStorage.getItem('navActive')
      if (value) {
        value = JSON.parse(value)
        this.navBar.active = value.top
        this.slideMenuActive = value.left
      }

    }
  }
}
</script>

<style lang="scss" scoped>

.nav-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;

  > .el-header {
    background-color: #545c64;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    > .logo {
      color: #ffffff;
      text-align: center;
    }

    > .el-menu {


      > .el-menu-item {
      }

      > .el-submenu {

        .el-submenu__title {

          > .username {
            margin-left: 0.5em;
          }
        }
      }
    }
  }

  > .el-container {
    height: 100%;
    overflow: hidden;

    > .el-aside {
      border-right: 1px solid #e6e6e6;

      .el-menu {
        border-right: 0;
      }
    }

    > .el-main {
      color: #333;
      background: #f8f9fa;
      position: relative;

      .el-breadcrumb {
        background: white;
        padding: 20px;
        margin: -20px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 15px
      }

    }
  }
}


</style>