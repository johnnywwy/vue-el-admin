<template>
  <div id="app">
    <router-view></router-view>
    <image-dialog ref="imageDialog" :max="maxChooseImageValue"></image-dialog>
    <skus-dialog ref="skusDialog"></skus-dialog>
  </div>
</template>

<script>
import imageDialog from './components/image/image-dialog'
import skusDialog from './components/skus/skus-dialog'

export default {
  name: 'app',
  components: {imageDialog, skusDialog},

  //依赖注入
  provide() {
    return {
      app: this
    }
  },
  data() {
    return {
      maxChooseImageValue: 9
    }
  },
  created() {
    //初始化用户信息
    this.$store.commit('initUser')
    //  初始化 后台菜单
    this.$store.commit('initNavBar')
  },
  methods: {
    //选择图片
    showChooseImage(callback, max = 9) {
      this.maxChooseImageValue = max
      this.$refs.imageDialog.showChooseImage(callback)
    },
    //  选择规格
    chooseSkus(callback) {
      this.$refs.skusDialog.showChooseSkus(callback)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "assets/css/common.css";


</style>
