<template>
  <div id="customerOrder">
    <!-- 客户订单 -->
    <div v-if="!detailsDialogVisible">
      <div class="queryForm">
        <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
          <el-form-item :label="$t('log.timeSlot')" prop="dateRange">
            <el-date-picker v-model="queryForm.dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')"></el-date-picker>
          </el-form-item>
          <!-- <el-form-item prop="companyName" :label="$t('common.companyName1')">
            <el-input v-model="queryForm.companyName" clearable :placeholder="$t('placeholder.input')"></el-input>
          </el-form-item> -->
          <el-form-item prop="companyIdPull" :label="$t('common.companyName1')">
            <el-select v-model="queryForm.companyIdPull" :placeholder="$t('placeholder.select')" clearable>
              <el-option v-for="item in companyList" :key="item.companyId" :label="item.companyName" :value="item.companyId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="companyId" :label="$t('common.companyId')">
            <el-input v-model="queryForm.companyId" :placeholder="$t('placeholder.input')" clearable></el-input>
          </el-form-item>
          <el-form-item prop="orderId" :label="$t('order.orderNum')">
            <el-input v-model="queryForm.orderId" :placeholder="$t('placeholder.input')" clearable></el-input>
          </el-form-item>
          <el-form-item prop="productId" :label="$t('common.productName')">
            <el-select v-model="queryForm.productId" :placeholder="$t('placeholder.select')" clearable>
              <el-option v-for="(item, index) in productData" :key="index" :label="item.productName" :value="item.productId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="orderStatus" :label="$t('order.orderStatus')">
            <el-select v-model="queryForm.status" :placeholder="$t('placeholder.select')" clearable>
              <el-option :label="$t('userShop.all')" value="0"></el-option>
              <el-option :label="$t('order.orderStatus1')" value="1"></el-option>
              <el-option :label="$t('order.orderStatus2')" value="2"></el-option>
              <el-option :label="$t('order.orderStatus3')" value="3"></el-option>
              <!-- <el-option :label="$t('order.orderStatus4')" :value="4"></el-option> -->
              <!-- <el-option :label="$t('order.orderStatus5')" value="5"></el-option> -->
              <!-- <el-option :label="$t('order.orderStatus6')" :value="6"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
            <!-- <el-button @click="handleReset" icon="el-icon-refresh">{{ $t('button.reset') }}</el-button> -->
          </el-form-item>
        </el-form>
      </div>
      <div class="result clearfix">
        <el-table class="audited" ref="resultTable" stripe border max-height="620" :data="list" style="width: 100%;" v-loading="listLoading" @sort-change="handleSortChange" highlight-current-row>
          <el-table-column type="index" :label="$t('common.no')" width="70" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
          <el-table-column prop="companyName" :label="$t('common.companyName1')" min-width="100"></el-table-column>
          <el-table-column prop="companyId" :label="$t('common.companyId')"></el-table-column>
          <el-table-column prop="orderId" :label="$t('order.orderNum')" min-width="140"></el-table-column>
          <el-table-column prop="productName" :label="$t('common.productName')"></el-table-column>
          <el-table-column prop="createTime" :label="$t('unsubscribe.orderCreateTime')" min-width="100"></el-table-column>
          <el-table-column sortable="custom" prop="status" :label="$t('order.orderStatus')" min-width="90">
            <!-- 1.待支付 2.支付成功 3.订单取消 4.已退订(此处后台过滤掉) 5.支付成功 支付成功后过期订单点了删除 6.支付成功 支付成功后点了禁用 -->
            <span slot-scope="scope">{{ $t(`order.orderStatus${scope.row.status}`) }}</span>
          </el-table-column>
          <el-table-column sortable="custom" prop="orderType" :label="$t('order.orderType')">
            <!-- 1.新购 2.续费 3.后付费 -->
            <span slot-scope="scope">{{ $t(`order.orderType${scope.row.orderType}`) }}</span>
          </el-table-column>
          <el-table-column prop="totalAmount" :label="$t('order.orderAmount')"></el-table-column>
          <el-table-column prop="paymentAmount" :label="$t('order.payable')"></el-table-column>
          <el-table-column :label="$t('common.operation')">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleDialogOpen('detils',scope.row)" plain>{{ $t('button.details') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="total">
          {{ $t('common.total1') }}: ￥{{totalAmount}} (
          <span style="color: #f00">{{ $t('order.toPaid') }}: ￥{{unpaidAmount}}</span>
          )
        </div>
        <!-- 分页 -->
        <div class="currentTotal">{{ $t('common.currentPage') }} {{list.length}} {{ $t('common.unit') }}</div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
      </div>
    </div>
    <!-- 详情 -->
    <customer-kanban-details v-if="detailsDialogVisible" :orderId="orderId" @show-details="isShow"></customer-kanban-details>
  </div>
</template>

<script>
import CustomerKanbanDetails from './customerKanbanDetails'
export default {
  components: { CustomerKanbanDetails },
  data() {
    return {
      companyList: [],
      productData: [],
      queryForm: {
        dateRange: [],
        companyIdPull: '',
        companyId: '',
        orderId: '',
        productId: '',
        status: '', // 订单状态

        startTime: '',
        endTime: ''
      },
      realQuery: {
        sortKey: '',
        sortValue: '',
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      list: [],
      total: 0, // 总条数
      listLoading: false,
      totalAmount: 0,
      unpaidAmount: 0,

      detailsDialogVisible: false,
      orderId: ''
      // button: {}
    }
  },
  computed: {
    queryFormRules() {
      return {
        companyId: [{
          trigger: 'change',
          message: this.$t('message.inputRight'),
          pattern: this.$utils.reg.companyId
        }],
        orderId: [
          {
            trigger: 'change',
            message: this.$t('message.inputRight'),
            pattern: this.$utils.reg.orderId
          }
        ]
      }
    }
  },
  created() {
    // this.$utils.getButton(this.$route.path, 1).then(res => {
    //   this.button = res
    // })
    this.getCompanyList()
    this.getProduct()
    this.getList()
  },
  mounted() { },
  methods: {
    getCompanyList() {
      this.$http.posts('getCompanyList')
        .then(res => {
          console.log(res)
          this.companyList = res.data
        })
    },
    // 获取产品名称
    getProduct() {
      this.$http.posts('getProductDataAuth')
        .then(res => {
          this.productData = res.data
        })
    },
    // 获取订单列表
    getList() {
      this.listLoading = true
      this.$http.posts('customerKanbanList', this.realQuery, '', false)
        .then(res => {
          this.listLoading = false
          let data = res.data || {}
          this.totalAmount = data.totalAmount || 0
          this.unpaidAmount = data.unpaidAmount || 0
          let listData = data.list || {}
          let list = listData.list || []
          this.total = listData.total || 0
          this.list = list
        })
        .catch(er => {
          this.listLoading = false
        })
    },
    // 点击查询
    handleQuery() {
      this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
      // this.$refs.resultTable.clearSort()
      var realQuery = this.realQuery
      var dateRange = realQuery.dateRange
      if (dateRange && dateRange.length > 0) {
        realQuery.startTime = dateRange[0]
        realQuery.endTime = dateRange[1]
      }
      delete realQuery.dateRange
      this.getList()
    },
    // 一页显示多少条
    handleSizeChange(val) {
      this.realQuery.pageSize = val
      this.getList()
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.realQuery.pageNumber = val
      this.getList()
    },
    // 排序
    handleSortChange(data) {
      if (data.order === 'ascending') {
        this.realQuery.sortValue = 'asc'
      } else if (data.order === 'descending') {
        this.realQuery.sortValue = 'desc'
      } else {
        this.realQuery.sortValue = ''
        this.realQuery.sortKey = ''
      }
      this.realQuery.sortKey = data.prop
      this.getList()
    },
    // 点击操作
    handleDialogOpen(type, row) {
      this.orderId = row.orderId
      this.detailsDialogVisible = true
    },
    isShow(val) {
      this.detailsDialogVisible = val
    }
    // 重置查询表单
    // handleReset() {
    //   this.$refs.queryForm.resetFields()
    // }
  }
}
</script>

<style lang="less" scoped>
#customerOrder {
  // .queryForm .el-form .el-form-item__content {
  //   width: auto;
  // }
  .el-form:not(.el-form--inline) {
    .el-form-item {
      min-width: auto;
    }
  }
  .total {
    width: 100%;
    line-height: 40px;
    text-align: right;
    font-size: 14px;
  }
}
</style>
