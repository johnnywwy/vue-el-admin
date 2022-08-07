<template>
  <div class="bg-white px-3 wrapper" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
    <el-tabs v-model="activeName">
      <el-tab-pane label="管理员列表" name="second">
        <div class="d-flex align-items-center">
          <el-button type="primary" size="mini"
                     @click="openModal(false)">
            添加管理员
          </el-button>
          <div class="ml-auto d-flex">
            <el-input size="mini" placeholder="请输入用户名" v-model="keyword" style="width: 200px;"></el-input>
            <el-button type="info" size="mini" class="ml-2">搜索</el-button>
          </div>
        </div>
        <el-table border class="mt-3"
                  :data="tableData"
                  style="width: 100%">
          <el-table-column
              align="center"
              label="用户头像"
              width="100"
          >
            <template slot-scope="scope">
              <el-avatar size="large" :src="scope.row.avatar"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="登录用户"
              prop="username"
              width="120"
          >
          </el-table-column>
          <el-table-column
              align="center"
              width="150"
              prop="phone"
              label="手机号">
          </el-table-column>
          <el-table-column
              prop="email"
              align="center"
              label="邮箱">
          </el-table-column>
          <el-table-column
              prop="create_time"
              align="center"
              label="所属管理员"
              width="150">
            <template slot-scope="scope">
              {{ scope.row.group.name }}
            </template>
          </el-table-column>
          <el-table-column
              prop="status"
              align="center"
              label="状态">
            <template slot-scope="scope">
              <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="操作"
              width="150">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="openModal(scope.$index)">修改</el-button>
              <el-button type="text" size="mini" @click='openDrawer(scope.row)'>
                <!--                配置模板({{ scope.row.express_values.length }})-->
              </el-button>
              <el-button type="text" size="mini" @click="deleteItem(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="角色列表" name="third">
        <div class="d-flex align-items-center">
          <el-button type="primary" size="mini"
                     @click="openModal(false)"
                     v-auth="'添加角色'"
          >
            添加角色
          </el-button>
        </div>
        <el-table border class="mt-3"
                  :data="groupList"
                  style="width: 100%">
          <el-table-column
              align="center"
              label="角色名称"
              prop="name">
          </el-table-column>
          <el-table-column
              prop="status"
              align="center"
              label="状态">
            <template slot-scope="scope">
              <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="操作"
              width="300">
            <template slot-scope="scope">
              <el-button type="text" size="mini">修改</el-button>
              <el-button type="text" size="mini">配置权限</el-button>
              <el-button type="text" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="权限列表" name="auth">
        <el-tree :data="data" default-expand-all
                 :expand-on-click-node="false"
                 :props="defaultProps"
                 @node-click="handleNodeClick"
                 draggable
                 @node-drop="nodeDrop">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <el-input v-if="data.editStatus"
                    v-model="data.label" size="mini"></el-input>
          <span v-else>{{ node.label }}</span>
        </span>
        <span>
          <el-button :type="data.status ? 'primary':'danger'"
                     size="mini"
                     @click.stop="showOrHide(data)">
            {{ data.status ? '显示' : '隐藏' }}
          </el-button>
          <el-button type="success" size="mini"
                     @click="append(data)"
                     v-auth="'添加规则'">增加</el-button>
          <el-button
              :type="data.editStatus?'default':'warning'"
              size="mini"
              @click="edit(data)"
          >{{ data.editStatus ? '完成' : '修改' }}</el-button>
          <el-button
              type="danger" size="mini"
              @click="remove(node,data)">删除</el-button>
        </span>
      </span>
        </el-tree>
      </el-tab-pane>
    </el-tabs>

    <!--<div style="height: 60px;"></div>-->
    <!--<el-footer class="border-top d-flex
    align-items-center px-0 position-fixed bg-white"
    style="bottom: 0;left: 200px;right: 0;z-index: 100;">-->
    <!--  <div style="flex: 1;" class="px-2">-->
    <!--    <el-pagination-->
    <!--        :current-page="page.current"-->
    <!--        :page-sizes="page.sizes"-->
    <!--        :page-size="page.size"-->
    <!--        layout="total, sizes, prev, pager, next, jumper"-->
    <!--        :total="page.total"-->
    <!--        @size-change="handleSizeChange"-->
    <!--        @current-change="handleCurrentChange">-->
    <!--    </el-pagination>-->
    <!--  </div>-->
    <!--</el-footer>-->


    <el-dialog title="添加模板" :visible.sync="createModal" top="5vh">
      <!-- 表单内容 -->
      <el-form ref="form" :model="modal" label-width="80px">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="modal.name" placeholder="模板名称"
                    size="mini" style="width: 25%;"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="level">
          <el-input type="number" v-model="modal.order" placeholder="排序"
                    size="mini" style="width: 25%;"></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-radio-group v-model="modal.type" size="mini">
            <el-radio :label="1" border>按重量</el-radio>
            <el-radio :label="0" border>按件数</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="createModal = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import common from '../../../common/mixins/common.js';

export default {
  // inject:['app','layout'],
  mixins: [common],
  data() {
    return {
      keyword: '',
      activeName: 'second',

      drawer: false,
      drawerId: 0,
      preUrl: 'express',

      tableData: [{
        id: 10,
        username: '用户名',
        avatar: 'https://gw.alicdn.com/i4/710600684/O1CN01bNcLnV1GvJd3wK1k2_!!710600684.jpg_Q75.jpg_.webp',
        phone: '15648897641',
        email: '15648897641@163.com',
        group_id: 1,
        group: {
          id: 1,
          name: '管理员',
        },
        status: 1
      }],
      //管理员列表
      managerList: [{
        id: 10,
        username: '用户名',
        avatar: 'https://gw.alicdn.com/i4/710600684/O1CN01bNcLnV1GvJd3wK1k2_!!710600684.jpg_Q75.jpg_.webp',
        phone: '15648897641',
        email: '15648897641@163.com',
        group_id: 1, group: {
          id: 1,
          name: '管理员',
        },
        status: 1
      }],
      //分组列表
      groupList: [{
        id: 10,
        name: '超级管理员',
        status: 1
      }],

      data: [
        {
          id: 1,
          label: '一级 1',
          status: 1,
          editStatus: false,
          children: [{
            id: 2,
            label: '二级 1-1',
            status: 1,
            editStatus: false,
            children: [{
              id: 3,
              label: '三级 1-1-1',
              status: 1,
              editStatus: false,
            }]
          }]
        },
      ],

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
      options: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }


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
    },
    handleNodeClick(data) {
      console.log(data);
    },
    //显示或隐藏
    showOrHide(data) {
      console.log('11111')
      data.status = data.status ? 0 : 1
    },
    //修改或提交
    edit(data) {
      data.editStatus = !data.editStatus
    },
    //删除节点
    remove(node, data) {
      this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parent = node.parent
        let children = parent.data.children || parent.data
        let index = children.findIndex(v => {
          return v.id === data.id
        })
        children.splice(index, 1)
      })

    },
    //增加子分类
    append(data) {
      let newObj = {
        id: 2,
        label: '二级 1-1',
        status: 1,
        editStatus: true,
        children: []
      }
      data.children.push(newObj)

    },
    //拖拽事件
    nodeDrop(...option) {
      console.log(option.data[0])
      console.log(option.data[1])
    },
  },
}
</script>


<style scoped lang="scss">

.wrapper {
  //border: 1px solid red;
  background: white;
  margin: -20px;
  margin-top: -15px;
  padding: 0 15px 0 15px;

  .el-tree ::v-deep .el-tree-node__content {
    //border: 1px solid green;
    padding: 20px 0;
  }


  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

}

.el-form-item {
  margin-bottom: 0;
}

.el-tree-node__content {
  padding: 20px 0;
}
</style>
