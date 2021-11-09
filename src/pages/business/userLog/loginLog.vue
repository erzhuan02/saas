<template>
  <div id="loginLog">
    <!-- 查询 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
        <el-form-item :label="$t('log.timeSlot')" prop="dateRange">
          <el-date-picker v-model="queryForm.dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('account.organization')" prop="orgId">
          <input-tree ref="orgTree" v-model="queryForm.orgId" :data="busiOrgTree"></input-tree>
        </el-form-item>
        <el-form-item prop="userName" :label="$t('account.userName')">
          <el-input v-model.trim="queryForm.userName" maxlength="30" @keydown.enter.native="handleQuery" :placeholder="$t('placeholder.input') + $t('account.userName')" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询结果 -->
    <div class="result clearfix" v-loading="listLoading">
      <el-table ref="table" stripe border max-height="595" :data="list" highlight-current-row>
        <el-table-column type="index" :label="$t('common.no')" width="150" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
        <el-table-column prop="userName" :label="$t('account.userName')"></el-table-column>
        <el-table-column prop="loginNumb" :label="$t('log.times')"></el-table-column>
        <el-table-column prop="logSum" :label="$t('log.totalDuration')"></el-table-column>
        <el-table-column prop="logAvg" :label="$t('log.aveDur')"></el-table-column>
        <el-table-column prop="webNumb" :label="'Web' + $t('log.times')"></el-table-column>
        <el-table-column prop="iosNumb" :label="'IOS' + $t('log.times')"></el-table-column>
        <el-table-column prop="androidNumb" :label="'Android' + $t('log.times')"></el-table-column>
      </el-table>
      <div class="currentTotal">{{ $t('common.currentPage') }} {{list.length}} {{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background>
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      busiOrgTree: [],
      // 实时查询表单数据
      queryForm: {
        dateRange: [],
        orgId: [],
        userName: '',

        startTime: '',
        endTime: ''
      },
      // 实际查询数据
      realQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10, // 一页显示多少条

        type: 1 // 1.登录日志 2.操作日志 3.登录详情
      },
      list: [],
      total: 0,
      listLoading: ''
    }
  },
  computed: {
    // 查询验证规则
    queryFormRules() {
      return {
        userName: [
          {
            trigger: 'change',
            message: this.$t('message.noSpecial'),
            pattern: this.$utils.reg.searchName
          }
        ]
      }
    }
  },
  watch: {},
  created() {
    this.getList()
    this.$store.dispatch('busiGetOrgTree', { url: 'getOrgTree', orgType: 2 }).then(res => {
      this.busiOrgTree = res
    }) // 获取查询的组织架构
  },
  mounted() { },
  methods: {
    // 获取数据列表
    getList() {
      this.listLoading = true
      this.$http.posts('searchUserLog', this.realQuery)
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
    // 查询表单提交
    handleQuery() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
          var realQuery = this.realQuery
          // console.log('this.realQuery', realQuery)
          var dateRange = realQuery.dateRange
          if (dateRange && dateRange.length > 0) {
            realQuery.startTime = dateRange[0]
            realQuery.endTime = dateRange[1]
          }
          realQuery.orgId = realQuery.orgId.join()
          delete realQuery.dateRange
          this.getList()
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
    }
  }
}
</script>
