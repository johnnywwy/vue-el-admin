<template>
  <div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
    <el-tabs v-model="activeName">
      <el-tab-pane label="支付设置" name="second">
        <el-table border class="mt-3"
                  :data="tableData"
                  style="width: 100%">
          <el-table-column
              label="支付方式">
            <template slot-scope="scope">
              <div class="d-flex align-items-center">
                <img :src="scope.row.src"
                     style="width: 40px;height: 40px;" class="rounded mr-2"/>
                <div class="d-flex flex-column" style="align-items: flex-start;">
                  <h6>{{ scope.row.name }}</h6>
                  <small class="d-block text-secondary">
                    {{ scope.row.desc }}
                  </small>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="操作"
              width="200">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="openModal(scope.$index)">配置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="购物设置" name="third">
        <el-form ref="form" :model="form" label-width="160px">
          <el-form-item label="未支付订单">
            <el-input type="number" size="mini" style="width: 25%;" placeholder="未支付订单"
            >
              <template slot="append">天后自动关闭</template>
            </el-input>
            <small class="text-secondary d-block">订单下单未付款，n天后自动关闭，设置0天不自动关闭</small>
          </el-form-item>
          <el-form-item label="已发货订单">
            <el-input type="number" size="mini" style="width: 25%;" placeholder="已发货订单"
            >
              <template slot="append">天后自动确认收货</template>
            </el-input>
            <small class="text-secondary d-block">如果在期间未确认收货，系统自动完成收货，设置0天不自动收货</small>
          </el-form-item>
          <el-form-item label="已完成订单">
            <el-input type="number" size="mini" style="width: 25%;" placeholder="已完成订单"
            >
              <template slot="append">天内允许申请售后</template>
            </el-input>
            <small class="text-secondary d-block">订单完成后 ，用户在n天内可以发起售后申请，设置0天不允许申请售后</small>
          </el-form-item>
          <el-form-item label="运费组合策略">
            <el-select type="number" size="mini"
                      style="width: 25%;" placeholder="请选择运费组合策略">
              <el-option label="区域一" value="shanghai">上海</el-option>
              <el-option label="区域二" value="beijing">北京</el-option>
            </el-select>
            <small class="text-secondary d-block">订单完成后 ，用户在n天内可以发起售后申请，设置0天不允许申请售后</small>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       size="mini" @click="submit">保存
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import common from '../../../common/mixins/common.js';

export default {
  // inject:['app','layout'],
  mixins: [common],
  data() {
    return {
      drawer: false,
      drawerId: 0,
      preUrl: 'express',

      activeName: 'second',
      tableData: [{
        name: '支付宝支付',
        key: 'alipay',
        desc: '该系统支持即时到账接口',
        src: 'https://img.ixintu.com/download/jpg/20201025/d8b7680b770a25592643bbf058c5141c_512_512.jpg!bg'
      }, {
        name: '微信支付',
        key: 'wxpay',
        desc: '该系统支持微信网页支付和扫码支付',
        src: 'https://pic.616pic.com/ys_img/00/03/79/SkfHaoi23t.jpg'
      }
      ],
      form: {
        customer: '',
        key: ''
      },

      createModal: false,
      modal: {
        name: '',
        order: 50,
        type: 0
      },
      modalIndex: -1,

      express_values: [10, 20, 30],


      props: {
        multiple: true,
        label: 'name',
        value: 'name'
      },
      options: []


    }
  },
  filters: {
    formatType(value) {
      let arr = ['按件数', '按重量']
      return arr[value];
    }
  },
  methods: {
    getListResult(e) {
      // console.log(e);
      // this.tableData = e.list
      // this.options = e.area.map(item=>{
      //   item.children = item.citys.map(v=>{
      //     v.children = v.districts
      //     return v
      //   })
      //   return item
      // })
    },
    openModal(index) {
      // // 新增
      // if(index === false){
      //   this.modal = {
      //     name:"",
      //     order:50,
      //     type:0
      //   }
      //   this.modalIndex = -1
      //   return this.createModal = true
      // }
      // // 修改
      // let item = this.tableData[index]
      // this.modal = {
      //   name:item.name,
      //   order:item.order,
      //   type:item.type
      // }
      // this.modalIndex = index
      // this.createModal = true
    },
    submit() {
      // let id = 0
      // if(this.modalIndex !== -1){
      //   id = this.tableData[this.modalIndex].id
      // }
      // this.addOrEdit(this.modal,id)
      // this.createModal = false
    },
    openDrawer(item) {
      // this.express_values = item.express_values
      // this.drawer = true
      // this.drawerId = item.id
    },
    addValue() {
      // this.axios.post('/admin/express_value',{
      //   first:0,
      //   first_price:0,
      //   add:0,
      //   add_price:0,
      //   express_id:this.drawerId,
      //   region:[
      //     ['全国','所有','所有']
      //   ],
      // },{ token:true }).then(res=>{
      //   let data = res.data.data
      //   this.express_values.push(data)
      // })
    },
    deleteValue(item, index) {
      // this.axios.post('/admin/express_value/'+item.id+'/delete',{},{
      //   token:true ,
      // }).then(res=>{
      //   this.express_values.splice(index,1)
      //   this.$message({
      //     type:"success",
      //     message:"删除成功"
      //   })
      // })
    },
    change(item) {
      // this.axios.post('/admin/express_value/'+item.id,item,{
      //   token:true,
      // }).then(res=>{
      //   console.log(res);
      // })
    }
  },
}
</script>


<style scoped lang="scss">
.el-form-item {
  margin-bottom: 0;
}
</style>
