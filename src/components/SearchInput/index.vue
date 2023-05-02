<template>
  <div class="search-input">
    <span>{{ title }}</span>
    <el-input v-model="_value" placeholder="请输入内容" clearable @keydown.enter.native="handleSearch" @blur="handleSearch" />
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
  .search-input{
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
    ::v-deep .el-input{
      .el-input__inner{
        height: 50px;
        color: #FFF;
        background-color: transparent;
        border: 1px solid rgba(255, 255, 255, 0.25);
        border-radius: 0 6px 6px 0;
      }
    }
  }
</style>
