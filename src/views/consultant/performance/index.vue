<template>
  <div class="performance">
    <!--搜索组件-->
    <div class="search-box">
      <!--input输入搜索框-->
      <SearchInput title="顾问名" :value.sync="searchData.顾问名" @handleSearch="handleSearch"/>
      <!--input输入搜索框-->
      <SearchSelect title="完成比" :value.sync="searchData.完成比" :options="percentOptions" @handleSearch="handleSearch"/>
      <!--select下拉搜索框，需要调接口，事件不同为getData-->
      <SearchSelect title="职位" :value.sync="searchData.职位" :options="positionOptions" @handleSearch="getData"/>
      <!--时间选择器搜索框，需要调接口，事件不同为getData-->
      <SearchDate title="统计时间" :value.sync="searchData.统计时间" @handleSearch="getData"/>
    </div>

    <!--tabs选择组件，不需要可删除 tabActiveName：tabs选中项（必填）-->
    <el-tabs v-model="tabActiveName">
      <!--tabs页面项，有几个tab写几个-->
      <el-tab-pane label="billing" name="billing">
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
          :default-sort="{prop: 'billing排名', order: 'ascending'}"
          :max-height="maxHeight"
          :loadingShow="loading"
        >
          <!--以下template标签内为自定义表格内容，通过表头数据prop字段来匹配-->
          <template v-slot:指标="{ scope }">
            <span>￥{{ scope.row.指标 }}</span>
          </template>
          <template v-slot:billing="{ scope }">
            <span>￥{{ scope.row.billing }}</span>
          </template>
          <template v-slot:billing完成率="{ scope }">
            <span class="completion"
                  :class="scope.row.billing完成率>100?'greenBox':scope.row.billing完成率>50?'blueBox':'redBox'">
              {{ scope.row.billing完成率 }}%
            </span>
          </template>
        </CommonTable>
      </el-tab-pane>
      <!--与上方重复-->
      <el-tab-pane label="开票" name="">
        <CommonTable
          :data="tableShowData"
          :col="col2"
          :default-sort="{prop: '开票完成率排名', order: 'ascending'}"
          :max-height="maxHeight"
          :loadingShow="loading"
        >
          <template v-slot:指标="{ scope }">
            <span>￥{{ scope.row.指标 }}</span>
          </template>
          <template v-slot:开票="{ scope }">
            <span>￥{{ scope.row.开票 }}</span>
          </template>
          <template v-slot:开票完成率="{ scope }">
            <span class="completion" :class="scope.row.开票完成率>100?'greenBox':scope.row.开票完成率>50?'blueBox':'redBox'">
              {{ scope.row.开票完成率 }}%
            </span>
          </template>
        </CommonTable>
      </el-tab-pane>
      <!--与上方重复-->
      <el-tab-pane label="到款" name="到款">
        <CommonTable
          :data="tableShowData"
          :col="col3"
          :default-sort="{prop: '到款完成率排名', order: 'ascending'}"
          :max-height="maxHeight"
          :loadingShow="loading"
        >
          <template v-slot:指标="{ scope }">
            <span>￥{{ scope.row.指标 }}</span>
          </template>
          <template v-slot:到款="{ scope }">
            <span>￥{{ scope.row.到款 }}</span>
          </template>
          <template v-slot:到款完成率="{ scope }">
            <span class="completion" :class="scope.row.到款完成率>100?'greenBox':scope.row.到款完成率>50?'blueBox':'redBox'">
              {{ scope.row.到款完成率 }}%
            </span>
          </template>
        </CommonTable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CommonTable from '@/components/commonTable'
import SearchInput from '@/components/SearchInput'
import SearchSelect from '@/components/SearchSelect'
import SearchDate from '@/components/SearchDate'
import { getConsultantList } from '@/api/consultant'

export default {
  components: { CommonTable, SearchInput, SearchSelect, SearchDate },
  data() {
    return {
      /* 主体数据，基本页面都需要 */
      tableData: [], // 主表格源数据备份
      tableShowData: [], // 表格实际显示数据
      loading: false, // 表格loading判断
      col1: [
        { label: '顾问名', prop: '顾问名', width: '200' },
        { label: '职位', prop: '职位', sortable: true },
        { label: '当前指标', prop: '指标', sortable: true },
        { label: 'Billing', prop: 'billing', sortable: true },
        { label: '完成率', prop: 'billing完成率', sortable: true, width: '100' },
        { label: '完成率排名', prop: 'billing完成率排名', sortable: true },
        { label: '业绩排名', prop: 'billing排名', sortable: true }
      ], // 表头数据
      col2: [
        { label: '顾问名', prop: '顾问名', width: '200' },
        { label: '职位', prop: '职位', sortable: true },
        { label: '当前指标', prop: '指标', sortable: true },
        { label: '开票', prop: '开票', sortable: true },
        { label: '完成率', prop: '开票完成率', sortable: true, width: '100' },
        { label: '完成率排名', prop: '开票排名', sortable: true },
        { label: '业绩排名', prop: '开票完成率排名', sortable: true }
      ], // 表头数据
      col3: [
        { label: '顾问名', prop: '顾问名', width: '200' },
        { label: '职位', prop: '职位', sortable: true },
        { label: '当前指标', prop: '指标', sortable: true },
        { label: '到款', prop: '到款', sortable: true },
        { label: '完成率', prop: '到款完成率', sortable: true, width: '100' },
        { label: '完成率排名', prop: '到款排名', sortable: true },
        { label: '业绩排名', prop: '到款完成率排名', sortable: true }
      ], // 表头数据

      /* 搜索组件数据，根据页面进行修改 */
      searchData: { 团队名: '', 完成比: '所有', 职位: 'Associate Consultant', 统计时间: [] }, // 搜索数据
      percentOptions: [
        { label: '所有', value: '所有' },
        { label: '0-50%', value: '0-50%' },
        { label: '50-100%', value: '50-100%' },
        { label: '100%', value: '100%' }
      ], // 百分比搜索下拉列表
      positionOptions: [
        { label: 'AC', value: 'Associate Consultant' },
        { label: 'C', value: 'Consultant' },
        { label: 'SC', value: 'Senior Consultant' },
        { label: 'AD', value: 'Associate Director' },
        { label: 'D', value: 'Director' },
        { label: 'AP', value: 'Associate Partner' },
        { label: 'P', value: 'Partner' },
        { label: 'SP', value: 'Senior Partner' },
        { label: 'MP', value: 'Managing Partner' },
        { label: 'ALL', value: "Associate Consultant,Consultant,Senior Consultant,Associate Director,Director,Associate Partner,Partner,Senior Partner,Managing Partner"},
      ], // 职位搜索下拉列表

      /* tabs组件所需数据，无tabs可删除 */
      tabActiveName: 'billing'
    }
  },
  mounted() {
    /* 初始化获取数据 */
    this.getData()
  },
  computed: {
    /* 表格根据页面自适应高度 */
    maxHeight() {
      return window.innerHeight - 300
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
      getConsultantList({
        start: this.searchData.统计时间[0],
        end: this.searchData.统计时间[1],
        key: localStorage.getItem('key'),
        title: this.searchData.职位.split(',')
      }).then(res => {
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
          return item.顾问名.match(reg) !== null
        })
      }
      if (this.searchData.完成比) {
        searchDataList = searchDataList.filter(item => {
          if (this.searchData.完成比 === '所有') {
            return item
          } else if (this.searchData.完成比 === '0-50%') {
            return Number(item[`${this.tabActiveName}完成率`]) >= 0 && Number(item[`${this.tabActiveName}完成率`]) < 50
          } else if (this.searchData.完成比 === '50-100%') {
            return Number(item[`${this.tabActiveName}完成率`]) >= 50 && Number(item[`${this.tabActiveName}完成率`]) < 100
          } else if (this.searchData.完成比 === '100%') {
            return Number(item[`${this.tabActiveName}完成率`]) >= 100
          }
        })
      }
      this.tableShowData = searchDataList
    }
  }
}
</script>

<style lang="scss" scoped>
  .performance {
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
