<template>
  <div id="assoSecond">
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
        <el-table-column prop="auditStatus" :label="$t('common.status')" width="130">
          <span slot-scope="scope" :class="`auditStatus${scope.row.auditStatus}`">{{ $t(`association.accountStatus${scope.row.auditStatus}`) }}</span>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="270">
          <template slot-scope="scope">
            <el-button v-if="button.functionAuth" size="mini" type="primary" @click="handleDialogOpen(1, scope.row)" plain>{{ $t('button.functionAuth') }}</el-button>
            <el-button v-if="button.disable" size="mini" type="primary" @click="handleDialogOpen(0, scope.row)" plain>{{ $t('button.disable') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">
        {{ $t('common.currentPage') }} {{ list.length }}
        {{ $t('common.unit') }}
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <!-- 对话框 -->
    <el-dialog :title="type ? $t('button.functionAuth') : $t('button.disable')" :visible.sync="dialogVisible" :close-on-click-modal="false" @closed="handleDialogClose">
      <div v-if="type">
        <el-tabs v-model="tabActive">
          <el-tab-pane :label="$t('association.productAuth')" name="first" v-loading="loading">
            <el-checkbox-group v-model="checkList">
              <el-checkbox v-for="item in productList" :label="item.productName" :key="item.productId"></el-checkbox>
            </el-checkbox-group>
          </el-tab-pane>
          <el-tab-pane :label="$t('association.menuAuth')" name="second">
            <el-tree class="roleTree" ref="roleTree" node-key="id" show-checkbox :default-expanded-keys="expandedKeys" @check="handleRoleTreeChange" :data="roleTree" :props="defaultProps">
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span v-if="!type">{{ $t('dialog.isDisableCompany') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleSure" :disabled="buttonDisabled">{{ $t('button.confirm') }}</el-button>
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
        startTime: '',
        endTime: '',
        companyName: '',
        userName: '',
        phoneNumb: ''
      },
      realQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10, // 一页显示多少条

        auditStatus: 1 // 0待审核 1审核通过 2拒绝
      },
      total: 0,
      list: [],
      listLoading: false,
      activeRow: {},

      buttonDisabled: false,
      dialogVisible: false,

      loading: false,
      type: 1, // 1功能授权 0禁用
      tabActive: 'first',
      productList: [],
      checkList: [],
      expandedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeForm: {},
      roleTree: [], // 树的数据
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
    handleDialogOpen(type, row) {
      this.loading = true
      this.type = type
      this.dialogVisible = true
      this.activeRow = { ...row }
      if (type) {
        this.$http.posts('dpUserMenuTree', '', { dpUserId: row.dpUserId })
          .then(res => {
            let data = res.data
            this.productList = data.productList
            this.roleTree = data.treeList

            this.productList.forEach(ele => {
              if (ele.checked) {
                this.checkList.push(ele.productName)
              }
            })

            var keys = this.$utils.recurseJson(this.roleTree, true, [])
            var tree = this.$refs.roleTree
            tree.setCheckedKeys(keys)
            this.expandedKeys = keys
            this.$nextTick(() => {
              this.handleRoleTreeChange(
                {},
                {
                  checkedNodes: tree.getCheckedNodes(),
                  halfCheckedNodes: tree.getHalfCheckedNodes()
                }
              )
            })

            this.loading = false
          })
      }
    },
    handleSure() {
      if (this.type) {
        let params = { dpUserId: this.activeRow.dpUserId }
        if (this.tabActive === 'first') {
          let list = []
          this.checkList.forEach(item => {
            this.productList.forEach(ele => {
              if (item === ele.productName) {
                list.push({
                  productId: ele.productId,
                  moduleId: ele.moduleId
                })
              }
            })
          })
          params.list = list
        }
        if (this.tabActive === 'second') {
          params.menuIds = this.treeForm.menuIds
        }
        this.$utils.disabledButton(this)
        this.$http.posts(this.tabActive === 'first' ? 'updateDpUserCoProductAuth' : 'updateDpUserMenuAuth', params)
          .then(res => {
            this.getList()
            this.dialogVisible = false
          })
      } else {
        this.$utils.disabledButton(this)
        this.$http.posts('auditAccountNumber', { status: 0, dpUserId: this.activeRow.dpUserId })
          .then(res => {
            this.getList()
            this.dialogVisible = false
          })
      }
    },
    // 树节点改变时触发 将选中和半选中的组成obj
    handleRoleTreeChange(val, e) {
      let ids = []
      let names = []
      let checkedNodes = e.checkedNodes
      let halfCheckedNodes = e.halfCheckedNodes
      checkedNodes.forEach((e, i) => { ids.push(e.id) })
      halfCheckedNodes.forEach((e, i) => { ids.push(e.id) })
      this.treeForm.menuIds = ids.join(',')
    },
    handleDialogClose() {
      this.checkList = []
      this.expandedKeys = []
      this.tabActive = 'first'
    }
  }
}
</script>

<style lang="less">
#assoSecond {
  .el-checkbox-group {
    padding: 20px;
  }
}
</style>
