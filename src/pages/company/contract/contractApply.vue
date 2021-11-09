<template>
  <div id="contractApply">
    <div class="top">
      <div class="backTo">
        <router-link to="/comContract"><span><i class="el-icon-arrow-left"></i> {{ $t('contract.back') }}</span></router-link>
      </div>
      <h3 class="apply">{{ $t('contract.apply') }}</h3>
      <el-steps class="steps" :active="activeStep" process-status="wait" align-center>
        <el-step :title="$t('contract.step1')"></el-step>
        <el-step :title="$t('contract.step2')"></el-step>
        <el-step :title="$t('contract.step3')"></el-step>
        <el-step :title="$t('contract.step4')"></el-step>
      </el-steps>
    </div>
    <div class="step" v-show="activeStep === 1">
      <!-- 查询 -->
      <div class="queryForm">
        <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
          <el-form-item :label="$t('log.timeSlot')" prop="dateRange">
            <el-date-picker v-model="queryForm.dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')"></el-date-picker>
          </el-form-item>
          <el-form-item prop="orderId" :label="$t('common.orderNo')">
            <el-input v-model="queryForm.orderId" :placeholder="$t('placeholder.input')" clearable></el-input>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery(1)">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 查询结果 表格 -->
      <div class="result clearfix" v-loading="listLoading">
        <el-table ref="table1" stripe border max-height="565" :data="list" @selection-change="handleSelectionChange" highlight-current-row>
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="no" width="120" :label="$t('common.no')"></el-table-column>
          <el-table-column prop="orderId" :label="$t('common.orderNo')" min-width="100"></el-table-column>
          <el-table-column :label="$t('order.orderType')">
            <span slot-scope="scope">{{ $t(`order.orderType${scope.row.orderType}`) }}</span>
          </el-table-column>
          <el-table-column prop="productName" :label="$t('common.productName')"></el-table-column>
          <el-table-column prop="paymentAmount" :label="$t('contract.actualAmount')"></el-table-column>
          <el-table-column prop="createTime" :label="$t('common.createTime')" min-width="100"></el-table-column>
          <!-- <el-table-column :label="$t('common.operation')" width="400">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleDialogOpen ('edit', scope.row)" plain>{{ $t('button.edit') }}</el-button>
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleDialogOpen ('edit', scope.row)" plain>{{ $t('button.edit') }}</el-button>
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleDialogOpen ('edit', scope.row)" plain>{{ $t('button.edit') }}</el-button>
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleDialogOpen ('edit', scope.row)" plain>{{ $t('button.edit') }}</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="fl right">
          <el-button type="primary" @click="handleNextStep" :disabled="selection.length === 0">{{ $t('button.next') }}</el-button>
          <div class="currentTotal">
            {{ $t('common.currentPage') }} {{ list.length }}
            {{ $t('common.unit') }},
            {{ $t('common.selected') }} {{ selection.length }}
            {{ $t('common.unit') }}
          </div>
        </div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
      </div>
    </div>
    <div class="step step2" v-show="activeStep === 2">
      <!-- 表格 -->
      <div class="result clearfix">
        <el-table ref="table2" stripe border max-height="565" :data="selection" highlight-current-row>
          <el-table-column type="index" width="120" :label="$t('common.no')"></el-table-column>
          <!-- <el-table-column prop="no" width="120" :label="$t('common.no')"></el-table-column> -->
          <el-table-column prop="orderId" :label="$t('common.orderNo')" min-width="100"></el-table-column>
          <el-table-column :label="$t('order.orderType')">
            <span slot-scope="scope">{{ $t(`order.orderType${scope.row.orderType}`) }}</span>
          </el-table-column>
          <el-table-column prop="productName" :label="$t('common.productName')"></el-table-column>
          <el-table-column prop="paymentAmount" :label="$t('contract.actualAmount')"></el-table-column>
          <el-table-column prop="createTime" :label="$t('common.createTime')" min-width="100"></el-table-column>
        </el-table>
        <div class="fl right">
          <el-button type="primary" @click="handlePrevStep">{{ $t('button.prev') }}</el-button>
          <el-button type="primary" @click="handleNextStep">{{ $t('button.next') }}</el-button>
          <div class="currentTotal">
            {{ $t('common.currentPage') }} {{ selection.length }}
            {{ $t('common.unit') }}
          </div>
        </div>
      </div>
    </div>
    <div class="step step3" v-show="activeStep === 3">
      <!-- 客户信息 -->
      <div class="result flex-hc" v-loading="listLoading3">
        <el-form class="contentBody" ref="companyInfo" :model="companyInfo" label-width="120px">
          <el-form-item prop="companyName" :label="$t('common.companyName1')" required>
            <el-input v-model="companyInfo.companyName" :placeholder="$t('placeholder.realName1')" maxlength="128" disabled></el-input>
          </el-form-item>
          <el-form-item prop="address" :label="$t('common.address')" required>
            <el-input v-model.trim="companyInfo.address" :placeholder="$t('placeholder.input')" disabled></el-input>
          </el-form-item>
          <el-form-item prop="contactName" :label="$t('realName.contact')" required>
            <el-input v-model.trim="companyInfo.contactName" :placeholder="$t('placeholder.realName6')" maxlength="30" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('realName.contactNum')" required>
            <el-col :span="9">
              <el-form-item prop="phonePrefix" style="width: 100%;min-width:auto">
                <el-select v-model="companyInfo.phonePrefix" filterable :placeholder="$t('placeholder.select')" style="width: 100%;" disabled>
                  <el-option v-for="(item, index) in prefixOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1" style="text-align:center;">-</el-col>
            <el-col :span="14">
              <el-form-item prop="phoneNumb" style="width: 100%;min-width:auto">
                <el-input v-model.trim="companyInfo.phoneNumb" :placeholder="$t('placeholder.input')" maxlength="30" style="width: 100%;" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item style="margin-bottom:0;color:#909399">
            <!-- <span>{{ $t('contract.coInfoError1') }} <router-link class="blue" to="/bmRealNameAuth">{{ $t('home.nav12') }}</router-link></span> -->
            <span>{{ $t('contract.coInfoError1') }}{{ $t('home.nav12') }}</span>
          </el-form-item>
          <el-form-item>
            <div class="button">
              <!-- <el-button type="primary" @click="handlePrevStep">{{ $t('button.prev') }}</el-button> -->
              <el-button v-if="button.createDraftContr" type="primary" @click="handleAddOrEdit('add',1)" :disabled="Object.keys(this.companyInfo).length === 0">{{ $t('button.createDraftContr') }}</el-button>
              <el-button v-if="button.createFormalContr" type="primary" @click="handleAddOrEdit('add',2)" :disabled="Object.keys(this.companyInfo).length === 0">{{ $t('button.createFormalContr') }}</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="step step4" v-show="activeStep === 4">
      <!-- 成功 -->
      <div class="result flex-hc" v-loading="listLoading4">
        <div class="contentBody">
          <h2><i class="el-icon-success"></i>{{ $t(`contract.${createType}Success1`) }}</h2>
          <div>{{ $t('contract.contractNo') }}：{{editForm.contractId}}</div>
          <div>{{ $t(`contract.${createType}Success2`) }}</div>
          <div class="button">
            <!-- <el-button type="primary" @click="handlePrevStep">{{ $t('button.prev') }}</el-button> -->
            <el-button v-if="button.downloadDraft" v-show="createType === 'draft'" type="primary" @click="handleDownload">{{ $t(`button.downloadDraft`) }}</el-button>
            <el-button v-if="button.toFormal1" v-show="createType === 'draft'" type="primary" @click="handleAddOrEdit('edit',2)">{{ $t('button.toFormal') }}</el-button>
            <el-button v-if="button.downloadFormal" v-show="createType === 'formal'" type="primary" @click="handleDownload">{{ $t(`button.downloadFormal`) }}</el-button>
            <router-link to="/comContract">
              <el-button>{{ $t('button.backContrList') }}</el-button>
            </router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $utils from '@/utils'
export default {
  data() {
    return {
      activeStep: 1,
      // 查询表单数据
      queryForm: {
        dateRange: [],
        orderId: '',

        startTime: '',
        endTime: '',
        searchName: '' // 名称
      },
      realQuery: {
        // sortKey: '',
        // sortValue: '',

        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
        // type: 2, // 1.企业用户 2.业务用户
        // moduleId: 1
      }, // 当前表格的查询条件
      list: [],
      total: 0,
      selection: [],
      listLoading: false,

      // realQuery2: {
      //   sortKey: '',
      //   sortValue: ''
      // }, // 当前表格的查询条件
      // list2: [],
      // total2: 0,
      // listLoading2: false,

      prefixOptions: [],
      companyInfo: {},
      listLoading3: false,
      addForm: {
        ids: '', // 订单号
        orderNumb: '', // 订单个数
        contractStatus: '', // 创建合同类型 1草稿 2正式
        type: 1// 1 创建 2转正式
      },
      // createDisabled: true, // 初始禁止，公司请求回来后变为false
      listLoading4: false,
      createType: '',
      editForm: {
        contractId: '',
        contractStatus: '', // 创建合同类型 2正式
        type: 2
      },

      button: {}
    }
  },
  computed: {
    ...mapGetters(['language']),
    // 查询验证规则
    queryFormRules() {
      return {
        orderId: [
          {
            trigger: 'change',
            message: this.$t('message.inputRight'),
            pattern: this.$utils.reg.orderId
          }
        ]
      }
    }
  },
  watch: {
    language: {
      handler: function (newLang, oldLang) {
        // console.log(newLang, oldLang, this)
        if (newLang === 'cn') {
          this.prefixOptions = this.$utils.formatPrefixCN()
        } else if (newLang === 'en') {
          this.prefixOptions = this.$utils.formatPrefixEN()
        }
      },
      immediate: true
    },
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
      this.$utils.getButton('/comContract', 1).then(res => {
        this.button = res
      })
      this.getList()// 获取列表数据
    },
    // type 1.企业用户 2.业务用户
    getList() {
      this.listLoading = true
      this.$http.posts('contrOrderList', this.realQuery)
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
    getCompanyInfo() {
      this.listLoading3 = true
      this.$http.posts('contrCompanyinfo')
        .then(res => {
          this.listLoading3 = false
          let data = res.data
          // console.log(data)
          const { companyName, address, contactName, contactNumb } = { ...data }
          var phone = this.$utils.splitPhone(contactNumb)
          const { phonePrefix, phoneNumb } = { ...phone }
          // certStatus 企业验证状态 1验证通过 0没有或者没通过 此字段暂时不用
          this.companyInfo = { companyName, address, contactName, phonePrefix, phoneNumb }
          this.$nextTick(() => {
            // 应该放这里，在closed关闭时，上面form值改变，change的会触发验证，blur的不会
            this.$refs.companyInfo.clearValidate()
          })
        })
        .catch(er => {
          this.listLoading3 = false
          this.companyInfo = {}
        })
    },
    // 人脸资源库查询表单提交
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
          // console.log('error 验证错误query!!')
          return false
        }
      })
    },
    // 多选选中
    handleSelectionChange(val) {
      this.selection = val
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
    // 下一步
    handleNextStep(createType) {
      // if (this.activeStep++ > 3) this.activeStep = 1
      if (this.activeStep === 1) {
        // this.activeStep++
        this.activeStep = 2
      } else if (this.activeStep === 2) {
        this.activeStep = 3
        // 获取公司信息
        this.getCompanyInfo()
      } else if (this.activeStep === 3) {
        // 判断企业是否通过验证
        // this.addOrUpdataContr(createType)
      }
      // else {
      //   this.activeStep++
      // }
    },
    // 上一步
    handlePrevStep() {
      this.activeStep--
    },
    // 新增/编辑
    handleAddOrEdit: $utils.debounce(function (type, contractStatus) {
      // type add新增 edit修改转正式
      // contractStatus合同状态 1草稿 2正式
      // 企业是否通过认证，验证通过，创建合同
      // if (!this.companyInfo.certStatus) {
      //   this.$utils.$message({
      //     message: this.$t('code.S00135'),
      //     type: 'error'
      //   })
      //   return
      // }
      var form = { ...this[`${type}Form`], contractStatus }
      if (type === 'add') {
        let ids = this.selection.map(item => item.orderId).join()
        form.ids = ids
        form.orderNumb = this.selection.length
      } else if (type === 'edit') {
      }
      this[`listLoading${this.activeStep}`] = true
      this.$http.posts('addOrUpdateContr', form, '', { showErrorMsg: false })
        .then(res => {
          this[`listLoading${this.activeStep}`] = false
          if (type === 'add') {
            this.editForm.contractId = res.data.contractId
            this.activeStep = 4
          }
          if (contractStatus === 2) {
            this.createType = 'formal'
          } else {
            this.createType = 'draft'
          }
        })
        .catch(er => {
          this[`listLoading${this.activeStep}`] = false
          if (typeof er === 'object') {
            var errorMsg = this.$t(`code.${er.resMsg}`)
            if (er.resMsg === 'S00134') {
              errorMsg = errorMsg.replace('xxx', er.data)
            }
            this.$utils.$message({
              message: errorMsg,
              type: 'error'
            })
          }
        })
    }),
    // 下载
    handleDownload: $utils.debounce(function () {
      var companyId = this.companyInfo.companyId
      var contractId = this.editForm.contractId
      this.$utils.excelExport('exportPDF', { companyId, contractId }, '', `contract${contractId}.pdf`)
    })
    // // 新增/修改/详情/删除对话框打开
    // handleDialogOpen(type, row) {
    //   this[`${type}DialogVisible`] = true
    // },
    // // 点击新增/修改/详情/删除对话框关闭,重置表单
    // handleDialogClose(type) {
    // }

  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#contractApply {
  padding: 0 !important;
  background-color: @background;
  .top {
    background-color: #fff;
    padding: 0 8px;
    margin-bottom: 10px;
    .backTo {
      height: 40px;
      line-height: 40px;
      padding: 5px 10px 0;
      span:hover {
        color: @main;
        cursor: pointer;
      }
    }
    .apply {
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
    .steps {
      padding: 15px 0;
      // .el-step__head.is-process,
      // .el-step__title.is-process {
      //   color: @main;
      // }
      // .el-step__head.is-process .el-step__icon.is-text {
      //   border-color: @main;
      // }
    }
  }
  .step {
    padding: 0 8px;
    background-color: #fff;
  }
  .step2 {
    padding-top: 8px;
  }
  .step3,
  .step4 {
    padding-top: 15px;
    .contentBody {
      max-width: 900px;
      .button {
        margin-top: 10px;
        .el-button {
          margin-left: 0;
        }
        .el-button:not(:last-child) {
          margin-right: 40px;
          margin-bottom: 10px;
        }
      }
    }
  }
  .step3 {
    .contentBody {
      width: 80%;
    }
  }
  .step4 {
    .contentBody {
      line-height: 2.3;
      h2 {
        i {
          margin-right: 8px;
          position: relative;
          top: 3px;
          color: @success;
          font-size: 30px;
        }
      }
      & > div {
        padding-left: 38px;
      }
      .button {
        margin-top: 18px;
      }
    }
  }
  .result {
    overflow: visible;
    .el-table {
      margin-bottom: 15px;
    }
    .right {
      .el-button {
        margin-right: 20px;
      }
      .currentTotal {
        margin-top: 12px;
      }
    }
  }
}
</style>
