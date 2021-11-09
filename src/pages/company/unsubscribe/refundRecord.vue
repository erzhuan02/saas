<template>
  <div id="refundRecord">
    <!-- 查询条件 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" inline label-width="auto">
        <el-form-item :label="$t('time.startTime')" prop="startTime">
          <el-date-picker v-model="queryForm.startTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :placeholder="$t('time.startTime')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('time.endTime')" prop="endTime">
          <el-date-picker v-model="queryForm.endTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :placeholder="$t('time.endTime')">
          </el-date-picker>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="search">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询结果 -->
    <div class="result clearfix">
      <el-table class="audited" ref="resultTable" stripe border max-height="620" :data="tableData" style="width: 100%;" highlight-current-row>
        <el-table-column prop="productName" :label="$t('order.productName')"></el-table-column>
        <el-table-column prop="unRegReason" :label="$t('unsubscribe.unsubReason')"></el-table-column>
        <el-table-column prop="unRegStatus" :label="$t('expend.state')"></el-table-column>
        <el-table-column prop="unRegAmount" :label="$t('unsubscribe.refundAmount')"></el-table-column>
        <el-table-column prop="createTime" :label="$t('unsubscribe.applyUnsubTime')"></el-table-column>
        <el-table-column prop="confirmTime" :label="$t('unsubscribe.unsubCompleteTime')"></el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="scope">
            <div class="flex-hcvc">
              <el-button size="mini" type="primary" @click="examine(scope)" v-if="button.details" plain>{{ $t('button.details') }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal" v-if="tableData == null || tableData == []">{{ $t('common.currentPage') }} 0 {{ $t('common.unit') }}</div>
      <div class="currentTotal" v-else>{{ $t('common.currentPage') }} {{tableData.length}} {{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="params.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="params.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryForm: {
        startTime: '',
        endTime: '',
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      total: 10, // 总条数
      tableData: [],
      params: {} // 查询参数
    }
  },
  props: ['button'],
  mounted() {
    this.search()
  },
  methods: {
    // 点击查询
    search() {
      this.params = { ...this.queryForm }
      let startTime, endTime
      if (this.params.startTime !== null) {
        startTime = new Date(this.params.startTime.replace(/-/g, '/'))
      }
      if (this.params.endTime !== null) {
        endTime = new Date(this.params.endTime.replace(/-/g, '/'))
      }
      if (startTime > endTime) {
        this.$utils.$message({
          message: this.$t('message.startThanEnd'),
          type: 'error'
        })
        return false
      }
      this.getList()
    },
    // 一页显示多少条
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getList()
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.params.pageNumber = val
      this.getList()
    },
    // 点击操作
    examine(scope) {
      this.$router.push({
        path: '/refundRecordDetails',
        query: {
          orderId: scope.row.orderId
        }
      })
    },
    getList() {
      this.$http.posts('getAlreadyUnregOrder', this.params, '', false)
        .then(res => {
          let data = res.data
          this.total = data.total
          if (data.list !== null) {
            data.list.forEach(e => {
              /** 退款状态 1.退订成功 0 退订失败 */
              if (e.unRegStatus == 1) {
                e.unRegStatus = '退订成功'
              } else if (e.unRegStatus == 2) {
                e.unRegStatus = '退订失败'
              } else {
                e.unRegStatus = '-'
              }
              // 申请退订时间
              if (e.unRegStartTime == null) {
                e.unRegStartTime = '-'
              }
              // 退订完成时间
              if (e.unRegEndTime == null) {
                e.unRegEndTime = '-'
              }
            })
          } else {
            this.tableData = []
          }
          this.tableData = data.list
        })
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#refundRecord {
  // position: relative;
  // min-height: calc(100vh - 186px);
}
</style>
