<template>
  <div id="customerOrder">
    <ul class="breadCrumb">
      <li @click="resetPage">{{ $t('home.nav32') }}</li>
      <li v-if="showDetails"><i class="el-icon-arrow-right"></i>{{ $t('button.details') }}</li>
      <li v-if="showAdPrice"><i class="el-icon-arrow-right"></i>{{ $t('button.adjustPrice') }}</li>
    </ul>
    <!-- 客户订单 -->
    <div v-if="showOrder">
      <div class="queryForm">
        <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
          <el-form-item prop="companyName" :label="$t('myClients.clientName')">
            <el-input v-model="queryForm.companyName" clearable maxlength="128" :placeholder="$t('placeholder.input1') + $t('myClients.clientName')"></el-input>
          </el-form-item>
          <el-form-item prop="orderId" :label="$t('order.orderNum')">
            <el-input v-model="queryForm.orderId" clearable maxlength="32" :placeholder="$t('placeholder.input1') + $t('order.orderNum')"></el-input>
          </el-form-item>
          <el-form-item prop="companyId" :label="$t('common.companyId')">
            <el-input v-model="queryForm.companyId" clearable :placeholder="$t('placeholder.input1') + $t('common.companyId')"></el-input>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" icon="el-icon-search" @click="search">{{ $t('button.query') }}</el-button>
            <el-button @click="handleReset" icon="el-icon-refresh">{{ $t('button.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="result clearfix">
        <el-table class="audited" ref="resultTable" stripe border max-height="620" :data="list" style="width: 100%;" v-loading="listLoading" @sort-change="handleSortChange" highlight-current-row>
          <el-table-column type="index" :label="$t('common.no')" width="70" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
          <el-table-column prop="orderId" :label="$t('order.orderNum')" min-width="150"></el-table-column>
          <el-table-column prop="companyId" :label="$t('common.companyId')"></el-table-column>
          <el-table-column prop="productName" :label="$t('customerOrder.productType')"></el-table-column>
          <el-table-column sortable="custom" prop="orderType" :label="$t('order.orderType')">
            <!-- 1.新购 2.续费 3.后付费 -->
            <span slot-scope="scope">{{ $t(`order.orderType${scope.row.orderType}`) }}</span>
            <!-- <template slot-scope="scope">
              <span v-if="scope.row.orderType === 1">新购</span>
              <span v-if="scope.row.orderType === 2">续费</span>
              <span v-if="scope.row.orderType === 3">后付费</span>
            </template> -->
          </el-table-column>
          <el-table-column sortable="custom" prop="status" :label="$t('order.orderStatus')">
            <!-- 1.待支付 2.支付成功 3.订单取消 4.已退订 5.支付成功 支付成功后过期订单点了删除 6.支付成功 支付成功后点了禁用 -->
            <span slot-scope="scope">{{ $t(`order.orderStatus${scope.row.status}`) }}</span>
            <!-- <template slot-scope="scope">
              <div v-if="scope.row.paymentMethod === 3">支付成功</div>
              <div v-else>
                <div v-if="scope.row.orderType === 3">
                  <span v-if="scope.row.status === 2">支付成功</span>
                  <span v-else>待支付</span>
                </div>
                <div v-else>
                  <span v-if="scope.row.status === 1">待支付</span>
                  <span v-else-if="scope.row.status === 2">支付成功</span>
                  <span v-else-if="scope.row.status === 3">订单取消</span>
                  <span v-else>已退订</span>
                </div>
              </div>
            </template> -->
          </el-table-column>
          <el-table-column prop="companyName" :label="$t('myClients.clientName')" min-width="100"></el-table-column>
          <el-table-column prop="contactName" :label="$t('myClients.accountName')"></el-table-column>
          <el-table-column prop="paymentMethod" :label="$t('unsubscribe.payMethod')">
            <template slot-scope="scope">
              <span v-if="scope.row.paymentMethod === 1">支付宝</span>
              <span v-else-if="scope.row.paymentMethod === 3">代金券</span>
              <span v-else-if="scope.row.paymentMethod === null">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" :label="$t('order.orderAmount')"></el-table-column>
          <el-table-column prop="paymentAmount" :label="$t('order.pay')"></el-table-column>
          <el-table-column prop="createTime" :label="$t('customerOrder.orderTime')" min-width="110"></el-table-column>
          <el-table-column :label="$t('common.operation')">
            <template slot-scope="scope">
              <div class="flex-hcvc">
                <el-button size="mini" type="primary" @click="examine(scope, 1)" plain v-if="button.details">{{ $t('button.details') }}</el-button>
                <!-- <el-button size="mini" type="primary" @click="examine(scope, 2)" plain v-if="button.changePrice">{{ $t('button.adjustPrice') }}</el-button> -->
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="currentTotal" v-if="list == null || list == []">{{ $t('common.currentPage') }} 0 {{ $t('common.unit') }}</div>
        <div class="currentTotal" v-else>{{ $t('common.currentPage') }} {{list.length}} {{ $t('common.unit') }}</div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
      </div>
    </div>
    <!-- 详情 -->
    <customer-order-details v-if="showDetails" :orderId="orderId"></customer-order-details>
    <!-- 调整价格 -->
    <adjust-price v-if="showAdPrice"></adjust-price>
  </div>
</template>

<script>
import CustomerOrderDetails from './customerOrderDetails'
import AdjustPrice from './adjuctPrice'
export default {
  components: {
    CustomerOrderDetails,
    AdjustPrice
  },
  data() {
    return {
      showOrder: true,
      showDetails: false,
      showAdPrice: false,

      queryForm: {
        companyName: '',
        companyId: '',
        orderId: ''
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
      companyId: '',
      orderId: '',
      button: {}
    }
  },
  computed: {
    queryFormRules() {
      return {
        companyName: [
          {
            // required: true,
            trigger: 'change',
            pattern: this.$utils.reg.companyName,
            validator: this.$utils.validator.common
          }
        ]
      }
    }
  },
  created() {
    this.$utils.getButton(this.$route.path, 1).then(res => {
      this.button = res
    })
    this.companyId = JSON.parse(sessionStorage.getItem('user')).companyId
    this.getList()
  },
  mounted() { },
  methods: {
    // 获取订单列表
    getList() {
      this.listLoading = true
      this.$http.posts('getCustomerOrder', this.realQuery, '', false)
        .then(res => {
          let data = res.data
          this.total = data.total || 0
          this.list = data.list || []
          this.listLoading = false
        })
        .catch(er => {
          this.listLoading = false
        })
    },
    // 点击查询
    search() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
          this.getList()
        } else {
          // console.log('error 验证错误query!!')
          return false
        }
      })
    },
    // 重置查询表单
    handleReset() {
      this.$refs.queryForm.resetFields()
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
    examine(scope, type) {
      this.orderId = scope.row.orderId
      if (type == 1) {
        this.changePage(false, true, false)
      }
      if (type == 2) {
        this.changePage(false, false, true)
      }
    },
    changePage(showOrder, showDetails, showAdPrice) {
      this.showOrder = showOrder
      this.showDetails = showDetails
      this.showAdPrice = showAdPrice
    },
    resetPage() {
      this.changePage(true, false, false)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color.less';
#customerOrder {
  .breadCrumb {
    margin: 10px 0;
    height: auto;
    overflow: hidden;
    border-bottom: solid 1px #eee;
    i {
      margin: 0 4px;
      font-size: 12px;
    }
    li {
      float: left;
      font-size: 14px;
      &:first-child {
        color: @main;
        border-bottom: solid 1px @main;
        cursor: pointer;
        padding: 10px 0;
        margin-left: 10px;
      }
      &:last-child {
        padding: 10px 0;
      }
    }
  }
}
</style>
