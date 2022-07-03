<template>
  <div>
    <!--数据统计-->
    <el-row :gutter="20">
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
      ]
    }
  }

};
</script>

<style lang="scss" scoped>
.el-row {
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


</style>