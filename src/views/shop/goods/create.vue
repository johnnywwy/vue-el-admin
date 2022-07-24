<template>
  <div class="wrapper">
    <router-link :to="{name:'shop_goods_list'}" class="linkBtn">
      <el-button size="mini">回到商品列表</el-button>
    </router-link>
    <el-tabs class="el-tabs-wrapper"
             v-model="tabIndex"
             @tab-click="handleClick">
      <el-tab-pane label="基础设置">
        <base-create></base-create>
      </el-tab-pane>
      <el-tab-pane label="商品规格">
        <!--规格选项-->
        <el-form ref="form" label-width="80px">
          <el-form-item label="商品规格">
            <el-radio-group :value="skus_type" size="medium"
                            @input="vModel('skus_type', $event)">
              <el-radio-button :label="0">单一规格</el-radio-button>
              <el-radio-button :label="1">多规格</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <!--单规格-->
        <template v-if="skus_type===0">
          <single-attrs></single-attrs>
        </template>

        <!--多规格-->
        <template v-else>
          <!--规格卡片-->
          <el-form ref="form" label-width="80px">
            <el-form-item label="添加规格">
              <sku-card v-for="(item,index) in sku_card" :key="index"
                        :item="item" :index="index" :total="skuCardTotal">
              </sku-card>
              <el-button type="success" size="mini" @click="addSkuCard">
                添加规格
              </el-button>
            </el-form-item>
          </el-form>
          <el-form ref="form" label-width="80px">
            <el-form-item label="批量设置">
              <el-button type="text">销售价</el-button>
              <el-button type="text">市场价</el-button>
              <el-button type="text">成本价</el-button>
              <el-button type="text">库存</el-button>
              <el-button type="text">体积</el-button>
              <el-button type="text">重量</el-button>
            </el-form-item>
            <el-form-item label="规格设置">
              <sku-table></sku-table>
            </el-form-item>
            <el-form-item label="添加规格">
              添加规格
            </el-form-item>
          </el-form>
        </template>
      </el-tab-pane>
      <el-tab-pane label="商品属性">商品属性</el-tab-pane>
      <el-tab-pane label="媒体属性">媒体属性</el-tab-pane>
      <el-tab-pane label="商品详情">基础设置</el-tab-pane>
      <el-tab-pane label="折扣设置">基础设置</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import baseCreate from '../../../components/shop/create/base-create'
import singleAttrs from '../../../components/shop/create/single-attrs'
import skuCard from '../../../components/shop/create/sku/sku-card'
import skuTable from '../../../components/shop/create/sku-table'

export default {
  components: {baseCreate, singleAttrs, skuCard, skuTable},
  data() {
    return {
      tabIndex: 0,
    };
  },
  computed: {
    ...mapState({
      skus_type: state => state.goods_create.skus_type,
      sku_card: state => state.goods_create.sku_card
    }),
    //其他计算属性
    //规格卡片总数
    skuCardTotal() {
      return this.sku_card.length
    }
  },
  mounted() {
    this.vModel({key: 'skus_type', value: 1})
  },
  methods: {
    ...mapMutations(['vModelState', 'addSkuCard']),
    //修改表单的值
    vModel(key, value) {
      this.vModelState({key, value})
    },
    //加载数据
    handleClick() {
    },
  }

};
</script>

<style lang="scss" scoped>
.wrapper {
  background: white;
  margin: -20px;
  margin-top: -15px;

  .el-tabs-wrapper {
    //border: 1px solid red;
    padding: 0 15px 15px 15px;

    .tab-content {
      display: flex;
      align-items: center;

      .input {
        margin-right: 1rem;
        width: 150px;
      }
    }

    .card-wrapper {
      .header {
        margin: -10px;
      }

      .el-form {
        .el-form-item {
          .el-input {
            width: 200px;
          }

          .el-select {
            width: 200px;
          }
        }


      }
    }

    .table-wrapper {
      margin-top: 15px;

      .commodity {
        h6 {
          font-weight: bold;
          color: deepskyblue;
          line-height: 25px;
        }

        p {
          color: #929392;
          line-height: 18px;
        }
      }
    }

  }

  .linkBtn {
    position: absolute;
    top: 12px;
    left: 180px;
  }

}

</style>