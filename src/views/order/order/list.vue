<template>
  <div class="wrapper">
    <el-tabs class="el-tabs-wrapper"
             v-model="tabIndex"
             @tab-click="handleClick">
      <el-tab-pane :label="tab.name" :key="tabIndex"
                   v-for="(tab,tabIndex) in tabBars">
        <button-search placeholder="要搜索的订单编号" ref="buttonSearch" @search="search">
          <template #left>
            <!--左边按钮-->
            <el-button type="success" size="mini">导出数据</el-button>
            <el-button type="danger" size="mini">批量删除</el-button>
          </template>
          <!--高级搜索表单-->
          <template #form>
            <el-form :inline="true" :model="form" class="demo-form-inline">
              <el-form-item label="订单编号" class="mb-0">
                <el-input v-model="form.code" placeholder="请输入订单编号" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="订单状态" class="mb-0">
                <el-select v-model="form.type" placeholder="订单状态" size="mini">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="下单时间" class="mb-0">
                <el-date-picker size="mini"
                                v-model="form.time"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>

              <el-form-item label="收货人" class="mb-0">
                <el-input v-model="form.username" placeholder="请输入收货人" size="mini">
                </el-input>
              </el-form-item>
              <el-form-item label="手机号" class="mb-0">
                <el-input v-model="form.phone" placeholder="请输入手机号" size="mini">
                </el-input>
              </el-form-item>
              <el-form-item class="mb-0">
                <el-button type="info" @click="search" size="mini">搜索</el-button>
                <el-button type="danger" size="mini" @click="clearAllSearch">清空删选条件</el-button>
              </el-form-item>
            </el-form>
          </template>
        </button-search>
        <!--商品列表-->
        <el-table border :data="tableData[tabIndex].list" style="width: 100%"
                  class="table-wrapper" @selection-change="handleSelectionChange">
          <!--多选-->
          <el-table-column type="selection" width=45 align="center"></el-table-column>
          <!--表头-->
          <el-table-column prop="title" label="商品" width="300">
            <template slot-scope="scope">
              <div class="d-flex">
                <div style="flex: 1;">
                  <p class="mb-1">订单编号：</p>
                  <p>
                    <small>202208098545157</small>
                  </p>
                </div>
                <div style="flex: 1;">
                  <p>下单时间：</p>
                  <p>
                    <small>202208098545157</small>
                  </p>
                </div>
              </div>
              <div class="media commodity">
                <img :src="scope.row.cover" class="mr-3" height="60" alt="">
                <div class="media-body">
                  <a class="text-primary" style="font-weight:bold;">{{ scope.row.title }}</a>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="实付款" align="center" width="120">
            <template slot-scope="scope">
              <span>￥20</span>
              <p>
                <small>(含运费：￥0.00)</small>
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="sale_count" label="买家" align="center" width="120">
            <template slot-scope="scope">
              <span>用户名</span>
              <p>
                <small>(用户id：11)</small>
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="支付方式" align="center">
            <template slot-scope="scope">
              <span class="badge badge-success">微信支付</span>
            </template>
          </el-table-column>
          <el-table-column label="配送方式" align="center" prop="order">
            <template slot-scope="scope">
              <span>顺丰快递</span>
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="交易状态" align="center" width="200px">
            <template slot-scope="scope">
              <div>付款状态：
                <span class="badge badge-success">已付款</span>
              </div>
              <div>发货状态：
                <span class="badge badge-success">代发货</span>
              </div>
              <div>收货状态：
                <span class="badge badge-success">待收货</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" plain>订单详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--占位用的div-->
        <div style="height: 60px;"></div>
        <el-footer class="d-flex align-items-center px-0 border-top">
          <div class="footer-pagination">
            <el-pagination
                :current-page="tableData[tabIndex].currentPage"
                :page-sizes="[20, 50, 100, 200]"
                :page-size="50"
                layout="total, sizes, prev, pager, next, jumper"
                :total="400">
            </el-pagination>
          </div>
        </el-footer>
      </el-tab-pane>
    </el-tabs>
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
      tabIndex: 0,
      tabBars: [
        {name: '全部'},
        {name: '代付款'},
        {name: '待发货'},
        {name: '已发货'},
        {name: '已收货'},
        {name: '已完成'},
        {name: '已关闭'},
        {name: '退款中'},
        1],
      form: {
        code: '',
        type: '',
        time: '',
        username: '',
        phone: ''
      },
      //商品列表
      tableData: [],
      //多选
      multipleSelection: []
    }
  },
  created() {
    this.__getData()
  },
  methods: {
    __getData() {
      for (let i = 0; i < this.tabBars.length; i++) {
        this.tableData.push(
            {
              currentPage: 1,
              list: []
            }
        )
        for (let j = 0; j < 20; j++) {
          this.tableData[i].list.push({
            id: j,
            title: '苹果手机iphone13' + '||' + i + '-' + j,
            type: '普通商品',
            cover:
                'https://www.apple.com.cn/iphone/home/images/meta/iphone__btp62hy2cbea_og.png',
            category: '手机',
            create_time: '2019-01-01 12:11:11',
            sale_count: 20,
            order: 100,
            status: 1,
            stock: 20,
            price: 1000,
            isCheck: 1
          })
        }

      }
    },
    //加载数据
    handleClick(tab) {
      console.log('tab.index', tab.index)
    },
    //提交高级搜索
    search(e = false) {
      //简单搜索
      if (typeof e === 'string') {
        return console.log('简单搜索', e)
      }
      //高级搜索
      console.log('高级搜索')

    },
    //  清空所有
    clearAllSearch() {
      this.form = {
        code: '',
        type: '',
        time: '',
        username: '',
        phone: ''
      }
      //点击清空所有 同时关闭高级搜索
      this.$refs.buttonSearch[this.tabIndex].closeSuperSearch()
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //删除当前商品
    deleteItem(index) {

      this.$confirm('是否删除该商品', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData[this.tabIndex].list.splice(index, 1)
        // console.log(this.tabIndex, index)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
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

    .el-footer {
      position: fixed;
      bottom: 0;
      left: 200px;
      right: 0;
      background: #fff;
      z-index: 100;

      .footer-pagination {
        padding-left: 10px;
        display: flex;
        align-items: center;
        flex: 1;
        //border: 1px solid red;


      }
    }
  }
}
</style>