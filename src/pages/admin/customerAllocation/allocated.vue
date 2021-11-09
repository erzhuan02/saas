<template>
  <div id="allocated">
    <div class="routerView flex1">
      <div id="scrollView" class="flex-d">
        <div>
          <!-- 查询条件 -->
          <div class="queryForm">
            <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
              <el-form-item :label="$t('customerAllocation.clientOrSales')" prop="companyName">
                <el-input v-model="queryForm.companyName" :placeholder="$t('placeholder.input')" maxlength="128" clearable></el-input>
              </el-form-item>
              <el-form-item label=" ">
                <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
                <el-button type="primary" icon="el-icon-goods" @click="openDialog(true)" v-if="button.batchDistribution">{{ $t('button.batchAllocation') }}</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 查询结果 -->
          <div class="result clearfix">
            <el-table class="overflowTable" ref="resultTable" @selection-change="handleSelectionChange" stripe border max-height="560" :data="list" v-loading="loading" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index" :label="$t('common.no')" width="120" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
              <!-- <el-table-column prop="no" :label="$t('common.no')"></el-table-column> -->
              <el-table-column prop="userName" :label="$t('myClients.accountName')"></el-table-column>
              <el-table-column prop="companyId" :label="$t('myClients.companyId')"></el-table-column>
              <el-table-column prop="companyName" :label="$t('myClients.clientName')"></el-table-column>
              <el-table-column prop="contactNumb" :label="$t('common.phone')"></el-table-column>
              <el-table-column prop="realName" :label="$t('myClients.clerkName')"></el-table-column>
              <el-table-column prop="phoneNumb" :label="$t('common.phone') + '(' + $t('customerAllocation.salesman') + ')'"></el-table-column>
              <el-table-column :label="$t('common.operation')">
                <template slot-scope="scope">
                  <el-button v-if="button.reallocate" size="mini" type="primary" @click="openDialog(false, scope.row)" plain>{{ $t('button.redistribute') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="currentTotal">{{ $t('common.currentPage') }} {{list.length}} {{ $t('common.unit') }}</div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
          </div>
        </div>
        <!-- 重新分配对话框 -->
        <el-dialog class="dialogRec" :title="isRrcMult ? $t('button.batchAllocation') : $t('button.redistribute')" :visible.sync="dialogVisible" @close="closeRecDia" :close-on-click-modal="false">
          <el-table stripe border max-height="560" :data="distUser" v-loading="loading" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
            <el-table-column width="35">
              <template slot-scope="scope">
                <el-radio v-model="radio" :label="scope.row"></el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="realName" :label="$t('myClients.clerkName')"></el-table-column>
            <el-table-column prop="userName" :label="$t('myClients.accountName')"></el-table-column>
            <el-table-column prop="phoneNumb" :label="$t('common.phone')"></el-table-column>
            <el-table-column prop="roleName" :label="$t('account.role')"></el-table-column>
          </el-table>
          <div class="result clearfix">
            <div class="currentTotal">{{ $t('common.currentPage') }} {{distUser.length}} {{ $t('common.unit') }}</div>
            <el-pagination @size-change="dialogSizeChange" @current-change="dialogCurrentChange" :current-page.sync="dialogPaging.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="dialogPaging.pageSize" layout=" prev, pager, next,sizes,total" :total="totalDialog" background></el-pagination>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="dealWith()">{{ $t('button.confirm') }}</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import $utils from '@/utils'
export default {
  data() {
    return {
      // 查询表单数据
      queryForm: {
        companyName: '' // 客户名称
      },
      realQuery: {
        pageNumber: 1,
        pageSize: 10,

        type: 2 // 1.未分配客户 2.已分配客户 3.我的客户
      },
      total: 0, // 分页数据，总条数
      totalDialog: 10, // 分页数据，总条数
      // 查询结果数据
      list: [],
      distUser: [],
      dialogPaging: {
        pageNumber: 1,
        pageSize: 10
      },
      loading: false,
      dialogVisible: false,
      isRrcMult: false, // true为批量 false为单个
      multRec: [],
      alloData: {},
      radio: ''
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
  mounted() { this.getList() },
  props: ['button'],
  methods: {
    // 多选
    handleSelectionChange(val) {
      this.multRec = val
    },
    // 打开对话框
    openDialog(type, data) {
      // type=true为批量 false为单个
      this.isRrcMult = type
      if (type && this.multRec.length === 0) { // 批量
        this.$utils.$message({
          message: this.$t('customerAllocation.msg1'),
          type: 'error'
        })
        return
      } else {
        this.alloData = data
      }
      this.getDistComUser()
    },
    // 获取可分配的企业用户
    getDistComUser() {
      this.distUser = []
      this.$http.posts('getDistComUser', this.dialogPaging, '', { showSuccessMsg: false, showErrorMsg: true })
        .then(res => {
          this.dialogVisible = true
          let data = res.data
          let list = data.list || []
          this.totalDialog = data.total || 0
          list.forEach(item => {
            if (item.phoneNumb && item.phoneNumb.indexOf('+') !== -1) {
              item.phoneNumb = this.$utils.exchangePrefix(item.phoneNumb)
            }
          })
          this.distUser = list
        })
    },
    // 关闭回收对话框
    closeRecDia() {
      this.radio = ''
      this.multRec = []
      this.$refs.resultTable.clearSelection()
    },
    // 查询表单
    handleQuery() {
      this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
      this.getList()
    },
    getList() {
      this.loading = true
      this.$http.posts('distList', this.realQuery)
        .then(res => {
          this.loading = false
          let data = res.data
          let list = data.list || []
          this.total = data.total
          list.forEach((item, index) => {
            if (item.contactNumb && item.contactNumb.indexOf('+') !== -1) {
              item.contactNumb = this.$utils.exchangePrefix(item.contactNumb)
            }
            if (item.phoneNumb && item.phoneNumb.indexOf('+') !== -1) {
              item.phoneNumb = this.$utils.exchangePrefix(item.phoneNumb)
            }
          })
          this.list = list
        })
        .catch(er => {
          this.loading = false
        })
    },
    // 分配
    dealWith: $utils.debounce(function () {
      if (this.radio == '') {
        this.$utils.$message({
          message: this.$t('customerAllocation.msg2'),
          type: 'error'
        })
        return
      }
      let companys = []
      if (this.isRrcMult) {
        this.multRec.forEach(item => {
          companys.push(item.companyId)
        })
      } else {
        companys.push(this.alloData.companyId)
      }
      let params = {
        userId: this.radio.userId,
        comIds: companys
      }
      this.$http.posts('distributionComUser', params, '', true)
        .then(res => {
          if (this.list.length == 1) {
            this.realQuery.pageNumber = 1
          }
          this.getList()
          this.dialogVisible = false
        })
    }),
    // 分页事件
    handleSizeChange(val) {
      this.realQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.realQuery.pageNumber = val
      this.getList()
    },
    dialogSizeChange(val) {
      this.radio = ''
      this.dialogPaging.pageSize = val
      this.getDistComUser()
    },
    dialogCurrentChange(val) {
      this.radio = ''
      this.dialogPaging.pageNumber = val
      this.getDistComUser()
    }
  }
}
</script>

<style lang="less">
#allocated {
  .msgRec {
    margin-bottom: 30px;
  }
  .dialogRec > div {
    width: 80% !important;
    max-width: 100%;
  }
}
</style>
