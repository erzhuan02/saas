<template>
  <div id="signing">
    <!-- 查询 -->
    <div class="queryForm">
      <h4>{{ $t('versionRelease.signQuery') }}</h4>
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
        <el-form-item prop="dateRange" :label="$t('versionRelease.signTime')">
          <el-date-picker v-model="queryForm.dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="content" :label="$t('common.companyName1')">
          <el-input v-model="queryForm.companyName" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item prop="agreementType" :label="$t('versionRelease.agreementType')">
          <el-select v-model="queryForm.proTypeId" :placeholder="$t('placeholder.select')" clearable>
            <el-option v-for="(item, index) in selectProType" :key="index" :label="language === 'cn' ? item.nameCn : item.nameEn" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="result clearfix" v-loading="listLoading">
      <el-table class="signTable" ref="resultTable" stripe border max-height="640" :data="list" style="width: 100%;" highlight-current-row>
        <el-table-column prop="no" :label="$t('common.no')"></el-table-column>
        <el-table-column prop="proName" :label="$t('versionRelease.agreementName')"></el-table-column>
        <el-table-column prop="companyId" :label="$t('login.enterpriceLogin')">
          <template slot-scope="scope">
            <span v-if="scope.row.companyId">{{scope.row.companyId}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" :label="$t('common.companyName1')">
          <template slot-scope="scope">
            <span v-if="scope.row.companyName">{{scope.row.companyName}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('versionRelease.signStatus')">{{ $t('versionRelease.signed') }}</el-table-column>
        <el-table-column prop="signTime" :label="$t('versionRelease.signTime')"></el-table-column>
        <el-table-column prop="contactName" :label="$t('account.contacts')"></el-table-column>
        <el-table-column prop="contactNumb" :label="$t('common.phone')"></el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="preview(scope.row)">{{ $t('button.preview') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">{{ $t('common.currentPage') }} {{ list.length }}{{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <!-- 预览对话框 -->
    <el-dialog class="modeDia dlgWidthAuto" :title="$t('button.preview')" :visible.sync="showPreview" :close-on-click-modal="false">
      <div class="previewWangEd" v-html="content"></div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      // 查询表单数据
      queryForm: {
        dateRange: [],
        startTime: '',
        endTime: '',
        companyName: '',
        proTypeId: ''
      },
      // 当前表格的查询条件
      realQuery: {
        pageNumber: 1,
        pageSize: 10
      },
      selectProType: [],
      content: '',
      list: [],
      total: 0,
      listLoading: false,
      showPreview: false
    }
  },
  computed: {
    ...mapGetters(['language']),
    // 查询验证规则
    queryFormRules() {
      return {}
    }
  },
  mounted() {
    this.getProType()
    this.getList()
  },
  methods: {
    // 获取协议类型列表
    getProType() {
      // 类型：1.查询所有协议 0.排除订单协议
      this.$http.gets('getProTypeAuth', { type: 1 })
        .then(res => {
          this.selectProType = res.data || []
        })
    },
    getList() {
      this.listLoading = true
      this.$http.posts('getSignProList', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          this.list = list.map((item, index) => {
            return {
              no: this.realQuery.pageSize * (this.realQuery.pageNumber - 1) + (index + 1),
              ...item,
              contactNumb: item.contactNumb && this.$utils.exchangePrefix(item.contactNumb)
            }
          })
        })
        .catch(er => {
          this.listLoading = false
          this.list = []
          this.total = 0
        })
    },
    // 预览
    preview(data) {
      this.$http.gets('getPreviewContent', { id: data.id })
        .then(res => {
          this.content = res.data || ''
          this.showPreview = true
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
@import '../../../assets/color.less';
#signing {
  h4 {
    margin-bottom: 30px;
    padding-bottom: 7px;
    border-bottom: solid 1px @border;
  }
}
</style>
