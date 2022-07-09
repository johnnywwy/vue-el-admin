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
          <el-row :gutter="20">
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
          <!--统计图容器-->
          <div ref="myChart" style="width: 100%;height:270px;"></div>
        </el-card>
      </el-col>
    </el-row>
    <!--销售情况统计 | 单品销售排名-->
    <el-row :gutter="20" class="mt-3 footerCard">
      <el-col :span="12">
        <el-card class="box-card-xiaoliang" shadow="never">
          <div slot="header" class="clearfix">
            <span>销量</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <!--第一个-->
          <div class="media border align-items-center  mb-4">
            <span class=" py-4 px-3 bg-light border-right ">昨日销量</span>
            <div class="media-body ">
              <div class="border-bottom pl-3 pb-1 mb-1">
                <span>订单量（件）</span>
                12
              </div>
              <div class=" pl-3">
                <span>订单量（件）</span>
                12
              </div>
            </div>
          </div>
          <!--第二个-->
          <div class="media border align-items-center ">
            <span class=" py-4 px-3 bg-light border-right ">昨日销量</span>
            <div class="media-body ">
              <div class="border-bottom pl-3 pb-1 mb-1">
                <span>订单量（件）</span>
                12
              </div>
              <div class=" pl-3">
                <span>订单量（件）</span>
                12
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card-paiming" shadow="never">
          <div slot="header" class="clearfix">
            <span>单品销售排名</span>
            <el-button style="float: right; padding: 3px 0" type="text">
              按周期统计商家店铺的订单量和订单金额
            </el-button>
          </div>
          <el-table
              :data="tableData"
              height="178"
              border
              style="width: 100%">
            <el-table-column
                type="index"
                label="#"
                width="50">
            </el-table-column>
            <el-table-column
                prop="date"
                label="商品信息"
            >
            </el-table-column>
            <el-table-column
                prop="num"
                label="销量"
                width="50">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import * as echarts from 'echarts';

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
          desc: '需要立即处理的交易订单',
          list: [
            {name: '出售中', value: 64},
            {name: '待回复', value: 10},
            {name: '库存预警', value: 0},
            {name: '仓库中', value: 3}
          ]
        },
        {
          title: '交易提示',
          desc: '按周期统计商家店铺的订单量和订单金额',
          list: [
            {name: '代付款', value: 0},
            {name: '待发货', value: 10},
            {name: '已发货', value: 0},
            {name: '已收货', value: 3},
            {name: '退款中', value: 3},
            {name: '待售后', value: 3}
          ]
        }

      ],
      tableData: [
        {
          date: '小天鹅（littleSwan）滚筒洗衣机...',
          num: '9'
        }, {
          date: '小天鹅（littleSwan）滚筒洗衣机...',
          num: '9'
        }, {
          date: '小天鹅（littleSwan）滚筒洗衣机...',
          num: '9'
        }, {
          date: '小天鹅（littleSwan）滚筒洗衣机...',
          num: '9'
        }
      ]
    }
  },
  filters: {
    getCol(total) {
      return 24 / total
    }
  },
  mounted() {
    // 画统计图
    this.drawLine()
  },
  methods: {
    drawLine() {
      //  初始化echarts
      let myChart = echarts.init(this.$refs.myChart);
      myChart.setOption({
        title: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Email',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'Union Ads',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: 'Video Ads',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: 'Direct',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: 'Search Engine',
            type: 'line',
            stack: 'Total',
            label: {
              show: true,
              position: 'top'
            },
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      });
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

.footerCard {
  .box-card-xiaoliang {
    height: 280px;
    //border: 1px solid red;

  }

}


</style>