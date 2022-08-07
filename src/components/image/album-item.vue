<template>
  <li class="list-group-item list-group-item-action"
      @click.stop="albumChange(index)"
      :class="{'active list-group-item-active':active}">
    {{ item.name }}

    <span class="btn btn-light btn-sm ml-auto" v-if="!showOptions">
        {{ item.images_count }}
    </span>
    <el-dropdown v-else>
      <span class="btn btn-light btn-sm">
        {{ item.images_count }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
            @click.stop.native="openAlbumModel({index,item})">
          修改
        </el-dropdown-item>
        <el-dropdown-item
            @click.stop.native="albumDel(index)">
          删除
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </li>
</template>

<script>
export default {
  name: 'album-item',
  props: {
    item: Object,
    index: Number,
    active: {
      type: Boolean,
      default: false
    },
    showOptions: {
      type: Boolean,
      default: true
    }


  },
  methods: {
    albumChange(index) {
      this.$emit('change', index)
    },
    openAlbumModel({index, item}) {
      this.$emit('edit', {index, item})
    },
    albumDel(index) {
      this.$emit('del', index)
    }
  }

};
</script>

<style lang="scss">
.list-group-item {
  display: flex;
  align-items: center;
  cursor: pointer;

  &-active {
    color: #67c23A;
    background: #f0f9eb;
    border-color: #c2e7b0;
  }

  .el-dropdown {
    margin-left: auto;
  }
}

</style>