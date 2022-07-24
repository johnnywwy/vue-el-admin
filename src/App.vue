<template>
  <div id="app">
    <router-view></router-view>
    <el-dialog
        title="标题"
        :visible.sync="imageModel">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="imageModel = false">取 消</el-button>
    <el-button type="primary" @click="imageModel = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'app',
  //依赖注入
  provide() {
    return {
      app: this
    }
  },
  data() {
    return {
      imageModel: false
    }
  },
  methods: {
    //打开弹出层
    show() {
      this.imageModel = true
    },
    //取消
    hide() {
      this.imageModel = false
    },
    //确定
    confirm() {
      //选中的图片url
      //隐藏
      this.hide()

    }

  }
}
</script>

<style>
@import "assets/css/common.css";

</style>
