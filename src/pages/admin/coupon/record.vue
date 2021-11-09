<template>
  <div id="record">
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
            <el-form-item :label="$t('coupon.tab1_1')" prop="faceValueId">
              <el-input v-model.trim="queryForm.faceValueId" :placeholder="$t('placeholder.input')" maxlength="32" clearable></el-input>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" icon="el-icon-search" @click="handleQuery()">{{ $t('button.query') }}</el-button>
              <el-button icon="el-icon-refresh-left" @click="handleReset()">{{ $t('button.reset') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 查询结果 -->
        <div class="result clearfix">
          <el-table class="overflowTable" ref="resultTable" @sort-change="handleSortChange" stripe border max-height="560" :data="list" v-loading="listLoading" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
            <el-table-column prop="type" sortable="custom" width="110" :label="$t('coupon.oprType')"></el-table-column>
            <el-table-column prop="voucherId" :label="$t('coupon.coupon') + ' ID'" min-width="140"></el-table-column>
            <el-table-column prop="faceValueId" :label="$t('coupon.tab1_1')" min-width="140"></el-table-column>
            <el-table-column prop="initialAmount" :label="$t('coupon.payAmount')"></el-table-column>
            <el-table-column prop="companyName" :label="$t('myClients.clientName')"></el-table-column>
            <el-table-column prop="userName" :label="$t('myClients.accountName')"></el-table-column>
            <el-table-column prop="result" :label="$t('coupon.oprResult')">
              <template slot-scope="scope">
                <span v-if="scope.row.result == 1">成功</span>
                <span v-if="scope.row.result == 0">失败</span>
              </template>
            </el-table-column>
            <el-table-column prop="opUserName" :label="$t('coupon.tab2_4')"></el-table-column>
            <el-table-column prop="updateTime" :label="$t('log.operTime')"></el-table-column>
          </el-table>
          <div class="currentTotal">{{ $t('common.currentPage') }} {{list.length}} {{ $t('common.unit') }}</div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
        </div>
      </div>
    </div>
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
        opType: 2 // 操作类型：1.已发放 2.操作记录 3.回收记录
      }, // 当前表格的查询条件
      // 查询结果数据
      list: [],
      total: 0, // 分页数据，总条数
      listLoading: false
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
    this.getList()
  },
  mounted() { },
  methods: {
    getList() {
      this.listLoading = true
      this.$http.posts('searchPageOp', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          list.forEach(item => { item.type = '发放代金券' })
          this.list = list
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
    // 分页事件
    handleSizeChange(val) {
      this.realQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.realQuery.pageNumber = val
      this.getList()
    }
  }
}
</script>

<style lang="less">
#record {
}
</style>
