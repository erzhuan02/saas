<template>
  <div id="audited">
    <!-- 查询条件 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" @submit.native.prevent inline label-width="auto">
        <el-form-item :label="$t('myClients.regisTime')" prop="createTime">
          <el-date-picker v-model="queryForm.createTime" type="daterange" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')" format="yyyy-MM-dd" clearable value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('myClients.clientName')" prop="companyName">
          <el-input v-model.trim="queryForm.companyName" :placeholder="$t('placeholder.input')" clearable maxlength="20"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.companyId')" prop="companyId">
          <el-input v-model.trim="queryForm.companyId" :placeholder="$t('placeholder.input')" clearable maxlength="5"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.phone')" prop="phoneNumb">
          <el-input v-model.trim="queryForm.phoneNumb" :placeholder="$t('placeholder.input')" clearable maxlength="11"></el-input>
        </el-form-item>
        <el-form-item :label="$t('myClients.clerkName')" prop="userName">
          <el-input v-model.trim="queryForm.userName" :placeholder="$t('placeholder.input')" clearable maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
          <el-button icon="el-icon-refresh-left" @click="handleReset()">{{ $t('button.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询结果 -->
    <div class="result clearfix">
      <el-table class="audited" ref="resultTable" stripe border max-height="595" :data="tableData" v-loading="loading" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange" highlight-current-row>
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" :label="$t('common.no')" width="80" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
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
        <el-table-column prop="auditStatus" :label="$t('myClients.RealName')" min-width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.auditStatus == 5">{{ $t('basicInfo.noPass') }}</span>
            <span v-if="scope.row.auditStatus == 4">{{ $t('basicInfo.passed') }}</span>
            <span v-if="scope.row.auditStatus == 1">{{ $t('basicInfo.waitAuth') }}</span>
            <span v-if="scope.row.auditStatus == 3 || scope.row.auditStatus == 6">{{ $t('basicInfo.authing') }}</span>
            <span v-if="scope.row.auditStatus == 0 || scope.row.auditStatus == 2">-</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('myClients.clerkName')">
          <template slot-scope="scope">
            <span>{{ scope.row.agentName | toRung(0) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="certCode" :label="$t('myClients.certCode')">
          <template slot-scope="scope">
            <span>{{ scope.row.certCode | toRung(0) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="examine(scope)" plain>{{ $t('button.review') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">{{ $t('common.currentPage') }} {{tableData.length}} {{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
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
        auditStatus: 1,
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      // 查询结果数据
      tableData: [],
      multipleSelection: []

      // saveRoutePath: ''
    }
  },
  watch: {
    // $route (to, from) {
    //   if (from.path !== '/review') {
    //     this.getList()
    //   }
    // },
    language() {
      this.getList()
    }
  },
  computed: {
    ...mapGetters(['language']),
    queryFormRules() {
      return {
        clientName: [],
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
  mounted() {
    this.getList()
  },
  // activated() {
  //   // 不是详情跳回则清除页面缓存
  //   if (this.saveRoutePath !== '/review') {
  //     this.handleReset()
  //     this.handleQuery()
  //   }
  // },
  // deactivated() {
  //   // 记录离开后页面的path
  //   this.saveRoutePath = this.$route.path
  // },
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
    // 点击审核
    examine(scope) {
      this.$router.push({
        path: '/review',
        query: {
          companyId: scope.row.companyId
        }
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
