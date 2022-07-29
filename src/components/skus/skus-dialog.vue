<template>
  <el-dialog
      title="商品规格选择" width="80%" top="5vh"
      :visible.sync="createModel">
    <el-container class="wrapper">
      <el-container>
        <!--侧边栏-->
        <el-aside width="200px">
          <div>
            <!-- 侧边 | 规格卡片标题 -->
            <ul class="list-group list-group-flush">
              <li
                  class="list-group-item
                  list-group-item-action "
                  v-for="(item,index) in skusList" :key="index"
                  :class="skusIndex===index ? 'sum-active': '' "
                  @click="changeSku(index)"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
        </el-aside>
        <el-container>
          <el-header>
            <el-button type="primary" size="mini" @click="toggleChoose">
              {{ isChooseAll ? '取消全选' : '全选' }}
            </el-button>
          </el-header>
          <!--主内容-->
          <el-main>
            <div>
              <span
                  class="border rounded py-1 px-3 mr-3"
                  v-for="(item,index) in skuItems" :key="index"
                  :class="item.isCheck ? 'sum-active' : '' "
                  @click="choose(item)"
              >
                {{ item.name }}
              </span>

            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
    <span slot="footer" class="dialog-footer">
    <el-button @click="createModel = false">取 消</el-button>
    <el-button type="primary" @click="confirm">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>

export default {
  data() {
    return {
      createModel: false,
      callback: false,
      chooseSkusList: [],//选中的skus
      skusIndex: 0,//当前选中skus规格的索引
      //  数据
      skusList: [
        {
          name: '颜色',
          type: 0,
          list: [
            {
              id: 1,
              name: '黄色',
              image: '',
              color: '',
              isCheck: false
            },
            {
              id: 2,
              name: '红色',
              image: '',
              color: '',
              isCheck: false
            }
          ]
        },
        {
          name: '尺寸',
          type: 0,
          list: [
            {
              id: 3,
              name: 'XL',
              image: '',
              color: '',
              isCheck: false
            },
            {
              id: 4,
              name: 'XXL',
              image: '',
              color: '',
              isCheck: false
            }
          ]
        }
      ]
    }
  },
  created() {
  },
  methods: {
    //打开弹出层
    showChooseSkus(callback) {
      this.callback = callback
      this.createModel = true
    },
    //关闭弹出层
    hide() {
      this.unChooseAll()
      this.createModel = false
      this.callback = false
    },
    //确定
    confirm() {
      //选中的skus
      if (typeof this.callback === 'function') {
        let item = this.skusList[this.skusIndex]
        this.callback({
          name: item.name,
          type: item.type,
          list: this.chooseSkusList
        })
      }
      //隐藏
      this.hide()
    },
    //选中切换规格卡片
    changeSku(index) {
      this.unChooseAll()
      this.skusIndex = index
    },
    //切换子选项
    choose(item) {
      //之前没有选中
      if (!item.isCheck) {
        //加入选中列表
        this.chooseSkusList.push(item)
        //修改选中状态
        return item.isCheck = true
      }
      //之前选中

      //  找到当前对象在chooseSkusList 中的索引
      let index = this.chooseSkusList.findIndex(v => {
        return v.id === item.id
      })
      //找不到
      if (index < 0) return;
      //从选中列表中删除
      this.chooseSkusList.splice(index, 1)

      //修改选中状态
      item.isCheck = false
    },
    //  选中/取消选中切换
    toggleChoose() {
      let list = this.skusList[this.skusIndex].list
      //  已经全选
      if (this.isChooseAll) {
        return this.unChooseAll()
      }
      // 全选操作
      this.chooseSkusList = list.map(v => {
        //  设置全选
        v.isCheck = true
        return v
      })

    },
    // 取消选中所有
    unChooseAll() {
      let list = this.skusList[this.skusIndex].list
      //  取消全选：
      //    1、取消选中状态
      list.forEach(v => {
        v.isCheck = false
      })
      // .isCheck = false
      //    2、清空选中列表
      return this.chooseSkusList = []

    }

  },
  computed: {
    //当前规格下的规格属性列表
    skuItems() {
      return this.skusList[this.skusIndex].list
    },
    //全选功能
    isChooseAll() {
      return this.skuItems.length === this.chooseSkusList.length
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
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #fff;


    }

    > .el-container {
      > .el-header {
        position: absolute;
        top: 0;
        left: 200px;
        right: 0;
        bottom: 0;
        height: 60px;
        border-top: 1px solid #ebebeb;
        border-bottom: 1px solid #ebebeb;
        line-height: 60px;
      }


      > .el-main {
        color: #333;
        position: absolute;
        top: 60px;
        left: 200px;
        right: 0;
        bottom: 0;

        div {
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          span {
            cursor: pointer;
          }
        }

      }
    }
  }
}

.sum-active {
  background: #eaf2e6;
  color: teal;
}
</style>