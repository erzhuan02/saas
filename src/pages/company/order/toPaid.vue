<template>
  <div id="toPaid">
    <!-- 查询结果 -->
    <div class="result clearfix">
      <el-table class="audited" ref="resultTable" stripe border max-height="650" :data="tableData" v-loading="loading" style="width: 100%;" @selection-change="handleSelectionChange" highlight-current-row>
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="orderId" :label="$t('order.orderNum')" width="210"></el-table-column>
        <el-table-column prop="productName" :label="$t('order.productName')"></el-table-column>
        <el-table-column prop="createTime" :label="$t('account.createTime')" width="160"></el-table-column>
        <el-table-column prop="paymentEndTime" :label="$t('order.expirationTime')" width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.orderType === 3">-</span>
            <span v-else>{{ scope.row.paymentEndTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('order.orderStatus')"></el-table-column>
        <el-table-column :label="$t('order.orderType')">
          <!-- 1.新购 2.续费 3.后付费 -->
          <span slot-scope="scope">{{ $t(`order.orderType${scope.row.orderType}`) }}</span>
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.orderType === 1">新购</span>
            <span v-if="scope.row.orderType === 2">续费</span>
            <span v-if="scope.row.orderType === 3">后付费</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="totalAmount" :label="$t('order.orderAmount')"></el-table-column>
        <el-table-column prop="paymentAmount" :label="$t('order.payable')"></el-table-column>
        <el-table-column :label="$t('common.operation')" width="150">
          <template slot-scope="scope">
            <div class="flex-hcvc">
              <el-button size="mini" type="primary" @click="examine(scope.row, 1)" plain v-if="button.cancel" :disabled="scope.row.orderType === 3">{{ $t('button.cancel') }}</el-button>
              <el-button size="mini" type="primary" @click="examine(scope.row, 2)" plain v-if="button.details">{{ $t('button.details') }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">{{ $t('common.currentPage') }} {{ total }} {{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="params.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="params.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <div class="toPay flex-hr">
      <p>{{ $t('order.totalAmount') }}：<span>{{totalCast | decimal2}}</span></p>
      <el-button type="primary" class="btnClr" :disabled="totalCast == 0" @click="toPay" v-if="button.pay">{{ $t('button.toPay') }}</el-button>
    </div>
    <el-dialog :title="$t('dialog.tips')" :visible.sync="dialogCancel" width="30%">
      <span>{{ $t('order.message1') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="toCancel">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
export default {
  data() {
    return {
      clickflag: true,
      // 查询参数
      params: {
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      total: 10, // 总条数
      tableData: [],
      totalCast: 0, // 总金额
      companyId: '',
      selected: [],
      joinOrder: '',
      orderId: '', // 当前操作的orderId
      dialogCancel: false,
      button: {},
      loading: false
    }
  },
  mounted() {
    this.companyId = JSON.parse(sessionStorage.getItem('user')).companyId
    this.params = { ...this.params, companyId: this.companyId, status: 1 }
    this.getOrderList()

    this.$nextTick(() => {
      this.$utils.getButton('/finOrderMange', 1).then(res => {
        this.button = res
      })
    })
  },
  methods: {
    // 点击去支付
    toPay() {
      this.$store.commit('GOODS_INFO', this.selected)
      if (this.selected.length == 1) {
        this.joinOrder = 0
        sessionStorage.setItem('joinOrder', 0)
      } else {
        this.joinOrder = 1
        sessionStorage.setItem('joinOrder', 1)
      }
      let orderId = []
      this.selected.map((e, i) => {
        orderId.push(e.orderId)
      })
      orderId = orderId.join(',')
      this.getJoinOrder(orderId, this.joinOrder, () => {
        this.$router.push('/payInfo')
      })
    },
    // 多选选中
    handleSelectionChange(val) {
      this.selected = val
      this.totalCast = 0
      val.map(e => {
        this.totalCast += Number(e.paymentAmount)
      })
    },
    // 一页显示多少条
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getOrderList()
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.params.pageNumber = val
      this.getOrderList()
    },
    // 点击操作
    examine(row, type) {
      this.orderId = row.orderId
      sessionStorage.setItem('orderId', row.orderId)
      if (type == 1) { // 取消
        this.dialogCancel = true
      } else { // 详情
        sessionStorage.setItem('joinOrder', 0)
        sessionStorage.setItem('status', row.status)
        this.$router.push({
          path: '/finOrderDetails',
          query: {
            type: 1,
            back: 1
          }
        })
      }
    },
    // 确认取消
    toCancel() {
      this.$http.posts('cancelOrder', '', { orderId: this.orderId }, true)
        .then(res => {
          this.getOrderList()
          this.dialogCancel = false
        }).catch((er) => {
          this.dialogCancel = false
        })
    },
    // 获取订单列表
    getOrderList() {
      this.clickflag = false
      this.loading = true
      this.$http.posts('myOrderList', this.params, '', false)
        .then(res => {
          this.clickflag = true
          this.loading = false
          let data = res.data || {}
          this.total = data.total || 0
          let list = data.list || []
          list.forEach(e => {
            if (e.status == 1) {
              e.status = '待支付'
            } else if (e.status == 2) {
              e.status = '支付成功'
            } else {
              e.status = '订单取消'
            }
          })
          this.tableData = list
        }).catch((er) => {
          this.clickflag = true
          this.loading = false
        })
    },
    // 拼接订单
    getJoinOrder(orderId, joinOrder, callback) {
      this.$http.posts('joinOrderId', '', { orderId, joinOrder })
        .then(res => {
          let data = res.data
          sessionStorage.setItem('PAY_MES', JSON.stringify(data))
          callback()
        })
    }
  }
}
</script>

<style lang="less">
#toPaid {
  position: relative;
  min-height: calc(100vh - 136px);
  .toPay {
    width: 100%;
    height: 55px;
    border-top: solid 1px grey;
    position: absolute;
    right: 0;
    bottom: 0;
    background: #fff;
    .btnClr {
      margin: 7px 20px;
      height: 40px;
    }
    p {
      font-weight: bold;
      line-height: 56px;
      span {
        color: #f00;
      }
    }
  }
  .result {
    padding: 10px 10px 70px 10px;
  }
}
</style>
