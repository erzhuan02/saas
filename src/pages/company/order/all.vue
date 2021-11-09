<template>
  <div id="all">
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
        <el-form-item prop="productName" :label="$t('order.productName')">
          <el-input v-model="queryForm.productName" maxlength="30" :placeholder="$t('placeholder.input') + $t('order.productName')" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="search" v-if="clickflag">{{ $t('button.query') }}</el-button>
          <el-button type="primary" icon="el-icon-search" disabled v-else>{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询结果 -->
    <div class="result clearfix">
      <el-table class="audited" ref="resultTable" stripe border max-height="620" :data="tableData" v-loading="loading" style="width: 100%;" highlight-current-row>
        <el-table-column prop="orderId" :label="$t('order.orderNum')" width="210"></el-table-column>
        <el-table-column prop="productName" :label="$t('order.productName')"></el-table-column>
        <el-table-column prop="createTime" :label="$t('account.createTime')" width="170"></el-table-column>
        <el-table-column prop="status" :label="$t('order.orderStatus')"></el-table-column>
        <el-table-column :label="$t('order.shopNum')">
          <template slot-scope="scope">
            <span>{{ scope.row.shopNumb | toRung(0) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('order.specification')">
          <template slot-scope="scope">
            <span v-if="scope.row.productType == 1">{{ scope.row.pointNumb | toRung(1) }}</span>
            <span v-else>{{ scope.row.userNumb | toRung(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="validityPeriod" :label="$t('time.startAndStop')" width="310">
          <template slot-scope="scope">
            <span v-if="scope.row.startTime == null && scope.row.endTime == null">-</span>
            <span v-else>{{ `${scope.row.startTime}~${scope.row.endTime}` }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('order.orderType')">
          <!-- 1.新购 2.续费 3.后付费 -->
          <span slot-scope="scope">{{ $t(`order.orderType${scope.row.orderType}`) }}</span>
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.orderType === 1">新购</span>
            <span v-if="scope.row.orderType === 2">续费</span>
            <span v-if="scope.row.orderType === 3">后付费</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="totalAmount" :label="$t('order.orderAmount')"></el-table-column>
        <el-table-column prop="paymentAmount" :label="$t('order.payable')"></el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="scope">
            <div class="flex-hcvc">
              <el-button size="mini" type="primary" @click="examine(scope.row, 2)" v-if="clickflag && button.details" plain>{{ $t('button.details') }}</el-button>
              <el-button size="mini" type="primary" disabled v-else plain>{{ $t('button.details') }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal" v-if="tableData == null || tableData == []">{{ $t('common.currentPage') }} 0 {{ $t('common.unit') }}</div>
      <div class="currentTotal" v-else>{{ $t('common.currentPage') }} {{tableData.length}} {{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="paging.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="paging.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
export default {
  data() {
    return {
      clickflag: true,
      queryForm: {
        startTime: '',
        endTime: '',
        productName: ''
      },
      paging: {
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      total: 10, // 总条数
      tableData: [],
      totalCast: 0, // 总金额
      companyId: '',
      params: {}, // 查询参数
      button: {},
      loading: false
    }
  },
  mounted() {
    this.companyId = JSON.parse(sessionStorage.getItem('user')).companyId
    this.search()
    this.$nextTick(() => {
      this.$utils.getButton('/finOrderMange', 1).then(res => {
        this.button = res
      })
    })
  },
  methods: {
    // 点击查询
    search() {
      let startTime, endTime
      if (this.queryForm.startTime !== null) {
        startTime = new Date(this.queryForm.startTime.replace(/-/g, '/'))
      }
      if (this.queryForm.endTime !== null) {
        endTime = new Date(this.queryForm.endTime.replace(/-/g, '/'))
      }
      if (startTime > endTime) {
        this.$utils.$message({
          message: this.$t('message.startThanEnd'),
          type: 'error'
        })
        return false
      }
      this.params = {
        ...this.queryForm,
        companyId: this.companyId,
        status: 0,
        pageNumber: 1,
        pageSize: this.paging.pageSize
      }
      this.getOrderList(this.params)
    },
    // 点击去支付
    toPay() {
      this.$router.push('/payInfo')
    },
    // 一页显示多少条
    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.params = { ...this.paging, ...this.queryForm, companyId: this.companyId, status: 0 }
      this.getOrderList(this.params)
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.queryForm.pageNumber = val
      this.params = { ...this.paging, ...this.queryForm, companyId: this.companyId, status: 0 }
      this.getOrderList(this.params)
    },
    // 点击操作
    examine(row, type) {
      sessionStorage.setItem('orderId', row.orderId)
      if (type == 1) { // 取消
        this.$http.posts('cancelOrder', '', { orderId: this.orderId }, true)
          .then(res => {
            this.params = { ...this.paging, ...this.queryForm, companyId: this.companyId, status: 0 }
            this.getOrderList(this.params)
          }).catch((er) => {
            this.dialogCancel = false
          })
      } else { // 详情
        sessionStorage.setItem('joinOrder', 0)
        sessionStorage.setItem('status', row.status)
        this.$router.push({
          path: '/finOrderDetails',
          query: {
            type: 1,
            back: 2
          }
        })
      }
    },
    // 获取订单列表
    getOrderList(parmas) {
      this.clickflag = false
      this.loading = true
      this.$http.posts('myOrderList', parmas, '', false)
        .then(res => {
          this.clickflag = true
          let data = res.data
          this.total = data.total
          let list = data.list || []
          list.forEach((e, i) => {
            let isExpired = this.$utils.dateIsExpired(e.paymentEndTime)
            if (e.status == 1) {
              if (isExpired && e.orderType !== 3) {
                e.status = '订单取消'
              } else {
                e.status = '待支付'
              }
            } else if (e.status == 2) {
              e.status = '支付成功'
            } else if (e.status == 3) {
              e.status = '订单取消'
            } else {
              e.status = '订单退订'
            }
          })
          this.tableData = list
          this.loading = false
        }).catch((er) => {
          setTimeout(() => {
            this.clickflag = true
          }, 1000)
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less">
#all {
}
</style>
