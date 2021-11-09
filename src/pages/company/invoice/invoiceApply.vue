<template>
  <div id="invoiceApply">
    <div class="top">
      <div class="backTo">
        <router-link to="/comInvoice"><span><i class="el-icon-arrow-left"></i> {{ $t('invoice.back') }}</span></router-link>
      </div>
      <h3 class="apply">{{ $t('invoice.apply') }}</h3>
      <el-steps class="steps" :active="activeStep" process-status="wait" align-center>
        <el-step :title="$t('invoice.step1')"></el-step>
        <el-step :title="$t('invoice.step2')"></el-step>
        <el-step :title="$t('invoice.step3')"></el-step>
      </el-steps>
    </div>
    <div class="step" v-show="activeStep === 1">
      <div class="step1Form">
        <el-form ref="queryForm" :model="queryForm" label-width="120px" class="clearfix" :rules="queryFormRules">
          <el-form-item>
            <p>
              {{ $t('invoice.canApply') }}
              <b style="color: #f00">￥{{canApplyAmount}}</b>
            </p>
          </el-form-item>
          <el-form-item prop="thisApplyAmount" :label="$t('invoice.thisApply')">
            <el-input v-model="queryForm.thisApplyAmount" disabled></el-input>
          </el-form-item>
        </el-form>
        <div class="result clearfix" v-loading="listLoading">
          <el-table ref="resultTable" class="overflowTable" stripe border @selection-change="handleSelectionChange" max-height="650" :data="list" highlight-current-row>
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="orderId" :label="$t('common.orderNo')"></el-table-column>
            <el-table-column prop="orderType" :label="$t('order.orderType')">
              <span slot-scope="scope">{{ $t(`order.orderType${scope.row.orderType}`) }}</span>
            </el-table-column>
            <el-table-column prop="productName" :label="$t('common.productName')"></el-table-column>
            <el-table-column prop="paymentAmount" :label="$t('unsubscribe.payAmount') + '(￥)'"></el-table-column>
            <el-table-column prop="createTime" :label="$t('common.createTime')"></el-table-column>
          </el-table>
          <div class="currentTotal">
            {{ $t('common.currentPage') }} {{ list.length }}
            {{ $t('common.unit') }}
          </div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
        </div>
        <div class="flex-hc">
          <el-button type="primary" @click="handleNextStep">{{ $t('button.next') }}</el-button>
          <el-button type="primary" class="resetCancel" @click="handlePrevStep(1)">{{ $t('button.cancel') }}</el-button>
        </div>
      </div>
    </div>
    <div class="step step2" v-show="activeStep === 2">
      <h4>{{ $t('invoice.totalInvoice') }}: ￥{{queryForm.thisApplyAmount}}</h4>
      <div class="invoiceInfo">
        <p>
          {{ $t('invoice.headUpType') }}:
          <span v-if="invoiceInfoShow.headType === 1">{{ $t('invoice.personal') }}</span>
          <span v-else-if="invoiceInfoShow.headType === 2">{{ $t('invoice.enterprise') }}</span>
          <span v-else>-</span>
        </p>
        <p>
          {{ $t('invoice.invoiceType') }}:
          <span v-if="invoiceInfoShow.invoiceType === 1">{{ $t('invoice.ordInvoice') }}</span>
          <span v-else-if="invoiceInfoShow.invoiceType === 2">{{ $t('invoice.specialInvoice') }}</span>
          <span v-else>-</span>
        </p>
        <p>
          {{ $t('invoice.invoiceTT') }}: {{invoiceInfoShow.invoiceHead}}
        </p>
        <p v-show="invoiceInfoShow.headType === 2">
          {{ $t('invoice.taxNumb') }}: {{invoiceInfoShow.taxNumber}}
        </p>
        <p v-show="invoiceInfoShow.headType === 2 && invoiceInfoShow.invoiceType === 2">
          {{ $t('invoice.bankName') }}: {{invoiceInfoShow.bankBranch}}
        </p>
        <p v-show="invoiceInfoShow.headType === 2 && invoiceInfoShow.invoiceType === 2">
          {{ $t('invoice.accountOpening') }}: {{invoiceInfoShow.bankAccount}}
        </p>
        <p v-show="invoiceInfoShow.headType === 2 && invoiceInfoShow.invoiceType === 2">
          {{ $t('realName.enterLocation') }}: {{invoiceInfoShow.area}}
        </p>
        <p v-show="invoiceInfoShow.headType === 2 && invoiceInfoShow.invoiceType === 2">
          {{ $t('common.address') }}: {{invoiceInfoShow.coAddress}}
        </p>
        <p v-show="invoiceInfoShow.headType === 2 && invoiceInfoShow.invoiceType === 2">
          {{ $t('common.tel') }}: {{invoiceInfoShow.coPhoneNumb}}
        </p>
      </div>
      <h4>{{ $t('invoice.selectBillingInfo') }}</h4>
      <div class="selectInfo pointer" @click="handleOpenDialog('invoice')">
        <i class="el-icon-plus"></i>
        <p>{{ $t('invoice.selectBillingInfo') }}</p>
      </div>
      <h4>{{ $t('invoice.chooseAddr') }}</h4>
      <div class="flex">
        <div class="selectAddr bgblue" style="border: none;margin-right: 20px">
          <div class="flex-hb">
            <p class="fs14 one-txt-cut" :title="addrInfoShow.area">{{addrInfoShow.area}}</p>
            <p class="fs12 def" v-if="addrInfoShow.isDefault === 1">{{ $t('invoice.default') }}</p>
          </div>
          <p class="fs12 one-txt-cut addr" :title="addrInfoShow.address + $t('invoice.receive')">{{addrInfoShow.address}} {{ $t('invoice.receive') }}</p>
          <hr>
          <div class="flex-hb">
            <p class="fs12 one-txt-cut" :title="addrInfoShow.receiver + ' ' + addrInfoShow.phoneNumb">{{addrInfoShow.receiver}} {{addrInfoShow.phoneNumb}}</p>
          </div>
        </div>
        <div class="selectInfo pointer" @click="handleOpenDialog('addr')">
          <i class="el-icon-plus"></i>
          <p>{{ $t('invoice.chooseAddr') }}</p>
        </div>
      </div>
      <div class="right">
        <el-button type="primary" @click="handlePrevStep">{{ $t('button.prev') }}</el-button>
        <el-button type="primary" @click="handleNextStep">{{ $t('button.applyBilling') }}</el-button>
      </div>
    </div>
    <div class="step step3" v-show="activeStep === 3">
      <div class="result flex-hc">
        <div class="contentBody">
          <h2><i class="el-icon-success"></i>{{ $t('invoice.applyComplete') }}</h2>
          <div class="button">
            <router-link to="/comInvoice">
              <el-button>{{ $t('button.backInvoiceList') }}</el-button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择开票信息 -->
    <el-dialog class="dlgWidthAuto" :title="$t('invoice.selectBill')" :visible.sync="invoiceDialogVisible" :close-on-click-modal="false">
      <div class="flex-w">
        <div v-for="(item, index) in invoiceInfo" :key="index">
          <div :class="item.currInfo ? 'selectBill checked' : 'selectBill'" @click="changeInfo('invoice', index)">
            <p class="head" v-if="item.invoiceType === 2">{{ $t('invoice.VAT2Invoice') }}:</p>
            <p class="head" v-if="item.invoiceType === 1">{{ $t('invoice.VAT1Invoice') }}:</p>
            <span v-if="item.isDefault === 1">{{ $t('invoice.default') }}</span>
            <ul>
              <li class="one-txt-cut">{{ $t('invoice.invoiceTT') }}: {{item.invoiceHead}}</li>
              <li class="one-txt-cut">
                {{ $t('invoice.taxNumb') }}: {{item.taxNumber || '--'}}
              </li>
              <li class="one-txt-cut">
                {{ $t('invoice.bankName') }}: {{item.bankBranch || '--'}}
              </li>
              <li class="one-txt-cut">
                {{ $t('invoice.accountOpening') }}: {{item.bankAccount || '--'}}
              </li>
              <li class="one-txt-cut">
                {{ $t('realName.enterLocation') }}: {{item.area || '--'}}
              </li>
              <li class="one-txt-cut">
                {{ $t('common.address') }}: {{item.coAddress || '--'}}
              </li>
              <li class="one-txt-cut">
                {{ $t('common.tel') }}: {{item.coPhoneNumb || '--'}}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="invoiceDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="fixInfo('invoice')">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 选择地址 -->
    <el-dialog class="dlgWidthAuto" :title="$t('invoice.selectAddr')" :visible.sync="addrDialogVisible" :close-on-click-modal="false">
      <div class="flex-w">
        <div v-for="(item, index) in addrInfo" :key="index">
          <div :class="item.currInfo ? 'selectAddr checked' : 'selectAddr'" @click="changeInfo('addr', index)">
            <div class="flex-hb">
              <p class="fs14 one-txt-cut" :title="item.area">{{item.area}}</p>
              <p class="fs12 def" v-if="item.isDefault === 1" style="color:#f00">{{ $t('invoice.default') }}</p>
            </div>
            <p class="fs12 one-txt-cut addr" :title="item.address + $t('invoice.receive')">{{item.address}} {{ $t('invoice.receive') }}</p>
            <hr>
            <p class="fs12 one-txt-cut" :title="item.receiver + ' ' + item.phoneNumb">{{item.receiver}} {{item.phoneNumb}}</p>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addrDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="fixInfo('addr')">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $utils from '@/utils'
export default {
  data() {
    return {
      activeStep: 1,
      canApplyAmount: 0, // 可开票金额
      queryForm: {
        thisApplyAmount: 0 // 申请开票金额
      },

      // 当前表格的查询条件
      realQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      list: [],
      total: 0,
      selection: [],
      listLoading: false,
      orderIds: [],

      invoiceInfo: [], // 所有信息集合
      invoiceInfoShow: {}, // 展示的集合
      currinvoiceInfo: {}, // 当前选中的集合
      addrInfo: [],
      addrInfoShow: {},
      curraddrInfo: {},

      infoId: '',
      addrId: '',

      hasDef1: false, // 是否有默认信息
      hasDef2: false,

      invoiceDialogVisible: false,
      addrDialogVisible: false
    }
  },
  computed: {
    // 查询验证规则
    queryFormRules() {
      return {
        thisApplyAmount: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (value < 1000 || value > this.canApplyAmount) {
                callback(new Error(this.$t('invoice.msg1')))
              }
              if (!this.$utils.reg.twoDecimal.test(value)) {
                callback(new Error(this.$t('message.inputRight')))
              }
              callback()
            }
          }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  mounted() { },
  methods: {
    init() {
      this.$http.posts('getInvoiceBalance')
        .then(res => {
          let data = res.data
          this.canApplyAmount = data.availableAmount || 0
          this.getList()
        })
    },
    // 获取开票信息
    getInvoiceInfo() {
      this.$http.posts('invoiceInfoList')
        .then(res => {
          this.hasDef1 = false
          let data = res.data.list || []
          if (data === []) this.invoiceInfoShow = []
          data.forEach(item => {
            if (item.coPhoneNumb) {
              let pho = item.coPhoneNumb.split('+')
              item.coPhoneNumb = '+' + pho[0] + pho[1]
            }
            if (item.isDefault === 1) {
              this.hasDef1 = true
              this.invoiceInfoShow = item
              data[0].currInfo = false
              item.currInfo = true
            }
            if (!this.hasDef1) {
              this.invoiceInfoShow = data[0]
              data[0].currInfo = true
            }
          })
          this.invoiceInfo = data
        })
        .catch(er => {
          this.invoiceInfo = []
        })
    },
    // 获取地址信息
    getAddrInfo() {
      this.$http.posts('getDeliveryAddrList')
        .then(res => {
          this.hasDef2 = false
          let data = res.data || []
          if (data === []) this.addrInfoShow = []
          data.forEach(item => {
            if (item.phoneNumb) {
              let pho = item.phoneNumb.split('+')
              item.phoneNumb = '+' + pho[0] + pho[1]
            }
            if (item.isDefault === 1) {
              this.hasDef2 = true
              this.addrInfoShow = item
              data[0].currInfo = false
              item.currInfo = true
            }
            if (!this.hasDef2) {
              this.addrInfoShow = data[0]
              data[0].currInfo = true
            }
          })
          this.addrInfo = data
        })
        .catch(er => {
          this.addrInfo = []
        })
    },
    // 改变信息
    changeInfo(type, index) {
      let info = [...this[`${type}Info`]]
      info.forEach((item, idx) => {
        if (index === idx) {
          item.currInfo = true
          this[`curr${type}Info`] = item
        } else {
          item.currInfo = false
        }
      })
      this[`${type}Info`] = info
    },
    // 修改信息
    fixInfo(type) {
      let d = Object.keys(this[`curr${type}Info`])
      if (d.length !== 0) {
        this[`${type}InfoShow`] = this[`curr${type}Info`]
      }
      this[`${type}DialogVisible`] = false
    },
    // 对话框打开
    handleOpenDialog(type) {
      this[`${type}DialogVisible`] = true
    },
    // 下一步
    handleNextStep() {
      if (this.activeStep === 1) {
        this.$refs.queryForm.validate((valid) => {
          if (valid) {
            this.activeStep = 2
            this.getInvoiceInfo()
            this.getAddrInfo()
          }
        })
      } else if (this.activeStep === 2) {
        if (!this.addrInfoShow.addrId) {
          this.$utils.$message({
            message: this.$t('code.S00181'),
            type: 'error'
          })
          return
        }
        if (!this.invoiceInfoShow.infoId) {
          this.$utils.$message({
            message: this.$t('code.S00179'),
            type: 'error'
          })
          return
        }
        let data = {
          amount: this.queryForm.thisApplyAmount,
          infoId: this.invoiceInfoShow.infoId,
          addrId: this.addrInfoShow.addrId,
          orderIds: this.orderIds
        }
        this.$http.posts('applyInvoice', data, '', { showSuccessMsg: false, showErrorMsg: true })
          .then(res => {
            this.activeStep = 3
          })
      }
    },
    // 上一步
    handlePrevStep(type) {
      if (type === 1) {
        this.$router.push('/comInvoice')
      } else {
        this.activeStep--
      }
    },
    // 获取列表
    getList() {
      this.listLoading = true
      this.$http.posts('getOrderList', this.realQuery, '', { showSuccessMsg: false, showErrorMsg: true })
        .then(res => {
          this.listLoading = false
          let data = res.data.list || []
          this.list = data
          this.total = res.data.total || 0
        })
        .catch(er => {
          this.listLoading = false
          this.list = []
          this.total = 0
        })
    },
    // 多选选中
    handleSelectionChange(val) {
      this.queryForm.thisApplyAmount = 0
      this.orderIds = []
      this.selection = val
      this.selection.forEach(item => {
        this.queryForm.thisApplyAmount = item.paymentAmount + this.queryForm.thisApplyAmount
        this.orderIds.push(item.orderId)
      })
    },
    // 一页显示多少条
    handleSizeChange(val) {
      this.queryForm.thisApplyAmount = 0
      this.realQuery.pageSize = val
      this.getList()
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.queryForm.thisApplyAmount = 0
      this.realQuery.pageNumber = val
      this.getList()
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#invoiceApply {
  padding: 0 !important;
  background-color: @background;
  .step1Form {
    padding: 50px 0;
    form {
      width: 50%;
      margin: auto;
    }
  }
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
    }
  }
  .step {
    padding: 0 8px;
    background-color: #fff;
  }
  .step2 {
    padding: 10px 0 20px 10%;
    h4 {
      padding: 20px 0;
    }
    .invoiceInfo {
      line-height: 1.8;
    }
    .selectInfo {
      width: 180px;
      height: 80px;
      background: @background;
      color: @text5;
      text-align: center;
      i {
        font-size: 30px;
        padding-top: 12px;
      }
    }
  }
  .step3 {
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
  .right {
    margin-top: 20px;
    .el-button {
      margin-right: 20px;
    }
  }
  .bgblue {
    background: @background1;
    color: #fff;
  }
  .selectBill {
    position: relative;
    padding: 10px;
    width: 280px;
    height: 225px;
    border: solid 2px @border;
    margin: 0 15px 15px 0;
    &.checked {
      border: solid 3px @main;
    }
    p.head {
      line-height: 2;
    }
    span {
      color: #f00;
      position: absolute;
      right: 15px;
      top: 12px;
    }
    ul {
      li {
        line-height: 1.8;
      }
    }
  }
  .selectAddr {
    width: 180px;
    height: 80px;
    padding: 5px;
    border: solid 2px @border;
    margin: 0 15px 15px 0;
    .def {
      width: 40px;
      text-align: right;
    }
    &.checked {
      border: solid 3px @main;
    }
  }
}
</style>
