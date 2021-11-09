<template>
  <div id="adSentList">
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
        <el-table-column prop="deliveryTime" :label="$t('invoice.sendTime')" min-width="95px"></el-table-column>
        <el-table-column prop="invoiceNumb" :label="$t('invoice.receiptNumb')"></el-table-column>
        <el-table-column prop="invoiceHead" :label="$t('invoice.invoiceTT')"></el-table-column>
        <el-table-column prop="amount" :label="$t('invoice.invoiceAmount')"></el-table-column>
        <el-table-column :label="$t('invoice.invoiceType')">
          <template slot-scope="scope">
            <span v-if="scope.row.invoiceType === 1">{{ $t('invoice.ordInvoice') }}</span>
            <span v-if="scope.row.invoiceType === 2">{{ $t('invoice.specialInvoice') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('invoice.address')" min-width="130">
          <template slot-scope="scope">
            <div class="moreCell">
              <span>{{ scope.row.area }}</span>
              <span>{{ scope.row.address }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('common.status')">
          <span slot-scope="scope">{{ $t(`invoice.status${scope.row.status}`) }}</span>
        </el-table-column>
        <el-table-column prop="expressNumb" :label="$t('invoice.trackNumb')"></el-table-column>
        <el-table-column :label="$t('invoice.operAccount')">
          <template slot-scope="scope">
            <span v-if="scope.row.userName && scope.row.realName">{{ scope.row.userName }}({{ scope.row.realName }})</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">
        {{ $t('common.currentPage') }} {{ list.length }}
        {{ $t('common.unit') }}
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
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
      listLoading: false
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
  created() { this.getList() },
  mounted() { },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      this.$http.posts('getDvoSendOutInvoiceList', this.realQuery, '', { showSuccessMsg: false, showErrorMsg: true })
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
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#adSentList {
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
