<template>
  <div class="wrapper">
    <button-search
        class="pb-3"
        :show-search="true"
        placeholder="要搜索的商品名称"
        ref="buttonSearch" @search="search"
        :showSuperSearch="false"
    >
    </button-search>
    <!--商品列表-->
    <el-table border :data="tableData" style="width: 100%"
              class="table-wrapper">
      <!--折叠面板-->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <div style="margin: 0 20px 0 50px;">
            <div class="media">
              <img
                  :src="scope.row.user.avatar"
                  class="mr-3" alt="..." style="width: 70px;border-radius: 100%">
              <div class="media-body">
                <h6 class="mt-0 d-flex align-items-center">
                  {{ scope.row.user.username }}
                  <span style="width: 10px;"></span>
                  <small>{{ scope.row.review_time }}</small>
                  <!--<el-button type="danger" size="mini" class="ml-auto">删除</el-button>-->
                </h6>
                <p>{{ scope.row.review.data }}</p>
                <div>
                  <img v-for="(item,index) in scope.row.review.image"
                       :key="index" :src="item" alt=""
                       style="height: 100px;width: 100px;">
                </div>
                <div v-if="scope.row.extra">
                  <div class="media mt-3 bg-light mt-3 p-2 rounded">
                    <div class="media-body " :key="index"
                         v-for="(item,index) in scope.row.extra">
                      <h6 class="mt-0 d-flex align-items-center">
                        客服
                        <span style="width: 10px;"></span>
                      </h6>
                      <p>{{ item.data }}</p>
                    </div>
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
            <img :src="scope.row.goods_item.cover" class="mr-3" height="60px" alt="">
            <div class="media-body">
              <h6>{{ scope.row.goods_item.title }}</h6>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="order" label="评价信息" width="200">
        <template slot-scope="scope">
          <div class="d-flex flex-column">
            <p>用户名:{{ scope.row.user.username }}</p>
            <p>平分:
              <el-rate
                  v-model="scope.row.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
              </el-rate>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="review_time" label="评价时间" align="center"></el-table-column>
      <el-table-column align="center" label="是否显示">
        <template slot-scope="scope">
          <el-button
              :type="scope.row.status ? 'success' : 'danger'"
              size="mini" plain
              @click="changeStatus(scope.row)"
          >{{ scope.row.status ? '启用' : '禁用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--占位用的div-->
    <div style="height: 60px; "></div>
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
  </div>
</template>

<script>
import buttonSearch from '../../../components/common/button-search'
import common from '../../../common/mixins/common'


export default {
  inject: ['layout'],
  mixins: [common],
  components: {
    buttonSearch
  },
  name: 'list',
  data() {
    return {
      preURL: 'goods_comment',

      //商品列表
      tableData: [],

      title: ''

    }
  },

  methods: {

    getListResult(e) {
      console.log(e)
      this.tableData = e.list
    },

    //启用禁用
    changeStatus(item)
    {
      //请求服务端修改状态
      item.status = !item.status
      this.$message({
        message: item.status ? '启用' : '禁用',
        type: 'success'
      })
    },

    //请求列表分页url
    getListURL() {
      return `/admin/${this.preURL}/${this.page.current}?limit=${this.page.size}&title=${this.title}`
    },

    //  搜索
    search(e) {
      console.log(e)
      this.title = e
      this.getList()
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
  }

}
</style>