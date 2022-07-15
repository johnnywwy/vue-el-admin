<template>
  <div class="wrapper">
    <el-tabs class="el-tabs-wrapper"
             v-model="tabIndex"
             @tab-click="handleClick">
      <el-tab-pane :label="tab.name" :key="tabIndex"
                   v-for="(tab,tabIndex) in tabBars">
        <button-search placeholder="要搜索的商品名称" ref="buttonSearch" @search="search">
          <template #left>
            <!--左边按钮-->
            <router-link :to="{name:'shop_goods_create'}">
              <el-button type="success" size="mini">发布商品</el-button>

            </router-link>
            <el-button type="danger" size="mini">批量删除</el-button>
            <el-button type="warning" size="mini">恢复商品</el-button>
            <el-button size="mini">上架</el-button>
            <el-button size="mini">下架</el-button>
            <el-button size="mini">推荐</el-button>
          </template>
          <!--高级搜索表单-->
          <template #form>
            <el-form :inline="true" :model="form" class="demo-form-inline">
              <el-form-item label="商品名称" class="mb-0">
                <el-input v-model="form.name" placeholder="请输入商品名称" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="商品编码" class="mb-0">
                <el-input v-model="form.code" placeholder="请输入商品编码" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="商品类型" class="mb-0">
                <el-select v-model="form.type" placeholder="活动区域" size="mini">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商品分类" class="mb-0">
                <el-input v-model="form.category" placeholder="请输入商品分类" size="mini">
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
          <el-table-column prop="title" label="商品" width="380">
            <template slot-scope="scope">
              <div class="media commodity">
                <img :src="scope.row.cover" class="mr-3" height="60px" alt="">
                <div class="media-body">
                  <h6>{{ scope.row.title }}</h6>
                  <p>分类：{{ scope.row.category }}</p>
                  <p>时间：{{ scope.row.create_time }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="商品类型" align="center">
          </el-table-column>
          <el-table-column prop="sale_count" label="实际销量" align="center">
          </el-table-column>
          <el-table-column label="商品排序" align="center" prop="order"></el-table-column>
          <el-table-column prop="status" label="商品状态" align="center">
            <template slot-scope="scope">
              <el-button type="success" size="mini"
                         plain @click="scope.row.isCheck=1">审核通过
              </el-button>
              <el-button type="danger" size="mini" class="ml-0 mt-1"
                         plain @click="scope.row.isCheck=2">审核拒绝
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="总库存" align="center">
          </el-table-column>
          <el-table-column prop="price" label="价格" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="success" size="mini" plain>编辑</el-button>
                <el-button
                    type="danger" size="mini"
                    plain @click="deleteItem(scope.$index)">删除
                </el-button>
              </el-button-group>
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
        {name: '审核中'},
        {name: '出售中'},
        {name: '已下架'},
        {name: '库存预警'},
        {name: '回收站'},
      ],
      form: {
        name: '',
        code: '',
        type: '',
        category: ''
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
        name: '',
        code: '',
        type: '',
        category: ''
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
  border: 1px solid red;
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