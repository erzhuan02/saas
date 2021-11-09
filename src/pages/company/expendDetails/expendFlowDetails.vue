<template>
  <div id="orderDetails">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/expendDetails' }">{{ $t('home.nav72') }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('button.details') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <h4 class="num">{{ $t('expend.flow') }}</h4>
    <ul>
      <li>{{ $t('expend.payStatus') }}：
        <!-- 1.待支付 2.支付成功 3.订单取消 4.已退订 5.支付成功 支付成功后过期订单点了删除 6.支付成功 支付成功后点了禁用 -->
        <span>{{ $t(`order.orderStatus${data.status}`) }}</span>
        <!-- <span class="success" v-if="data.paymentMethod === 3">已支付</span>
        <span v-else>
          <span v-if="data.orderType === 3">
            <span class="success" v-if="data.status === 2">已支付</span>
            <span class="error" v-else>待支付</span>
          </span>
          <span v-else>
            <span class="error" v-if="data.status === 1">待支付</span>
            <span class="success" v-else-if="data.status === 2">已支付</span>
            <span v-else-if="data.status === 3">订单取消</span>
            <span v-else>已退订</span>
          </span>
        </span> -->
      </li>
      <li>{{ $t('expend.consumption') }}：￥{{ data.paymentAmount }}</li>
      <li>{{ $t('expend.consumeTime') }}：{{ data.confirmTime }}</li>
      <li>{{ $t('order.orderNum') }}：{{ data.orderId }}</li>
      <li>{{ $t('order.orderType') }}：
        <!-- 1.新购 2.续费 3.后付费 -->
        <span>{{ $t(`order.orderType${data.orderType}`) }}</span>
        <!-- <span v-if="data.orderType == 1">新购</span>
        <span v-if="data.orderType == 2">续费</span>
        <span v-if="data.orderType == 3">后付费</span> -->
      </li>
    </ul>
    <el-table class="detailsTable" ref="resultTable" stripe border :data="list" max-height="578" style="width: 100%;" highlight-current-row>
      <el-table-column prop="confirmTime" :label="$t('expend.consumeTime')"></el-table-column>
      <el-table-column prop="productName" :label="$t('order.productName')"></el-table-column>
      <el-table-column prop="shopNumb" :label="$t('order.shopNum')">
        <template slot-scope="scope">
          <span v-if="scope.row.shopNumb == null || scope.row.shopNumb == 0">-</span>
          <span v-else>{{ scope.row.shopNumb }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="data.orderType === 3" :label="$t('order.unitPrice') + `(￥)`">
        <template slot-scope="scope">
          <span>￥{{ scope.row.trafficPrice }}/GB</span>
        </template>
      </el-table-column>
      <el-table-column v-if="data.orderType === 3" prop="ext2" :label="$t('order.usedTraffic')"></el-table-column>
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
          <div v-if="data.orderType === 3">
            <span v-if="scope.row.startTime === null || scope.row.endTime === null">-</span>
            <span v-else>{{ scope.row.startTime }} ~ {{scope.row.endTime}}</span>
          </div>
          <div v-else>
            <span v-if="scope.row.confirmTime === null || scope.row.endTime === null">-</span>
            <span v-else>{{ scope.row.confirmTime }} ~ {{scope.row.endTime}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="paymentAmount" :label="$t('order.consumptions')"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      list: [],
      menuItem: []
    }
  },
  created() {
    this.getJoinOrder(this.$route.query.orderId, 0)
  },
  mounted() {
    // 强制给左侧导航加class保持高亮
    this.$nextTick(() => {
      this.menuItem = document.getElementsByClassName('el-menu-item')
      for (let i of this.menuItem) {
        if (i.innerText == '消费明细' || i.innerText == 'Expend Detail') {
          i.classList.add('is-active')
        }
      }
    })
  },
  methods: {
    // joinOrder 都传0单个订单
    getJoinOrder(orderId, joinOrder) {
      this.$http.posts('getJoinOrderDetail', '', { orderId: orderId, joinOrder: joinOrder }, false)
        .then(res => {
          let data = res.data || {}
          this.list = data.orders || []
          this.data = data.orders[0]
        })
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem('EXPEND_DETAILS')
    for (let i of this.menuItem) {
      if (i.innerText == '消费明细' || i.innerText == 'Expend Detail') {
        i.classList.remove('is-active')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color';
#orderDetails {
  .breadcrumb {
    padding-top: 15px;
  }
  .num {
    margin-top: 15px;
    padding-top: 20px;
    border-top: solid 1px @border;
  }
  ul {
    width: auto;
    height: auto;
    overflow: hidden;
    padding: 20px 0;
    border-bottom: solid 1px #dedede;
    li {
      margin-top: 10px;
    }
  }
  .detailsTable {
    margin-top: 30px;
  }
}
</style>
