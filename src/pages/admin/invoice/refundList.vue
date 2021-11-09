<template>
  <div id="adRefundList">
    <!-- 查询 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
        <el-form-item :label="$t('log.timeSlot')" prop="dateRange">
          <el-date-picker v-model="queryForm.dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')"></el-date-picker>
        </el-form-item>
        <el-form-item prop="companyName" :label="$t('common.companyName1')">
          <el-input v-model="queryForm.companyName" :placeholder="$t('placeholder.input')" maxlength="50" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery()">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询结果 表格 -->
    <div class="result clearfix" v-loading="listLoading">
      <el-table ref="resultTable" class="overflowTable" stripe border max-height="650" :data="list" highlight-current-row>
        <el-table-column type="index" :label="$t('common.no')" width="50" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
        <el-table-column prop="companyName" :label="$t('common.companyName1')"></el-table-column>
        <el-table-column prop="phoneNumb" :label="$t('invoice.contactInfo')" min-width="90px"></el-table-column>
        <el-table-column prop="createTime" :label="$t('invoice.reqBillTime')" min-width="105px"></el-table-column>
        <el-table-column prop="updateTime" :label="$t('invoice.refundTime')" min-width="105px"></el-table-column>
        <el-table-column :label="$t('invoice.receiptNumb')">
          <span slot-scope="scope">{{scope.row.invoiceNumb || '-'}}</span>
        </el-table-column>
        <el-table-column prop="invoiceHead" :label="$t('invoice.invoiceTT')"></el-table-column>
        <el-table-column prop="amount" :label="$t('invoice.invoiceAmount')"></el-table-column>
        <el-table-column :label="$t('invoice.invoiceType')">
          <template slot-scope="scope">
            <span v-if="scope.row.invoiceType === 1">{{ $t('invoice.ordInvoice') }}</span>
            <span v-if="scope.row.invoiceType === 2">{{ $t('invoice.specialInvoice') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('invoice.address')" min-width="140px">
          <template slot-scope="scope">
            <div class="moreCell">
              <span>{{scope.row.area}}</span>
              <span>{{scope.row.address}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('common.status')">
          <span slot-scope="scope">{{ $t(`invoice.status${scope.row.status}`) }}</span>
        </el-table-column>
        <el-table-column :label="$t('invoice.trackNumb')">
          <span slot-scope="scope">{{scope.row.expressNumb || '-'}}</span>
        </el-table-column>
        <el-table-column :label="$t('invoice.operAccount')">
          <span slot-scope="scope">{{scope.row.userName}}({{scope.row.realName}})</span>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="160">
          <template slot-scope="scope">
            <el-button v-if="button.agree" :disabled="scope.row.status === 1 || scope.row.status === 5" size="mini" type="primary" plain @click="handleDialogOpen('agree', scope.row)">{{ $t('button.agree') }}</el-button>
            <el-button v-if="button.reject" :disabled="scope.row.status === 1 || scope.row.status === 5" size="mini" type="primary" plain @click="handleDialogOpen('reject', scope.row)">{{ $t('button.overrule') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">
        {{ $t('common.currentPage') }} {{ list.length }}
        {{ $t('common.unit') }}
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <!-- 同意 -->
    <el-dialog :title="$t('button.agree')" :visible.sync="agreeDialogVisible" :close-on-click-modal="false">
      <span>{{ $t('invoice.toAgree') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="agreeDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="confirm('agree')">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 驳回 -->
    <el-dialog :title="$t('button.reject')" :visible.sync="rejectDialogVisible" :close-on-click-modal="false">
      <span>{{ $t('invoice.toDismiss') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="confirm('reject')">{{ $t('button.confirm') }}</el-button>
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
        startTime: '',
        endTime: '',
        companyName: ''
      },
      // 当前表格的查询条件
      realQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      list: [],
      total: 0,
      listLoading: false,

      agreeDialogVisible: false,
      rejectDialogVisible: false,
      info: {}
    }
  },
  computed: {
    ...mapGetters(['language']),
    // 查询验证规则
    queryFormRules() {
      return {
        companyName: [
          {
            trigger: 'change',
            message: this.$t('message.inputRight'),
            pattern: this.$utils.reg.companyName
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
  created() { this.getList() },
  mounted() { },
  props: ['button'],
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      this.$http.posts('getDvoRefundInvoiceList', this.realQuery, '', { showSuccessMsg: false, showErrorMsg: true })
        .then(res => {
          this.listLoading = false
          let data = res.data.list || []
          data.forEach((item, index) => {
            let pho = item.phoneNumb.split('+')
            item.phoneNumb = '+' + pho[0] + pho[1]
          })
          this.list = data
          this.total = res.data.total || 0
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
    // 对话框打开
    handleDialogOpen(type, data) {
      this[`${type}DialogVisible`] = true
      this.info = data
    },
    // 操作确认
    confirm(style) {
      let type = style === 'agree' ? 4 : 3
      let data = {
        type,
        ids: this.info.invoiceId
      }
      // type: 1退票，2寄出，3驳回，4同意
      this.$http.posts('updateStatusInvoice', data, '', true)
        .then(res => {
          this[`${style}DialogVisible`] = false
          this.getList()
        })
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#adRefundList {
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
