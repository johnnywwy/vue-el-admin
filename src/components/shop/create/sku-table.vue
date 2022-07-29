<template>
  <table class="table table-sm table-bordered">
    <thead>
    <tr>
      <th scope="col" class="text-center" :colspan="th.colspan"
          :rowspan="th.rowspan" style="vertical-align:middle;"
          v-for="(th,thi) in tableThs" :key="thi"
      >
        {{ th.name }}
      </th>
    </tr>
    <tr>
      <th scope="col" class="text-center" colspan="1"
          rowspan="1" style="vertical-align:middle;"
          v-for="(th,thi) in sku_card" :key="thi"
      >
        {{ th.name }}
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item,index) in list" :key="index">
      <!--商品规格-->
      <th scope="row" class="text-center" width="100"
          v-for="(sku,skuI) in item.skus" :key="skuI">
        {{ sku.name }}
      </th>
      <td class="text-center" width="100">
       <span v-if="!item.image" class="btn btn-light border" @click="chooseImage(item)">
          <i class="el-icon-plus"></i>
        </span>
        <img :src="item.image" v-else class="image rounded" @click="chooseImage(item)">
      </td>
      <td class="text-center" width="100">
        <input type="number" v-model="item.pprice" class="form-control text-center">
      </td>
      <td class="text-center" width="100">
        <input type="number" v-model="item.cprice" class="form-control text-center">
      </td>
      <td class="text-center" width="100">
        <input type="number" v-model="item.oprice" class="form-control text-center">
      </td>
      <td class="text-center" width="100">
        <input type="number" v-model="item.stock" class="form-control text-center">
      </td>
      <td class="text-center" width="100">
        <input type="number" v-model="item.volume" class="form-control text-center">
      </td>
      <td class="text-center" width="100">
        <input type="number" v-model="item.weight" class="form-control text-center">
      </td>
      <td class="text-center" width="100">
        <input type="text" v-model="item.code" class="form-control text-center">
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import {mapGetters, mapState} from 'vuex'

export default {
  name: 'sku-table',
  inject: ['app'],
  data() {
    return {
      list: []
    }
  },
  computed: {
    ...mapGetters(['tableThs', 'tableData', 'skuLabels']),
    ...mapState({
      'sku_card': state => state.goods_create.sku_card
    }),

  },
  watch: {
    tableData(newValue) {
      this.list = newValue
    }
  },
  mounted() {
    // console.log(this.tableData)
    this.list = this.tableData
  },
  methods: {
    //选择图片
    chooseImage(item) {
      this.app.showChooseImage((res) => {
        // console.log(item)
        item.image = res[0].url
      }, 1)
    }
  }

};
</script>

<style lang="scss" scoped>
.image {
  width: 45px;
  height: 45px;
  cursor: pointer;
}
</style>