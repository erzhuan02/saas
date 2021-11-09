<template>
  <div id="myCustomer">
    <div class="routerView flex1">
      <div id="scrollView" class="flex-d">
        <!-- 查询条件 -->
        <div class="queryForm">
          <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
            <el-form-item :label="$t('myClients.clientName')" prop="companyName">
              <el-input v-model="queryForm.companyName" :placeholder="$t('placeholder.input')" maxlength="128" clearable></el-input>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 查询结果 -->
        <div class="result clearfix">
          <el-table class="overflowTable" ref="resultTable" stripe border max-height="560" :data="list" v-loading="loading" tooltip-effect="dark" style="width: 100%;" :empty-text="$t('customerAllocation.emptyTable')" highlight-current-row>
            <!-- <el-table-column prop="no" :label="$t('common.no')"></el-table-column> -->
            <el-table-column type="index" :label="$t('common.no')" width="120" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
            <el-table-column prop="userName" :label="$t('myClients.accountName')"></el-table-column>
            <el-table-column prop="companyId" :label="$t('myClients.companyId')"></el-table-column>
            <el-table-column prop="companyName" :label="$t('myClients.clientName')"></el-table-column>
            <el-table-column prop="contactNumb" :label="$t('common.phone')"></el-table-column>
            <el-table-column prop="operation" :label="$t('common.operation')"></el-table-column>
          </el-table>
          <div class="currentTotal">{{ $t('common.currentPage') }} {{list.length}} {{ $t('common.unit') }}</div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
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
        companyName: '' // 客户名称
      },
      // 当前表格的查询条件
      realQuery: {
        pageNumber: 1,
        pageSize: 10,

        type: 3 // 1.未分配客户 2.已分配客户 3.我的客户
      },
      total: 0, // 分页数据，总条数
      // 查询结果数据
      list: [],
      loading: false
    }
  },
  mounted() { this.getList() },
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
  methods: {
    // 查询表单提交
    handleQuery() {
      this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
      this.getList()
    },
    getList() {
      this.loading = true
      this.$http.posts('distList', this.realQuery)
        .then(res => {
          this.loading = false
          this.list = []
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          list.forEach((item, index) => {
            if (item.contactNumb && item.contactNumb.indexOf('+') !== -1) {
              item.contactNumb = this.$utils.exchangePrefix(item.contactNumb)
            }
            item.no = this.realQuery.pageSize * (this.realQuery.pageNumber - 1) + (index + 1)
            item.operation = '-'
          })
          this.list = list
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

<style lang="less" scoped>
#myCustomer {
}
</style>
