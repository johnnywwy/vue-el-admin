<template>
  <div class="border py-2 px-3 rounded">
    <div class="mr-2" v-if="type!==0">
      <!--颜色选择器-->
      <el-color-picker size="mini" v-if="type===1"></el-color-picker>
      <!--图片选择器-->
      <span v-else class="btn btn-light border">
        <i class="el-icon-plus"></i>
      </span>
    </div>
    <input type="text" value="内容" class="form-control border-0">
    <span class="btn btn-light p-0 close-btn">
      <i class="el-icon-circle-close"></i>
    </span>
  </div>
</template>

<script lang="ts">
export default {
  name: 'sku-card-children',
  props: {
    type: {
      type: Number,
      default: 0
    }
  }

};
</script>

<style lang="scss">

</style>