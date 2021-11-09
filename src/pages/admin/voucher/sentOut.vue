<template>
  <div id="new">
    <div class="routerView flex1">
      <div id="scrollView" class="flex-d">
        <div>
          <!-- 查询条件 -->
          <div class="queryForm">
            <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
              <el-form-item :label="$t('log.operTime')" prop="regisTime">
                <el-date-picker v-model="queryForm.regisTime" type="daterange" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')" format="yyyy-MM-dd" clearable value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('myClients.clientName')" prop="companyName">
                <el-input v-model="queryForm.companyName" :placeholder="$t('placeholder.input')" maxlength="128" clearable></el-input>
              </el-form-item>
              <!-- <el-form-item :label="$t('coupon.tab1_1')" prop="faceValueId">
                <el-input v-model.trim="queryForm.faceValueId" :placeholder="$t('placeholder.input')" maxlength="32" clearable></el-input>
              </el-form-item> -->
              <el-form-item label=" ">
                <el-button type="primary" icon="el-icon-search" @click="handleQuery()">{{ $t('button.query') }}</el-button>
                <el-button icon="el-icon-refresh-left" @click="handleReset()">{{ $t('button.reset') }}</el-button>
                <el-button type="primary" icon="el-icon-goods" v-if="button.batchRecovery" @click="openDialog('recyle', true)">{{ $t('button.recovery') }}</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 查询结果 -->
          <div class="result clearfix">
            <el-table class="overflowTable" ref="resultTable" @sort-change="handleSortChange" @selection-change="handleSelectionChange" stripe border max-height="560" :data="tableData" v-loading="loading" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
              <el-table-column type="selection"></el-table-column>
              <el-table-column prop="voucherId" :label="$t('voucher.voucher') + ' ID'"></el-table-column>
              <el-table-column prop="faceValueId" :label="$t('coupon.tab1_1')" min-width="150"></el-table-column>
              <el-table-column sortable="custom" prop="createTime" :label="$t('coupon.tab2_1')"></el-table-column>
              <el-table-column prop="companyName" :label="$t('voucher.clientName')"></el-table-column>
              <el-table-column prop="initialAmount" :label="$t('voucher.tab2_1')"></el-table-column>
              <el-table-column prop="balance" :label="$t('coupon.tab2_3')"></el-table-column>
              <el-table-column prop="status" sortable="custom" :label="$t('expend.state')">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 1">可使用</span>
                  <span v-if="scope.row.status == 2">已用完</span>
                  <span v-if="scope.row.status == 3">已过期</span>
                  <span v-if="scope.row.status == 4">已回收</span>
                  <span v-if="scope.row.status == 5">已失效</span>
                </template>
              </el-table-column>
              <el-table-column prop="opUserName" :label="$t('coupon.tab2_4')"></el-table-column>
              <el-table-column :label="$t('common.operation')" width="150">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" v-if="button.details" @click="jumpDetails(scope.row)" plain>{{ $t('button.details') }}</el-button>
                  <el-button size="mini" type="primary" v-if="button.recycle" @click="openDialog('recyle', false, scope.row)" plain>{{ $t('button.recyle') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="currentTotal">{{ $t('common.currentPage') }} {{tableData.length}} {{ $t('common.unit') }}</div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="activeQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="activeQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
          </div>
        </div>
        <!-- 回收对话框 -->
        <el-dialog class="dialogRec" :title="isRrcMult ? $t('button.recovery') : $t('button.recyle')" :visible.sync="recyleDialogVisible" @close="closeRecDia" :close-on-click-modal="false">
          <div class="msgRec">
            <i class="el-icon-warning" style="color: #feae50;font-size:16px;"></i> {{ $t('voucher.msg2') }}
          </div>
          <el-table @selection-change="handleSelectionChange" stripe border max-height="560" :data="multRec" v-loading="loading" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
            <el-table-column prop="no" :label="$t('common.no')" width="50"></el-table-column>
            <el-table-column prop="voucherId" :label="$t('voucher.voucher') + ' ID'"></el-table-column>
            <el-table-column prop="initialAmount" :label="$t('voucher.tab1_1')+'(￥)'"></el-table-column>
            <el-table-column prop="balance" :label="$t('coupon.tab2_3')"></el-table-column>
            <el-table-column prop="companyName" :label="$t('myClients.clientName')"></el-table-column>
            <el-table-column prop="userName" :label="$t('myClients.accountName')"></el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button @click="recyleDialogVisible = false">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="dealWith()">{{ $t('button.confirm') }}</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeQuery: {}, // 当前表格的查询条件
      // 查询表单数据
      queryForm: {
        sortKey: '',
        sortValue: '',
        regisTime: ['', ''],
        startTime: '',
        endTime: '',
        companyName: '', // 客户名称
        // faceValueId: '', // 额度编号
        cardType: 2, // 卡类型 1.代金券 2.抵用券
        opType: 1, // 操作类型：1.已发放 2.操作记录 3.回收记录
        pageNumber: 1,
        pageSize: 10
      },
      total: 0, // 分页数据，总条数
      // 查询结果数据
      tableData: [],
      loading: false,
      detailsDialogVisible: false,
      recyleDialogVisible: false,
      isRrcMult: false,
      multRec: []
    }
  },
  mounted() {
    this.handleQuery()
  },
  props: ['button'],
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
        ],
        userName: [
          // {
          //   message: this.$t('common.plzRight') + this.$t('myClients.clerkName'),
          //   trigger: ['blur'],
          //   validator: (rule, value, callback) => {
          //     var reg = /\D/g
          //     if (reg.test(value)) {
          //       callback(new Error(this.$t('placeholder.onlyNumber')))
          //     }
          //     callback()
          //   }
          // }
        ]
      }
    }
  },
  methods: {
    // 重置查询表单
    handleReset() {
      this.$refs.queryForm.resetFields()
    },
    // 多选
    handleSelectionChange(val) {
      this.multRec = val
    },
    // 跳转详情
    jumpDetails(data) {
      let params = {
        showDetails: true,
        id: data.voucherId
      }
      this.$emit('show-details', params)
    },
    // 打开对话框
    openDialog(name, type, data) {
      // type=true为批量 false为单个
      this.isRrcMult = type
      if (type && this.multRec.length === 0) { // 批量
        this.$utils.$message({
          message: this.$t('coupon.msg4'),
          type: 'error'
        })
        return
      }
      if (!type) {
        data.no = 1
        this.multRec = []
        this.multRec.push(data)
      }
      this[`${name}DialogVisible`] = true
    },
    // 关闭回收对话框
    closeRecDia() {
      this.multRec = []
      this.$refs.resultTable.clearSelection()
    },
    // 查询表单提交
    handleQuery() {
      this.activeQuery = { ...this.activeQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
      var regisTime = this.activeQuery.regisTime
      if (regisTime && regisTime.length > 0) {
        this.activeQuery.startTime = regisTime[0]
        this.activeQuery.endTime = regisTime[1]
      }
      delete this.activeQuery.regisTime
      this.getList()
    },
    getList() {
      this.loading = true
      this.$http.posts('searchPageOp', this.activeQuery)
        .then(res => {
          this.loading = false
          let data = res.data
          this.total = data.total
          this.tableData = data.list || []
        })
        .catch(er => {
          this.loading = false
        })
    },
    // 回收
    dealWith() {
      let companys = []
      this.multRec.forEach(item => {
        companys.push({
          status: item.status,
          voucherId: item.voucherId,
          companyName: item.companyName,
          companyId: item.companyId
        })
      })
      let params = {
        cardType: 2,
        vouchers: companys
      }
      this.$http.posts('recycle', params, '', true)
        .then(res => {
          if (this.tableData.length == 1) {
            this.activeQuery.pageNumber = 1
          }
          this.getList()
          this.recyleDialogVisible = false
        })
        .catch(er => {
          this.recyleDialogVisible = false
        })
    },
    // 排序
    handleSortChange(data) {
      if (data.order === 'ascending') {
        this.activeQuery.sortValue = 'asc'
      } else if (data.order === 'descending') {
        this.activeQuery.sortValue = 'desc'
      } else {
        this.activeQuery.sortValue = ''
      }
      this.activeQuery.sortKey = data.prop
      this.getList()
    },
    // 分页事件
    handleSizeChange(val) {
      this.activeQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.activeQuery.pageNumber = val
      this.getList()
    }
  }
}
</script>

<style lang="less">
#new {
  .msgRec {
    margin-bottom: 30px;
  }
  .dialogRec > div {
    width: 80% !important;
    max-width: 100%;
  }
}
</style>
