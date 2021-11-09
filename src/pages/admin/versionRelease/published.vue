<template>
  <div id="published">
    <!-- 查询 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
        <el-form-item prop="dateRange" :label="$t('msgCenter.publishTime')">
          <el-date-picker v-model="queryForm.dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="content" :label="$t('versionRelease.versionNumb')">
          <el-input v-model="queryForm.versionNumb" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="result clearfix" v-loading="listLoading">
      <el-table class="overflowTable" ref="resultTable" stripe border max-height="640" :data="list" style="width: 100%;" highlight-current-row>
        <el-table-column prop="no" width="150" :label="$t('common.no')"></el-table-column>
        <el-table-column prop="updateTime" :label="$t('versionRelease.publishTime')"></el-table-column>
        <el-table-column prop="versionNumb" :label="$t('versionRelease.versionNumb')"></el-table-column>
        <el-table-column prop="ext1" :label="$t('versionRelease.bucketPath')"></el-table-column>
        <el-table-column prop="status" :label="$t('common.status')">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">正常</span>
            <span v-if="scope.row.status == 0">停用</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('versionRelease.featureDesc')" width="200px">
          <div slot-scope="scope" class="moreCell">
            <div class="flex-dvc">
              <pre>{{scope.row.explanation}}</pre>
            </div>
          </div>
        </el-table-column>
        <el-table-column prop="userName" :label="$t('versionRelease.publisher')"></el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="scope">
            <el-switch :value="scope.row.status == 1 ? true : false" @change="upStatus(scope.row)" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">{{ $t('common.currentPage') }} {{ list.length }}{{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询表单数据
      queryForm: {
        dateRange: [],
        versionNumb: '',
        startTime: '',
        endTime: ''
      },
      // 当前表格的查询条件
      realQuery: {
        pageNumber: 1,
        pageSize: 10
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
        versionNumb: [
          {
            // trigger: 'blur',
            trigger: 'change',
            message: this.$t('message.noSpecial'),
            pattern: this.$utils.reg.searchName
          }
        ]
      }
    }
  },
  mounted() { },
  props: ['tabActive'],
  watch: {
    tabActive(val) {
      if (val === 'published') {
        this.getList()
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$http.posts('verList', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          this.list = list.map((item, index) => {
            return {
              no: this.realQuery.pageSize * (this.realQuery.pageNumber - 1) + (index + 1),
              ...item
            }
          })
        })
        .catch(er => {
          this.listLoading = false
          this.list = []
          this.total = 0
        })
    },
    // 修改更新状态
    upStatus(data) {
      let params = {
        id: data.id,
        status: data.status === 1 ? 0 : 1
      }
      this.$http.posts('verUpVerStatus', '', params, true)
        .then(res => {
          this.getList()
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
    }
  }
}
</script>

<style lang="less" scoped>
#published {
  .moreCell {
    pre {
      text-align: left;
    }
  }
}
</style>
