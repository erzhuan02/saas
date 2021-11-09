<template>
  <div id="refundOrder">
    <!-- list -->
    <div v-if="page == 'list'">
      <div class="tips">
        <p>{{ $t('unsubscribe.reminder') }}：</p>
        <p>1.{{ $t('unsubscribe.reminder1') }}</p>
        <p>2.{{ $t('unsubscribe.reminder2') }}</p>
        <p>3.{{ $t('unsubscribe.reminder3') }}</p>
        <p>4.{{ $t('unsubscribe.reminder4') }}</p>
      </div>
      <!-- 表格 -->
      <div class="result clearfix">
        <el-table class="audited" ref="resultTable" stripe border max-height="560" :data="tableData" style="width: 100%;" highlight-current-row>
          <el-table-column prop="orderId" :label="$t('order.orderNum')"></el-table-column>
          <el-table-column prop="productName" :label="$t('order.productName')"></el-table-column>
          <el-table-column :label="$t('order.specification')">
            <template slot-scope="scope">
              <span v-if="scope.row.productType == 1">{{ scope.row.pointNumb | toRung(1) }}</span>
              <span v-else>{{ scope.row.userNumb | toRung(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="shopNumb" :label="$t('order.shopNum')"></el-table-column>
          <el-table-column prop="confirmTime" :label="$t('account.createTime')"></el-table-column>
          <el-table-column prop="endTime" :label="$t('resource.dueTime')">
            <template slot-scope="scope">
              <span>{{ scope.row.expireDateNum}}{{ $t('expend.dueIn') }}({{ scope.row.endTime | toRung(0) }})</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.operation')">
            <template slot-scope="scope">
              <div class="flex-hcvc">
                <el-button size="mini" type="primary" @click="examine(scope)" plain v-if="button.unsubscribe">{{ $t('button.unsubscribe') }}</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="currentTotal" v-if="tableData == null || tableData == []">{{ $t('common.currentPage') }} 0 {{ $t('common.unit') }}</div>
        <div class="currentTotal" v-else>{{ $t('common.currentPage') }} {{tableData.length}} {{ $t('common.unit') }}</div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="paging.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="paging.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
      </div>
    </div>
    <!-- details -->
    <div v-if="page == 'details'">
      <span class="toBack pointer" @click="backToList">
        <i class="el-icon-back"></i>
        {{ $t('button.back') }}
      </span>
      <div class="result clearfix">
        <el-table class="audited" ref="resultTable" stripe border max-height="560" :data="detailData" style="width: 100%;" highlight-current-row>
          <el-table-column prop="productName" :label="$t('order.productName')"></el-table-column>
          <el-table-column :label="$t('unsubscribe.productGG')" width="80%">
            <template slot-scope="scope">
              <span v-if="scope.row.productType == 1">{{ scope.row.pointNumb | toRung(1) }}</span>
              <span v-else>{{ scope.row.userNumb | toRung(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="endTime" :label="$t('time.startAndStop')" width="330%"></el-table-column>
          <el-table-column prop="useAmount" :label="$t('unsubscribe.consumed')"></el-table-column>
          <el-table-column prop="serviceCharge" :label="$t('unsubscribe.charge')"></el-table-column>
          <el-table-column prop="unRegAmount" :label="$t('unsubscribe.unsubAmount')"></el-table-column>
        </el-table>
      </div>
      <p class="title">
        <span>*</span>
        {{ $t('unsubscribe.selectUnsubReason') }}
      </p>
      <el-radio-group v-model="radio" class="radios">
        <el-radio :label="$t('unsubscribe.reason1')">{{ $t('unsubscribe.reason1') }}</el-radio>
        <el-radio :label="$t('unsubscribe.reason2')">{{ $t('unsubscribe.reason2') }}</el-radio>
        <el-radio :label="$t('unsubscribe.reason3')">{{ $t('unsubscribe.reason3') }}</el-radio>
        <el-radio :label="4">
          {{ $t('common.others') }}
          <el-input class="reasonInput" v-model="otherReason" :placeholder="$t('placeholder.input')" :disabled="canWrite"></el-input>
        </el-radio>
      </el-radio-group>
      <div class="flex-hr amount">{{ $t('unsubscribe.payAmount') }} ￥{{detailData[0].paymentAmount}}</div>
      <div class="flex-hr amount">{{ $t('unsubscribe.consumed1') }} ￥{{detailData[0].useAmount}}</div>
      <div class="flex-hr amount">{{ $t('unsubscribe.charge1') }} ￥{{detailData[0].serviceCharge}}</div>
      <div class="flex-hr amount amount1">{{ $t('unsubscribe.unsubAmount1') }}<span>￥{{detailData[0].unRegAmount}}</span></div>
      <div class="flex-hr amount">
        <el-button class="red" @click="toUnsub">{{ $t('button.unsubscribe') }}</el-button>
      </div>
    </div>
    <!-- success -->
    <div v-if="page == 'success'" class="successPage">
      <p class="message2 flex-hcvc">
        <i class="el-icon-success"></i>
        {{ $t('unsubscribe.message2') }}
      </p>
      <p>{{ $t('unsubscribe.message3') }}</p>
      <el-button class="back" @click="backToList" type="primary">{{ $t('button.back') }}</el-button>
    </div>
    <!-- 退订二次确认对话框 -->
    <el-dialog :title="$t('dialog.tips')" :visible.sync="dialogVisible" width="30%">
      <span>{{ $t('unsubscribe.tips1') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="sureToUnsub" :disabled="clickflag">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $utils from '@/utils'
export default {
  data() {
    return {
      clickflag: false,
      page: 'list', // list-details-success
      paging: {
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      total: 10, // 总条数
      tableData: [],
      detailData: [],
      productType: '',
      params: {}, // 查询参数
      selected: [],
      radio: '',
      otherReason: '',
      unRegReason: '',
      canWrite: true,
      dialogVisible: false
    }
  },
  props: ['button'],
  watch: {
    radio(val) {
      if (val == 4) {
        this.canWrite = false
      } else {
        this.canWrite = true
      }
    }
  },
  mounted() {
    this.page = 'list'
    this.getList()
  },
  methods: {
    // 一页显示多少条
    handleSizeChange(val) {
      this.paging.pageNumber = 1
      this.paging.pageSize = val
      this.getList()
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.paging.pageNumber = val
      this.getList()
    },
    // 点击操作
    examine(scope) {
      // 初始化退订原因
      this.radio = ''
      this.otherReason = ''
      this.detailData = []
      this.$http.posts('getUnregResourceDetail', '', { orderId: scope.row.orderId, isUnreg: 1 }, { showSuccessMsg: false, showErrorMsg: true })
        .then(res => {
          this.page = 'details'
          let data = res.data
          this.detailData.push(data)
          this.detailData.forEach(e => {
            // 起止时间
            e.endTime = e.confirmTime + '~' + e.endTime
          })
        })
    },
    // 点击退订
    toUnsub() {
      if (this.radio == 4) {
        this.unRegReason = this.otherReason
      } else {
        this.unRegReason = this.radio
      }
      if (this.unRegReason == '') {
        this.$utils.$message({
          message: this.$t('unsubscribe.message1'),
          type: 'error'
        })
        return
      }
      this.dialogVisible = true
    },
    // 确认退订
    sureToUnsub: $utils.debounce(function () {
      this.clickflag = true
      this.params = {
        orderId: this.detailData[0].orderId,
        unRegReason: this.unRegReason,
        unRegAmount: this.detailData[0].unRegAmount
      }
      this.$http.posts('addOrderUnReg', this.params, '', true)
        .then(res => {
          this.page = 'success'
          this.dialogVisible = false
          this.clickflag = false
        })
        .catch(er => {
          this.dialogVisible = false
          this.clickflag = false
        })
    }),
    // 点击返回
    backToList() {
      this.page = 'list'
      this.getList()
    },
    getList() {
      this.$http.posts('getCusUnregOrder', this.paging, '', false)
        .then(res => {
          // if (res.data.resCode === 0) {
          let data = res.data
          this.total = data.total
          if (data.list !== null) {
            this.productType = data.list[0].productType
            this.tableData = data.list
          } else {
            this.tableData = []
          }
          // } else {
          //   this.$utils.$message({
          //     message: res.data.resMsg,
          //     type: 'error'
          //   })
          // }
        })
      // .catch(er => {
      //   console.log(er)
      // })
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#refundOrder {
  position: relative;
  min-height: calc(100vh - 186px);
  .tips {
    background: @background;
    width: 98%;
    height: auto;
    margin: 5px auto 15px;
    border-radius: 8px;
    padding: 20px;
  }
  .title {
    padding-left: 20px;
    span {
      color: #f00;
    }
  }
  .radios {
    padding: 20px 30px;
    .reasonInput {
      margin-left: 10px;
    }
  }
  .amount {
    padding: 10px 60px 0 0;
    .red {
      background: #f00;
      color: #fff;
    }
  }
  .amount1 {
    line-height: 46px;
    span {
      color: #f00;
      font-size: 26px;
    }
  }
  .toBack {
    padding: 10px;
  }
  .successPage {
    text-align: center;
    i {
      color: #008000;
      font-size: 40px;
      margin-right: 10px;
    }
    .back {
      margin: 30px;
    }
    .message2 {
      font-size: 24px;
      padding: 50px 0 30px;
    }
  }
}
</style>
