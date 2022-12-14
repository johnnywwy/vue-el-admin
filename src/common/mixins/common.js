export default {
  filters: {
    numToString(value) {
      return value.toString()
    }
  },
  data() {
    return {
      preURL: '',
      page: {
        current: 1,
        sizes: [10, 20, 50, 100],
        size: 10,
        total: 0
      },
      //当前分页
      currentPage: 1,
      //多选
      multipleSelection: [],
      //判断等待状态
      loading: true
    }
  },
  computed: {
    //选中的id的组成数组
    ids() {
      return this.multipleSelection.map(item => {
        return item.id
      })
    }
  },
  created() {
    this.getList()
  },
  methods: {
    showLoading() {
      if (this.loading) {
        this.layout.showLoading()
      }
    },
    hideLoading() {
      if (this.loading) {
        this.layout.hideLoading()
      }
    },

    //处理列表结果方法
    getListResult(data) {
    },
    //请求列表分页url
    getListURL() {
      return `/admin/${this.preURL}/${this.page.current}?limit=${this.page.size}`
    },
    //获取列表
    getList() {
      if (this.preURL === '') return
      this.showLoading()
      let url = this.getListURL()
      this.axios.get(url, {
        token: true
      }).then(res => {
        let data = res.data.data
        this.page.total = data.totalCount
        //往外暴露列表结果
        this.getListResult(data)
        this.tableData = data.list
        this.hideLoading()
      }).catch(err => {
        this.hideLoading()
      })

    },

    //添加或者编辑
    addOrEdit(data, id = 0) {
      this.showLoading()
      let msg = id > 0 ? '修改' : '增加'
      let url = id > 0 ? '/admin/' + this.preURL + '/' + id : '/admin/' + this.preURL
      this.axios.post(url, data, {
        token: true
      }).then(res => {
        this.$message({
          message: msg + '成功',
          type: 'success'
        })
        this.getList()
        this.hideLoading()
      }).catch(err => {
        this.hideLoading()
      })
    },

    //批量删除
    deleteAll() {
      this.$confirm('是否删除选中规格?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showLoading()
        this.axios.post('/admin/' + this.preURL + '/delete_all', {
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
          this.hideLoading()
        }).catch(err => {
          this.hideLoading()
        })
      })

    },

    //修改状态
    changeStatus(item) {
      //请求服务端修改状态
      this.showLoading()
      let status = item.status === 1 ? 0 : 1
      let msg = status === 1 ? '启用' : '禁用'

      this.axios.post('/admin/' + this.preURL + '/' + item.id + '/update_status', {
        status: status
      }, {
        token: true
      }).then(res => {
        item.status = status
        this.$message({
          message: msg + '成功',
          type: 'success'
        })
        this.hideLoading()
      }).catch(err => {
        this.hideLoading()

      })

    },

    //删除当前商品
    deleteItem(item) {
      this.$confirm('是否删除该规格?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showLoading()
        this.axios.post('/admin/' + this.preURL + '/' + item.id + '/delete', {}, {
          token: true
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList()
          this.hideLoading()
        }).catch(err => {
          this.hideLoading()
        })

      })
    },

    //选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(this.multipleSelection)
      console.log(this.ids)
    },
    //分页
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

}