<template>
  <el-form>
    <el-form-item label="市场价格">
      <el-input type="number" class="w-25" :value="oprice"
                @input="vModel('oprice', $event)" placeholder="">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="销售价格">
      <el-input type="number"
                class="w-25"
                :value="pprice"
                @input="vModel('pprice', $event)"
                placeholder="销售价格">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="成本价格">
      <el-input type="number"
                class="w-25"
                :value="cprice"
                @input="vModel('cprice', $event)"
                placeholder="成本价格">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="商品重量">
      <el-input type="number"
                class="w-25"
                :value="weight"
                @input="vModel('weight', $event)"
                placeholder="商品重量">
        <template slot="append">公斤</template>
      </el-input>
    </el-form-item>
    <el-form-item label="商品体积">
      <el-input type="number"
                class="w-25"
                :value="volume"
                @input="vModel('volume', $event)"
                placeholder="商品体积">
        <template slot="append">立方米</template>
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import {mapMutations, mapState} from 'vuex'

export default {
  data() {
    return {
      tabIndex: 0,
      value: [],
    };
  },
  computed: {
    ...mapState({
      oprice: state => state.goods_create.oprice,
      pprice: state => state.goods_create.pprice,
      cprice: state => state.goods_create.cprice,
      weight: state => state.goods_create.weight,
      volume: state => state.goods_create.volume,
    }),
    //  其他计算属性
  },
  methods: {
    ...mapMutations(['vModelState']),
    //修改表单的值
    vModel(key, value) {
      this.vModelState({key, value})
    },
  }

};
</script>

<style lang="scss">

</style>