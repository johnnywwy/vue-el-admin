<template>
  <div id="app">
    <router-view></router-view>
    <image-dialog ref="imageDialog" :max="maxChooseImageValue"></image-dialog>
  </div>
</template>

<script>
import imageDialog from './components/image/image-dialog'

export default {
  name: 'app',
  components: {imageDialog},

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
  methods: {
    showChooseImage(callback, max = 9) {
      this.maxChooseImageValue = max
      this.$refs.imageDialog.showChooseImage(callback)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "assets/css/common.css";


</style>
