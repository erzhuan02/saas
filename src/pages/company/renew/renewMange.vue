<template>
  <div id="orderMange">
    <!-- 查询条件 -->
    <div class="queryForm">
      <el-form ref="paging" inline label-width="auto">
        <el-form-item prop="orderNum" :label="$t('order.productName')">
          <el-input v-model="flowQuery.productName" maxlength="20" :placeholder="$t('placeholder.input') + $t('order.productName')" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="search" :disabled="!clickflag">{{ $t('button.query') }}</el-button>
          <el-button type="primary" icon="el-icon-s-finance" v-if="button.batchRenewalFee" @click="examine(2)" :disabled="!clickflag">{{ $t('button.batchRenewal') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询结果 -->
    <div class="result clearfix">
      <el-table class="audited" ref="resultTable" stripe border max-height="560" :data="tableData" style="width: 100%;" @selection-change="handleSelectionChange" highlight-current-row>
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="confirmTime" :label="$t('expend.consumeTime')"></el-table-column>
        <el-table-column prop="productName" :label="$t('order.productName')"></el-table-column>
        <el-table-column prop="orderId" :label="$t('order.orderNum')"></el-table-column>
        <el-table-column prop="orderType" :label="$t('order.orderType')"></el-table-column>
        <el-table-column prop="paymentAmount" :label="$t('order.consumptions')"></el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="scope">
            <div class="flex-hcvc">
              <el-button size="mini" v-if="button.renewalFee" type="primary" @click="examine(1, scope.row)" plain>{{ $t('button.renew') }}</el-button>
            </div>
          </template>
        </el-table-column>
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
      clickflag: true,
      button: {},
      total: 10, // 总条数
      tableData: [],
      params: {}, // 查询参数
      flowQuery: {
        productName: '',
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      batchData: []
    }
  },
  created() {
    this.$utils.getButton(this.$route.path, 1).then(res => {
      this.button = res
    })
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
    // 点击续费
    examine(type, data) {
      let arr = []
      let orderId = []
      if (type === 1) {
        arr.push(data)
      } else {
        // 批量续费
        if (this.batchData.length === 0) {
          this.$utils.$message({
            message: this.$t('message.prodToRenew'),
            type: 'error'
          })
          return
        }
        arr = this.batchData
      }
      arr.forEach(item => {
        orderId.push(item.orderId)
      })
      sessionStorage.setItem('renewOrderId', orderId.join(','))
      this.$router.push('/renew')
    },
    // 多选
    handleSelectionChange(val) {
      this.batchData = val
    },
    // 获取列表
    getList() {
      this.clickflag = false
      // this.tableData = []
      this.$http.posts('getRenewOrder', this.params, '', false)
        .then(res => {
          let data = res.data
          this.total = data.total
          if (data.list !== null) {
            data.list.forEach(item => {
              /** orderType 订单类型 1 新购 2续费 */
              if (item.orderType == 1) {
                item.orderType = '新购'
              } else {
                item.orderType = '续费'
              }
            })
            this.tableData = data.list
          } else {
            this.tableData = []
          }
          this.clickflag = true
        })
        .catch(er => {
          this.tableData = []
          this.clickflag = true
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color';
#orderMange {
}
</style>
