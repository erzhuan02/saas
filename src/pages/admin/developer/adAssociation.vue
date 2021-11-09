<template>
  <div id="adAssociation">
    <!-- 查询 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
        <el-form-item prop="dateRange" :label="$t('log.timeSlot')">
          <el-date-picker v-model="queryForm.dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="companyName" :label="$t('common.companyName1')">
          <el-input v-model="queryForm.companyName" maxlength="128" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item prop="companyId" :label="$t('common.companyId')">
          <el-input v-model.trim="queryForm.companyId" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item prop="devCompanyName" :label="$t('association.devCompanyName')">
          <el-input v-model="queryForm.devCompanyName" maxlength="128" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item prop="userName" :label="$t('association.devAccount')">
          <el-input v-model.trim="queryForm.userName" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="result clearfix" v-loading="listLoading">
      <el-table class="signTable" ref="resultTable" stripe border max-height="640" :data="list" style="width: 100%;" highlight-current-row>
        <el-table-column type="index" :label="$t('common.no')" width="80" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
        <el-table-column prop="companyName" :label="$t('common.companyName1')"></el-table-column>
        <el-table-column prop="companyId" :label="$t('login.enterpriceLogin')"></el-table-column>
        <el-table-column prop="updateTime" :label="$t('friend.correlationTime')" min-width="100"></el-table-column>
        <el-table-column prop="devCompanyName" :label="$t('association.devCompanyName')"></el-table-column>
        <el-table-column prop="userName" :label="$t('association.devAccount')"></el-table-column>
        <el-table-column prop="auditStatus" :label="$t('common.status')">
          <template slot-scope="scope">
            <span :class="'auditStatus'+ scope.row.auditStatus">{{ $t('association.auditStatus'+scope.row.auditStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="270px" v-if="false">
          <template slot-scope="scope">
            <el-button v-if="button.disconnect" size="mini" type="primary" plain @click="handleDialogOpen('disconnect', scope.row)">{{ $t('button.disconnect') }}</el-button>
            <el-button v-if="button.related" size="mini" type="primary" plain @click="handleDialogOpen('related', scope.row)">{{ $t('button.related') }}</el-button>
            <el-button v-if="button.delete" size="mini" type="primary" plain @click="handleDialogOpen('delete', scope.row)">{{ $t('button.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">{{ $t('common.currentPage') }} {{ list.length }}{{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <!-- 解除对话框 -->
    <el-dialog :title="$t('dialog.tips')" :visible.sync="disconnectDialogVisible" :close-on-click-modal="false">
      <span>{{ $t('association.confirmDisconnect') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="disconnectDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleSure('disconnect')" :disabled="buttonDisabled">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 关联 -->
    <el-dialog :title="$t('dialog.tips')" :visible.sync="relatedDialogVisible" :close-on-click-modal="false">
      <span>{{ $t('association.confirmAsso') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="relatedDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleSure('related')" :disabled="buttonDisabled">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog :title="$t('dialog.tips')" :visible.sync="deleteDialogVisible" :close-on-click-modal="false">
      <span>{{ $t('association.confirmDel') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleSure('delete')" :disabled="buttonDisabled">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询表单数据
      queryForm: {
        dateRange: [],
        companyName: '', // 企业名称
        companyId: '', // 企业工号
        devCompanyName: '', // 开发者企业名称
        userName: '', // 开发者帐号

        startTime: '',
        endTime: ''
      },
      // 当前表格的查询条件
      realQuery: {
        pageNumber: 1,
        pageSize: 10,

        type: 1 // 1-六臂云业务查询 2-开发者查询
        // auditStatus: 0, // 0-待审核 1-审核通过 2-拒绝
      },
      total: 0,
      list: [],
      listLoading: false,

      buttonDisabled: false,
      disconnectDialogVisible: false,
      relatedDialogVisible: false,
      deleteDialogVisible: false,
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
        companyId: [{
          trigger: 'change',
          pattern: this.$utils.reg.companyId,
          message: this.$t('message.inputRight')
        }],
        devCompanyName: [{
          trigger: 'change',
          pattern: this.$utils.reg.companyName,
          validator: this.$utils.validator.common
        }],
        userName: [{
          trigger: 'change',
          pattern: this.$utils.reg.noCnChar,
          validator: this.$utils.validator.common
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
  created() {
    this.$utils.getButton(this.$route.path, 1).then(res => {
      this.button = res
    })
    this.getList()
  },
  mounted() { },
  methods: {
    getList() {
      this.listLoading = true
      this.$http.posts('userCompanyListPage', this.realQuery)
        .then(res => {
          // console.log(res)
          this.listLoading = false
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          this.list = list
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
    // 打开对话框
    handleDialogOpen(type, row) {
      this[`${type}DialogVisible`] = true
    },
    handleSure(type) {
      this.$utils.disabledButton(this)
      this[`${type}DialogVisible`] = false
    }
  }
}
</script>
