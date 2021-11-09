<template>
  <div id="filed">
    <div class="routerView flex1">
      <div id="scrollView" class="flex-d">
        <div>
          <!-- 查询条件 -->
          <div class="queryForm">
            <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
              <el-form-item :label="$t('friend.customerOrPartner')" prop="companyNameSearch">
                <el-input v-model="queryForm.companyNameSearch" :placeholder="$t('placeholder.input')" maxlength="128" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('myClients.accountName')" prop="accountNameSearch">
                <el-input v-model.trim="queryForm.accountNameSearch" :placeholder="$t('placeholder.input')" maxlength="20" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('common.email')" prop="emailNameSearch">
                <el-input v-model.trim="queryForm.emailNameSearch" :placeholder="$t('placeholder.input')" maxlength="30" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('common.phone')" prop="phoneSearch">
                <el-input v-model.trim="queryForm.phoneSearch" :placeholder="$t('placeholder.input')" maxlength="11" clearable></el-input>
              </el-form-item>
              <el-form-item label=" ">
                <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
                <el-button @click="handleReset" icon="el-icon-refresh">{{ $t('button.reset') }}</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 查询结果 -->
          <div class="result clearfix">
            <el-table class="overflowTable" ref="resultTable" stripe border max-height="560" :data="list" v-loading="loading" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
              <!-- <el-table-column prop="no" width="50px" :label="$t('common.no')"></el-table-column> -->
              <el-table-column type="index" :label="$t('common.no')" width="80" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
              <el-table-column prop="invitCoName" :label="$t('friend.regCustomer')"></el-table-column>
              <el-table-column prop="invitPhoneNumb" :label="$t('common.phone')"></el-table-column>
              <el-table-column :label="$t('common.email')" min-width="120">
                <template slot-scope="scope">
                  <span v-if="scope.row.invitEmail">{{scope.row.invitEmail}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column prop="isRelated" :label="$t('expend.state')"></el-table-column>
              <el-table-column prop="createTime" :label="$t('friend.regTime')" min-width="90"></el-table-column>
              <el-table-column prop="userName" :label="$t('friend.repAccount')"></el-table-column>
              <el-table-column prop="companyName" :label="$t('friend.repCompany')"></el-table-column>
              <el-table-column :label="$t('common.operation')">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="openDialog(scope.row)" plain v-if="button.delete">{{ $t('button.delete') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="currentTotal">{{ $t('common.currentPage') }} {{list.length}} {{ $t('common.unit') }}</div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
          </div>
        </div>
        <!-- 删除对话框 -->
        <el-dialog class="dialogRec" :title="$t('button.delete')" :visible.sync="dialogVisible" :close-on-click-modal="false">
          <span>{{ $t('dialog.isDel') }}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="handleDelete()">{{ $t('button.confirm') }}</el-button>
          </span>
        </el-dialog>
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
        companyNameSearch: '',
        accountNameSearch: '',
        emailNameSearch: '',
        phoneSearch: ''
      },
      realQuery: {
        pageNumber: 1,
        pageSize: 10,

        method: 2 // 1 线下，2 线上(固定写死)
      },
      total: 0, // 分页数据，总条数
      // 查询结果数据
      list: [],
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
    }
  },
  mounted() {
    this.getList()
  },
  props: ['button'],
  methods: {
    // 重置查询表单
    handleReset() {
      this.$refs.queryForm.resetFields()
    },
    // 打开对话框
    openDialog(data) {
      this.curData = data
      this.dialogVisible = true
    },
    // 确认删除
    handleDelete() {
      this.$http.posts('updateInvitRecordStatus', '', { ids: this.curData.id }, true)
        .then(res => {
          if (this.list.length == 1) {
            this.realQuery.pageNumber = 1
          }
          this.getList()
          this.dialogVisible = false
        })
    },
    // 查询表单
    handleQuery(type) {
      this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
      this.getList()
    },
    getList() {
      this.loading = true
      this.$http.posts('invitRecordList', this.realQuery, '', false)
        .then(res => {
          this.loading = false
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          this.list = list.map((item, index) => {
            if (item.isRelated === 0) {
              item.isRelated = '未关联'
            } else if (item.isRelated === 1) {
              item.isRelated = '已关联'
            } else if (item.isRelated === 2) {
              item.isRelated = '已报备'
            } else if (item.isRelated === 3) {
              item.isRelated = '已失效'
            }
            return {
              ...item,
              method: item.method === 1 ? '线下' : '线上',
              invitPhoneNumb: item.invitPhoneNumb && this.$utils.exchangePrefix(item.invitPhoneNumb)
            }
          })
        })
        .catch(er => {
          this.loading = false
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

<style lang="less">
#filed {
}
</style>
