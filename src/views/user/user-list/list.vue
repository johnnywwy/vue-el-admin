<template>
  <div class="wrapper">
    <button-search class="pb-3" placeholder="手机号/邮箱/会员名称" @search="searchEvent">
      <template #left>
        <!--左边按钮-->
        <el-button type="success" size="mini"
                   @click="openModel(false)">添加规格
        </el-button>
      </template>
      <!--高级搜索表单-->
      <template #form>
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-form-item label="搜索内容" class="mb-0">
            <el-input v-model="search.keyword" placeholder="手机号/邮箱/会员名称" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="会员等级" class="mb-0">
            <el-select v-model="search.user_level_id" placeholder="请选择会员等级" size="mini">
              <el-option :label="item.name" :value="item.id" :key="index"
                         v-for="(item,index) in user_level"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="mb-0">
            <el-button type="info" @click="searchEvent" size="mini">搜索</el-button>
            <el-button type="danger" size="mini" @click="clearAllSearch">清空删选条件</el-button>
          </el-form-item>
        </el-form>
      </template>

    </button-search>
    <!--商品列表-->
    <el-table border :data="tableData" style="width: 100%"
              class="table-wrapper">
      <!--表头-->
      <el-table-column label="会员" align="center" width="280">
        <template slot-scope="scope">
          <div class="media">
            <img class="mr-3 rounded-circle" :src="scope.row.avatar" style="width: 40px;height: 40px;">
            <div class="media-body">
              <h6 class="mt-0 d-flex align-items-center">
                {{ scope.row.username }}
                <el-button class="ml-auto" type="text" size="mini"
                >详情
                </el-button>
              </h6>
              <span class="mt-0 d-flex align-items-center">
                用户id：{{ scope.row.id }}
              </span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="会员等级" align="center">
        <template slot-scope="scope">
          {{ scope.row.user_level.name }}
        </template>
      </el-table-column>
      <el-table-column label="登录注册" align="center" width="300">
        <template slot-scope="scope">
          <div>注册时间：{{ scope.row.create_time }}</div>
          <div>最后登录：{{ scope.row.update_time }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-button
              :type="scope.row.status ? 'success' : 'danger'"
              size="mini"
              @click="changeStatus(scope.row)"
              plain>{{ scope.row.status ? '启用' : '禁用' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="openModel(scope)">修改</el-button>
          <el-button type="text" size="mini" @click="deleteItem(scope.row)">删除</el-button>
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
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名" size="mini" style="width: 25%;"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="密码" size="mini" style="width: 25%;"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="昵称" size="mini" style="width: 25%;"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <div>
				<span v-if="!form.avatar" class="btn btn-light border mr-2"
              @click="chooseImage">
					<i class="el-icon-plus"></i>
				</span>
            <img v-else :src="form.avatar" class="rounded" style="width: 45px;height: 45px;cursor: pointer;"
                 @click="chooseImage"/>
          </div>
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select v-model="form.user_level_id" placeholder="请选择会员等级"
                     size="mini">
            <el-option v-for="(item,index) in user_level" :key="index"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone" placeholder="手机" size="mini" style="width: 25%;"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="邮箱" size="mini" style="width: 25%;"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status" size="mini">
            <el-radio :label="1" border>启用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
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
  inject: ['app', 'layout'],
  mixins: [common],
  components: {
    buttonSearch
  },
  name: 'list',
  data() {
    return {
      preURL: 'user',
      //商品列表
      tableData: [],

      //控制是否新建规格
      createModel: false,
      editIndex: -1,

      search: {
        keyword: '',
        user_level_id: '',
      },


      //新建规格字段
      form: {
        username: '',
        password: '',
        nickname: '',
        avatar: '',
        user_level_id: 1,
        phone: '',
        email: '',
        status: 1,
      },

      user_level: []
    }
  },
  created() {
    this.getList()
  },

  methods: {
    //获取列表
    getListResult(e) {
      // console.log(e)
      this.tableData = e.list
      this.user_level = e.user_level
    },

    // 打开模态框
    openModel(e = false) {
      // 增加
      if (!e) {
        // 初始化表单
        this.form = {
          username: '',
          password: '',
          nickname: '',
          avatar: '',
          user_level_id: 3,
          phone: '',
          email: '',
          status: 1,
        }
        this.editIndex = -1
      } else {
        // 修改
        this.form = {
          username: e.row.username,
          password: '',
          nickname: e.row.nickname,
          avatar: e.row.avatar,
          user_level_id: e.row.user_level_id,
          phone: e.row.phone,
          email: e.row.email,
          status: e.row.status,
        }
        this.editIndex = e.$index
      }
      // 打开dialog
      this.createModel = true
    },

    //添加规格
    submit() {
      let id = 0
      if (this.editIndex !== -1) {
        id = this.tableData[this.editIndex].id
      }
      this.addOrEdit(this.form, id)
      // 关闭模态框
      this.createModel = false
    },

    // 获取请求列表分页url
    getListURL() {
      return `/admin/${this.preURL}/${this.page.current}?limit=${this.page.size}&keyword=${this.search.keyword}&user_level_id=${this.search.user_level_id}`
    },


    //提交高级搜索
    searchEvent(e = false) {
      // 简单搜索
      if (typeof e === 'string') {
        this.search.keyword = e
        this.getList()
        return
      }
      // 高级搜索
      this.getList()
    },

    //  清空所有
    clearAllSearch() {
      this.search = {
        keyword: '',
        user_level_id: '',
      }
    },

    // 选择头像
    chooseImage() {
      this.app.showChooseImage((res) => {
        this.form.avatar = res[0].url
      }, 1)
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