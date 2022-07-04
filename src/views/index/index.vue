<template>
  <div>
    <!--数据统计-->
    <el-row :gutter="20" class="topCard">
      <el-col :span="6" v-for="(item,index) in counts" :key="index">
        <el-card class="box-card" shadow="hover">
          <div class="wrapper">
            <div class="img">
              <i :class='[item.icon,item.color]'></i>
            </div>
            <div class="text">
              <h4>{{ item.num }}</h4>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--店铺、订单提示 | 统计图-->
    <el-row :gutter="20" class="middleCard">
      <!--店铺、订单提示-->
      <el-col :span="12" class="left-side">
        <el-card
            class="box-card-left-one" shadow="never"
            v-for="(tip,title) in tips" :key="title"
        >
          <div slot="header" class="clearfix">
            <span>{{ tip.title }}</span>
            <el-button style="float: right; padding: 3px 0" type="text">
              {{ tip.desc }}
            </el-button>
          </div>
          <el-row :gutter="30">
            <el-col :span="tip.list.length|getCol" v-for="(itemList,index) in tip.list" :key="index">
              <a class="btn btn-light w-100" href="#">
                <h4 class="mb-1">{{ itemList.value }}</h4>
                <small class="text-muted">{{ itemList.name }}</small>
              </a>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <!--统计图-->
      <el-col :span="12" class="right-side">
        <el-card class="box-card-right" shadow="never">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>

          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      counts: [
        {
          icon: 'el-icon-user-solid',
          num: 30, desc: '关注人数（个）',
          color: 'bg-primary'
        },
        {
          icon: 'el-icon-s-finance',
          num: 120, desc: '订单总数（笔）',
          color: 'bg-success'
        },
        {
          icon: 'el-icon-s-order',
          num: 4183.80, desc: '今日订单金额（元）',
          color: 'bg-danger'
        },
        {
          icon: 'el-icon-s-data',
          num: 100, desc: '本月销量（个）',
          color: 'bg-warning'
        },
      ],
      tips: [
        {
          title: '店铺及商品提示',
          desc: '需要关注的店铺信息及待处理事项',
          list: [
            {name: '出售中', value: 123},
            {name: '出售中', value: 123},
            {name: '出售中', value: 123},
            {name: '出售中', value: 123}
          ]
        },
        {
          title: '交易提示',
          desc: '需要关注的店铺信息及待处理事项',
          list: [
            {name: '出售中', value: 123},
            {name: '出售中', value: 123},
            {name: '出售中', value: 123},
            {name: '出售中', value: 123},
            {name: '出售中', value: 123},
            {name: '出售中', value: 123}
          ]
        }

      ]
    }
  },
  filters: {
    getCol(total) {
      return 24 / total
    }
  }

};
</script>

<style lang="scss" scoped>
.topCard {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  > .el-col {
    border-radius: 4px;

    > .box-card {
      .wrapper {
        display: flex;
        align-items: center;

        .img {
          i {
            width: 40px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 1.5em;
            color: #fff;
            margin-right: 10px;
            background: #007bff;
          }
        }

        .text {
          p {
            color: #6c757d;
            font-size: 80%;
          }
        }
      }
    }
  }
}

.middleCard {
  > .left-side {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 370px;


    > .box-card-left-one {
      //margin: auto;

    }

    > .box-card-left-two {

    }

  }


  > .right-side {
    > .box-card-right {
      //border: 1px solid red;
      height: 370px;
    }
  }

  .bg-purple {
    background: #d3dce6;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

}


</style>