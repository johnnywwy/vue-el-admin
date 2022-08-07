<template>
  <div>
    <el-container class="wrapper">
      <!--头部-->
      <el-header>
        <div class="header-wrapper">
          <el-select placeholder="请选择图片排序方式" size="mini"
                     v-model="searchFrom.order">
            <el-option label="降序" value="desc"></el-option>
            <el-option label="升序" value="asc"></el-option>
          </el-select>
          <el-input size="mini" placeholder="请选择相册名称"
                    v-model="searchFrom.keyword"></el-input>
          <el-button type="success" size="mini" @click="getImageList">搜索</el-button>
        </div>
        <el-button
            type="warning" size="mini"
            @click="unChoose"
            v-if="chooseImageList.length">取消选中
        </el-button>
        <el-button
            type="danger" size="mini"
            @click="delImage({all:true})"
            v-if="chooseImageList.length">批量删除
        </el-button>
        <el-button
            type="success" size="mini"
            @click="openAlbumModel(false)">创建相册
        </el-button>
        <el-button
            type="warning" size="mini"
            @click="openUploadModel">上传图片
        </el-button>
      </el-header>
      <el-container>
        <!--侧边栏-->
        <el-aside width="200px">
          <div>
            <ul class="list-group list-group-flush">
              <albumItem v-for="(item,index) in albums" :key="index"
                         :item="item" :index="index"
                         :active="albumIndex===index"
                         @change="albumChange"
                         @edit="openAlbumModel"
                         @del="albumDel"
              />
            </ul>
          </div>
        </el-aside>
        <el-container>
          <!--主内容-->
          <el-main>
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
                            icon="el-icon-view" size="mini" class="p-2"
                            @click="previewImage(item)"></el-button>
                        <el-button
                            icon="el-icon-edit" size="mini" class="p-2"
                            @click="editImageName(item,index)"></el-button>
                        <el-button
                            icon="el-icon-delete" size="mini" class="p-2"
                            @click="delImage({index,item})"></el-button>
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
        <!--分页-->
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

    <!--修改 | 创建相册-->
    <el-dialog :title="albumModelTitle" :visible.sync="albumsModel">
      <el-form :model="albumForm" label-width="90px">
        <el-form-item label="相册名称：">
          <el-input
              v-model="albumForm.name" label-width="90px"
              size="medium" placeholder="请输入图片名称"
              style="width: 50%;"
          ></el-input>
        </el-form-item>
        <el-form-item label="相册排序：">
          <el-input-number v-model="albumForm.order"
                           :min="0" size="medium">
          </el-input-number>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="albumsModel = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirmAlbumsModel()">确 定
        </el-button>
      </div>
    </el-dialog>

    <!--上传图片-->
    <el-dialog title="上传图片" @close="__init"
               :visible.sync="uploadModel"
               width="50%">
      <!--拖拽上传-->
      <div class="uploadImage">
        <el-upload
            class="upload-demo"
            drag
            action="/admin/image/upload"
            multiple
            :headers="{token:$store.state.user.token}"
            :data="{image_class_id:image_class_id}"
            name="img"
            :on-success="uploadSuccess"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>

    <!--预览图片-->
    <el-dialog :visible.sync="previewModel" width="70vw">
      <div class="previewModel">
        <img :src="previewURL" alt="" width="100%">
      </div>
    </el-dialog>


  </div>
</template>

<script>
import albumItem from '../../components/image/album-item'

export default {
  name: 'index',
  inject: ['layout'],
  components: {
    albumItem
  },
  data() {
    return {
      //搜索相册
      searchFrom: {
        order: 'desc', //desc降序 ，asc升序
        keyword: ''    //照片名称
      },
      albums: [],      //相册
      albumPage: 1,    //分页
      albumIndex: 0,   //当前选中相册
      albumTotal: 0,   //相册总条数

      albumsModel: false,
      albumEditIndex: -1,
      albumForm: {
        name: '',
        order: 0
      },
      uploadModel: false,
      previewModel: false,
      previewURL: '',
      imageList: [],//获取到的图片列表
      //选中图片的数组
      chooseImageList: [],
      currentPage: 1,
      pageSize: 10, //当前页面
      pageSizes: [10, 20, 50, 100],//页面条数选项
      total: 100 //总条数
    }
  },
  created() {
    this.__init()
  },
  methods: {
    //初始化
    __init() {
      //获取相册列表
      this.layout.showLoading()
      this.axios.get('/admin/imageclass/' + this.albumPage, {
        token: true
      }).then(res => {
        let result = res.data.data
        // console.log('result', result)
        this.albums = result.list
        this.albumTotal = result.totalCount
        //  获取选中相册下的第一页图片列表
        this.getImageList()
      }).catch(err => {
        this.layout.hideLoading()
      })
    },
    //获取对应相册下的图片列表
    getImageList() {
      this.layout.showLoading()
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
        this.layout.hideLoading()
      }).catch(err => {
        this.layout.hideLoading()
      })
    },
    //切换相册方法
    albumChange(index) {
      this.albumIndex = index
      this.getImageList()
    },
    //打开相册修改/创建框
    openAlbumModel(obj) {
      //修改
      if (obj) {
        let {item, index} = obj
        this.albumForm.name = item.name
        this.albumForm.order = item.order
        this.albumEditIndex = index
        //打开模态框
        return this.albumsModel = true
      }
      //创建
      this.albumForm = {
        name: '',
        order: 0
      }
      this.albumEditIndex = -1
      this.albumsModel = true

    },
    // 点击确定修改/创建相册
    confirmAlbumsModel() {
      //  判断是否修改
      if (this.albumEditIndex > -1) {
        this.albumEdit()
        return this.albumsModel = false
      }
      // 创建相册
      this.layout.showLoading()
      this.axios.post('/admin/imageclass', this.albumForm, {
        token: true
      }).then(res => {
        this.layout.hideLoading()
        this.$message({
          type: 'success',
          message: '创建成功'
        })
        this.__init()
        console.log(res)
      }).catch(err => {
        console.log(err)
      })

      this.albumsModel = false

    },
    // 修改相册
    albumEdit() {
      let item = this.albums[this.albumEditIndex]
      this.layout.showLoading()
      this.axios.post('/admin/imageclass/' + item.id, this.albumForm, {
        token: true
      }).then(res => {
        console.log('res.statusText', res.statusText)
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.layout.hideLoading()
        this.__init()
      }).catch(err => {
        this.layout.hideLoading()
      })
    },
    //  删除相册
    albumDel(index) {
      this.$confirm('是否删除该相册', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = this.albums[index].id
        this.layout.showLoading()
        this.axios.delete('/admin/imageclass/' + id, {
          token: true
        }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.__init()
          this.layout.hideLoading()
        }).catch(err => {
          this.layout.hideLoading()
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });


    },
    //  上传图片
    openUploadModel() {
      this.uploadModel = true
    },
    //  预览图片
    previewImage(item) {
      this.previewURL = item.url
      this.previewModel = true
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
        this.layout.showLoading()
        this.axios.post('/admin/image/' + item.id, {
          name: value
        }, {
          token: true
        }).then(res => {
          this.__init()
          this.layout.hideLoading()
          this.$message({
            message: '修改成功',
            type: 'success'
          }).catch(err => {
            this.layout.hideLoading()
          })
        })

      })
    },
    //  删除当前图片
    delImage(obj) {
      this.layout.showLoading()
      this.$confirm(obj.all ? '是否删除选中图片?' : '是否删除该图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //批量删除
        if (obj.all) {

          // let list = this.imageList.filter(img => {
          //   return !this.chooseImageList.some(c => {
          //     return c.id === img.id
          //   })
          // })
          let ids = this.chooseImageList.map(item => item.id)
          console.log(ids)
          this.axios.post('/admin/image/delete_all', {
                ids: ids
              }, {
                token: true
              }
          ).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.__init()
            this.layout.hideLoading()
            this.chooseImageList = [] //清空选中列表
          }).catch(err => {
            this.layout.hideLoading()
          })
        } else {
          //删除单张图片
          this.axios.delete('/admin/image/' + obj.item.id, {
            token: true
          }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.__init()
            this.layout.hideLoading()
          }).catch(err => {
            this.layout.hideLoading()
          })
        }
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
      if (i === -1) return
      //重新计算序号
      let length = this.chooseImageList.length
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
      this.pageSize = val
      this.getImageList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getImageList()
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

    //  上传成功后回调
    uploadSuccess(response, file, fileList) {
      console.log(response, file, fileList)
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

  }
};
</script>

<style lang="scss" scoped>

.wrapper {
  position: absolute;
  top: 55px;
  left: 0;
  right: 0;
  bottom: 0;


  > .el-container {
    > .el-aside {
      color: #333;
      position: absolute;
      top: 60px;
      left: 0;
      right: 0;
      bottom: 60px;
      background: #fff;
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

.uploadImage {
  .upload-demo {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
}

.previewModel {
  margin: -60px -20px -30px -20px;
}


</style>