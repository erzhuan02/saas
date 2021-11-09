<template>
  <div id="invitedPartner">
    <div class="queryForm">
      <el-form ref="flowQuery" :model="flowQuery" :rules="queryFormRules" inline label-width="auto">
        <el-form-item prop="companyNameSearch" :label="$t('myClients.clientName')">
          <el-input v-model="flowQuery.companyNameSearch" clearable maxlength="128" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item prop="accountName" :label="$t('myClients.accountName')">
          <el-input v-model="flowQuery.accountName" clearable maxlength="32" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item prop="emailNameSearch" :label="$t('common.email')">
          <el-input v-model="flowQuery.emailNameSearch" clearable maxlength="32" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item prop="phoneSearch" :label="$t('common.phone')">
          <el-input v-model="flowQuery.phoneSearch" clearable maxlength="11" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="search">{{ $t('button.query') }}</el-button>
          <el-button @click="handleReset" icon="el-icon-refresh">{{ $t('button.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="result clearfix">
      <el-table class="audited" ref="resultTable" stripe border max-height="620" @filter-change="filterHandler" :data="tableData" style="width: 100%;" v-loading="loading" highlight-current-row>
        <el-table-column prop="no" :label="$t('common.no')"></el-table-column>
        <el-table-column prop="invitCoName" :label="$t('myClients.clientName')"></el-table-column>
        <el-table-column prop="invitPhoneNumb" :label="$t('common.phone')"></el-table-column>
        <el-table-column :label="$t('common.email')">
          <template slot-scope="scope">
            <span v-if="scope.row.invitEmail">{{scope.row.invitEmail}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('myClients.accountName')">
          <template slot-scope="scope">
            <span v-if="scope.row.accountName">{{scope.row.accountName}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="method" :filters="invtMethod" column-key="method" :label="$t('friend.invitedMethod')"></el-table-column>
        <el-table-column :filters="isRelated" column-key="isRelated" :label="$t('expend.state')">
          <template slot-scope="scope">
            <span v-if="scope.row.isRelated == 0">未关联</span>
            <span v-if="scope.row.isRelated == 1">已关联</span>
            <span v-if="scope.row.isRelated == 2">已报备</span>
            <span v-if="scope.row.isRelated == 3">已失效</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('account.registrationTime')"></el-table-column>
        <el-table-column :label="$t('common.operation')" width="180">
          <div class="flex-wha" slot-scope="scope">
            <el-button size="mini" type="primary" @click="openDialog(scope.row)" plain v-if="button.delete" :disabled="scope.row.isRelated == 1 || scope.row.isRelated == 2">{{ $t('button.delete') }}</el-button>
            <el-button size="mini" type="primary" @click="refile" plain v-if="button.reFile" :disabled="scope.row.isRelated == 1">{{ $t('button.refile') }}</el-button>
          </div>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="currentTotal" v-if="tableData == null || tableData == []">{{ $t('common.currentPage') }} 0 {{ $t('common.unit') }}</div>
      <div class="currentTotal" v-else>{{ $t('common.currentPage') }} {{tableData.length}} {{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <!-- 删除对话框 -->
    <el-dialog :title="$t('button.delete')" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <span>{{ $t('dialog.isDel') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleDelete()">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      button: {},
      flowQuery: {
        isRelated: '', // 状态 1已关联 0未关联
        method: '', // 邀请方式  1 线下，2 线上
        companyNameSearch: '',
        accountName: '',
        emailNameSearch: '',
        phoneSearch: ''
      },
      realQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10, // 一页显示多少条
        type: 1
      },
      total: 10, // 总条数
      tableData: [],
      loading: false,
      dialogVisible: false,
      curData: {}
    }
  },
  computed: {
    queryFormRules() {
      return {
        companyNameSearch: [
          {
            // required: true,
            trigger: 'change',
            pattern: this.$utils.reg.companyName,
            validator: this.$utils.validator.common
          }
        ]
      }
    },
    isRelated() {
      const isRelated = [
        {
          text: this.$t('friend.notAss'),
          value: 0
        },
        {
          text: this.$t('friend.linked'),
          value: 1
        },
        {
          text: this.$t('friend.reported'),
          value: 2
        },
        {
          text: this.$t('friend.expired'),
          value: 3
        }
      ]
      return isRelated
    },
    invtMethod() {
      const invtMethod = [
        {
          text: this.$t('friend.offline'),
          value: 1
        },
        {
          text: this.$t('friend.online'),
          value: 2
        }
      ]
      return invtMethod
    }
  },
  created() {
    this.$utils.getButton(this.$route.path, 1).then(res => {
      this.button = res
    })
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    // 重置查询表单
    handleReset() {
      this.$refs.flowQuery.resetFields()
    },
    // 筛选
    filterHandler(obj) {
      for (let i in obj) {
        if (obj[i].length === 1) {
          this.flowQuery[i] = obj[i].join()
        } else {
          this.flowQuery[i] = ''
        }
        this.realQuery = { ...this.realQuery, ...this.flowQuery }
        this.getOrderList()
      }
    },
    // 点击查询
    search() {
      this.realQuery.pageNumber = 1
      this.realQuery.pageSize = 10
      this.realQuery = { ...this.realQuery, ...this.flowQuery }
      this.getOrderList(this.realQuery)
    },
    getOrderList() {
      this.loading = true
      this.$http.posts('invitRecordAndCompanyList', this.realQuery, '', false)
        .then(res => {
          let data = res.data
          let list = data.list.map((item, index) => {
            return {
              no: 10 * (this.realQuery.pageNumber - 1) + (index + 1),
              ...item,
              method: item.method == 1 ? '线下' : '线上',
              invitPhoneNumb: item.invitPhoneNumb && this.$utils.exchangePrefix(item.invitPhoneNumb)
            }
          }) || []
          this.tableData = list
          this.total = data.total
          this.loading = false
        })
        .catch(er => {
          this.loading = false
        })
    },
    // 重新报备
    refile() {
      // 跳转至线上邀请页面
      this.$router.push({
        path: '/myFCode',
        query: {
          online: 1
        }
      })
    },
    // 打开对话框
    openDialog(data) {
      this.curData = data
      this.dialogVisible = true
    },
    // 确认删除
    handleDelete() {
      this.$http.posts('delInvisted', '', { ids: this.curData.id }, true)
        .then(res => {
          this.search()
          this.dialogVisible = false
        })
    },
    // 一页显示多少条
    handleSizeChange(val) {
      this.realQuery.pageSize = val
      this.getOrderList()
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.realQuery.pageNumber = val
      this.getOrderList()
    }
  }
}
</script>

<style lang="less">
#invitedPartner {
  .queryForm {
    .el-form-item:not(:last-child) .el-form-item__content {
      width: 207px;
    }
  }
}
</style>
