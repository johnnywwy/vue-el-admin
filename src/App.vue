<template>
  <div id="app">
    <router-view></router-view>
    <el-dialog
        title="标题"
        :visible.sync="imageModel">
      <el-container class="wrapper">
        <!--头部-->
        <el-header>
          <div class="header-wrapper">
            <el-select placeholder="请选择图片排序方式" size="mini" v-model="searchFrom.order">
              <el-option label="区域一" value="上海"></el-option>
              <el-option label="区域二" value="北京"></el-option>
            </el-select>
            <el-input size="mini" placeholder="请选择相册名称" v-model="searchFrom.keyword"></el-input>
            <el-button type="success" size="mini">搜索</el-button>
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
                           :active="albumsIndex===index"
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
              <el-button size="mini">上一页</el-button>
              <el-button size="mini">下一页</el-button>
            </el-button-group>
          </div>
          <div class="footer-pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="400">
            </el-pagination>
          </div>
        </el-footer>
      </el-container>
      <span slot="footer" class="dialog-footer">
    <el-button @click="imageModel = false">取 消</el-button>
    <el-button type="primary" @click="imageModel = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>

import albumItem from './components/image/album-item'

export default {
  name: 'app',
  components: {
    albumItem
  },
  //依赖注入
  provide() {
    return {
      app: this
    }
  },
  data() {
    return {
      imageModel: false,
      searchFrom: {
        order: '',
        keyword: ''
      },
      albums: [],
      albumsIndex: 0,
      albumsModel: false,
      albumEditIndex: -1,
      albumForm: {
        name: '',
        order: 0
      },
      uploadModel: false,
      previewModel: false,
      previewURL: '',
      imageList: [],
      //选中图片的数组
      chooseImageList: [],
      currentPage: 1
    }
  },
  created() {
    this.__init()
  },
  methods: {
    //初始化
    __init() {
      for (let i = 0; i < 20; i++) {
        this.albums.push({
          name: '相册' + i,
          num: Math.floor(Math.random() * 10),
          order: 0
        })
      }

      for (let i = 0; i < 30; i++) {
        this.imageList.push({
          id: i,
          url: 'https://www.apple.com/newsroom/images/product/mac/standard/Apple-Mac-Studio-Studio-Display-hero-220308_big.jpg.slideshow-xlarge_2x.jpg',
          name: '图片' + i,
          isCheck: false,
          checkOrder: 0
        })
      }

    },
    //切换相册方法
    albumChange(index) {
      this.albumsIndex = index
    },
    //打开相册修改/创建框
    openAlbumModel(obj) {
      //修改
      if (obj) {
        let {item, index} = obj
        this.albumForm.name = item.name
        this.albumForm.order = item.order
        this.albumEditIndex = index
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
    //  点击确定修改/创建相册
    confirmAlbumsModel() {
      //  判断是否修改
      if (this.albumEditIndex > -1) {
        this.albumEdit()
        return this.albumsModel = false
      }
      //  追加albums
      this.albums.unshift({
        name: this.albumForm.name,
        order: this.albumForm.order,
        num: 0
      })
      this.albumsModel = false

    },
    // 修改相册
    albumEdit() {
      this.albums[this.albumEditIndex].name = this.albumForm.name
      this.albums[this.albumEditIndex].order = this.albumForm.order
    },
    //  删除相册
    albumDel(index) {
      this.$confirm('是否删除该相册', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.albums.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!',

        });
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
      console.log(item)
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
    show() {
      this.imageModel = true
    },
    //取消
    hide() {
      this.imageModel = false
    },
    //确定
    confirm() {
      //选中的图片url
      //隐藏
      this.hide()

    }

  }
}
</script>

<style>
@import "assets/css/common.css";

</style>
