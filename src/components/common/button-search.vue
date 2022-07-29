<template>
  <div>
    <div class="tab-content">
      <!--左边按钮-->
      <slot name="left"></slot>
      <!--右边按钮-->
      <div class="ml-auto" v-show="!superSearch" v-if="showSearch">
        <slot name="right">
          <el-input v-model="keyword" size="mini"
                    :placeholder="placeholder" class="input">
          </el-input>
          <el-button type="info" size="mini"
                     @click="$emit('search',keyword)">搜索
          </el-button>
          <el-button size="mini"
                     @click="superSearch=true">高级搜索
          </el-button>
        </slot>
      </div>
    </div>
    <el-card class="card-wrapper box-card bg-light my-3"
             v-show="superSearch">
      <div slot="header" class="clearfix header">
        <span>高级搜索</span>
        <el-button style="float: right; padding: 3px 0" type="text"
                   @click="closeSuperSearch">收起
        </el-button>
      </div>
      <!--表单-->
      <slot name="form"></slot>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'button-search',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    showSearch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      keyword: '',
      superSearch: false,
    }
  },
  methods: {
    //高级搜索的显示与隐藏
    closeSuperSearch() {
      this.superSearch = false
    },
  }

};
</script>

<style lang="scss">
.tab-content {
  display: flex;
  align-items: center;

  .input {
    margin-right: 1rem;
    width: 150px;
  }
}

.card-wrapper {
  .header {
    margin: -10px;
  }

  .el-form {
    .el-form-item {
      .el-input {
        width: 200px;
      }

      .el-select {
        width: 200px;
      }
    }


  }
}

</style>