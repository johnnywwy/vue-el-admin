<template>
  <div class="wrapper">
    <el-tabs class="el-tabs-wrapper" v-model="tabIndex"
             @tab-click="handleClick">
      <el-tab-pane :label="tab.name" :key="tabIndex"
                   v-for="(tab,tabIndex) in tabBars">
        <div class="tab-content">
          <!--左边按钮-->
          <el-button type="success" size="mini">发布商品</el-button>
          <el-button type="danger" size="mini">批量删除</el-button>
          <!--右边按钮-->
          <div class="ml-auto" v-show="!superSearch">
            <el-input v-model="form.name" size="mini"
                      placeholder="要搜索的商品名称" class="input">

            </el-input>
            <el-button type="info" size="mini">搜索</el-button>
            <el-button size="mini" @click="toggleSearch">高级搜索</el-button>
          </div>
        </div>

        <el-card class="card-wrapper box-card bg-light my-3" v-show="superSearch">
          <div slot="header" class="clearfix header">
            <span>高级搜索</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="toggleSearch">收起</el-button>
          </div>
          <!--表单-->
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
        </el-card>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
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
      superSearch: false,

    }
  },
  methods: {
    //加载数据
    handleClick(tab) {
      console.log('tab.index', tab.index)
    },
    //高级搜索的显示与隐藏
    toggleSearch() {
      this.superSearch = !this.superSearch
    },
    //提交高级搜索
    search() {
      console.log('搜索中啦')
    },
    //  清空所有
    clearAllSearch() {
      this.form = {
        name: '',
        code: '',
        type: '',
        category: ''
      }
      // this.toggleSearch()
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

  .el-tabs-wrapper {
    padding: 0 20px;

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

        border: 1px solid red;

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
  }
}
</style>