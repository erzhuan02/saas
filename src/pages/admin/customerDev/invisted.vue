<template>
  <div id="invisted">
    <div class="routerView flex1">
      <div id="scrollView" class="flex-d">
        <div>
          <!-- 查询条件 -->
          <div class="queryForm">
            <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
              <el-form-item :label="$t('friend.customerOrPartner')" prop="companyNameSearch">
                <el-input v-model.trim="queryForm.companyNameSearch" :placeholder="$t('placeholder.input')" maxlength="128" clearable></el-input>
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
            <el-table class="overflowTable" ref="resultTable" stripe border max-height="560" @filter-change="filterHandler" :data="list" v-loading="loading" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
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
              <el-table-column prop="userName" :label="$t('myClients.accountName')"></el-table-column>
              <el-table-column prop="asscType" :filters="asType" column-key="asscType" :label="$t('myClients.type')"></el-table-column>
              <el-table-column prop="invtMethod" :filters="invtMethod" column-key="method" :label="$t('friend.invitedMethod')"></el-table-column>
              <el-table-column :label="$t('expend.state')" :filters="isFriendNumb" column-key="isFriendNumb">
                <template slot-scope="scope">
                  <span v-if="scope.row.isFriendNumb == 0">未关联</span>
                  <span v-if="scope.row.isFriendNumb == 1">已关联</span>
                  <span v-if="scope.row.isFriendNumb == 2">已报备</span>
                  <span v-if="scope.row.isFriendNumb == 3">已失效</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" :label="$t('basicInfo.regisTime')" min-width="90"></el-table-column>
              <el-table-column prop="beInvitedName" :label="$t('friend.affiliatePartner')"></el-table-column>
              <el-table-column prop="correlationTime" :label="$t('friend.correlationTime')" min-width="90"></el-table-column>
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
      // 实时查询表单数据
      queryForm: {
        method: '', // 邀请方式  1 线下，2 线上
        asscType: '', // 来源类型 1 自荐 2 推荐
        isFriendNumb: '', // 状态
        companyNameSearch: '',
        accountNameSearch: '',
        emailNameSearch: '',
        phoneSearch: ''
      },
      realQuery: {
        pageNumber: 1,
        pageSize: 10,

        type: 1
      },
      total: 0, // 分页数据，总条数
      // 查询结果数据
      list: [],
      loading: false
    }
  },
  mounted() {
    this.getList()
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
    asType() {
      const asType = [
        {
          text: this.$t('OV.selfRecom'),
          value: 1
        },
        {
          text: this.$t('friend.recommend'),
          value: 2
        }
      ]
      return asType
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
    },
    isFriendNumb() {
      const isFriendNumb = [
        {
          text: this.$t('friend.notAss'),
          value: 0
        },
        {
          text: this.$t('friend.linked'),
          value: 1
        }
        // {
        //   text: this.$t('friend.expired'),
        //   value: 3
        // }
      ]
      return isFriendNumb
    }
  },
  methods: {
    // 重置查询表单
    handleReset() {
      this.$refs.queryForm.resetFields()
    },
    // 筛选
    filterHandler(obj) {
      for (let i in obj) {
        if (obj[i].length === 1) {
          this.queryForm[i] = obj[i].join()
        } else {
          this.queryForm[i] = ''
        }
        this.realQuery = { ...this.realQuery, ...this.queryForm }
        this.getList()
      }
    },
    // 查询表单
    handleQuery() {
      this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
      this.getList()
    },
    getList() {
      this.loading = true
      this.$http.posts('invitedCustomers', this.realQuery, '', false)
        .then(res => {
          this.loading = false
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          this.list = list.map((item, index) => {
            return {
              ...item,
              invtMethod: item.invtMethod === 1 ? '线下' : '线上',
              contactNumb: item.contactNumb && this.$utils.exchangePrefix(item.contactNumb),
              asscType: item.asscType === 1 ? '自荐' : '推荐'
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
#invisted {
}
</style>
