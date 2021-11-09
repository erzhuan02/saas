<template>
  <div id="orderDetails">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/finOrderMange' }">{{
        $t('home.nav71')
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('button.details') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="num">
      <i>{{ $t('order.orderNum') }}：</i> {{ tableData.orderId }}
      <el-button type="primary" class="btnClr" @click="toPay" v-show="showCountDown" v-if="button.pay">{{ $t('button.toPay') }}</el-button>
    </div>
    <div class="surplus">
      <el-button v-show="showCountDown & !isVisualSafe" class="btn" type="primary">{{ $t('time.surplus') }}{{ m }}{{ $t('time.min') }}{{ s
        }}{{ $t('time.sec') }}</el-button>
      <span>{{ $t('order.orderStatus') }}：{{ status }}</span>
    </div>
    <p class="ps" v-show="showCountDown & !isVisualSafe">{{ $t('order.ps1') }}</p>
    <ul v-show="showCountDown">
      <li>{{ $t('order.payable1') }}：￥{{ tableData.paymentAmount | decimal2 }}</li>
      <!-- <li v-show="showData">{{ $t('account.createTime') }}：{{list[0].createTime}}</li> -->
      <li v-show="showData" v-if="list.length == 1">
        {{ $t('order.orderType') }}：
        <!-- 1.新购 2.续费 3.后付费 -->
        <span>{{ $t(`order.orderType${orderType}`) }}</span>
        <!-- <span v-if="orderType == 1">新购</span>
        <span v-if="orderType == 2">续费</span>
        <span v-if="orderType == 3">后付费</span> -->
      </li>
    </ul>
    <div class="result clearfix">
      <el-table class="detailsTable" stripe border :data="list" max-height="578" highlight-current-row>
        <el-table-column prop="createTime" :label="$t('account.createTime')"></el-table-column>
        <el-table-column prop="productName" :label="$t('order.productName')"></el-table-column>
        <el-table-column :label="$t('order.shopNum')">
          <template slot-scope="scope">
            <span>{{ scope.row.shopNumb | toRung(0) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="orderType === 3" :label="$t('order.unitPrice') + `(￥)`">
          <template slot-scope="scope">
            <span>￥{{ scope.row.trafficPrice }}/GB</span>
          </template>
        </el-table-column>
        <el-table-column v-if="orderType === 3" prop="ext2" :label="$t('order.usedTraffic')"></el-table-column>
        <el-table-column :label="$t('order.specification')">
          <template slot-scope="scope">
            <span v-if="scope.row.productId == 6">{{ scope.row.userNumb | toRung(2) }}</span>
            <span v-else>{{ scope.row.pointNumb | toRung(1) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="billingCycle" :label="$t('order.billingModel')">
          <template slot-scope="scope">
            <!-- billingModel1: '包月',billingModel2: '永久',billingModel3: '按月结算' -->
            <span v-if="scope.row.orderType === 3">{{ $t('order.billingModel3') }}</span>
            <span v-else-if="scope.row.billingCycle === 1">{{ $t('order.billingModel1') }}</span>
            <span v-else>{{ $t('order.billingModel2') }}</span>
          </template>
          <!-- <template slot-scope="scope">
            <div v-if="scope.row.orderType === 3">按月结算</div>
            <div v-else>
              <span v-if="scope.row.billingCycle === 1">包月</span>
              <span v-else>永久</span>
            </div>
          </template> -->
        </el-table-column>
        <el-table-column prop="validityPeriod" :label="$t('time.startAndStop')">
          <template slot-scope="scope">
            <div v-if="scope.row.orderType === 3">
              <span v-if="scope.row.startTime === null || scope.row.endTime === null">-</span>
              <span v-else>{{ scope.row.startTime }} ~ {{scope.row.endTime}}</span>
            </div>
            <div v-else>
              <span v-if="scope.row.confirmTime === null || scope.row.endTime === null">-</span>
              <span v-else>{{ scope.row.confirmTime }} ~ {{scope.row.endTime}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" :label="$t('order.consumptions')">
          <template slot-scope="scope">
            <span>{{scope.row.totalAmount | decimal2}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { setTimeout, clearTimeout } from 'timers'
export default {
  data() {
    return {
      tableData: [],
      showCountDown: true,
      showData: true,
      m: 0,
      s: 0,
      data: {},
      list: [],
      joinOrder: '',
      status: '', // 订单状态
      t: '',
      now: 0, // 当前时间
      menuItem: [],
      orderType: '',
      button: {},
      isVisualSafe: false
    }
  },
  created() {
    this.joinOrder = sessionStorage.getItem('joinOrder')
  },
  mounted() {
    if (this.$route.query.type == 1) {
      this.orderId = sessionStorage.getItem('orderId')
      this.getJoinOrder(this.orderId, this.joinOrder)
    } else {
      this.data = JSON.parse(sessionStorage.getItem('PAY_MES'))
      this.getJoinOrder(this.data.orderId, this.joinOrder)
    }
    setTimeout(() => {
      this.countTime()
    }, 200)
    // 强制给左侧导航加class保持高亮
    this.$nextTick(() => {
      this.$utils.getButton('/finOrderMange', 1).then(res => {
        this.button = res
      })
      this.menuItem = document.getElementsByClassName('el-menu-item')
      for (let i of this.menuItem) {
        if (i.innerText == '订单管理' || i.innerText == 'Order MGT') {
          i.classList.add('is-active')
        }
      }
    })
  },
  methods: {
    // 点击去支付
    toPay() {
      sessionStorage.setItem('PAY_MES', JSON.stringify(this.tableData))
      this.$router.push('payInfo')
    },
    countTime() {
      var _this = this
      // 获取系统时间
      // _this.$api.GetSysDate()
      _this.$http.gets('getSysDate', { data: Math.random() })
        .then(res => {
          _this.now = res.data || 0
          // 设置截止时间
          // var endDate = Date.parse(this.tableData.paymentEndTime.replace(/-/g, '/'))
          var endTime = new Date(_this.tableData.paymentEndTime.replace(/-/g, '/').replace(/T|Z/g, ' ').trim())
          var endDate = endTime.getTime()
          // 时间差
          var leftTime = endDate - _this.now
          if (leftTime > -1) {
            _this.m = Math.floor((leftTime / 1000 / 60) % 60)
            _this.s = Math.floor((leftTime / 1000) % 60)
          }
        }).catch(er => {
          console.log(er)
        })
      if (_this.showCountDown) {
        _this.t = setTimeout(_this.countTime, 1000)
      }
    },
    // 订单信息
    getJoinOrder(orderId, joinOrder) {
      this.$http.posts('getJoinOrderDetail', '', { orderId, joinOrder }, false)
        .then(res => {
          this.tableData = res.data
          this.list = this.tableData.orders || []
          this.list.forEach((val, i) => {
            if (val.orderType == 3) {
              this.isVisualSafe = true
              clearTimeout(this.t)
            }
            if (this.$route.query.type == 2) {
              // 支付成功来
              this.showCountDown = false
              this.status = '支付成功'
            } else if (this.$route.query.type == 3) {
              // 支付过程中来
              this.status = '待支付'
              this.showData = false
            } else {
              // 单个详情来
              this.status = sessionStorage.getItem('status')
              if (this.status == '订单取消' || this.status == '支付成功' || this.status == '订单退订') {
                this.showCountDown = false
                clearTimeout(this.t)
              }
            }
          })
          this.orderType = this.list[0].orderType
        })
    }
  },
  beforeDestroy() {
    clearTimeout(this.t)
    for (let i of this.menuItem) {
      if (i.innerText == '订单管理' || i.innerText == 'Order MGT') {
        i.classList.remove('is-active')
      }
    }
  }
}
</script>

<style lang="less" scoped>
#orderDetails {
  i {
    font-style: normal;
  }
  .breadcrumb {
    padding-top: 15px;
  }
  .num {
    margin-top: 20px;
    i {
      font-weight: bold;
    }
    .btnClr {
      margin-left: 20px;
    }
  }
  .surplus {
    margin: 30px 0;
    .btn {
      background: #ffcc33;
      border: solid 1px #ffcc33;
      margin-right: 20px;
    }
    span {
      color: #f00;
      font-weight: bold;
    }
  }
  .ps {
    font-size: 14px;
    color: #ccc;
    margin-bottom: 30px;
  }
  ul {
    width: auto;
    height: auto;
    overflow: hidden;
    li {
      float: left;
      margin-right: 30px;
    }
  }
  .detailsTable {
    margin-top: 50px;
  }
}
</style>
