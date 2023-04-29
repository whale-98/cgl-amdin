<template>
  <el-table
    v-bind="$attrs"
    style="width: 100%"
    align="center"
    @row-click="handleRowClick"
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
</template>

<script>
import Sortable from 'sortablejs'

export default {
  name: 'Index',
  props: {
    col: {
      type: Array,
      require: true,
      default: () => []
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
  mounted() {
    this.columnDrop()
  },
  methods: {
    // 列拖拽
    columnDrop() {
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          const oldItem = this.dropCol[evt.oldIndex]
          this.dropCol.splice(evt.oldIndex, 1)
          this.dropCol.splice(evt.newIndex, 0, oldItem)
        }
      })
    },
    // 单元行点击事件
    handleRowClick(row, column, cell) {
      this.$emit('row-click', row, column, cell)
    }
  }
}
</script>

<style scoped>

</style>
