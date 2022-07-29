<template>
  <div class="wrapper">
    <div class="py-2 border-bottom d-flex align-items-center">
      <el-button type="primary" size="mini" @click="createTop">新建分类</el-button>
    </div>
    <el-tree :data="data" default-expand-all :expand-on-click-node="false"
             :props="defaultProps" @node-click="handleNodeClick" draggable
             @node-drop="nodeDrop">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <el-input v-if="data.editStatus"
                    v-model="data.label" size="mini"></el-input>
          <span v-else>{{ node.label }}</span>
        </span>
        <span>
          <el-button :type="data.status ? 'primary':'danger'" size="mini"
                     @click.stop="showOrHide(data)">
            {{ data.status ? '显示' : '隐藏' }}
          </el-button>
          <el-button type="success" size="mini" @click="append(data)">增加</el-button>
          <el-button
              :type="data.editStatus?'default':'warning'" size="mini"
              @click="edit(data)"
          >{{ data.editStatus ? '完成' : '修改' }}</el-button>
          <el-button
              type="danger" size="mini"
              @click="remove(node,data)">删除</el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>


export default {
  data() {

    return {
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
        // {
        //   label: '一级 2',
        //   status: 1,
        //   editStatus: false,
        //   children: [{
        //     label: '二级 2-1',
        //     status: 1,
        //     editStatus: false,
        //     children: [{
        //       label: '三级 2-1-1',
        //       status: 1,
        //       editStatus: false,
        //     }]
        //   }, {
        //     label: '二级 2-2',
        //     status: 1,
        //     editStatus: false,
        //     children: [{
        //       label: '三级 2-2-1',
        //       status: 1,
        //       editStatus: false,
        //     }]
        //   }]
        // },
        // {
        //   label: '一级 3',
        //   status: 1,
        //   editStatus: false,
        //   children: [{
        //     label: '二级 3-1',
        //     status: 1,
        //     editStatus: false,
        //     children: [{
        //       label: '三级 3-1-1',
        //       status: 1,
        //       editStatus: false,
        //     }]
        //   }, {
        //     label: '二级 3-2',
        //     status: 1,
        //     editStatus: false,
        //     children: [{
        //       label: '三级 3-2-1',
        //       status: 1,
        //       editStatus: false,
        //     }]
        //   }]
        // }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
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
    //创建顶级分类
    createTop() {
      this.$prompt('请输入顶级分类名称', '提示', {
        confirmButtonText: '创建',
        cancelButtonText: '取消',
        inputValidator: function (val) {
          if (val === null || val.trim() === '') {
            return '顶级分类名称不能为空'
          }
          return true
        }
      }).then(({value}) => {
        console.log(value);
      })
    }
  }
};
</script>

<style lang="scss" scoped>
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

.el-tree-node__content {
  padding: 20px 0;
}
</style>