<template>
  <div id="passed">
    <!-- 查询条件 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
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
          <el-button type="primary" icon="el-icon-search" @click="handleQuery()">{{ $t('button.query') }}</el-button>
          <el-button icon="el-icon-refresh-left" @click="handleReset()">{{ $t('button.reset') }}</el-button>
          <el-button type="primary" icon="el-icon-money" @click="openDialog(1)">{{ $t('button.batchVoucher') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询结果 -->
    <div class="result clearfix">
      <el-table class="audited" ref="resultTable" stripe border max-height="560" :data="tableData" v-loading="loading" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange" highlight-current-row>
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" :label="$t('common.no')" width="80" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
        <!-- <el-table-column prop="no" :label="$t('common.no')"></el-table-column> -->
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
        <el-table-column prop="auditStatus" :label="$t('myClients.RealName')" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.auditStatus == 5">{{ $t('basicInfo.noPass') }}</span>
            <span v-if="scope.row.auditStatus == 4">{{ $t('basicInfo.passed') }}</span>
            <span v-if="scope.row.auditStatus == 1">{{ $t('basicInfo.waitAuth') }}</span>
            <span v-if="scope.row.auditStatus == 3 || scope.row.auditStatus == 6">{{ $t('basicInfo.authing') }}</span>
            <span v-if="scope.row.auditStatus == 0 || scope.row.auditStatus == 2">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="agentName" :label="$t('myClients.clerkName')"></el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('common.operation')" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-money" @click="openDialog(scope.row)" plain>{{ $t('button.voucher') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">{{ $t('common.currentPage') }} {{tableData.length}} {{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
      <!-- 发券对话框 -->
      <el-dialog class="dialogVour" :title="multipleSelection.length == 1 ? $t('button.voucher') : $t('button.batchVoucher')" :visible.sync="dialogVisibleVor" @close="closeDialog" :close-on-click-modal="false" :style="toTop ? 'top: -13%' : 'top: 0'">
        <el-tabs v-model="tabActive">
          <!-- 代金券 -->
          <el-tab-pane :label="$t('coupon.coupon')" name="coupon"></el-tab-pane>
          <!-- 抵用券 -->
          <el-tab-pane :label="$t('voucher.voucher')" name="voucher"></el-tab-pane>
        </el-tabs>
        <div class="tabs-content">
          <table class="vou">
            <tr>
              <th v-if="cardType == 1">{{ $t('coupon.tab1_3') }}</th>
              <th v-else>{{ $t('voucher.tab1_1') }}</th>
              <th v-if="cardType == 1">{{ $t('myClients.vorNumber') }}</th>
              <th v-else>{{ $t('voucher.vourNum') }}</th>
              <th>{{ $t('order.totalAmount') }}</th>
              <th>{{ $t('myClients.usedScenes') }}</th>
              <th>{{ $t('myClients.timeLimit') }}</th>
            </tr>
            <tr>
              <td>
                <el-select v-model="faceValue" :placeholder="$t('placeholder.select')">
                  <el-option v-for="item in allAmount" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-input v-model="couponNum" :placeholder="$t('placeholder.input')"></el-input>
              </td>
              <td>
                <el-input v-model="totalAmount" disabled></el-input>
              </td>
              <td>
                <el-select v-if="cardType == 1" v-model="useTypeVal" :placeholder="$t('placeholder.select')">
                  <el-option v-for="item in useType" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-else v-model="useTypeVorVal" :placeholder="$t('placeholder.select')">
                  <el-option v-for="item in useTypeVor" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-date-picker v-model="timeRange" type="datetimerange" class="paswordNoEye" range-separator="-" :picker-options='pickerBeginDateBefore' format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :start-placeholder="$t('time.startTime')" :end-placeholder="$t('time.endTime')">
                </el-date-picker>
              </td>
            </tr>
          </table>
          <p class="name">{{ $t('myClients.msg1') }}</p>
          <div class="tableBox">
            <table class="vou1">
              <tr>
                <th>{{ $t('myClients.clientName') }}</th>
                <th>{{ $t('myClients.accountName') }}</th>
                <th v-if="cardType == 1">{{ $t('myClients.vorNumber') }}</th>
                <th v-else>{{ $t('voucher.vourNum') }}</th>
                <th>{{ $t('order.totalAmount1') }}</th>
                <th>{{ $t('common.operation') }}</th>
              </tr>
              <tr v-for="(item, index) in multipleSelection" :key="index">
                <td>{{ item.companyName }}</td>
                <td>{{ item.contactName }}</td>
                <td>{{ couponNum }}</td>
                <td>{{ totalAmount }}</td>
                <td v-if="multipleSelection.length == 1">-</td>
                <td v-else>
                  <el-button size="mini" type="primary" icon="el-icon-delete" @click="deleteComp(item)" plain>{{ $t('button.delete') }}</el-button>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleVor = false">{{ $t('button.cancel') }}</el-button>
          <el-button type="primary" @click="toVoucher">{{ $t('button.confirm') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $utils from '@/utils'
export default {
  data() {
    return {
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      oneCompany: [],
      tabActive: 'coupon',
      cardType: 1,
      activeQuery: {}, // 当前表格的查询条件

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
        auditStatus: 2,
        pageNumber: 1,
        pageSize: 10
      },

      total: 0, // 分页数据，总条数
      // 查询结果数据
      tableData: [],
      multipleSelection: [],
      dialogVisibleVor: false,
      faceValueCal: '', // 代金券面值-用于计算
      faceValue: '',
      couponNum: 1,
      totalAmount: 0, // 总金额
      useType: [
        {
          label: 'POC测试',
          value: 1
        }
      ],
      useTypeVal: 1,
      useTypeVor: [
        {
          label: '购买抵现',
          value: 2
        }
      ],
      useTypeVorVal: 2,
      allAmount: [],
      timeRange: [],
      isRight: true, // 发券对话框输入是否正确
      companyName: '', // 客户名称
      accountName: '', // 账户名
      toTop: false // 是否需要上移发券的对话框(解决控件闪动)
    }
  },
  mounted() {
    this.getList()
  },
  watch: {
    language() {
      this.getList()
    },
    faceValue(val) {
      this.faceValueCal = val.split('+')[0]
      if (val !== '' && this.isRight) {
        this.totalAmount = this.faceValueCal * this.couponNum
      } else {
        this.totalAmount = 0
      }
    },
    couponNum(val) {
      var notEmptyCo = this.$t('message.passedCouponNotEmpty')
      var notEmptyVor = this.$t('message.passedVoucherNotEmpty')
      var errMsg1 = this.$t('message.passedNumRange')
      var onlyNum = this.$utils.reg.numberDay
      if (val == '') {
        this.$utils.$message({
          type: 'error',
          message: this.cardType == 1 ? notEmptyCo : notEmptyVor
        })
        this.totalAmount = 0
        this.isRight = false
        return
      }
      if (val < 1 || val > 100) {
        this.$utils.$message({
          type: 'error',
          message: errMsg1
        })
        this.totalAmount = 0
        this.isRight = false
        return
      }
      if (!onlyNum.test(val)) {
        this.$utils.$message({
          type: 'error',
          message: errMsg1
        })
        this.isRight = false
      } else {
        this.isRight = true
        if (this.faceValue !== '') {
          this.totalAmount = this.faceValueCal * val
        } else {
          this.totalAmount = 0
        }
      }
    },
    dialogVisibleVor(val) {
      let screenHeight = document.body.clientHeight
      if (val && screenHeight - 430 < 240) {
        this.toTop = true
      } else {
        this.toTop = false
      }
    },
    tabActive(val) {
      this.init()
      if (val == 'coupon') {
        this.cardType = 1
      } else {
        this.cardType = 2
      }
      this.getAllAmount(this.cardType)
    }
  },
  computed: {
    ...mapGetters(['language']),
    queryFormRules() {
      return {
        companyName: [],
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
  methods: {
    init() {
      this.isRight = true
      this.faceValue = ''
      this.couponNum = 1
      this.totalAmount = 0
      this.timeRange = []
    },
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
    // 获取所有代金券面值
    getAllAmount(cardType) {
      this.$http.posts('searchAllVoucher', { cardType: cardType })
        .then(res => {
          let data = res.data || []
          this.allAmount = []
          data.forEach((item) => {
            this.allAmount.push({
              label: item.faceValue,
              value: item.faceValue + '+' + item.faceValueId
            })
          })
        })
    },
    openDialog(data) {
      if (typeof data === 'object') {
        this.multipleSelection = []
        this.multipleSelection.push(data)
      } else {
        if (this.multipleSelection.length == 0) {
          this.$utils.$message({
            type: 'error',
            message: this.$t('message.passedMsg1')
          })
          return
        }
      }
      this.getAllAmount(1)
      this.dialogVisibleVor = true
    },
    // 关闭对话框
    closeDialog() {
      this.tabActive = 'coupon'
      this.cardType = 1
      this.init()
      this.multipleSelection = []
      this.$refs.resultTable.clearSelection()
    },
    deleteComp(data) {
      let id = data.companyId
      this.multipleSelection.forEach((item, idx) => {
        if (item.companyId == id) {
          this.multipleSelection.splice(idx, 1)
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
    // 发券
    toVoucher: $utils.debounce(function () {
      // 代金券/抵用券面值不能为空
      if (this.faceValue == '') {
        this.$utils.$message({
          type: 'error',
          message: this.cardType == 1 ? this.$t('message.passedMsg2') : this.$t('message.passedMsg6')
        })
        return
      }
      // 请输入正确的代金券/抵用券数量
      if (!this.isRight) {
        this.$utils.$message({
          type: 'error',
          message: this.cardType == 1 ? this.$t('message.passedMsg3') : this.$t('message.passedMsg7')
        })
        return
      }
      // 使用场景不能为空
      // if (this.useTypeVal == '') {
      //   this.$utils.$message({
      //     type: 'error',
      //     message: this.$t('message.passedMsg4')
      //   })
      //   return
      // }
      // 时间范围不能为空
      if (this.timeRange.length == 0) {
        this.$utils.$message({
          type: 'error',
          message: this.$t('message.passedMsg5')
        })
        return
      } else {
        let start = this.timeRange[0]
        let end = this.timeRange[1]
        let aYear = 365 * 24 * 3600 * 1000
        let halfYear = 180 * 24 * 3600 * 1000
        let startTime = new Date(start).getTime()
        let endTime = new Date(end).getTime()
        let year = this.tabActive == 'coupon' ? startTime + aYear : startTime + halfYear
        // 开始时间不能等于结束时间
        if (start == end) {
          this.$utils.$message({
            type: 'error',
            message: this.$t('code.S00101')
          })
          return
        }
        // 时间范围: 代金券不能超过一年(365天),抵用券不能超过半年(180天)
        if (endTime > year) {
          this.$utils.$message({
            type: 'error',
            message: this.tabActive == 'coupon' ? this.$t('message.aYear') : this.$t('message.halfYear')
          })
          return
        }
      }
      let companys = []
      this.multipleSelection.forEach(item => {
        companys.push({
          companyId: item.companyId,
          companyName: item.companyName
        })
      })
      let params = {
        cardType: this.cardType,
        companys: companys,
        useType: this.cardType == 1 ? this.useTypeVal : this.useTypeVorVal,
        startTime: this.timeRange[0] || '',
        endTime: this.timeRange[1] || '',
        faceValueId: this.faceValue.split('+')[1],
        amount: this.couponNum,
        totalAmount: this.totalAmount
      }
      this.$http.posts('send', params, '', true)
        .then(res => {
          this.dialogVisibleVor = false
        }).catch(er => {
          this.dialogVisibleVor = false
        })
    }),
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

<style lang="less">
#passed {
  .dialogVour {
    table.vou,
    table.vou1 {
      padding-bottom: 30px;
      th {
        padding: 12px 0;
        color: #909399;
        text-align: center;
      }
      td {
        padding: 0 5px;
      }
    }
    .tableBox {
      width: 100%;
      max-height: 300px;
      overflow-y: scroll;
    }
    table.vou1 {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      th,
      td {
        border: 1px solid #ebeef5;
      }
      td {
        line-height: 50px;
        text-align: center;
      }
    }
    .name {
      font-size: 16px;
      line-height: 30px;
      padding: 10px 0 20px;
      border-top: 1px solid #dcdfe6;
    }
  }
}
</style>
