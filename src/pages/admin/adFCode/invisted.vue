<template>
  <div id="invisted">
    <div class="routerView flex1">
      <div id="scrollView" class="flex-d">
        <div>
          <!-- 查询条件 -->
          <div class="queryForm">
            <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
              <el-form-item :label="$t('myClients.clientName')" prop="accountNameSearch">
                <el-input v-model.trim="queryForm.accountNameSearch" :placeholder="$t('placeholder.input')" maxlength="30" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('myClients.accountName')" prop="companyNameSearch">
                <el-input v-model="queryForm.companyNameSearch" :placeholder="$t('placeholder.input')" maxlength="128" clearable></el-input>
              </el-form-item>
              <el-form-item :label="$t('basicInfo.FNum')" prop="friendNumbSearch">
                <el-input v-model.trim="queryForm.friendNumbSearch" :placeholder="$t('placeholder.input')" maxlength="30" clearable></el-input>
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
              <el-table-column prop="companyName" :label="$t('myClients.clientName')"></el-table-column>
              <el-table-column prop="contactNumb" :label="$t('common.phone')"></el-table-column>
              <el-table-column :label="$t('common.email')" min-width="120">
                <template slot-scope="scope">
                  <span v-if="scope.row.email">{{scope.row.email}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column prop="comUserName" :label="$t('myClients.accountName')"></el-table-column>
              <el-table-column prop="asscType" :label="$t('myClients.type')"></el-table-column>
              <el-table-column prop="invtMethod" :label="$t('friend.invitedMethod')"></el-table-column>
              <el-table-column prop="isFriendNumb" :label="$t('expend.state')"></el-table-column>
              <el-table-column prop="createTime" :label="$t('friend.invistedTime')" min-width="90"></el-table-column>
              <el-table-column prop="beInvitedName" :label="$t('friend.affiliatePartner')"></el-table-column>
              <el-table-column prop="partnerFriendNumb" :label="$t('friend.partnerFCode')"></el-table-column>
            </el-table>
            <div class="currentTotal">{{ $t('common.currentPage') }} {{list.length}} {{ $t('common.unit') }}</div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
          </div>
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
        accountNameSearch: '',
        companyNameSearch: '',
        friendNumbSearch: ''
      },
      realQuery: {
        type: 1,
        pageNumber: 1,
        pageSize: 10
      },
      total: 0, // 分页数据，总条数
      // 查询结果数据
      list: [],
      loading: false
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
  methods: {
    // 重置查询表单
    handleReset() {
      this.$refs.queryForm.resetFields()
    },
    // 查询表单
    handleQuery() {
      this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
      this.getList()
    },
    getList() {
      this.loading = true
      this.$http.posts('queryCompany', this.realQuery, '', false)
        .then(res => {
          this.loading = false
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          this.list = list.map((item, index) => {
            if (item.isFriendNumb === 0) {
              item.isFriendNumb = '未关联'
            } else if (item.isFriendNumb === 1) {
              item.isFriendNumb = '已关联'
            } else if (item.isFriendNumb === 2) {
              item.isFriendNumb = '已报备'
            } else if (item.isFriendNumb === 3) {
              item.isFriendNumb = '已失效'
            }
            return {
              ...item,
              contactNumb: item.contactNumb && this.$utils.exchangePrefix(item.contactNumb),
              asscType: item.asscType == 1 ? '自荐' : '推荐',
              invtMethod: item.invtMethod == 1 ? '线下' : '线上'
            }
          })
        })
        .catch(er => {
          this.loading = false
        })
    },
    // 分页事件
    handleSizeChange(val) {
      // this.realQuery.pageNumber = 1
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
#invisted {
}
</style>
