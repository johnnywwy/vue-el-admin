<template>
  <div class="border py-2 px-2 rounded mr-2 mt-2">
    <div class="mr-2" v-if="type!==0">
      <!--颜色选择器-->
      <el-color-picker
          size="mini" v-if="type===1"
          :value="item.color" @change="onColorChange"
      ></el-color-picker>
      <!--图片选择器-->
      <template v-else>
        <span v-if="!item.image" class="btn btn-light border" @click="chooseImage">
          <i class="el-icon-plus"></i>
        </span>
        <img :src="item.image" v-else class="image rounded" @click="chooseImage">
      </template>

    </div>
    <input
        type="text" :value="item.name" @input="inputChange"
        class="form-control border-0">
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
  inject: ['app'],
  props: {
    type: {
      type: Number,
      default: 0
    },
    item: Object,
    cardIndex: Number,
    valueIndex: Number

  },
  methods: {
    ...mapMutations(['delSkuValue', 'updateSkuValue']),
    inputChange(e) {
      this.vModel('name', e.target.value)
    },
    vModel(key, value) {
      this.updateSkuValue({
        cardIndex: this.cardIndex,
        valueIndex: this.valueIndex,
        key,
        value
      })
    },
    //选择图片
    chooseImage() {
      this.app.showChooseImage((res) => {
        this.vModel('image', res[0].url)
      }, 1)
    },
    //监听颜色变化
    onColorChange(e){
      this.vModel('color', e)
    }
  }

};
</script>

<style lang="scss" scoped>
.image {
  width: 45px;
  height: 45px;
  cursor: pointer;
}

div {
  input {
    text-align: center;
    width: 80px;
    font-size: 15px;
  }

  .close-btn {
    position: absolute;
    top: -10px;
    right: -10px;
    line-height: 1;
  }

}

</style>