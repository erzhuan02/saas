<template>
  <div id="flowSheet">
    <!-- 查询条件 -->
    <div class="queryForm">
      <el-form ref="flowQuery" :model="flowQuery" inline label-width="auto">
        <el-form-item :label="$t('time.startTime')" prop="startTime">
          <el-date-picker v-model="flowQuery.startTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :placeholder="$t('time.startTime')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('time.endTime')" prop="endTime">
          <el-date-picker v-model="flowQuery.endTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :placeholder="$t('time.endTime')">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="orderId" :label="$t('order.orderNum')">
          <el-input v-model="flowQuery.orderId" maxlength="30" :placeholder="$t('placeholder.input') + $t('order.orderNum')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.productName')" prop="productId">
          <el-select v-model="flowQuery.productId" :placeholder="$t('placeholder.select')" clearable>
            <el-option v-for="(item, index) in productData" :key="index" :label="item.productName" :value="item.productId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="search">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询结果 -->
    <div class="result clearfix">
      <el-table class="audited" ref="resultTable" stripe border max-height="560" v-loading="loading" :data="tableData" style="width: 100%;" highlight-current-row>
        <el-table-column prop="confirmTime" :label="$t('expend.consumeTime')"></el-table-column>
        <el-table-column prop="productName" :label="$t('order.productName')"></el-table-column>
        <el-table-column prop="orderId" :label="$t('order.orderNum')"></el-table-column>
        <el-table-column :label="$t('order.orderType')">
          <!-- 1.新购 2.续费 3.后付费 -->
          <span slot-scope="scope">{{ $t(`order.orderType${scope.row.orderType}`) }}</span>
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.orderType === 1">新购</span>
            <span v-if="scope.row.orderType === 2">续费</span>
            <span v-if="scope.row.orderType === 3">后付费</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="paymentAmount" :label="$t('order.consumptions')"></el-table-column>
        <el-table-column :label="$t('expend.payStatus')">
          <!-- 1.待支付 2.支付成功 3.订单取消 4.已退订 5.支付成功 支付成功后过期订单点了删除 6.支付成功 支付成功后点了禁用 -->
          <span slot-scope="scope">{{ $t(`order.orderStatus${scope.row.status}`) }}</span>
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.status === 1">待支付</span>
            <span v-if="scope.row.status === 2">支付成功</span>
            <span v-if="scope.row.status === 3">订单取消</span>
          </template> -->
        </el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="scope">
            <div class="flex-hcvc">
              <el-button size="mini" v-if="button.details" type="primary" @click="examine(scope.row)" plain>{{ $t('button.details') }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="currentTotal">{{ $t('common.currentPage') }} {{ tableData.length }} {{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="paging.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="paging.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      button: {},
      flowQuery: {
        startTime: '',
        endTime: '',
        orderId: '', // 订单号
        productId: ''
      },
      productData: [],
      paging: {
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      total: 10, // 总条数
      tableData: []
      // saveRoutePath: ''
    }
  },
  created() {
    this.$utils.getButton(this.$route.path, 1).then(res => {
      this.button = res
    })
  },
  mounted() {
    this.getProduct()
    this.getList()
  },
  // activated() {
  //   // 不是详情跳回则清除页面缓存
  //   if (this.saveRoutePath !== '/expendFlowDetails') {
  //     this.$refs['flowQuery'].resetFields()
  //     this.search()
  //   }
  // },
  // deactivated() {
  //   // 记录离开后页面的path
  //   this.saveRoutePath = this.$route.path
  // },
  methods: {
    // 获取产品名称
    getProduct() {
      this.$http.posts('getProductDataAuth')
        .then(res => {
          this.productData = res.data
        })
    },
    // 获取列表
    getList() {
      this.loading = true
      this.$http.posts('getCoExpenseDetail', this.paging, '', false)
        .then(res => {
          let data = res.data
          this.total = data.total || 0
          this.tableData = data.list || []
          this.loading = false
        }).catch((er) => {
          this.loading = false
        })
    },
    // 点击查询
    search() {
      this.paging = { ...this.paging, ...this.flowQuery }
      let startTime, endTime
      if (this.flowQuery.startTime !== null) {
        startTime = new Date(this.flowQuery.startTime.replace(/-/g, '/'))
      }
      if (this.flowQuery.endTime !== null) {
        endTime = new Date(this.flowQuery.endTime.replace(/-/g, '/'))
      }
      if (startTime > endTime) {
        this.$utils.$message({
          message: this.$t('message.startThanEnd'),
          type: 'error'
        })
        return false
      }
      this.paging.pageNumber = 1
      this.paging.pageSize = 10
      this.getList()
    },
    // 一页显示多少条
    handleSizeChange(val) {
      this.paging.pageSize = val
      this.getList()
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.paging.pageNumber = val
      this.getList()
    },
    // 点击操作
    examine(row) {
      this.$router.push({
        path: '/expendFlowDetails',
        query: {
          orderId: row.orderId
        }
      })
    }
  }
}
</script>

<style lang="less">
#flowSheet {
  position: relative;
  min-height: calc(100vh - 186px);
  .queryForm {
    .el-form-item:not(:last-child) .el-form-item__content {
      width: 220px;
    }
  }
}
</style>
