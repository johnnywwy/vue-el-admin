<template>
  <div>
    <el-container class="nav-container">
      <el-header>
        <a class="logo"><h5>UNI-ADMIN</h5></a>
        <el-menu
            :default-active="navBarIndex"
            mode="horizontal"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">商品</el-menu-item>
          <el-menu-item index="3">订单</el-menu-item>
          <el-menu-item index="4">会员</el-menu-item>
          <el-menu-item index="5">设置</el-menu-item>

          <el-submenu index="100">
            <template slot="title">
              <el-avatar :size="sizeList" :src="circleUrl"></el-avatar>
              <span class="username">summer</span>
            </template>
            <el-menu-item index="100-1">修改</el-menu-item>
            <el-menu-item index="100-2">退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-container class="aside-container">
        <!--侧边布局-->
        <el-aside width="200px">
          <el-row class="tac">
            <el-col>
              <el-menu default-active="1" @select="slideSelect">
                <el-menu-item index="1">
                  <i class="el-icon-location"></i>
                  <span slot="title">导航一</span>
                </el-menu-item>
                <el-menu-item index="2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">导航二</span>
                </el-menu-item>
                <el-menu-item index="3">
                  <i class="el-icon-document"></i>
                  <span slot="title">导航三</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <i class="el-icon-setting"></i>
                  <span slot="title">导航四</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <!--主内容布局-->
        <el-main class="main-container">
          <li v-for="i in 100" :key="i">
            {{ i }}
          </li>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navBarIndex: '1',
      sizeList: 'small',
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    slideSelect(key, keyPath) {
      console.log(key, keyPath);
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

  .el-header {
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

  > .aside-container {
    height: 100%;
    overflow: hidden;
  }

  > .main-container {
    height: 100%;
    overflow: hidden;
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