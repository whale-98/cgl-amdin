<template>
  <div class="search-date">
    <span>{{ title }}</span>
    <el-date-picker
      v-model="_value"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      :default-value="defaultValue"
      @change="handleSearch"
    />
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    title: {
      type: String,
      default: '',
      required: true
    },
    value: {
      type: [String, Object, Array]
    }
  },
  computed: {
    _value: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    },
    defaultValue() {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      date.setMonth(date.getMonth() + 1) // 先设置为下个月
      date.setDate(0) // 再置0，变成当前月最后一天
      const day = date.getDate()
      this.$emit('update:value', [`${year}-${month}-01`, `${year}-${month}-${day}`])
      return [`${year}-${month}-01`, `${year}-${month}-${day}`]
    }
  },
  methods: {
    handleSearch() {
      this.$emit('handleSearch')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-date{
  display: flex;
  span{
    padding: 0 10px;
    white-space: nowrap;
    background-color: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-right: 0px;
    border-radius: 6px 0 0 6px;
    line-height: 48px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
  }
  ::v-deep .el-date-editor{
    color: #fff;
    width: 100%;
    height: 50px;
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 0 6px 6px 0;
    .el-range-input{
      background-color: transparent;
      color: #fff;
    }
    .el-range-separator{
      color: #fff;
      line-height: 42px;
    }
  }
}
</style>
