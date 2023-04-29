<template>
  <div class="team">
    <div class="search-box">
      <SearchInput title="团队名" :value.sync="searchData.团队名" @handleSearch="handleSearch" />
      <SearchSelect title="完成比" :value.sync="searchData.完成比" :options="percentOptions" @handleSearch="handleSearch" />
      <!--时间选择器需要调接口，事件不同-->
      <SearchDate title="统计时间" :value.sync="searchData.统计时间" @handleSearch="getData" />
    </div>
    <el-tabs v-model="tabActiveName">
      <el-tab-pane label="billing" name="billing">
        <CommonTable :data="tableShowData" row-key="label" :col="col1" :default-sort="{prop: 'billing排名', order: 'ascending'}" @row-click="handleClick">
          <template v-slot:全年指标="{ scope }">
            <span>￥{{ scope.row.全年指标 }}</span>
          </template>
          <template v-slot:当前指标="{ scope }">
            <span>￥{{ scope.row.当前指标 }}</span>
          </template>
          <template v-slot:billing="{ scope }">
            <span>￥{{ scope.row.billing }}</span>
          </template>
          <template v-slot:billing完成率="{ scope }">
            <span class="completion" :class="scope.row.billing完成率>100?'greenBox':scope.row.billing完成率>50?'blueBox':'redBox'">
              {{ scope.row.billing完成率 }}%
            </span>
          </template>
        </CommonTable>
      </el-tab-pane>
      <el-tab-pane label="开票" name="开票">
        <CommonTable :data="tableShowData" row-key="label" :col="col2" :default-sort="{prop: '开票完成率排名', order: 'ascending'}" @row-click="handleClick">
          <template v-slot:全年指标="{ scope }">
            <span>￥{{ scope.row.全年指标 }}</span>
          </template>
          <template v-slot:当前指标="{ scope }">
            <span>￥{{ scope.row.当前指标 }}</span>
          </template>
          <template v-slot:billing="{ scope }">
            <span>￥{{ scope.row.billing }}</span>
          </template>
          <template v-slot:billing完成率="{ scope }">
            <span class="completion" :class="scope.row.billing完成率>100?'greenBox':scope.row.billing完成率>50?'blueBox':'redBox'">
              {{ scope.row.billing完成率 }}%
            </span>
          </template>
        </CommonTable>
      </el-tab-pane>
      <el-tab-pane label="到款" name="到款">
        <CommonTable :data="tableShowData" row-key="label" :col="col3" :default-sort="{prop: '到款完成率排名', order: 'ascending'}" @row-click="handleClick">
          <template v-slot:全年指标="{ scope }">
            <span>￥{{ scope.row.全年指标 }}</span>
          </template>
          <template v-slot:当前指标="{ scope }">
            <span>￥{{ scope.row.当前指标 }}</span>
          </template>
          <template v-slot:billing="{ scope }">
            <span>￥{{ scope.row.billing }}</span>
          </template>
          <template v-slot:billing完成率="{ scope }">
            <span class="completion" :class="scope.row.billing完成率>100?'greenBox':scope.row.billing完成率>50?'blueBox':'redBox'">
              {{ scope.row.billing完成率 }}%
            </span>
          </template>
        </CommonTable>
      </el-tab-pane>
    </el-tabs>
    <el-dialog destroy-on-close title="详情" :visible.sync="dialogTableVisible" width="70%" top="10vh">
      <template slot="title">
        <span>详情</span>
        <el-button size="small" type="primary" style="margin-left: 20px;" @click="fileDownload">下载</el-button>
      </template>
      <CommonTable ref="tableData" :data="detailData" :col="detailCol" max-height="600px" />
    </el-dialog>
  </div>
</template>

<script>
import CommonTable from '@/components/commonTable'
import SearchInput from '@/components/SearchInput'
import SearchSelect from '@/components/SearchSelect'
import SearchDate from '@/components/SearchDate'
import { getTeamList, achievementdetail } from '@/api/team'
import { exportToExcel } from '@/utils/tableToExcel'

export default {
  components: { CommonTable, SearchInput, SearchSelect, SearchDate },
  data() {
    return {
      tabActiveName: 'billing',
      col1: [
        { label: '一级团队', prop: '一级团队', width: '300' },
        { label: '全年指标', prop: '全年指标', sortable: true },
        { label: '当前指标', prop: '当前指标', sortable: true },
        { label: 'Billing', prop: 'billing', sortable: true },
        { label: '完成率', prop: 'billing完成率', sortable: true, align: 'center' },
        { label: '完成率排名', prop: 'billing完成率排名', sortable: true },
        { label: '业绩排名', prop: 'billing排名', sortable: true }
      ], // 表头数据
      col2: [
        { label: '一级团队', prop: '一级团队', width: '300' },
        { label: '全年指标', prop: '全年指标', sortable: true },
        { label: '当前指标', prop: '当前指标', sortable: true },
        { label: '开票', prop: '开票', sortable: true },
        { label: '完成率', prop: '开票完成率', sortable: true, align: 'center' },
        { label: '完成率排名', prop: '开票排名', sortable: true },
        { label: '业绩排名', prop: '开票完成率排名', sortable: true }
      ], // 表头数据
      col3: [
        { label: '一级团队', prop: '一级团队', width: '300' },
        { label: '全年指标', prop: '全年指标', sortable: true },
        { label: '当前指标', prop: '当前指标', sortable: true },
        { label: '到款', prop: '到款', sortable: true },
        { label: '完成率', prop: '到款完成率', sortable: true, align: 'center' },
        { label: '完成率排名', prop: '到款排名', sortable: true },
        { label: '业绩排名', prop: '到款完成率排名', sortable: true }
      ], // 表头数据
      detailCol: [
        { label: '发票id', prop: 'invoiceId' },
        { label: '顾问id', prop: 'consultantId' },
        { label: '顾问名', prop: 'consultantName' },
        { label: '目前团队', prop: 'currentTeam' },
        { label: '分配金额', prop: 'allocationAmount' },
        { label: '添加日期', prop: 'addDate' },
        { label: '核算开票时间', prop: 'invoicingTime' },
        { label: '核算到款时间', prop: 'paymentArrivalTime' }
      ], // 弹窗表头数据
      tableData: [], // 主表格源数据备份
      tableShowData: [], // 表格实际显示数据
      detailData: [], // 弹窗数据
      dialogTableVisible: false, // 控制弹窗显示
      searchData: { 团队名: '', 完成比: '', 统计时间: [] }, // 搜索数据
      percentOptions: [
        { label: '所有', value: '所有' },
        { label: '0-50%', value: '0-50%' },
        { label: '50-100%', value: '50-100%' },
        { label: '100%', value: '100%' }
      ] // 百分比搜索下拉列表
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 主表格数据
    getData() {
      console.log(JSON.parse(JSON.stringify(this.searchData)))
      console.log(JSON.parse(JSON.stringify(this.searchData.统计时间[0])))
      getTeamList({ start: this.searchData.统计时间[0], end: this.searchData.统计时间[1], key: 'ahushuai' }).then(res => {
        const title = res.data.splice(0, 1)[0]
        res.data.forEach(item => {
          const tempObj = {}
          item.forEach((i, index) => {
            tempObj[title[index]] = i
          })
          this.tableData.push(tempObj)
        })
        this.tableShowData = JSON.parse(JSON.stringify(this.tableData))
      })
    },
    // 弹窗表格数据
    handleClick(row) {
      achievementdetail({ start: '2023-04-01', end: '2023-04-30', key: 'ahushuai', id: row.主团队id, type: 1 }).then(res => {
        // 接口数据不是键值对，手动处理
        this.dialogTableVisible = true
        res.data.forEach(item => {
          const tempObj = {}
          item.forEach((i, index) => {
            tempObj[this.detailCol[index].prop] = i !== 'None' ? i : ''
          })
          this.detailData.push(tempObj)
        })
      })
    },
    // 弹窗文件下载
    fileDownload() {
      const header = {
        invoiceId: '发票id',
        consultantId: '顾问id',
        consultantName: '顾问名',
        currentTeam: '目前团队',
        allocationAmount: '分配金额',
        addDate: '添加日期',
        invoicingTime: '核算开票时间',
        paymentArrivalTime: '核算到款时间'
      }
      const data = JSON.parse(JSON.stringify(this.detailData))
      exportToExcel(data, header, '测试')
    },
    // 搜索
    handleSearch() {
      let searchDataList = JSON.parse(JSON.stringify(this.tableData)) // 需要深拷贝，不然会影响源数据
      if (this.searchData.团队名) {
        searchDataList = searchDataList.filter(item => {
          return item.一级团队.indexOf(this.searchData.团队名) !== -1
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
.team{
  padding: 20px;
  ::v-deep .el-tabs__header{
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
    margin-bottom: 0;
    .el-tabs__nav-wrap::after{
      background-color: transparent;
    }
    .el-tabs__item{
      font-size: 16px;
    }
    .el-tabs__item:not(.is-active){
      color: #fff;
    }
  }
  .search-box{
    padding: 0 15px;
    margin-bottom: 40px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
  }
}
</style>
