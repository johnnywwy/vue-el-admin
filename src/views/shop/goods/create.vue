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
              <template v-if="!updateAllStatus">
                <el-button
                    type="text" :key="btnIndex"
                    @click="openUpdateAllStatus(btn)"
                    v-for="(btn,btnIndex) in updateList">
                  {{ btn.name }}
                </el-button>
              </template>
              <div class="d-flex align-items-center" v-else>
                <el-input
                    size="small" style="width: 150px;"
                    class="mr-2" type="number" v-model="updateAllValue"
                    :placeholder="UpdateAllPlaceholder">
                </el-input>
                <el-button
                    type="primary"
                    size="mini"
                    @click="updateAllSubmit"
                >设置
                </el-button>
                <el-button
                    type="info" size="mini"
                    @click="closeUpdateAllStatus">
                  取消
                </el-button>
              </div>

            </el-form-item>
            <el-form-item label="规格设置">
              <sku-table ref="table"></sku-table>
            </el-form-item>
            <el-form-item label="添加规格">
              添加规格
            </el-form-item>
          </el-form>
        </template>
      </el-tab-pane>
      <el-tab-pane label="商品属性">
        <el-form ref="form" label-width="80px">
          <el-form-item label="商品类型">
            <el-select
                placeholder="请选择商品类型"
                :value="goods_type_id" @change="vModel('goods_type_id',$event)">
              <el-option label="上海" value="shanghai"></el-option>
              <el-option label="北京" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-card class="box-card">
            <div slot="header" class="clearfix py-1 ">
              <span>商品属性</span>
            </div>
            <el-form ref="form" label-width="80px">
              <el-form-item label="手机型号">
                <el-input style="width: 300px;"
                          :value="goods_attrs.phone_model"
                          @input="vModelGoodsAttrs({key:'phone_model',value:$event})"
                          placeholder="请输入">
                </el-input>
              </el-form-item>
              <el-form-item label="单项选框">
                <el-radio v-model="radio1" label="1" border>区域一</el-radio>
              </el-form-item>
              <el-form-item label="多项选框">
                <el-radio v-model="radio2" label="1" border>区域二</el-radio>
              </el-form-item>
            </el-form>
          </el-card>

        </el-form>
      </el-tab-pane>
      <el-tab-pane label="媒体设置">
        <el-form label-width="80px">
          <el-form-item label="商品大图">
            <div class="d-flex flex-wrap">
              <div
                  style="
                  width: 150px;
                  height: 150px;
                  cursor: pointer;
                  position:relative;
                  ;"
                  class="border rounded mr-2 mb-2
                  d-flex align-items-center
                  justify-content-center"
                  @click="chooseImage(index)"
                  v-for="(item,index) in banners" :key=index
              >
                <img v-if="item.url" :src="item.url" style="width: 100%;" alt="123">
                <i v-else class="el-icon-plus text-muted" style="font-size: 30px"></i>
                <i
                    class="el-icon-delete p-2  text-white"
                    style="position:absolute;top: 0; right: 0;
                    background-color:rgba(0,0,0,0.2);" @click.stop="deleteImage(index)"></i>
              </div>
              <div
                  style="
                  width: 150px;
                  height: 150px;
                  cursor: pointer;"
                  class="border rounded mr-2 mb-2
                  d-flex align-items-center
                  justify-content-center"
                  @click="chooseImage(-1)"
                  v-if="banners.length < 9"
              >
                <i class="el-icon-plus text-muted" style="font-size: 30px"></i>
              </div>

            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品详情">
        <!--富文本编辑器-->
        <tinymce v-model="msg" ref="editor" @onClick="onClick"></tinymce>
      </el-tab-pane>
      <el-tab-pane label="折扣设置">
        <el-form ref="form" label-width="80px">
          <el-form-item label="会员价">
            <el-input :value="discount" style="width: 250px;" @input="vModel('discount',$event)">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import baseCreate from '../../../components/shop/create/base-create'
import singleAttrs from '../../../components/shop/create/single-attrs'
import skuCard from '../../../components/shop/create/sku/sku-card'
import skuTable from '../../../components/shop/create/sku-table'
import tinymce from '../../../components/common/tinymce'

export default {
  inject: ['app'],
  components: {baseCreate, singleAttrs, skuCard, skuTable, tinymce},
  data() {
    return {
      tabIndex: 0,
      msg: '啦啦啦啦,tinymce',
      //批量修改
      updateAllStatus: false,
      updateList: [
        {name: '销售价', key: 'pprice'},
        {name: '市场价', key: 'cprice'},
        {name: '成本价', key: 'oprice'},
        {name: '库存', key: 'stock'},
        {name: '体积', key: 'volume'},
        {name: '重量', key: 'weight'},
        {name: '编码', key: 'code'},
      ],
      UpdateAllPlaceholder: '',
      updateAllValue: '',

      //选择框
      radio1: '1',
      radio2: '1',

    };
  },
  computed: {
    ...mapState({
      skus_type: state => state.goods_create.skus_type,
      sku_card: state => state.goods_create.sku_card,
      banners: state => state.goods_create.banners,
      goods_type_id: state => state.goods_create.goods_type_id,
      goods_attrs: state => state.goods_create.goods_attrs,
      discount: state => state.goods_create.discount,
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
    ...mapMutations(['vModelState', 'addSkuCard', 'vModelGoodsAttrs']),
    //修改表单的值
    vModel(key, value) {
      this.vModelState({key, value})
      console.log(this.discount)
    },
    //加载数据
    handleClick() {
    },
    //鼠标点击事件
    onClick(e, editor) {
      console.log('element clicked')
      console.log(e)
      console.log(editor)
    },
    //  修改批量设置状态
    openUpdateAllStatus(item) {
      this.updateAllStatus = item.key
      this.UpdateAllPlaceholder = item.name
    },
    //  取消批量设置
    closeUpdateAllStatus() {
      this.updateAllStatus = false
      this.UpdateAllPlaceholder = ''
      this.updateAllValue = ''
    },
    //提交批量设置
    updateAllSubmit() {
      this.$refs.table.list.forEach(item => {
        console.log(this.updateAllStatus)
        item[this.updateAllStatus] = this.updateAllValue
      })
      this.closeUpdateAllStatus()
      this.updateAllValue = ''
    },
    //选择图片
    chooseImage(index) {
      const MAX = 9
      let count = MAX - this.banners.length
      this.app.showChooseImage(res => {
        let list = []
        if (index === -1) {
          list = [...this.banners, ...res]
        } else {
          list = [...this.banners]
          list[index] = res[0]
        }
        this.vModel('banners', list)
      }, index === -1 ? count : 1)
    },
    //删除选中图片
    deleteImage(index) {
      this.$confirm('是否删除选中图片?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let list = [...this.banners]
        list.splice(index, 1)
        this.vModel('banners', list)
      })

    }
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