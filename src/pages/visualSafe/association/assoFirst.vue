<template>
  <div id="assoFirst">
    <div class="result clearfix" v-loading="listLoading">
      <el-table class="overflowTable" ref="table" stripe border max-height="565" :data="list" highlight-current-row>
        <el-table-column type="index" :label="$t('common.no')" width="100" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
        <el-table-column prop="updateTime" :label="$t('downloadApply.applyTime')" min-width="100"></el-table-column>
        <el-table-column prop="devCompanyName" :label="$t('association.devCompanyName')"></el-table-column>
        <el-table-column prop="userName" :label="$t('association.devAccount')"></el-table-column>
        <el-table-column prop="companyAddr" :label="$t('association.devCompanyAddr')"></el-table-column>
        <el-table-column prop="auditStatus" :label="$t('common.status')">
          <span slot-scope="scope" :class="`auditStatus${scope.row.auditStatus}`">{{ $t(`association.auditStatus${scope.row.auditStatus}`) }}</span>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" min-width="100">
          <template slot-scope="scope">
            <el-button v-if="button.agree" size="mini" type="primary" @click="handleDialogOpen('agree', scope.row)" plain>{{ $t('button.agree') }}</el-button>
            <el-button v-if="button.reject" size="mini" type="primary" @click="handleDialogOpen('reject', scope.row)" plain>{{ $t('button.reject') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">
        {{ $t('common.currentPage') }} {{ list.length }}
        {{ $t('common.unit') }}
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <!-- 同意对话框 -->
    <el-dialog :title="$t('dialog.tips')" :visible.sync="agreeDialogVisible" :close-on-click-modal="false">
      <span>{{ $t('association.confirmPassed') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="agreeDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleUpdateStatus('agree',1)" :disabled="buttonDisabled">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 拒绝对话框 -->
    <el-dialog :title="$t('dialog.tips')" :visible.sync="rejectDialogVisible" :close-on-click-modal="false">
      <span>{{ $t('association.confirmReject') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleUpdateStatus('reject',2)" :disabled="buttonDisabled">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $utils from '@/utils'
export default {
  data() {
    return {
      realQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10, // 一页显示多少条

        auditStatus: 0, // 0-待审核 1-已通过 2-已拒绝
        type: 1 // 1-六臂云视安心业务查询 2-admin开发者查询
      },
      total: 0,
      list: [],
      listLoading: false,
      activeRow: {},

      buttonDisabled: false,
      agreeDialogVisible: false,
      rejectDialogVisible: false,
      button: {}
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
      this.$utils.getButton(this.$route.path, 2, '', 'visualSafeLeftTree').then(res => {
        this.button = res
      })// 获取按钮权限
      this.getList()
    },
    getList() {
      this.listLoading = true
      this.$http.posts('userCompanyListPage', this.realQuery)
        .then(res => {
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
    handleDialogOpen(type, row) {
      this.activeRow = { ...row }
      this[`${type}DialogVisible`] = true
    },
    handleUpdateStatus(type, auditStatus) {
      //  auditStatus 0-解除关联 1-已关联 2-已拒绝
      this.$utils.disabledButton(this)
      const { id, dpUserId } = this.activeRow
      this.$http.posts('updateAuditStatus', { auditStatus, id, dpUserId }, '', true)
        .then(res => {
          this.getList()
        })
      this[`${type}DialogVisible`] = false
    }
  }
}
</script>
