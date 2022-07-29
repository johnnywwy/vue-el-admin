<template>
  <div class="card addRule">
    <div class="card-header">
      规格项：
      <el-input size="mini" :value="item.name"
                @input="vModel('name',index,$event)">
        <el-button
            slot="append" icon="el-icon-more" @click="chooseSkus"
        ></el-button>
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
            v-for="(item2,index2) in list"
            :item="item2" :index="index2"
            :card-index="index" :value-index="index2"
            v-dragging="{ item: item2, list: list, group: `skuItem${index}` }"
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
  inject: ['app'],
  components: {skuCardChildren},
  props: {
    item: Object,
    index: Number,
    total: Number
  },
  data() {
    return {
      list: this.item.list
    }
  },
  mounted() {
    //监听结束过程
    this.$dragging.$on('dragend', (e) => {
      if (e.group === 'skuItem' + this.index) {
        this.sortSkuValue({
          index: this.index,
          value: this.list
        })
      }
    })
    //监听list变化
    this.$watch('item.list', (newValue) => {
      this.list = newValue
    })
  },
  methods: {
    ...mapMutations(
        [
          'delSkuCard',
          'vModelSkuCard',
          'sortSkuCard',
          'addSkuValue',
          'sortSkuValue'
        ]
    ),
    vModel(key, index, value) {
      this.vModelSkuCard({key, index, value})
    },
    //排序规则卡片
    sortCard(action, index) {
      this.sortSkuCard({action, index})
    },
    //选择规格
    chooseSkus() {
      this.app.chooseSkus((res) => {
        console.log(res)
        this.vModel('name', this.index, res.name)
        this.vModel('type', this.index, res.type)
        this.vModel('list', this.index, res.list)
        this.list = res.list
      })
    }
  },


};
</script>

<style lang="scss" scoped>
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
        display: flex;
        align-items: center;
        position: relative;


        .close-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          line-height: 1;
        }


      }
    }
  }
}

</style>