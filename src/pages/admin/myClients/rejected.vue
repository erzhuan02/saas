<template>
  <div id="rejected">
    <!-- 查询条件 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
        <el-form-item :label="$t('myClients.regisTime')" prop="createTime">
          <el-date-picker v-model="queryForm.createTime" type="daterange" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')" format="yyyy-MM-dd" clearable value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('myClients.clientName')" prop="companyName">
          <el-input v-model.trim="queryForm.companyName" clearable :placeholder="$t('placeholder.input')" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.companyId')" prop="companyId">
          <el-input v-model.trim="queryForm.companyId" :placeholder="$t('placeholder.input')" clearable maxlength="5"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.phone')" prop="phoneNumb">
          <el-input v-model.trim="queryForm.phoneNumb" clearable :placeholder="$t('placeholder.input')" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item :label="$t('myClients.clerkName')" prop="userName">
          <el-input v-model.trim="queryForm.userName" clearable :placeholder="$t('placeholder.input')" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery()">{{ $t('button.query') }}</el-button>
          <el-button icon="el-icon-refresh-left" @click="handleReset()">{{ $t('button.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询结果 -->
    <div class="result clearfix">
      <el-table class="audited" ref="resultTable" stripe border max-height="610" :data="tableData" v-loading="loading" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange" highlight-current-row>
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" :label="$t('common.no')" width="80" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
        <!-- <el-table-column prop="no" :label="$t('common.no')"></el-table-column> -->
        <el-table-column prop="contactName" :label="$t('myClients.accountName')"></el-table-column>
        <el-table-column prop="createTime" :label="$t('account.registrationTime')" min-width="120"></el-table-column>
        <el-table-column prop="companyId" :label="$t('myClients.companyId')"></el-table-column>
        <el-table-column prop="companyName" :label="$t('myClients.clientName')"></el-table-column>
        <el-table-column prop="phoneNumb" :label="$t('common.phone')" min-width="100"></el-table-column>
        <el-table-column prop="balance" :label="$t('myClients.credit')"></el-table-column>
        <el-table-column :label="$t('myClients.type')">
          <template slot-scope="scope">
            <span v-if="scope.row.asscType == 1">自荐</span>
            <span v-else>推荐</span>
          </template>
        </el-table-column>
        <el-table-column prop="auditStatus" :label="$t('myClients.RealName')" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.auditStatus == 5">{{ $t('basicInfo.noPass') }}</span>
            <span v-if="scope.row.auditStatus == 4">{{ $t('basicInfo.passed') }}</span>
            <span v-if="scope.row.auditStatus == 1">{{ $t('basicInfo.waitAuth') }}</span>
            <span v-if="scope.row.auditStatus == 3 || scope.row.auditStatus == 6">{{ $t('basicInfo.authing') }}</span>
            <span v-if="scope.row.auditStatus == 0 || scope.row.auditStatus == 2">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="agentName" :label="$t('myClients.clerkName')"></el-table-column>
        <el-table-column :label="$t('expend.state')">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">启用</span>
            <span v-if="scope.row.status === 0">禁用</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="200">
          <template slot-scope="scope">
            <div class="flex-hb">
              <el-button size="mini" v-if="scope.row.status === 0" :disabled="scope.row.auditStatus !== 2" type="primary" icon="el-icon-circle-check" @click="editStatus(scope.row)" plain>{{ $t('button.enable') }}</el-button>
              <el-button size="mini" v-if="scope.row.status === 1" :disabled="scope.row.auditStatus !== 2" type="primary" icon="el-icon-circle-close" @click="editStatus(scope.row)" plain>{{ $t('button.disable') }}</el-button>
              <el-button size="mini" type="primary" icon="el-icon-delete" @click="deleteData(scope)" plain>{{ $t('button.delete') }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">{{ $t('common.currentPage') }} {{tableData.length}} {{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <el-dialog :close-on-click-modal="dialogClose" :title="$t('dialog.tips')" :visible.sync="sureToDelete" width="30%">
      <span>{{ $t('message.sureToDel') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sureToDelete = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleClose">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      dialogClose: false,

      loading: false,
      // 查询表单数据
      queryForm: {
        createTime: ['', ''], // 注册时间
        companyName: '', // 客户名称
        companyId: '',
        phoneNumb: '', // 手机号码
        userName: '' // 业务员姓名
      },
      realQuery: {
        auditStatus: 3,
        pageNumber: 1,
        pageSize: 10
      },

      total: 0, // 分页数据，总条数
      // 查询结果数据
      tableData: [],
      multipleSelection: [],
      sureToDelete: false,
      row: {} // 当前行
    }
  },
  mounted() {
    this.getList()
  },
  watch: {
    language() {
      this.getList(this.list)
    }
  },
  computed: {
    ...mapGetters(['language']),
    queryFormRules() {
      return {
        companyName: [],
        phoneNumb: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              var reg = /\D/g
              if (reg.test(value)) {
                callback(new Error(this.$t('placeholder.onlyNumber')))
              }
              callback()
            }
          }
        ],
        userName: []
      }
    }
  },
  methods: {
    // 获取列表数据
    getList() {
      this.loading = true
      this.$http.posts('myCustomer', this.realQuery)
        .then(res => {
          let data = res.data
          this.loading = false
          this.total = data.total || 0
          let list = data.list || []
          this.tableData = list.map((item, index) => {
            return {
              ...item,
              phoneNumb: this.$utils.exchangePrefix(item.phoneNumb)
            }
          })
        }).catch(er => {
          this.loading = false
          this.total = 0
          this.tableData = []
        })
    },
    handleQuery() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
          this.getList()
        }
      })
    },
    // 重置查询表单
    handleReset() {
      this.$refs.queryForm.resetFields()
    },
    // 多选选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 点击删除
    deleteData(scope) {
      this.row = scope.row
      this.sureToDelete = true
    },
    // 确认删除
    handleClose() {
      this.$http.posts('delNotAudit', '', { companyId: this.row.companyId }, true)
        .then(res => {
          this.getList()
          this.sureToDelete = false
        })
    },
    // 禁用启用
    editStatus(data) {
      let status = data.status === 1 ? 0 : 1
      this.$http.posts('editComStatus', '', { companyId: data.companyId, status }, true)
        .then(res => {
          this.getList()
        })
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
