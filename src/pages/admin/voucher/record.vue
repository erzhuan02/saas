<template>
  <div id="new">
    <div class="routerView flex1">
      <div id="scrollView" class="flex-d">
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
            </el-form-item>
          </el-form>
        </div>
        <!-- 查询结果 -->
        <div class="result clearfix">
          <el-table class="overflowTable" ref="resultTable" stripe border max-height="560" :data="tableData" v-loading="loading" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
            <el-table-column prop="type" width="110" :label="$t('coupon.oprType')"></el-table-column>
            <el-table-column prop="voucherId" :label="$t('voucher.voucher') + ' ID'"></el-table-column>
            <el-table-column prop="faceValueId" :label="$t('coupon.tab1_1')" min-width="150"></el-table-column>
            <el-table-column prop="initialAmount" :label="$t('coupon.payAmount')"></el-table-column>
            <el-table-column prop="companyName" :label="$t('voucher.clientName')"></el-table-column>
            <el-table-column prop="userName" :label="$t('myClients.accountName')"></el-table-column>
            <el-table-column prop="result" :label="$t('coupon.oprResult')">
              <template slot-scope="scope">
                <span v-if="scope.row.result == 1">成功</span>
                <span v-if="scope.row.result == 2">失败</span>
              </template>
            </el-table-column>
            <el-table-column prop="opUserName" :label="$t('coupon.tab2_4')"></el-table-column>
            <el-table-column prop="theWay" :label="$t('voucher.tab3_1')">
              <template slot-scope="scope">
                <span v-if="scope.row.theWay == 1">手动</span>
                <span v-if="scope.row.theWay == 2">自动</span>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" :label="$t('log.operTime')" min-width="90"></el-table-column>
          </el-table>
          <div class="currentTotal">{{ $t('common.currentPage') }} {{tableData.length}} {{ $t('common.unit') }}</div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="activeQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="activeQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
        </div>
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
        opType: 2, // 操作类型：1.已发放 2.操作记录 3.回收记录
        pageNumber: 1,
        pageSize: 10
      },
      total: 0, // 分页数据，总条数
      // 查询结果数据
      tableData: [],
      loading: false
    }
  },
  mounted() {
    this.handleQuery()
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
          this.tableData = []
          let data = res.data
          this.total = data.total
          let list = data.list
          list.forEach(item => { item.type = '发放抵用券' })
          this.tableData = list
        })
        .catch(er => {
          this.loading = false
        })
    },
    // 排序
    // handleSortChange(data) {
    //   if (data.order === 'ascending') {
    //     this.activeQuery.sortValue = 'asc'
    //   } else if (data.order === 'descending') {
    //     this.activeQuery.sortValue = 'desc'
    //   } else {
    //     this.activeQuery.sortValue = ''
    //   }
    //   this.activeQuery.sortKey = data.prop
    //   this.getList()
    // },
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
}
</style>
