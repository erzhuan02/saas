<template>
  <div id="invoiceList">
    <!-- 查询 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
        <el-form-item :label="$t('log.timeSlot')" prop="dateRange">
          <el-date-picker v-model="queryForm.dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')"></el-date-picker>
        </el-form-item>
        <el-form-item prop="invoiceHead" :label="$t('invoice.invoiceTT')">
          <el-input v-model="queryForm.invoiceHead" :placeholder="$t('placeholder.input')" maxlength="50" clearable></el-input>
        </el-form-item>
        <el-form-item prop="status" :label="$t('workOrder.status')">
          <el-select v-model="queryForm.status" :placeholder="$t('placeholder.select')" clearable>
            <el-option v-for="(item, idx) in 6" :key="idx" :label="$t(`invoice.status${idx}`)" :value="idx"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作 -->
    <div class="CRUD flex">
      <el-button v-if="button.apply" type="primary" :disabled="bill < 1000" @click="applyInvoice">{{ $t('button.reqInvoice') }}</el-button>
      <p class="reqInvoice" v-show="bill < 1000">
        <span>{{ $t('invoice.req1') }}</span>
        <span>￥{{bill}}</span>
        <span>{{ $t('invoice.req3') }}</span>
      </p>
    </div>
    <!-- 查询结果 表格 -->
    <div class="result clearfix" v-loading="listLoading">
      <el-table ref="resultTable" class="overflowTable" stripe border max-height="650" :data="list" highlight-current-row>
        <el-table-column prop="createTime" :label="$t('invoice.reqBillTime')"></el-table-column>
        <el-table-column prop="invoiceNumb" :label="$t('invoice.receiptNumb')">
          <template slot-scope="scope">
            <span>{{scope.row.invoiceNumb || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invoiceHead" :label="$t('invoice.invoiceTT')"></el-table-column>
        <el-table-column prop="amount" :label="$t('invoice.invoiceAmount')"></el-table-column>
        <el-table-column :label="$t('invoice.invoiceType')">
          <template slot-scope="scope">
            <span v-if="scope.row.invoiceType === 1">{{ $t('invoice.ordInvoice') }}</span>
            <span v-if="scope.row.invoiceType === 2">{{ $t('invoice.specialInvoice') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('invoice.address')" width="200">
          <template slot-scope="scope">
            <div class="moreCell">
              <span>{{scope.row.address}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('common.status')">
          <span slot-scope="scope">{{ $t(`invoice.status${scope.row.status}`) }}</span>
        </el-table-column>
        <el-table-column prop="expressNumb" :label="$t('invoice.trackNumb')">
          <template slot-scope="scope">
            <span>{{ scope.row.expressNumb || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain v-if="button.return" :disabled="scope.row.status === 4 || scope.row.status === 5 || scope.row.isRejectionNumb" @click="handleDialogOpen(scope.row)">
              {{ $t('button.refund') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">
        {{ $t('common.currentPage') }} {{ list.length }}
        {{ $t('common.unit') }}
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <!-- 退票 -->
    <el-dialog :title="$t('button.refund')" :visible.sync="refundDialogVisible" :close-on-click-modal="false">
      <span v-if="rejectNumber === 0">{{ $t('invoice.tip3') }}</span>
      <span v-else>{{ $t('invoice.tip2').replace('xx1', rejectNumber).replace('xx2', 3 - rejectNumber) }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refundDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="refund">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $utils from '@/utils'
export default {
  data() {
    return {
      // 查询表单数据
      queryForm: {
        dateRange: [],
        status: '',
        invoiceHead: '',
        startTime: '',
        endTime: ''
      },
      // 当前表格的查询条件
      realQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      bill: 0,
      isInfoAndAddr: false, // 是否存在发票开具信息和寄送地址
      list: [],
      total: 0,
      selection: [],
      listLoading: false,
      currentRow: {},
      rejectNumber: 0, // 驳回次数

      refundDialogVisible: false,
      refundData: {}
    }
  },
  computed: {
    ...mapGetters(['language']),
    // 查询验证规则
    queryFormRules() {
      return {
        contractId: [
          {
            trigger: 'change',
            message: this.$t('message.inputRight'),
            pattern: this.$utils.reg.contractId
          }
        ]
      }
    }
  },
  watch: {
    // 修改最后一页删除的bug
    total() {
      if (
        this.total ===
        (this.realQuery.pageNumber - 1) * this.realQuery.pageSize &&
        this.total !== 0
      ) {
        this.realQuery.pageNumber -= 1
        this.getList() // 获取列表数据
      }
    }
  },
  created() { this.init() },
  mounted() { },
  props: ['button'],
  methods: {
    // 进页面就发的请求
    init() {
      this.$http.posts('getInvoiceBalance')
        .then(res => {
          let data = res.data
          this.bill = data.availableAmount || 0
          this.isInfoAndAddr = data.isInfoAndAddr
        })
      this.getList()// 获取列表数据
    },
    // 获取列表
    getList() {
      this.listLoading = true
      this.$http.posts('getInvoiceList', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          this.list = data.list || []
          this.total = data.total || 0
        })
        .catch(er => {
          this.listLoading = false
          this.list = []
          this.total = 0
        })
    },
    // 查询表单提交
    handleQuery() {
      this.$refs['queryForm'].validate(valid => {
        if (valid) {
          this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
          var realQuery = this.realQuery
          var dateRange = realQuery.dateRange
          if (dateRange && dateRange.length > 0) {
            realQuery.startTime = dateRange[0]
            realQuery.endTime = dateRange[1]
          }
          delete realQuery.dateRange
          this.getList()
        } else {
          return false
        }
      })
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
    // 申请发票
    applyInvoice() {
      if (this.isInfoAndAddr) {
        this.$router.push({ path: '/comInvoiceApply' })
      } else {
        this.$utils.$message({
          message: this.$t('invoice.tip1'),
          duration: 3000
        })
      }
    },
    // 对话框打开
    handleDialogOpen(data) {
      this.$http.posts('getRejectNum', '', { invoiceId: data.invoiceId }, { showSuccessMsg: false, showErrorMsg: true })
        .then(res => {
          this.rejectNumber = res.data
          this.refundData = data
          this.refundDialogVisible = true
        })
    },
    // 退票
    refund() {
      // type: 1退票，2寄出，3驳回，4同意
      this.$http.posts('updateStatusInvoice', { ids: this.refundData.invoiceId, type: 1 }, '', true)
        .then(res => {
          this.refundDialogVisible = false
          this.init()
        })
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#invoiceList {
  .CRUD {
    .reqInvoice {
      line-height: 60px;
      padding-left: 10px;
      span {
        color: @text5;
      }
    }
  }
  .result {
    .eye {
      margin-left: 5px;
      color: @text3;
      font-weight: 700;
    }
  }
  i.show {
    display: inline-block;
    font-style: normal;
    color: @text3;
    width: 36px;
  }
}
.tablePopover1 {
  .invoiceAddr {
    padding: 0 5px;
    color: @text3;
    line-height: 1.8;
  }
}
</style>
