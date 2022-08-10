<template>
  <div class="wrapper">
    <button-search class="pb-3" :show-search="false">
      <template #left>
        <!--左边按钮-->
        <el-button type="success" size="mini" @click="openModel(false)">添加类型</el-button>
        <el-button type="danger" size="mini" @click="deleteAll" v-if="multipleSelection.length">批量删除</el-button>
      </template>
    </button-search>
    <!--商品列表-->
    <el-table border :data="tableData" style="width: 100%"
              class="table-wrapper"
              @selection-change="handleSelectionChange">
      <!--多选-->
      <el-table-column type="selection" width=45 align="center">

      </el-table-column>
      <!--表头-->
      <el-table-column prop="name" label="类型名称" align="center">
      </el-table-column>
      <el-table-column label="属性标签" width="360" align="center">
        <template slot-scope="scope">
          {{ scope.row.value_list | formatValue }}
        </template>
      </el-table-column>
      <el-table-column prop="order" label="排序" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-button
              :type="scope.row.status ? 'success' : 'danger'"
              size="mini" plain
              @click="changeStatus(scope.row)"
          >{{ scope.row.status ? '启用' : '禁用' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="success" size="mini" plain @click="openModel(scope)">修改</el-button>
            <el-button type="danger" size="mini" plain
                       @click="deleteItem(scope.row)">删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!--占位用的div-->
    <!--    <div style="height: 60px;"></div>-->
    <el-footer class="d-flex align-items-center px-0 border-top">
      <div class="footer-pagination">
        <el-pagination
            :current-page="page.current"
            :page-sizes="page.sizes"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-footer>

    <!--新增 / 修改的模态框 -->
    <el-dialog title="添加类型" :visible.sync="createModel" width="80%">
      <!--表单内容-->
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="类型名称" prop="name" class="input-wrapper">
          <el-input
              size="mini"
              v-model="form.name"
              placeholder="类型名称"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
              style="width: 150px;" :min="0" size="mini"
              v-model="form.order"></el-input-number>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status" size="mini">
            <el-radio :label="1" border>启用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联规格">
          <div class="d-flex">
            <span class="sku-list-item px-3 py-2 border rounded mr-2"
                  style="line-height: initial;" :key="index"
                  v-for="(item,index) in form.sku_list">
              <p>{{ item.name }}</p>
              <i class="el-icon-delete" @click="deleteFormSkuList(idnex)"
                 style="width: initial;"></i>
            </span>
            <el-button size="mini" @click="chooseSkus">
              <i class="el-icon-plus" style=""></i>
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="属性列表">
          <el-table
              :data="value_list"
              style="width: 100%">
            <el-table-column
                prop="order"
                label="排序"
                width="80">
              <template slot-scope="scope">
                <el-input v-model="scope.row.order" size="mini" placeholder="排序">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="属性名称"
                width="120"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" size="mini" placeholder="属性名称">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
                prop="type"
                label="所属类型"
                width="120"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.type"
                           placeholder="请选择区域" size="mini">
                  <el-option
                      label="输入框" value="input">输入框
                  </el-option>
                  <el-option
                      label="单选框" value="radio">单选框
                  </el-option>
                  <el-option
                      label="多选框" value="checkbox">多选框
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
                prop="status"
                label="是否显示"
                width="100">
              <template slot-scope="scope">
                <el-switch
                    v-model="scope.row.status"
                    active-value="1" :inactive-value="0"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="属性值">
              <template slot-scope="scope" v-if="scope.row.type!=='input'">
                <el-input type="textarea" size="mini"
                          v-model="scope.row.default" v-if="scope.row.isEdit"
                          placeholder="一行为一个属性值，多个属性值换行输入"
                ></el-input>
                <span v-else>{{ scope.row.default }}</span>
              </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="180">
              <template slot-scope="scope" v-if="scope.row.type!=='input'">
                <el-button type="text" size="mini" @click="editRow(scope)">
                  {{ scope.row.isEdit ? '完成' : '编辑属性值' }}
                </el-button>
                <el-button type="text" size="mini"
                           @click="delRow(scope).$index">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="text" size="mini" icon="el-icon-plus" @click="addValue">
            添加属性
          </el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createModel = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import buttonSearch from '../../../components/common/button-search'
import common from '../../../common/mixins/common'

export default {
  mixins: [common],
  inject: ['layout', 'app'],
  components: {
    buttonSearch
  },
  name: 'list',
  data() {
    return {
      preURL: 'goods_type',
      tableData: [],
      //商品列表
      // tableData: [{
      //   id: 1,
      //   name: '鞋子',
      //   order: 50,
      //   status: 1,
      //   sku_list: [
      //     {id: 1, name: '颜色'},
      //     {id: 2, name: '尺寸'}
      //   ],
      //   value_list: [{
      //     order: 50,
      //     name: '特性',
      //     type: 'input',
      //     value: '',
      //     isEdit: false
      //   }, {
      //     order: 50,
      //     name: '前置摄像机',
      //     type: 'input',
      //     value: ''
      //   }]
      // }],
      //多选
      multipleSelection: [],
      //当前分页
      currentPage: 1,
      //控制是否新建规格
      createModel: false,
      editIndex: -1,
      //新建规格字段
      form: {
        name: '',
        order: 50,
        status: 1,
        sku_list: [],
      },
      value_list: [],
      rules: {
        name: [{
          required: true,
          message: '类型名称不能为空',
          trigger: 'blur'
        }],
      },
    }
  },
  computed: {
    //关联规格id组成的一维数组
    skus_id() {
      return this.form.sku_list.map(item => item.id)
    }
  },
  filters: {
    formatValue(value) {
      // ['特性','前置摄像机']
      let arr = value.map(v => v.name)
      return arr.join(',')
    }
  },
  methods: {
    getListResult(e) {
      console.log(e.list)
      this.tableData = e.list.map(item => {
        // console.log(item.skus)
        item.value_list = item.goods_type_values
        item.sku_list = item.skus
        console.log(item)
        return item
      })
      // console.log(this.tableData)
    },

    //打开模态框
    openModel(e = false) {
      //增加
      if (!e) {
        //初始化
        this.form = {
          name: '',
          order: 50,
          status: 1,
          type: 0,
          sku_list: []
        }
        this.value_list = []
        this.editIndex = -1
      } else {
        //  修改
        this.form = {
          ...e.row
        }
        this.value_list = [...e.row.value_list]
        this.editIndex = e.$index

      }
      //  初始化表单
      // 打开dialog
      this.createModel = true
    },

    //添加规格
    submit() {
      this.$refs.form.validate(res => {
        // 验证属性列表
        let result = true
        let message = []
        this.value_list.forEach((item, index) => {
          let no = index + 1
          if (item.order === '') {
            result = result && false
            message.push('第' + no + '行：排序不能为空')
          }
          if (item.name === '') {
            result = result && false
            message.push('第' + no + '行：属性名称不能为空')
          }
          if (item.type !== 'input' && item.default === '') {
            result = result && false
            message.push('第' + no + '行：属性值不能为空')
          }
        })
        if (!result) {
          var temp = '';
          message.forEach(v => {
            temp += `<li>${v}</li>`;
          })
          return this.$notify({
            title: '属性列表提示',
            dangerouslyUseHTMLString: true,
            type: 'warning',
            duration: 3000,
            message: `<ul>${temp}</ul>`
          });
        }
        if (res) {
          let value_list = this.value_list.map(item=>{
            if(item.default){
              item.default = item.default.replace(/\n/g,',')
            }
            return item
          })
          let data = {
            ...this.form,
            skus_id:this.skus_id,
            value_list:[...value_list]
          }
          let id = 0
          if (this.editIndex !== -1) {
            id = this.tableData[this.editIndex].id
          }
          // 关闭模态框
          this.addOrEdit(data,id)
          this.createModel = false
        }
      })


    },
    //添加属性
    addValue() {
      this.value_list.push({
        order: 50,
        name: '',
        type: 'input',
        value: '',
        isEdit: false
      })

    },
    //  编辑属性值
    editRow(scope) {
      scope.row.isEdit = !scope.row.isEdit
    },
    //删除属性
    delRow(index) {
      this.value_list.splice(index, 1)

    },
    //
    chooseSkus() {
      this.app.chooseSkus((e) => {
        let index = this.form.sku_list.findIndex(item => {
          return item.id === e.id
        })
        if (index === -1) {
          this.form.sku_list.push(e)
        }

      })
    },
    //删除分类
    deleteFormSkuList(index) {
      this.form.sku_list.splice(index, 1)
    }
  }

};
</script>

<style lang="scss" scoped>
.wrapper {
  background: white;
  margin: -20px;
  margin-top: -15px;
  padding: 15px 15px;


  .el-footer {
    position: fixed;
    bottom: 0;
    left: 200px;
    right: 0;
    //background: red;
    z-index: 100;

    .footer-pagination {
      padding-left: 10px;
      display: flex;
      align-items: center;
      flex: 1;
      //border: 1px solid red;


    }
  }

  .sku-list-item > i {
    display: none;
    cursor: pointer;
    padding: 0 7px;
  }

  .sku-list-item:hover {
    background: #f4f4f4;
  }

  .sku-list-item:hover > p {
    display: none;
  }

  .sku-list-item:hover > i {
    display: inline-block;
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  .input-wrapper ::v-deep {
    .el-form-item__content {
      width: 200px;
    }
  }

  .input-wrapper ::v-deep .el-form-item__error {
    top: 70%;
    //width: 200px;
  }

}
</style>