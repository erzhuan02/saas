<template>
  <div id="formalContract">
    <!-- 查询 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
        <el-form-item :label="$t('log.timeSlot')" prop="dateRange">
          <el-date-picker v-model="queryForm.dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')"></el-date-picker>
        </el-form-item>
        <!-- <el-form-item prop="contractStatus" :label="$t('workOrder.status')">
          <el-select v-model="queryForm.contractStatus" :placeholder="$t('placeholder.select')" clearable>
            <el-option :label="$t('contract.status0')" :value="0"></el-option>
            <el-option :label="$t('contract.status1')" :value="1"></el-option>
            <el-option :label="$t('contract.status2')" :value="2"></el-option>
            <el-option :label="$t('contract.status3')" :value="3"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item prop="contractId" :label="$t('contract.contractNo')">
          <el-input v-model="queryForm.contractId" :placeholder="$t('placeholder.input')" maxlength="50" clearable></el-input>
        </el-form-item>
        <el-form-item prop="companyName" :label="$t('common.companyName1')">
          <el-input v-model="queryForm.companyName" :placeholder="$t('placeholder.input')" maxlength="128" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery()">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询结果 表格 -->
    <div class="result clearfix" v-loading="listLoading">
      <!-- @current-change="handleCurrentChange1" -->
      <el-table ref="resultTable" stripe border max-height="650" :data="list" highlight-current-row>
        <el-table-column prop="no" width="100" :label="$t('common.no')"></el-table-column>
        <el-table-column prop="contractId" :label="$t('contract.contractNo')" min-width="130"></el-table-column>
        <el-table-column :label="$t('contract.relatedOrders')">
          <template slot-scope="scope">
            <div class="flex-hcvc">
              <!-- popper-class="msgPopover" -->
              <span>{{ $t('common.total') }} {{scope.row.orderNumb}} {{ $t('unit.one') }}</span>
              <el-popover trigger="click" popper-class="tablePopover tablePopover1">
                <ul>
                  <li v-for="item in scope.row.orderIds" :key="item">{{ $t('common.orderNo') }}: {{item}}</li>
                </ul>
                <i slot="reference" class="el-icon-view eye"></i>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" :label="$t('common.companyName1')"></el-table-column>
        <el-table-column prop="userName" :label="$t('common.accountNo')"></el-table-column>
        <el-table-column prop="phoneNumb" :label="$t('contract.contactDetails')"></el-table-column>
        <el-table-column prop="createTime" :label="$t('contract.applyTime')" min-width="100"></el-table-column>
        <el-table-column prop="contractStatus" :label="$t('common.status')">
          <span slot-scope="scope">{{ $t(`contract.status${scope.row.contractStatus}`) }}</span>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="300">
          <template slot-scope="scope">
            <el-button v-if="button.downloadFormal" size="mini" type="primary" @click="handleDownload(scope.row)" plain>{{ $t('button.download') }}</el-button>
            <el-button v-if="button.voidFormal && scope.row.contractStatus === 2" size="mini" type="primary" @click="handleDialogOpen ('void', scope.row)" plain>{{ $t('button.void') }}</el-button>
            <el-button v-if="button.previewFormal" size="mini" type="primary" @click="handlePreview(scope.row)" plain>{{ $t('button.preview') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">
        {{ $t('common.currentPage') }} {{ list.length }}
        {{ $t('common.unit') }}
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <!-- 作废对话框 -->
    <el-dialog :title="$t('button.void')" :visible.sync="voidDialogVisible" :close-on-click-modal="false">
      <div class="dialogInfo" ref="voidBody">
        <i class="el-icon-warning"></i><span>{{ $t('message.voidContract') }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="voidDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleUpdateStatus('void',2)">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $utils from '@/utils'
export default {
  data() {
    return {
      // 查询表单数据
      queryForm: {
        dateRange: [],
        contractId: '', // 名称
        companyName: '',

        startTime: '',
        endTime: ''
      },
      realQuery: {
        // sortKey: '',
        // sortValue: '',
        contractStatus: 2, // 1草稿 2正式 3作废
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      }, // 当前表格的查询条件
      list: [],
      total: 0,
      // selection: [],
      listLoading: false,
      currentRow: {},

      // toFormalDialogVisible: false,
      voidDialogVisible: false,
      // deleteDialogVisible: false,

      button: {}
    }
  },
  computed: {
    ...mapGetters(['language']),
    // 查询验证规则
    queryFormRules() {
      return {
        contractId: [
          {
            trigger: 'change',
            message: this.$t('message.inputRight'),
            pattern: this.$utils.reg.contractId
          }
        ],
        companyName: [
          {
            trigger: 'change',
            // message: this.$t('message.inputRight'),
            pattern: this.$utils.reg.companyName,
            validator: this.$utils.validator.common
          }
        ]
      }
    }
  },
  watch: {
    // 修改最后一页删除的bug
    total() {
      if (
        this.total ===
        (this.realQuery.pageNumber - 1) * this.realQuery.pageSize &&
        this.total !== 0
      ) {
        this.realQuery.pageNumber -= 1
        this.getList() // 获取列表数据
      }
    }
  },
  created() { this.init() },
  mounted() { },
  methods: {
    // 进页面就发的请求
    init() {
      this.$utils.getButton(this.$route.path, 1).then(res => {
        this.button = res
      })
      this.getList()// 获取列表数据
    },
    // 获取列表
    getList() {
      this.listLoading = true
      this.$http.posts('contractList', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          this.list = list.map((item, index) => {
            return {
              no: this.realQuery.pageSize * (this.realQuery.pageNumber - 1) + (index + 1),
              ...item,
              phoneNumb: item.phoneNumb && this.$utils.exchangePrefix(item.phoneNumb)
            }
          })
        })
        .catch(er => {
          this.listLoading = false
          this.list = []
          this.total = 0
        })
    },
    // 查询表单提交
    handleQuery() {
      this.$refs['queryForm'].validate(valid => {
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
          // console.log('error 验证错误query!!')
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
    },
    // 新增/修改/详情/删除对话框打开
    handleDialogOpen(type, row) {
      if (row) this.currentRow = { ...row }
      // if (type === 'toFormal') {
      // } else if (type === 'void') {
      // } else if (type === 'delete') {
      // }
      this[`${type}DialogVisible`] = true
      // 对话框打开后
      this.$nextTick(() => {
        var dom = this.$refs[`${type}Body`]
        if (dom) {
          var { contractId, contractStatus } = row
          dom.innerHTML = dom.innerHTML.replace('xx0', contractId).replace('xx1', this.$t(`contract.status${contractStatus}`))
        }
      })
    },
    // 下载
    handleDownload: $utils.debounce(function (row) {
      var { companyId, contractId } = { ...row }
      // window.location.href = this.$api.apiBase + `${this.$api.exportPDF}?${this.$utils.obj2qs({ companyId, contractId, contractStatus })}`
      this.$utils.excelExport('exportPDF', { companyId, contractId }, '', `contract${contractId}.pdf`)
    }),
    // 删除和改变状态
    handleUpdateStatus: $utils.debounce(function (type, status) {
      // 0 删除  1  2作废
      // this.listLoading = true
      var params = {
        status
      }
      params.contractId = this.currentRow.contractId
      this.$http.posts('updateContrStatus', '', params, true)
        .then(res => {
          this.getList()
        })
      this[`${type}DialogVisible`] = false
    }),
    // 预览
    handlePreview(row) {
      var { companyId, contractId } = { ...row }
      this.$store.dispatch('previewFile', { companyId, contractId })
    },
    // 点击新增/修改/详情/删除对话框关闭,重置表单
    handleDialogClose(type) {
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#formalContract {
  .result {
    .eye {
      margin-left: 5px;
      color: @text3;
      font-weight: 700;
    }
  }
}
.tablePopover1 {
  li {
    // min-width: 225px;
    padding: 0 5px;
    color: @text3;
    line-height: 1.8;
  }
}
</style>
