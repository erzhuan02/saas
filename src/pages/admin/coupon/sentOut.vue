<template>
  <div id="sentOut">
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
        <el-form-item :label="$t('coupon.tab1_1')" prop="faceValueId">
          <el-input v-model.trim="queryForm.faceValueId" :placeholder="$t('placeholder.input')" maxlength="32" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery()">{{ $t('button.query') }}</el-button>
          <el-button icon="el-icon-refresh-left" @click="handleReset()">{{ $t('button.reset') }}</el-button>
          <el-button type="primary" icon="el-icon-goods" v-if="button.batchRecovery" @click="openDialog('recyle', true)">{{ $t('button.recovery') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询结果 -->
    <div class="result clearfix">
      <el-table class="overflowTable" ref="resultTable" @sort-change="handleSortChange" @selection-change="handleSelectionChange" stripe border max-height="560" :data="list" v-loading="listLoading" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column prop="faceValueId" :label="$t('coupon.tab1_1')" min-width="130"></el-table-column>
        <el-table-column sortable="custom" prop="createTime" :label="$t('coupon.tab2_1')"></el-table-column>
        <el-table-column prop="companyName" :label="$t('myClients.clientName')"></el-table-column>
        <el-table-column prop="initialAmount" :label="$t('coupon.tab2_2')"></el-table-column>
        <el-table-column prop="balance" :label="$t('coupon.tab2_3')"></el-table-column>
        <el-table-column sortable="custom" prop="status" :label="$t('expend.state')">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">可使用</span>
            <span v-if="scope.row.status == 2">已用完</span>
            <span v-if="scope.row.status == 3">已过期</span>
            <span v-if="scope.row.status == 4">已回收</span>
          </template>
        </el-table-column>
        <el-table-column prop="opUserName" :label="$t('coupon.tab2_4')"></el-table-column>
        <el-table-column width="160px" :label="$t('common.operation')">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" v-if="button.details" @click="jumpDetails(scope.row)" plain>{{ $t('button.details') }}</el-button>
            <el-button size="mini" type="primary" v-if="button.recycle" @click="openDialog('recyle', false, scope.row)" plain>{{ $t('button.recyle') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">{{ $t('common.currentPage') }} {{list.length}} {{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <!-- 回收对话框 -->
    <el-dialog class="dialogRec" :title="isRrcMult ? $t('button.recovery') : $t('button.recyle')" :visible.sync="recyleDialogVisible" @close="closeRecDia" :close-on-click-modal="false">
      <div class="msgRec">
        <i class="el-icon-warning" style="color: #feae50;font-size:16px;"></i> {{ $t('coupon.msg3') }}
      </div>
      <el-table @selection-change="handleSelectionChange" stripe border max-height="560" :data="multRec" v-loading="listLoading" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
        <el-table-column type="index" :label="$t('common.no')" width="60"></el-table-column>
        <el-table-column prop="voucherId" :label="$t('coupon.coupon') + ' ID'"></el-table-column>
        <el-table-column prop="initialAmount" :label="$t('coupon.tab2_2')"></el-table-column>
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
</template>

<script>
export default {
  props: ['button'],
  data() {
    return {
      // 查询表单数据
      queryForm: {
        regisTime: [],
        companyName: '', // 客户名称
        faceValueId: '', // 额度编号
        startTime: '',
        endTime: ''
      },
      realQuery: {
        sortKey: '',
        sortValue: '',
        pageNumber: 1,
        pageSize: 10,
        cardType: 1, // 卡类型 1.代金券 2.抵用券
        opType: 1 // 操作类型：1.已发放 2.操作记录 3.回收记录
      }, // 当前表格的查询条件
      list: [],
      total: 0, // 分页数据，总条数
      // 查询结果数据
      listLoading: false,
      detailsDialogVisible: false,
      recyleDialogVisible: false,
      isRrcMult: false,
      multRec: []
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
  created() { this.getList() },
  mounted() { },
  methods: {
    getList() {
      this.listLoading = true
      this.$http.posts('searchPageOp', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          this.total = data.total || 0
          this.list = data.list || []
        })
        .catch(er => {
          this.listLoading = false
        })
    },
    // 查询表单提交
    handleQuery() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
          var regisTime = this.realQuery.regisTime
          if (regisTime && regisTime.length > 0) {
            this.realQuery.startTime = regisTime[0]
            this.realQuery.endTime = regisTime[1]
          }
          delete this.realQuery.regisTime
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
    // 多选
    handleSelectionChange(val) {
      this.multRec = val
    },
    // 排序
    handleSortChange(data) {
      if (data.order === 'ascending') {
        this.realQuery.sortValue = 'asc'
      } else if (data.order === 'descending') {
        this.realQuery.sortValue = 'desc'
      } else {
        this.realQuery.sortValue = ''
      }
      this.realQuery.sortKey = data.prop
      this.getList()
    },
    // 分页事件
    handleSizeChange(val) {
      this.realQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.realQuery.pageNumber = val
      this.getList()
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
        this.multRec = []
        this.multRec.push(data)
      }
      this[`${name}DialogVisible`] = true
    },
    // 跳转详情
    jumpDetails(data) {
      let params = {
        showDetails: true,
        id: data.voucherId
      }
      this.$emit('show-details', params)
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
        cardType: 1,
        vouchers: companys
      }
      this.$http.posts('recycle', params, '', true)
        .then(res => {
          if (this.list.length === 1) {
            this.realQuery.pageNumber = 1
          }
          this.getList()
          this.recyleDialogVisible = false
        })
        .catch(er => {
          this.recyleDialogVisible = false
        })
    },
    // 关闭回收对话框
    closeRecDia() {
      this.multRec = []
      this.$refs.resultTable.clearSelection()
    }
  }
}
</script>

<style lang="less">
#sentOut {
  .msgRec {
    margin-bottom: 30px;
  }
  .dialogRec > div {
    width: 80% !important;
    max-width: 100%;
  }
}
</style>
