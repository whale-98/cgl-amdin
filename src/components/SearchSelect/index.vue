<template>
  <div class="search-select">
    <span>{{ title }}</span>
    <el-select v-model="_value" placeholder="请选择" clearable @change="handleSearch">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
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
    options: {
      type: Array,
      default: () => [],
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
.search-select{
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
  ::v-deep .el-select{
    width: 100%;
    .el-input .el-input__inner{
      height: 50px;
      background-color: transparent;
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 0 6px 6px 0;
      color: #FFF;
    }
  }
}
</style>
