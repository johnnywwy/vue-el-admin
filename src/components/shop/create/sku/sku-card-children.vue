<template>
  <div class="border py-2 px-2 rounded mr-2 mt-2">
    <div class="mr-2" v-if="type!==0">
      <!--颜色选择器-->
      <el-color-picker size="mini" v-if="type===1"></el-color-picker>
      <!--图片选择器-->
      <span v-else class="btn btn-light border">
        <i class="el-icon-plus"></i>
      </span>
    </div>
    <input type="text" :value="item.name" class="form-control border-0">
    <!--删除按钮-->
    <span class="btn btn-light p-0 close-btn">
      <i class="el-icon-circle-close" @click="delSkuValue({cardIndex,valueIndex})"></i>
    </span>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'

export default {
  name: 'sku-card-children',
  props: {
    type: {
      type: Number,
      default: 0
    },
    item: Object,
    index: Number,
    cardIndex: Number,
    valueIndex: Number


  },
  methods: {
    ...mapMutations(['delSkuValue'])
  }

};
</script>

<style>

</style>