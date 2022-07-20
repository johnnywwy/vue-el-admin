<template>
  <el-form ref="form" label-width="80px">
    <el-form-item label="添加规格">
      <div
          class="card addRule" :key="index"
          v-for="(item,index) in sku_card">
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
          <el-button class="ml-auto" icon="el-icon-arrow-up" size="mini"></el-button>
          <el-button icon="el-icon-arrow-down" size="mini"></el-button>
          <el-button size="mini" @click="delSkuCard(index)">删除</el-button>
        </div>
        <div class="card-body">
          <!--规格属性列表-->
          <!--增加规格-->
          <div>
            <el-button
                type="text" size="mini"
                icon="el-icon-plus">
              增加规格值
            </el-button>
          </div>
        </div>
      </div>
      <el-button
          type="success"
          size="mini"
          @click="addSkuCard">
        添加规格
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {mapMutations, mapState} from 'vuex'

export default {
  computed: {
    ...mapState({
      sku_card: state => state.goods_create.sku_card
    })
  },
  methods: {
    ...mapMutations(['addSkuCard', 'delSkuCard', 'vModelSkuCard']),
    vModel(key, index, value) {
      this.vModelSkuCard({key, index, value})

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
}

</style>