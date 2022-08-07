<template>
  <div class="wrapper">
    <button-search class="pb-3" :show-search="false">
      <template #left>
        <!--左边按钮-->
        <el-button type="success" size="mini" @click="openModel(false)">添加规格</el-button>
        <el-button type="danger" size="mini" @click="deleteAll" v-if="multipleSelection.length">批量删除</el-button>
      </template>
    </button-search>
    <!--商品列表-->
    <el-table border :data="tableData" style="width: 100%"
              class="table-wrapper" @selection-change="handleSelectionChange">
      <!--多选-->
      <el-table-column type="selection" width=45 align="center"></el-table-column>
      <!--表头-->
      <el-table-column prop="name" label="规格名称" align="center"></el-table-column>
      <el-table-column prop="default" label="规格值" width="360" align="center"></el-table-column>
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
    <div style="height: 80px;"></div>
    <el-footer class="d-flex align-items-center px-0 border-top">
      <div class="footer-pagination">
        <el-pagination
            :current-page="page.current"
            :page-sizes="page.sizes"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </el-footer>

    <!--新增 / 修改的模态框 -->
    <el-dialog :title="editIndex > -1?'修改规格':'添加规格'" :visible.sync="createModel" width="50%">
      <!--表单内容-->
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="规格名称" prop="name">
          <el-input
              size="mini"
              style="width: 180px; height: 34px!important;"
              v-model="form.name"
              placeholder="规格名称"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number style="width: 150px;" :min="0" size="mini" v-model="form.order"></el-input-number>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status" size="mini" style="height: 30px;">
            <el-radio :label="1" border>启用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.type" size="mini" style="height: 30px;">
            <el-radio :label="1" border>文字</el-radio>
            <el-radio :label="0" border>颜色</el-radio>
            <el-radio :label="2" border>图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规格值" prop="default">
          <el-input
              type="textarea"
              :rows="2"
              placeholder="一行一个规格项，多个规格项用换行输入"
              v-model="form.default">
          </el-input>
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

export default {
  inject: ['layout'],
  components: {
    buttonSearch
  },
  name: 'list',
  data() {
    return {
      page: {
        current: 1,
        sizes: [10, 20, 50, 100],
        size: 10,
        total: 0
      },
      //商品列表
      tableData: [],
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
        type: 0,
        default: '',
      },
      rules: {
        name: [
          {required: true, message: '规格名称不能为空', trigger: 'blur'},
        ],
        default: [
          {required: true, message: '规格值不能为空', trigger: 'blur'},
        ],
      }
    }
  },
  created() {
    this.getList()
  },
  computed: {
    //选中的id的组成数组
    ids() {
      return this.multipleSelection.map(item => {
        return item.id
      })
    }
  },
  methods: {

    //请求列表
    getList() {
      this.layout.showLoading()
      let url = `/admin/skus/${this.page.current}?limit=${this.page.size}`
      // console.log(url)
      this.axios.get(url, {
        token: true
      }).then(res => {
        // console.log(res)
        let data = res.data.data
        // console.log(data)
        this.tableData = data.list
        this.page.total = data.totalCount
        this.layout.hideLoading()
      }).catch(err => {
        this.layout.hideLoading()
      })

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
          default: ''
        }
        this.editIndex = -1
      } else {
        //  修改
        this.form = {
          name: e.row.name,
          order: e.row.order,
          status: e.row.status,
          type: e.row.type,
          default: e.row.default.replace(/,/g, '\n')
        }
        this.editIndex = e.$index

      }
      //  初始化表单

      // 打开dialog
      this.createModel = true
    },
    //启用禁用
    changeStatus(item) {
      //请求服务端修改状态
      let status = item.status === 1 ? 0 : 1
      let msg = status === 1 ? '启用' : '禁用'
      this.layout.showLoading()
      this.axios.post('/admin/skus/' + item.id + '/update_status', {
        status: status
      }, {
        token: true
      }).then(res => {
        item.status = status

        this.layout.hideLoading()


      }).catch(err => {
        this.layout.hideLoading()

      })

    },
    //选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(this.multipleSelection)
      console.log(this.ids)
    },
    //批量删除
    deleteAll() {
      this.$confirm('是否删除选中规格?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.layout.showLoading()
        this.axios.post('/admin/skus/delete_all', {
          ids: this.ids
        }, {
          token: true
        }).then(res => {
          this.multipleSelection = []
          this.$message({
            message: '删除成功',
            type: 'success'
          })

          this.getList()
          this.layout.hideLoading()
        }).catch(err => {
          this.layout.hideLoading()
        })
      })

    },
    //删除当前商品
    deleteItem(item) {
      this.$confirm('是否删除该规格?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.layout.showLoading()
        this.axios.post('/admin/skus/' + item.id + '/delete', {}, {
          token: true
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList()
          this.layout.hideLoading()
        }).catch(err => {
          this.layout.hideLoading()
        })

      })
    },
    //添加规格
    submit() {
      this.$refs.form.validate(res => {
        if (res) {
          let msg = '添加'
          if (this.editIndex === -1) {
            //添加
            this.layout.showLoading()
            this.axios.post('/admin/skus', this.form, {
              token: true
            }).then(res => {
              this.$message({
                message: msg + '成功',
                type: 'success'
              })
              this.getList()

              this.layout.hideLoading()
            }).catch(err => {
              this.layout.hideLoading()

            })
            this.form.default = this.form.default.replace(/\n/g, ',')
            // this.form.default = this.form.default.trim()
            // this.form.name = this.form.name.trim()
            // this.tableData.unshift(this.form)
          } else {
            msg = '修改'
            let item = this.tableData[this.editIndex]
            this.form.default = this.form.default.replace(/\n/g, ',')
            this.axios.post('/admin/skus/' + item.id, this.form, {
              token: true
            }).then(res => {
              this.$message({
                message: msg + '成功',
                type: 'success'
              })
              this.getList()
              this.layout.hideLoading()
            }).catch(err => {
              this.layout.hideLoading()
            })

          }
          this.createModel = false


        }

      })


    },
    handleSizeChange(val) {
      this.page.size = val
      // console.log(`每页 ${val} 条`);
      this.getList()
    },

    handleCurrentChange(val) {
      this.page.current = val
      this.getList()
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
    background: white;
    z-index: 100;

    .footer-pagination {
      padding-left: 10px;
      display: flex;
      align-items: center;
      flex: 1;
      //border: 1px solid red;


    }
  }

  .el-form-item {
    margin-bottom: 10px;
    //background: pink;


  }

}
</style>