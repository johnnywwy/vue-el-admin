<template>
  <el-dialog
      title="图片管理" width="80%" top="5vh"
      :visible.sync="imageModel">
    <el-container class="wrapper">
      <!--头部-->
      <el-header>
        <div class="header-wrapper">
          <el-select placeholder="请选择图片排序方式" size="mini"
                     v-model="searchFrom.order">
            <el-option label="降序" value="desc"></el-option>
            <el-option label="升序" value="asc"></el-option>
          </el-select>
          <el-input size="mini" placeholder="请选择图片名称"
                    v-model="searchFrom.keyword"></el-input>
          <el-button type="success" size="mini"
                     @click="getImageList">搜索
          </el-button>
        </div>
        <el-button
            type="warning" size="mini"
            @click="unChoose"
            v-if="chooseImageList.length">取消选中
        </el-button>
      </el-header>
      <el-container>
        <!--侧边栏-->
        <el-aside width="200px" v-loading="asideLoading">
          <div>
            <ul class="list-group list-group-flush">
              <albumItem v-for="(item,index) in albums" :key="index"
                         :item="item" :index="index"
                         :active="albumIndex===index"
                         @change="albumChange"
                         :show-options="false"/>
            </ul>
          </div>
        </el-aside>
        <el-container>
          <!--主内容-->
          <el-main v-loading="mainLoading">
            <el-row :gutter="10">
              <el-col :span="24" :lg="4" :md="6" :sm="8"
                      v-for="(item,index) in imageList" :key="index">
                <el-card class="box-card mb-3" shadow="hover"
                         :body-style="{ padding: '0' }">
                  <div class="border" :class="{'border-danger':item.isCheck}">
                    <span class="badge badge-danger" v-if="item.isCheck">{{ item.checkOrder }}</span>
                    <img :src="item.url" alt="123" @click="chooseImage(item)">
                    <div class="text small">{{ item.name }}</div>
                    <div class="btn p-2">
                      <el-button-group>
                        <el-button
                            icon="el-icon-edit" size="mini" class="p-2"
                            @click="editImageName(item,index)"></el-button>
                        <el-button
                            icon="el-icon-delete" size="mini" class="p-2"
                            @click="delImage({index})"></el-button>
                      </el-button-group>
                    </div>
                  </div>

                </el-card>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-container>
      <!--尾部-->
      <el-footer class="border-top d-flex align-items-center px-0 border-right">
        <div class="footer-btn">
          <el-button-group>
            <el-button
                size="mini"
                :disabled="albumPage===1"
                @click="changeAlbumPage('pre')"
            >上一页
            </el-button>
            <el-button
                size="mini"
                @click="changeAlbumPage('next')"
                :disabled="albumPage === Math.ceil(albumTotal / 10)"
            >下一页
            </el-button>
          </el-button-group>
        </div>
        <div class="footer-pagination">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="pageSizes"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
          </el-pagination>
        </div>
      </el-footer>
    </el-container>
    <span slot="footer" class="dialog-footer">
    <el-button @click="imageModel = false">取 消</el-button>
    <el-button type="primary" @click="confirm">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import albumItem from './album-item'

export default {
  components: {albumItem},
  name: 'image-dialog',
  props: {
    //图片选中数量限制
    max: {
      type: Number,
      default: 9
    }
  },
  data() {
    return {
      imageModel: false,
      callback: false,
      searchFrom: {
        order: '',
        keyword: ''
      },
      albums: [],
      albumPage: 1,    //分页
      albumIndex: 0,   //当前选中相册
      albumTotal: 0,   //相册总条数

      imageList: [],

      //选中图片的数组
      chooseImageList: [],
      currentPage: 1,
      pageSize: 10, //当前页面
      pageSizes: [10, 20, 50, 100],//页面条数选项
      total: 100, //总条数


      asideLoading: false,
      mainLoading: false,
    }
  },
  computed: {
    albumModelTitle() {
      return this.albumEditIndex > -1 ? '修改相册' : '创建相册'
    },
    // 选中相册id
    image_class_id() {
      let item = this.albums[this.albumIndex]
      // console.log('item', item)
      if (item) {
        return item.id
      }
      return 0
    },
    //  当前选中相册的图片列表url
    getImageListUrl() {
      let other = ''
      if (this.searchFrom.keyword !== '') {
        other = `&keyword=${this.searchFrom.keyword}`
      }
      return `/admin/imageclass/${this.image_class_id}/image/${this.currentPage}?limit=${this.pageSize}&order=${this.searchFrom.order}${other}`
    }

  },
  methods: {
    //初始化
    __init() {
      this.asideLoading = true

      //获取相册列表
      this.axios.get('/admin/imageclass/' + this.albumPage, {
        token: true
      }).then(res => {
        let result = res.data.data
        this.albums = result.list
        this.albumTotal = result.totalCount
        // console.log(result)
        this.asideLoading = false
        //  获取选中相册下的第一页图片列表
        this.getImageList()
      }).catch(err => {
        this.asideLoading = false
      })
    },
    //获取对应相册下的图片列表
    getImageList() {
      this.mainLoading = true
      this.axios.get(this.getImageListUrl, {
        token: true
      }).then(res => {
        let result = res.data.data
        // console.log(result)
        this.imageList = result.list.map(item => {
          return {
            id: item.id,
            url: item.url,
            name: item.name,
            isCheck: false,
            checkOrder: 0
          }
        })
        this.total = result.totalCount
        this.mainLoading = false
      }).catch(err => {
        this.mainLoading = false
      })
    },

    //切换相册方法
    albumChange(index) {
      this.albumIndex = index
      this.getImageList()
    },
    //  修改图片名称
    editImageName(item, index) {
      this.$prompt('请输入新名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: item.name,
        inputValidator(value) {
          let val = value.trim()
          if (val === '') {
            return '图片名称不能为空'
          }
        }
      }).then(({value}) => {
        console.log('value', value)
        console.log('index', index)
        item.name = value
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      })
    },
    //  删除当前图片
    delImage(obj) {
      this.$confirm(obj.all ? '是否删除选中图片?' : '是否删除该图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (obj.all) {
          let list = this.imageList.filter(img => {
            return !this.chooseImageList.some(c => {
              return c.id === img.id
            })
          })
          this.imageList = list
          this.chooseImageList = []
        } else {
          this.imageList.splice(obj.index, 1)
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    //  选择图片
    chooseImage(item) {
      //选中
      if (!item.isCheck) {
        //限制选中数量
        if (this.chooseImageList.length >= this.max) {
          return this.$message({
            message: '最多选择' + this.max + '张图片',
            type: 'warning'
          })
        }
        //加入选中序号
        this.chooseImageList.push({id: item.id, url: item.url})
        //计算选中序号
        item.checkOrder = this.chooseImageList.length
        //修改状态
        item.isCheck = !item.isCheck
        return;
      }
      //  取消选中
      //  找到在chooseImageList中的索引
      let i = this.chooseImageList.findIndex(v => v.id === item.id)
      console.log('序号i', i)
      if (i === -1) return
      //重新计算序号
      let length = this.chooseImageList.length
      console.log('长度length', length)
      //取消选中中间部分
      if (i + 1 < length) {
        //  重新计算chooseImageList中的序号
        for (let j = i; j < length; j++) {
          let No = this.imageList.findIndex(v => v.id === this.chooseImageList[j].id)
          if (No > -1) {
            this.imageList[No].checkOrder--
          }
        }
      }
      // 删除
      this.chooseImageList.splice(i, 1)
      //  修改状态
      item.isCheck = false
      //  重置序号
      item.checkOrder = 0


    },
    //取消选中
    unChoose() {
      //  找到所有选中的照片
      this.imageList.forEach(img => {
        let i = this.chooseImageList.findIndex(item => {
          return item.id === img.id
        })
        if (i > -1) {
          //  取消选中的样式，选中排序归零
          img.isCheck = false
          img.checkOrder = 0
          //  从chooseImageList 中移出
          this.chooseImageList.splice(i, 1)
        }
      })


    },
    //分页函数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    //打开弹出层
    showChooseImage(callback) {
      //取消选中图片
      this.unChoose()
      this.__init()
      this.imageModel = true
      this.callback = callback

    },
    //关闭弹出层
    hide() {
      this.imageModel = false
      this.callback = false
    },
    //  上下页
    changeAlbumPage(type) {
      if (type === 'pre') {
        this.albumPage--
      } else {
        this.albumPage++
      }
      this.__init()
    },

    //确定
    confirm() {
      //选中的图片url
      if (typeof this.callback === 'function') {
        this.callback(this.chooseImageList)
      }
      //隐藏
      this.hide()

    }

  }

};
</script>

<style lang="scss" scoped>
.wrapper {
  height: 70vh;
  position: relative;
  margin: -30px -20px;

  > .el-container {
    > .el-aside {
      color: #333;
      position: absolute;
      top: 60px;
      left: 0;
      right: 0;
      bottom: 60px;
      background: #fff;
      border-right: 1px solid #ccc;
    }

    > .el-container {

      > .el-main {
        color: #333;
        position: absolute;
        top: 60px;
        left: 200px;
        right: 0;
        bottom: 60px;

        > .el-row {
          > .el-col {
            > .el-card {
              cursor: pointer;
              position: relative;

              span {
                position: absolute;
                top: 0;
                right: 0;
              }

              img {
                width: 100%;
                height: 150px;
              }

              .text {
                position: absolute;
                color: white;
                width: 100%;
                background: rgba(0, 0, 0, 0.3);
                margin-top: -25px;
                padding-left: 0.5em;
              }

              .btn {
                width: 100%;
              }
            }

          }
        }

      }
    }
  }

  .el-header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #cccccc;

    > .header-wrapper {
      display: flex;
      align-items: center;
      margin-right: auto;


      > .el-select {
        width: 180px;
        margin-right: 1rem;
      }

      > .el-input {
        width: 200px;
        margin-right: 1rem;
      }
    }
  }


  .el-header,
  .el-footer {
    color: #333;
  }

  .el-footer {
    //border: 1px solid red;


    .footer-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 200px;
      height: 100%;
      border-right: 1px solid #dee2e6;
      flex-shrink: 0;

    }

    .footer-pagination {
      display: flex;
      align-items: center;
      margin-left: 20px;
      //border: 1px solid red;
      flex: 1;


    }
  }

}
</style>