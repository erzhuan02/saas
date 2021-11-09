<template>
  <div id="adInvoiceList">
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
        <el-table-column type="index" :label="$t('common.no')" width="60" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
        <el-table-column prop="companyName" :label="$t('common.companyName1')"></el-table-column>
        <el-table-column prop="phoneNumb" :label="$t('invoice.contactInfo')"></el-table-column>
        <el-table-column prop="createTime" :label="$t('invoice.reqBillTime')" min-width="95px"></el-table-column>
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
        <el-table-column :label="$t('invoice.address')" min-width="140">
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
        <el-table-column :label="$t('common.operation')" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="handleDialogOpen(scope.row)" v-if="button.sendOut">{{ $t('button.post') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">
        {{ $t('common.currentPage') }} {{ list.length }}
        {{ $t('common.unit') }}
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <!-- 寄出 -->
    <el-dialog :title="$t('button.post')" :visible.sync="sendDialogVisible" :close-on-click-modal="false" @closed="dialogClose">
      <el-form ref="sendForm" :model="sendForm" label-width="120px" class="clearfix" :rules="sendFormRules">
        <el-form-item :label="$t('invoice.trackNumb')" prop="expressNumb">
          <el-input v-model="sendForm.expressNumb" :placeholder="$t('placeholder.input')" maxlength="50" clearable></el-input>
        </el-form-item>
        <el-form-item prop="invoiceNumb" :label="$t('invoice.receiptNumb')">
          <el-input v-model="sendForm.invoiceNumb" :placeholder="$t('placeholder.input')" maxlength="50" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sendDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="sendOut('sendForm')">{{ $t('button.confirm') }}</el-button>
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
        companyName: '',
        startTime: '',
        endTime: ''
      },
      // 当前表格的查询条件
      realQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      list: [],
      total: 0,
      selection: [],
      listLoading: false,
      currentRow: {},

      sendDialogVisible: false,
      sendForm: {
        expressNumb: '',
        invoiceNumb: ''
      },
      info: {}
    }
  },
  created() { this.getList() },
  mounted() { },
  props: ['button'],
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
    },
    sendFormRules() {
      return {
        expressNumb: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('message.inputRight'),
            pattern: this.$utils.reg.contractId
          }
        ],
        invoiceNumb: [
          {
            required: true,
            trigger: 'blur',
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
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      this.$http.posts('getDvoInvoiceList', this.realQuery, '', { showSuccessMsg: false, showErrorMsg: true })
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
    handleDialogOpen(data) {
      this.info = data
      this.sendDialogVisible = true
    },
    // 寄出
    sendOut(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            ...this.sendForm,
            type: 2,
            ids: this.info.invoiceId
          }
          // type: 1退票，2寄出，3驳回，4同意
          this.$http.posts('updateStatusInvoice', data, '', true)
            .then(res => {
              this.sendDialogVisible = false
              this.getList()
            })
        }
      })
    },
    // 弹窗关闭
    dialogClose() {
      this.$refs.sendForm.resetFields()
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#adInvoiceList {
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
