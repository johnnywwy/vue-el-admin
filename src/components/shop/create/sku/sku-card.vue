<template>
  <div class="card addRule">
    <div class="card-header">
      规格项：
      <el-input size="mini" :value="item.name"
                @input="vModel('name',index,$event)">
        <el-button slot="append" icon="el-icon-more"></el-button>
      </el-input>
      <el-radio-group size="mini" :value="item.type" @input="vModel('type',index,$event)">
        <el-radio :label="0">无</el-radio>
        <el-radio :label="1">颜色</el-radio>
        <el-radio :label="2">图片</el-radio>
      </el-radio-group>
      <!--上移-->
      <el-button
          class="ml-auto" icon="el-icon-arrow-up" :disabled="index===0"
          size="mini" @click="sortCard('moveUp',index)"></el-button>
      <!--下移-->
      <el-button
          icon="el-icon-arrow-down" size="mini" :disabled="total===index+1"
          @click="sortCard('moveDown',index)"></el-button>
      <!--删除-->
      <el-button size="mini" @click="delSkuCard(index)">删除</el-button>
    </div>
    <div class="card-body">
      <!--规格属性列表-->
      <div class="tab-wrapper">
        <sku-card-children
            :type="item.type" :key="index2"
            v-for="(item2,index2) in item.list"
            :item="item2" :index="index2"
            :card-index="index" :value-index="index2"
        >
        </sku-card-children>
      </div>
      <!--增加规格-->
      <div class="mt-2">
        <el-button
            type="text" size="mini"
            icon="el-icon-plus"
            @click="addSkuValue(index)"
        >
          增加规格值
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import skuCardChildren from './sku-card-children'
import {mapMutations} from 'vuex'

export default {
  props: {
    item: Object,
    index: Number,
    total: Number
  },
  components: {skuCardChildren},
  methods: {
    ...mapMutations(
        [
          'delSkuCard',
          'vModelSkuCard',
          'sortSkuCard',
          'addSkuValue',
        ]
    ),
    vModel(key, index, value) {
      this.vModelSkuCard({key, index, value})
    },
    //排序规则卡片
    sortCard(action, index) {
      this.sortSkuCard({action, index})
    }
  }

};
</script>

<style lang="scss">
.addRule {
  line-height: 1.2em;
  margin-bottom: 10px;

  .card-header {
    display: flex;
    align-items: center;

    .el-input {
      width: 200px;
    }

    .el-radio-group {
      margin-left: 20px;
      margin-bottom: -10px;
    }

  }

  .card-body {

    .tab-wrapper {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      div {
        //border: 1px solid red;
        display: flex;
        align-items: center;
        position: relative;

        .close-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          line-height: 1;
        }

        input {
          text-align: center;
          width: 80px;
          font-size: 15px;
        }
      }
    }
  }
}

</style>