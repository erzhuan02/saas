<template>
  <div id="unsubscribeRecord">
    <!-- 查询条件 -->
    <div class="queryForm">
      <el-form ref="flowQuery" :model="flowQuery" :rules="queryFormRules" inline label-width="auto">
        <el-form-item prop="companyName" :label="$t('myClients.clientName')">
          <el-input v-model="flowQuery.companyName" clearable maxlength="128" :placeholder="$t('placeholder.input1') + $t('myClients.clientName')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('customerOrder.unSubTime')" prop="regisTime">
          <el-date-picker v-model="unsubTime" type="daterange" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')" format="yyyy-MM-dd" clearable value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="orderId" :label="$t('order.orderNum')">
          <el-input clearable v-model="flowQuery.orderId" maxlength="20" :placeholder="$t('placeholder.input1') + $t('order.orderNum')"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="search">{{ $t('button.query') }}</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">{{ $t('button.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询结果 -->
    <div class="result clearfix">
      <el-table class="audited" ref="resultTable" stripe border max-height="560" :data="tableData" style="width: 100%;" highlight-current-row>
        <el-table-column prop="companyName" :label="$t('myClients.clientName')"></el-table-column>
        <el-table-column prop="contactName" :label="$t('customerOrder.accountNum')"></el-table-column>
        <el-table-column prop="orderId" :label="$t('order.orderNum')" min-width="140"></el-table-column>
        <el-table-column prop="unRegReason" :label="$t('unsubscribe.unsubReason')"></el-table-column>
        <el-table-column prop="productName" :label="$t('order.productName')"></el-table-column>
        <el-table-column :label="$t('unsubscribe.productGG')">
          <template slot-scope="scope">
            <span v-if="scope.row.productType == 1">{{scope.row.pointNumb}}{{ $t('unit.one') }} {{scope.row.shopNumb}}{{ $t('unit.stores') }}</span>
            <span v-else>{{scope.row.userNumb}}{{ $t('unit.digit') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('account.createTime')" min-width="90"></el-table-column>
        <el-table-column :label="$t('workOrder.status')">
          <template slot-scope="scope">
            <span v-if="scope.row.unRegStatus == 1">退订成功</span>
            <span v-else-if="scope.row.unRegStatus == 2">退订失败</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="confirmTime" :label="$t('customerOrder.processTime')" min-width="90"></el-table-column>
        <!-- <el-table-column prop="unRegReason" :label="$t('regis.reason')"></el-table-column> -->
      </el-table>
      <!-- 分页 -->
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
      unsubTime: ['', ''],
      flowQuery: {
        startTime: '',
        endTime: '',
        companyName: '',
        orderId: '',
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      total: 0, // 总条数
      tableData: [],
      params: {} // 实际查询参数
    }
  },
  computed: {
    queryFormRules() {
      return {
        companyName: [
          {
            trigger: 'change',
            pattern: this.$utils.reg.companyName,
            validator: this.$utils.validator.common
          }
        ]
      }
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    // 点击查询
    search() {
      this.params = { ...this.flowQuery }
      this.params.pageNumber = 1
      this.params.pageSize = 10

      var unsubTime = this.unsubTime
      if (unsubTime && unsubTime.length > 0) {
        this.params.startTime = unsubTime[0]
        this.params.endTime = unsubTime[1]
      }
      this.getOrderList()
    },
    // 重置查询表单
    handleReset() {
      this.$refs.flowQuery.resetFields()
      this.unsubTime = ['', '']
    },
    // 一页显示多少条
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getOrderList()
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.params.pageNumber = val
      this.getOrderList()
    },
    // 获取订单列表
    getOrderList() {
      this.$http.posts('getAlreadyUnregOrder', this.params, '', false)
        .then(res => {
          let data = res.data
          this.total = data.total
          this.tableData = data.list || []
        })
    }
  }
}
</script>

<style lang="less" scoped>
#unsubscribeRecord {
}
</style>
