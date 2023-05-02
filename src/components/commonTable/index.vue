<template>
  <div class="commonTable">
    <ElTableDraggable column>
      <el-table
        v-bind="$attrs"
        style="width: 100%"
        align="center"
        @row-click="handleRowClick"
        v-loading="loadingShow"
        element-loading-text="数据正在加载中..."
      >
        <el-table-column
          v-for="(item, index) in col"
          :key="`col_${index}`"
          :prop="dropCol[index].prop"
          v-bind="item"
        >
          <template v-if="$scopedSlots[item.prop]" v-slot="scope">
            <slot :name="item.prop" :scope="scope" />
          </template>
        </el-table-column>
        <slot />
      </el-table>
    </ElTableDraggable>
  </div>
</template>

<script>
import ElTableDraggable from "el-table-draggable";

export default {
  name: 'Index',
  components:{ElTableDraggable},
  props: {
    col: {
      type: Array,
      require: true,
      default: () => []
    },
    tableId: {
      type: String,
      default: ''
    },
    loadingShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dropCol: []
    }
  },
  created() {
    this.dropCol = JSON.parse(JSON.stringify(this.col))
  },
  methods: {
    // 单元行点击事件
    handleRowClick(row, column, cell) {
      this.$emit('row-click', row, column, cell)
    }
  }
}
</script>

<style lang="scss" scoped>
.commonTable{
  /*padding: 20px;*/
  /*background-color: rgba(94, 62, 208, 0.6);*/
  /*border-radius: 15px;*/
}
</style>
