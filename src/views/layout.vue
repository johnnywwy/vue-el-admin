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
              <el-menu default-active="1" @select="slideSelect">
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
          <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>活动管理</el-breadcrumb-item>
              <el-breadcrumb-item>活动列表</el-breadcrumb-item>
              <el-breadcrumb-item>活动详情</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <h3>123456789</h3>
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
      navBar: []
    };
  },
  created() {
    //初始化菜单
    this.navBar = this.$conf.navBar
  },
  computed: {
    slideMenuActive() {
      return this.navBar.list[this.navBar.active].subActive || '0'
    },
    slideMenus() {
      return this.navBar.list[this.navBar.active].submenu || []
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.navBar.active = key
    },
    slideSelect(key, keyPath) {
      console.log(key, keyPath);
      this.navBar.list[this.navBar.active].subActive = key
    },
  }
}
</script>

<style lang="scss">

.nav-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;

  > .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > .logo {
      color: #ffffff;
      text-align: center;
    }

    > .el-menu {

      > .el-menu-item {}

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
      .el-menu {
      }
    }

    > .el-main {
      .el-breadcrumb {
        padding: 20px;
        margin: -20px;
        border-bottom: 2px solid #ccc;
      }
    }
  }


  .el-header {
    background-color: #545c64;
    color: #fff;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }


}


</style>