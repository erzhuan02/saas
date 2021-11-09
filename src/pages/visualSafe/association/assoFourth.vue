<template>
  <div id="assoFirst">
    <div class="result clearfix" v-loading="listLoading">
      <el-table class="overflowTable" ref="table" stripe border max-height="565" :data="list" highlight-current-row>
        <el-table-column type="index" :label="$t('common.no')" width="150" :index="1"></el-table-column>
        <el-table-column :label="$t('org.name')">企业绑定码</el-table-column>
        <el-table-column prop="bindCode" :label="$t('association.bindingCode')"></el-table-column>
        <el-table-column :label="$t('association.vaild')" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.codeOver">{{ $t('association.codeHasExpired') }}</span>
            <span v-else>{{ scope.row.startTime }} - {{ scope.row.endTime }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="scope">
            <el-button v-if="button.copy" size="mini" type="primary" plain v-clipboard:copy="scope.row.bindCode" v-clipboard:success="handleCopySuccess" v-clipboard:error="handleCopyError">{{ $t('button.copy') }}</el-button>
            <el-button v-if="button.refresh" size="mini" type="primary" @click="handleRefresh(scope.row)" plain>{{ $t('button.refresh') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="currentTotal">
        {{ $t('common.currentPage') }} {{ list.length }}
        {{ $t('common.unit') }}
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      realQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10, // 一页显示多少条
      },
      total: 0,
      list: [],
      listLoading: false,
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
      this.$http.posts('vsGetCode')
        .then(res => {
          this.listLoading = false
          let data = res.data || {}
          let list = [data]
          // this.total = data.total || 0
          this.list = list
        })
        .catch(er => {
          this.listLoading = false
          this.list = []
          this.total = 0
        })
    },
    // // 一页显示多少条
    // handleSizeChange(val) {
    //   this.realQuery.pageSize = val
    //   this.getList()
    // },
    // // 当前第几页
    // handleCurrentChange(val) {
    //   this.realQuery.pageNumber = val
    //   this.getList()
    // },
    handleRefresh(row) {
      this.listLoading = true
      this.$http.posts('vsRefreshCode')
        .then(res => {
          this.getList()
        })
        .catch(er => {
          this.listLoading = false
        })
    },
    handleCopySuccess() {
      this.$utils.$message({
        message: this.$t('message.copySuccess'),
        type: 'success'
      })
    },
    handleCopyError() {
      this.$utils.$message({
        message: this.$t('message.copyError'),
        type: 'error'
      })
    }
  }
}
</script>
