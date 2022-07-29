<template>
  <div class="wrapper">
    <button-search class="pb-3" :show-search="true" placeholder="要搜索的商品名称" ref="buttonSearch" @search="search">
      <template #left>
        <!--左边按钮-->
        <el-button type="danger" size="mini" @click="deleteAll"
                   v-if="multipleSelection.length">批量删除
        </el-button>
      </template>
      <template #form>
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="评价用户" class="mb-0">
            <el-input v-model="form.username" placeholder="请输入商品名称" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="评价类型" class="mb-0">
            <el-select v-model="form.type" placeholder="活动区域" size="mini">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间" class="mb-0">
            <el-date-picker
                v-model="form.time"
                type="daterange"
                size="small"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="mb-0">
            <el-button type="info" @click="search" size="mini">搜索</el-button>
            <el-button type="danger" size="mini" @click="clearAllSearch">清空删选条件</el-button>
          </el-form-item>
        </el-form>
      </template>
    </button-search>
    <!--商品列表-->
    <el-table border :data="tableData" style="width: 100%"
              class="table-wrapper" @selection-change="handleSelectionChange">
      <!--多选-->
      <el-table-column type="selection" align="center"></el-table-column>
      <!--折叠面板-->
      <el-table-column type="expand" label="">
        <template slot-scope="form">
          <div style="margin: 0 20px 0 50px;">
            <div class="media">
              <img
                  src="http://www.xunyintech.com/uploads/7d103c959b1ea975bc61aa6474f9e912.jpg"
                  class="mr-3" alt="..." style="width: 70px;border-radius: 100%">
              <div class="media-body">
                <h6 class="mt-0 d-flex ">
                  用户名
                  <small>2021-12-12 17:15:30</small>
                  <el-button type="danger" size="mini" class="ml-auto">删除</el-button>
                </h6>
                <p>评价内容</p>

                <div class="media mt-3">
                  <a class="mr-3" href="#">
                    <img
                        src="http://www.xunyintech.com/uploads/7d103c959b1ea975bc61aa6474f9e912.jpg"
                        alt="..." style="width: 70px;border-radius: 100%">
                  </a>
                  <div class="media-body">
                    <h6 class="mt-0">客服1</h6>
                    <p>回复内容</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <!--表头-->
      <el-table-column prop="id" label="ID" align="center" width="45"></el-table-column>
      <el-table-column prop="title" label="商品" width="280">
        <template slot-scope="scope">
          <div class="media commodity">
            <img :src="scope.row.goods.cover" class="mr-3" height="60px" alt="">
            <div class="media-body">
              <h6>{{ scope.row.goods.title }}</h6>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="order" label="评价信息" width="200">
        <template slot-scope="scope">
          <div class="d-flex flex-column">
            <p>用户名:{{ scope.row.username }}</p>
            <p>平分:
              <el-rate
                  v-model="scope.row.star"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
              </el-rate>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="评价时间" align="center"></el-table-column>
      <el-table-column align="center" label="是否显示">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status"></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <!--占位用的div-->
    <!--    <div style="height: 60px;"></div>-->
    <el-footer class="d-flex align-items-center px-0 border-top">
      <div class="footer-pagination">
        <el-pagination
            :current-page="currentPage"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="50"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
        </el-pagination>
      </div>
    </el-footer>
  </div>
</template>

<script>
import buttonSearch from '../../../components/common/button-search'

export default {
  components: {
    buttonSearch
  },
  name: 'list',
  data() {
    return {
      //商品列表
      tableData: [
        {
          id: 1,
          goods: {
            title: '商品标题',
            cover: 'https://www.apple.com.cn/iphone/home/images/meta/iphone__btp62hy2cbea_og.png',
          },
          username: 'johnny',
          star: 5,
          create_time: '2019-12-12 16:44:10',
          status: 1,
        },

      ],
      //多选
      multipleSelection: [],
      //当前分页
      currentPage: 1,
      form: {
        username: '',
        type: '',
        time: ''
      }
    }
  },

  methods: {
    //启用禁用
    changeStatus(item) {
      //请求服务端修改状态
      item.status = !item.status
      this.$message({
        message: item.status ? '启用' : '禁用',
        type: 'success'
      })
    },
    //选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //批量删除
    deleteAll() {
      this.$confirm('是否删除选中规格?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.multipleSelection.forEach(item => {
          let index = this.tableData.findIndex(v => v.id === item.id)
          if (index !== -1) {
            this.tableData.splice(index, 1)
          }
        })
        this.multipleSelection = []

      })

    },
    //  搜索
    search(e) {
      console.log(e)
    },
    clearAllSearch() {
      console.log('清空')
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

  .el-form-item {
    margin-bottom: 10px;
  }

}
</style>