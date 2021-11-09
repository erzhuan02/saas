<template>
  <div id="published">
    <!-- 查询 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
        <el-form-item prop="dateRange" :label="$t('msgCenter.publishTime')" clearable>
          <el-date-picker v-model="queryForm.dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('industry.busiName')">
          <el-select v-model="queryForm.businessId" :placeholder="$t('placeholder.select')" clearable>
            <el-option v-for="(item, index) in busiData" :key="index" :label="item.busName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common.productName')">
          <el-select v-model="queryForm.productId" :placeholder="$t('placeholder.select')" clearable>
            <el-option v-for="(item, index) in productData" :key="index" :label="item.productName" :value="item.productId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('industry.tabs1')">
          <el-select v-model="queryForm.categoryId" :placeholder="$t('placeholder.select')" clearable>
            <el-option v-for="(item, index) in industryData" :key="index" :label="item.categoryName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common.status')">
          <el-select v-model="queryForm.status" :placeholder="$t('placeholder.select')" clearable>
            <el-option v-for="(item, index) in statusData" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('industry.tempName')">
          <el-input v-model="queryForm.templateName" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('versionRelease.versionNumb')">
          <el-input v-model="queryForm.versionNumb" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <!-- <el-button icon="el-icon-refresh-left" @click="handleReset">{{ $t('button.reset') }}</el-button> -->
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="result clearfix" v-loading="listLoading">
      <el-table class="overflowTable" ref="resultTable" stripe border max-height="640" :data="list" style="width: 100%;" highlight-current-row>
        <el-table-column prop="no" width="50" :label="$t('common.no')"></el-table-column>
        <el-table-column prop="templateName" :label="$t('industry.tempName')"></el-table-column>
        <el-table-column prop="busName" :label="$t('industry.busiName')"></el-table-column>
        <el-table-column prop="createTime" :label="$t('msgCenter.publishTime')"></el-table-column>
        <el-table-column prop="versionNumb" :label="$t('versionRelease.versionNumb')"></el-table-column>
        <el-table-column prop="status" :label="$t('common.status')">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">{{ $t('industry.isUsing') }}</span>
            <span v-if="scope.row.status == 0">{{ $t('industry.stopUsing') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productName" :label="$t('common.productName')"></el-table-column>
        <el-table-column prop="categoryName" :label="$t('industry.tabs1')"></el-table-column>
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
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      productData: [],
      industryData: [],
      busiData: [],
      // 查询表单数据
      queryForm: {
        dateRange: [],
        startTime: '',
        endTime: '',
        businessId: '',
        productId: '',
        categoryId: '',
        status: '',
        templateName: '',
        versionNumb: ''
      },
      // 当前表格的查询条件
      realQuery: {
        pageNumber: 1,
        pageSize: 10
      },
      list: [],
      total: 0,
      listLoading: false
    }
  },
  computed: {
    ...mapGetters(['language']),
    // 查询验证规则
    queryFormRules() {
      return {}
    },
    statusData() {
      return [
        {
          label: this.$t('industry.isUsing'),
          value: 1
        },
        {
          label: this.$t('industry.stopUsing'),
          value: 0
        }
      ]
    }
  },
  mounted() {
    this.init()
    this.getList()
  },
  methods: {
    init() {
      // 产品名称
      this.$http.posts('getProductDataAuth', '', { type: 1 }).then(res => { this.productData = res.data })
      // 行业分类&业态名称
      this.$http.posts('getCategoryAndBusType')
        .then(res => {
          let data = res.data
          this.industryData = data.categoryList
          this.busiData = data.busTypeList
        })
    },
    getList() {
      this.listLoading = true
      this.$http.posts('questionBankPage', this.realQuery)
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
    // 重置查询表单
    handleReset() {
      // this.$nextTick(() => {
      //   this.$refs.queryForm.resetFields()
      // })
      for (var item in this.queryForm) {
        if (item === 'dateRange') {
          this.queryForm[item] = []
        } else {
          this.queryForm[item] = ''
        }
      }
    },
    // 修改更新状态
    upStatus(data) {
      let params = {
        id: data.id,
        status: data.status === 1 ? 0 : 1
      }
      this.$http.posts('updateQuestionBankId', params, '', true)
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
