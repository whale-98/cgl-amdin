<template>
  <div class="jobChange">
    <!--搜索组件-->
    <div class="search-box">
      <!--input输入搜索框-->
      <SearchInput title="顾问名" :value.sync="searchData.顾问名" @handleSearch="handleSearch"/>
      <!--input输入搜索框-->
      <SearchInput title="团队" :value.sync="searchData.团队" @handleSearch="handleSearch"/>
      <!--select下拉搜索框-->
      <SearchSelect title="晋升次数" :value.sync="searchData.晋升次数" :options="percentOptions" @handleSearch="handleSearch"/>
      <!--时间选择器搜索框，时间选择器需要调接口，事件不同为getData-->
      <SearchDate title="统计时间" :value.sync="searchData.统计时间" @handleSearch="getData"/>
    </div>

    <!--通用表格组件，
    data：表格数据（必填）
    col：表头数据（必填）
    loadingShow:loading参数（必填）
    default-sort:默认排序配置
    max-height:需要页面滚动条时添加
    @row-click:需要点击弹窗时添加
    -->
    <CommonTable
      :data="tableShowData"
      :col="col1"
      :default-sort="{prop: '晋升次数', order: 'descending'}"
      :loadingShow="loading"
      :max-height="maxHeight"
      @row-click="handleClick"
    >
      <!--以下template标签内为自定义表格内容，通过表头数据prop字段来匹配-->
      <template v-slot:id="{ scope }">
        <span>#{{ scope.row.id }}</span>
      </template>
    </CommonTable>

    <!--弹窗内容，需弹窗时增加 参数都必填-->
    <el-dialog destroy-on-close title="详情" :visible.sync="dialogTableVisible" width="70%" top="10vh">
      <!--弹窗表格主体，使用通用表格-->
      <CommonTable ref="tableData" :data="detailData" :col="detailCol" :max-height="maxHeight"/>
    </el-dialog>
  </div>
</template>

<script>
import CommonTable from '@/components/commonTable'
import SearchInput from '@/components/SearchInput'
import SearchSelect from '@/components/SearchSelect'
import SearchDate from '@/components/SearchDate'
import {titlechange} from '@/api/consultant'

export default {
  components: {CommonTable, SearchInput, SearchSelect, SearchDate},
  data() {
    return {
      /* 主体数据，基本页面都需要 */
      tableData: [], // 主表格源数据备份
      tableShowData: [], // 表格实际显示数据
      loading: false, // 表格loading判断
      col1: [
        { label: 'Id', prop: 'id', sortable: true, width: 80 },
        { label: '顾问名', prop: '顾问', sortable: true },
        { label: '团队', prop: '一级团队', sortable: true },
        { label: '职位', prop: '职位', sortable: true },
        { label: '晋升次数', prop: '晋升次数', sortable: true },
        { label: '降级次数', prop: '降级次数', sortable: true }
      ], // 表头数据

      /* 搜索组件数据，根据页面进行修改 */
      searchData: { 顾问名: '', 团队: '', 晋升次数: '所有', 统计时间: [] }, // 搜索数据
      percentOptions: [
        { label: '所有', value: '所有' },
        { label: '0次', value: '0' },
        { label: '1次', value: '1' },
        { label: '2次', value: '2' },
        { label: '2次以上', value: '2次以上' }
      ], // 百分比搜索下拉列表

      /* 弹窗组件所需数据，无弹窗可删除 */
      detailData: [], // 弹窗数据
      dialogTableVisible: false, // 控制弹窗显示
      detailCol: [
        { label: '变动时间', prop: '变动时间' },
        { label: '变动前', prop: '变动前' },
        { label: '变动后', prop: '变动后' }
      ] // 弹窗表头数据
    }
  },
  mounted() {
    /* 初始化获取数据 */
    this.getData()
  },
  computed: {
    /* 表格根据页面自适应高度 */
    maxHeight() {
      return window.innerHeight - 260
    }
  },
  methods: {
    // 主表格数据
    getData() {
      this.tableData = []
      /* 设置表格loading状态 */
      this.loading = true
      /* 将搜索框内容保存到vuex中，给页面下载使用 */
      this.$store.dispatch('common/setSearchData', this.searchData)
      /* 请求页面接口数据 */
      titlechange({start: this.searchData.统计时间[0], end: this.searchData.统计时间[1], key: localStorage.getItem('key')}).then(res => {
        /* 去除第一列数据 */
        const title = res.data.splice(0, 1)[0]
        /* 处理数据为键值对格式 */
        res.data.forEach(item => {
          const tempObj = {}
          item.forEach((i, index) => {
            tempObj[title[index]] = i
          })
          this.tableData.push(tempObj)
        })
        /* 将数据进行备份，保存源数据 */
        this.tableShowData = JSON.parse(JSON.stringify(this.tableData))
        /* 请求结束，解除表格loading状态 */
        this.loading = false
      })
    },
    // 搜索
    handleSearch() {
      // 需要深拷贝，不然会影响源数据
      let searchDataList = JSON.parse(JSON.stringify(this.tableData))
      /* 这里需要根据搜索内容进行自定义处理 */
      if (this.searchData.顾问名) {
        const reg = new RegExp(this.searchData.顾问名, 'i')
        searchDataList = searchDataList.filter(item => {
          return item.顾问.match(reg) !== null
        })
      }
      if (this.searchData.团队) {
        const reg = new RegExp(this.searchData.团队, 'i')
        searchDataList = searchDataList.filter(item => {
          return item.一级团队.match(reg) !== null
        })
      }
      if (this.searchData.晋升次数) {
        searchDataList = searchDataList.filter(item => {
          if (this.searchData.晋升次数 === '所有') {
            return item
          } else if (this.searchData.晋升次数 === '2次以上') {
            return Number(item.晋升次数) > 2
          } else {
            return Number(item.晋升次数) === Number(this.searchData.晋升次数)
          }
        })
      }
      this.tableShowData = searchDataList
    },
    // 弹窗表格数据(无弹窗可删除)
    handleClick(row) {
      /* 初始化表格数据 */
      this.detailData = []
      /* 显示弹窗 */
      this.dialogTableVisible = true
      /* 根据需求直接拿到弹窗表格数据 */
      row.详情.forEach(item => {
        const tempObj = {}
        item.forEach((i, index) => {
          tempObj[this.detailCol[index].prop] = i !== 'None' ? i : ''
        })
        this.detailData.push(tempObj)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .jobChange {
    padding: 20px;
    ::v-deep .el-tabs__header {
      display: flex;
      justify-content: flex-end;
      margin-right: 20px;
      margin-bottom: 0;

      .el-tabs__nav-wrap::after {
        background-color: transparent;
      }

      .el-tabs__item {
        font-size: 16px;
      }

      .el-tabs__item:not(.is-active) {
        color: #fff;
      }
    }

    .search-box {
      padding: 0 15px;
      margin-bottom: 40px;
      display: flex;
      gap: 15px;
      &>div{
        flex: 1;
      }
    }

    .completion{
      padding: 4px 8px;
      border-radius: 20px;
      line-height: 30px;
    }

    .redBox {
      background-color: #f72b50;
    }

    .blueBox {
      background-color: rgba(83, 202, 253, 0.1);
      color: #53CAFD;
    }

    .greenBox {
      background-color: #1EAE7A;
    }
  }
</style>
