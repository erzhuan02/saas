<template>
  <div id="invisted">
    <div class="routerView flex1">
      <div id="scrollView" class="flex-d">
        <div>
          <!-- 查询条件 -->
          <div class="queryForm">
            <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
              <el-form-item :label="$t('friend.buildTime')" prop="buildTime">
                <el-date-picker v-model="buildTime" type="daterange" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')" format="yyyy-MM-dd" clearable value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('myClients.accountName')" prop="accountNameSearch">
                <el-input v-model.trim="queryForm.accountNameSearch" :placeholder="$t('placeholder.input')" maxlength="30" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('myClients.clientName')" prop="companyNameSearch">
                <el-input v-model="queryForm.companyNameSearch" :placeholder="$t('placeholder.input')" maxlength="128" clearable></el-input>
              </el-form-item>
              <el-form-item label=" ">
                <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
                <el-button @click="handleReset" icon="el-icon-refresh">{{ $t('button.reset') }}</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 查询结果 -->
          <div class="result clearfix">
            <el-table class="overflowTable" ref="resultTable" stripe border max-height="560" :data="tableData" v-loading="loading" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
              <el-table-column prop="createTime" :label="$t('friend.buildTime')"></el-table-column>
              <el-table-column prop="friendNumb" :label="$t('basicInfo.FNum')"></el-table-column>
              <el-table-column prop="companyName" :label="$t('friend.bindCustomer')"></el-table-column>
              <el-table-column prop="comUserName" :label="$t('myClients.accountName')"></el-table-column>
              <el-table-column :label="$t('common.operation')">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" v-if="scope.row.isFriendNumb == 1" @click="openDialog(scope.row, 0)" plain>{{ $t('button.untie') }}</el-button>
                  <el-button size="mini" type="primary" v-if="scope.row.isFriendNumb == 0" @click="openDialog(scope.row, 1)" plain>{{ $t('button.bind') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="currentTotal">{{ $t('common.currentPage') }} {{tableData.length}} {{ $t('common.unit') }}</div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="activeQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="activeQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
          </div>
          <!-- 解绑对话框 -->
          <el-dialog class="dialogRec" :title="type == 0 ? $t('button.untie') : $t('button.bind')" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <span v-if="type == 0">{{ $t('dialog.isUntie') }}</span>
            <span v-if="type == 1">{{ $t('dialog.isBind') }}</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
              <el-button type="primary" @click="handleUntie()">{{ $t('button.confirm') }}</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询表单数据
      queryForm: {
        startTime: '',
        endTime: '',
        companyNameSearch: '', // 客户名称
        accountNameSearch: '' // 账号名
      },
      buildTime: ['', ''],
      total: 0, // 分页数据，总条数
      // 查询结果数据
      tableData: [],
      activeQuery: {
        pageNumber: 1,
        pageSize: 10
      },
      loading: false,
      dialogVisible: false,
      companyId: '',
      type: '' // 1已关联 0未关联
    }
  },
  computed: {
    // 查询验证规则
    queryFormRules() {
      return {
        companyNameSearch: [
          {
            trigger: 'change',
            pattern: this.$utils.reg.companyName,
            validator: this.$utils.validator.common
          }
        ]
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 重置查询表单
    handleReset() {
      this.$refs.queryForm.resetFields()
      this.buildTime = ['', '']
      this.queryForm.startTime = ''
      this.queryForm.endTime = ''
    },
    // 查询表单
    handleQuery() {
      if (!this.buildTime || this.buildTime[0] == '') {
        this.queryForm.startTime = ''
        this.queryForm.endTime = ''
      } else {
        this.queryForm.startTime = this.buildTime[0]
        this.queryForm.endTime = this.buildTime[1]
      }
      this.activeQuery.pageNumber = 1
      this.activeQuery.pageSize = 10
      this.activeQuery = { ...this.activeQuery, ...this.queryForm }
      this.getList()
    },
    getList() {
      this.loading = true
      this.$http.posts('queryCompany', this.activeQuery, '', false)
        .then(res => {
          let data = res.data
          this.tableData = data.list || []
          this.total = data.total
          this.loading = false
        })
        .catch(er => {
          this.loading = false
        })
    },
    openDialog(val, type) {
      this.type = type
      this.dialogVisible = true
      this.companyId = val.companyId
    },
    // 解绑
    handleUntie() {
      this.$http.posts('editIsFriendNumb', '', { companyId: this.companyId, isFriendNumb: this.type }, true)
        .then(res => {
          this.dialogVisible = false
          this.getList()
        })
    },
    // 分页事件
    handleSizeChange(val) {
      // this.activeQuery.pageNumber = 1
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
#invisted {
}
</style>
