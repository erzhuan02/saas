<template>
  <div id="assoFourth">
    <!-- 查询 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
        <el-form-item prop="dateRange" :label="$t('account.registrationTime')">
          <el-date-picker v-model="queryForm.dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="companyName" :label="$t('common.companyName1')">
          <el-input v-model="queryForm.companyName" maxlength="128" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item prop="userName" :label="$t('common.accountNo')">
          <el-input v-model="queryForm.userName" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item prop="phoneNumb" :label="$t('common.phone')">
          <el-input v-model.trim="queryForm.phoneNumb" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="result clearfix" v-loading="listLoading">
      <el-table class="overflowTable" ref="table" stripe border max-height="565" :data="list" highlight-current-row>
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column type="index" :label="$t('common.no')" width="80" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
        <el-table-column prop="userName" :label="$t('myClients.accountName')"></el-table-column>
        <el-table-column prop="createTime" :label="$t('account.registrationTime')" min-width="100"></el-table-column>
        <el-table-column prop="companyName" :label="$t('common.companyName1')"></el-table-column>
        <el-table-column prop="emailAddr" :label="$t('common.email')" min-width="120"></el-table-column>
        <el-table-column prop="phoneNumb" :label="$t('common.phone')"></el-table-column>
        <el-table-column prop="prodectName" :label="$t('tabs.productService')"></el-table-column>
        <el-table-column prop="status" :label="$t('association.lockStatus')" width="130">
          <i slot-scope="scope" class="dangerText el-icon-lock" style="font-size:30px;"></i>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="130">
          <el-button slot-scope="scope" v-if="button.unlock" size="mini" type="primary" @click="handleUnlock(scope.row)" plain>{{ $t('button.unlock') }}</el-button>
        </el-table-column>
      </el-table>
      <div class="currentTotal">
        {{ $t('common.currentPage') }} {{ list.length }}
        {{ $t('common.unit') }}
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询表单数据
      queryForm: {
        dateRange: [],
        startTime: '',
        endTime: '',
        companyName: '',
        userName: '',
        phoneNumb: ''
      },
      realQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10, // 一页显示多少条

        auditStatus: 1, // 0待审核 1审核通过 2拒绝
        status: 1 // 1已锁定
      },
      total: 0,
      list: [],
      listLoading: false,
      buttonDisabled: false,

      button: {}
    }
  },
  computed: {
    // 查询验证规则
    queryFormRules() {
      return {
        companyName: [{
          trigger: 'change',
          pattern: this.$utils.reg.companyName,
          validator: this.$utils.validator.common
        }],
        userName: [{
          trigger: 'change',
          pattern: this.$utils.reg.noCnChar,
          validator: this.$utils.validator.common
        }],
        phoneNumb: [{
          trigger: 'change',
          pattern: this.$utils.reg.phoneNoA,
          message: this.$t('message.inputRight')
        }]
      }
    }
  },
  watch: {
    // 修改最后一页删除的bug
    total() {
      if (this.total === (this.realQuery.pageNumber - 1) * this.realQuery.pageSize && this.total !== 0) {
        this.realQuery.pageNumber -= 1
        this.getList() // 获取列表数据
      }
    }
  },
  created() { this.init() },
  mounted() { },
  methods: {
    init() {
      this.$utils.getButton(this.$route.path, 1).then(res => {
        this.button = res
      })
      this.getList()
    },
    getList() {
      this.listLoading = true
      this.$http.posts('dpUserListPage', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          this.list = list.map((item, index) => {
            return {
              ...item,
              phoneNumb: this.$utils.exchangePrefix(item.phoneNumb)
            }
          })
        })
        .catch(er => {
          this.listLoading = false
          this.list = []
          this.total = 0
        })
    },
    // 查询表单提交
    handleQuery() {
      this.$refs.queryForm.validate(valid => {
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
    // 解锁
    handleUnlock(row) {
      this.listLoading = true
      this.$http.posts('unlockDpUser', '', { status: 1, dpUserId: row.dpUserId }, true)
        .then(res => {
          this.getList()
        })
        .catch(er => {
          this.listLoading = false
        })
    }
  }
}
</script>
<style lang="less">
#assoFourth {
  .result {
    .el-table td {
      padding: 7.5px 0;
    }
  }
}
</style>
