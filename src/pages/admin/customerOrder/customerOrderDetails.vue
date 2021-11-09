<template>
  <div id="customerOrderDetails">
    <div class="listNum flex">
      <div class="status" v-if="dpInfo.status !== null">
        <!-- 1.待支付 2.支付成功 3.订单取消 4.已退订 5.支付成功 支付成功后过期订单点了删除 6.支付成功 支付成功后点了禁用 -->
        <p><span>{{ $t(`order.orderStatus${dpInfo.status}`) }}</span></p>
        <!-- <p v-if="dpInfo.paymentMethod === 3">支付成功</p>
        <p v-else>
          <span v-if="dpInfo.orderType === 3">
            <span v-if="dpInfo.status === 2">支付成功</span>
            <span v-else>待支付</span>
          </span>
          <span v-else>
            <span v-if="dpInfo.status === 1">待支付</span>
            <span v-else-if="dpInfo.status === 2">支付成功</span>
            <span v-else-if="dpInfo.status === 3">订单取消</span>
            <span v-else>已退订</span>
          </span>
        </p> -->
      </div>
      <p>{{ $t('order.orderNum') }}：{{ orderId }}</p>
    </div>
    <div class="ulBox">
      <ul>
        <li>{{ $t('unsubscribe.orderInfo') }}</li>
        <li>{{ $t('order.productName') }}：{{ dpInfo.productName }}</li>
        <li>{{ $t('order.orderType') }}：
          <!-- 1.新购 2.续费 3.后付费 -->
          <span>{{ $t(`order.orderType${dpInfo.orderType}`) }}</span>
          <!-- <span v-if="dpInfo.orderType == 1">新购</span>
          <span v-if="dpInfo.orderType == 2">续费</span>
          <span v-if="dpInfo.orderType == 3">后付费</span> -->
        </li>
        <li>{{ $t('myClients.clientName') }}：{{ dpInfo.companyName }}</li>
        <li>{{ $t('myClients.accountName') }}：{{ dpInfo.contactName }}</li>
        <li>{{ $t('customerOrder.supplier') }}：{{ dpInfo.agentName }}</li>
        <li>{{ $t('customerOrder.orderTime') }}：{{ dpInfo.createTime }}</li>
      </ul>
      <ul>
        <li>{{ $t('order.orderInfo') }}</li>
        <li>
          {{ $t('order.orderAmount1') }}：
          <span class="amount">￥{{ dpInfo.totalAmount }}</span>
        </li>
      </ul>
    </div>
    <h4>{{ $t('order.orderDetails') }}</h4>
    <el-table class="detailsTable" ref="resultTable" stripe border :data="list" max-height="578" style="width: 100%;" highlight-current-row>
      <el-table-column prop="orderId" :label="$t('login.product') + ' ID'"></el-table-column>
      <el-table-column prop="productName" :label="$t('order.productName')"></el-table-column>
      <el-table-column prop="pointNumb" v-if="dpInfo.productType == 1" :label="$t('unsubscribe.productGG')">
        <template slot-scope="scope">
          <span v-if="scope.row.pointNumb !== null && scope.row.pointNumb !== 0">{{ scope.row.pointNumb }}{{ $t('unit.one') }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="userNumb" v-else :label="$t('unsubscribe.productGG')">
        <template slot-scope="scope">
          <span v-if="scope.row.userNumb !== null">{{ scope.row.userNumb }}{{ $t('unit.digit') }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="shopNumb" :label="$t('order.shopNum')">
        <template slot-scope="scope">
          <span v-if="scope.row.shopNumb == null || scope.row.shopNumb == 0">-</span>
          <span v-else>{{ scope.row.shopNumb }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="dpInfo.orderType === 3" prop="trafficPrice" :label="`${$t('order.unitPrice')}(￥)`">
        <template slot-scope="scope">￥{{scope.row.trafficPrice}}/GB</template>
      </el-table-column>
      <el-table-column prop="ext2" :label="$t('order.usedTraffic')">
        <template slot-scope="scope">{{ scope.row.trafficPrice | toRung() }}</template>
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
      <el-table-column prop="endTime" :label="$t('time.startAndStop')">
        <template slot-scope="scope">
          <div v-if="dpInfo.orderType === 3">
            <span v-if="scope.row.startTime === null || scope.row.endTime === null">-</span>
            <span v-else>{{ scope.row.startTime }} - {{scope.row.endTime}}</span>
          </div>
          <div v-else>
            <span v-if="scope.row.confirmTime === null || scope.row.endTime === null">-</span>
            <span v-else>{{ scope.row.confirmTime }} - {{scope.row.endTime}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="totalAmount" :label="$t('order.orderAmount')"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      dpInfo: {}
    }
  },
  props: ['orderId'],
  created() {
    this.getDetails()
  },
  mounted() { },
  methods: {
    getDetails() {
      this.$http.posts('getCustomerOrderDetail', '', { orderId: this.orderId }, false)
        .then(res => {
          let data = res.data || {}
          this.dpInfo = data
          this.list.push(data)
        })
    }
  }
}
</script>

<style lang="less" scoped>
#customerOrderDetails {
  width: 100%;
  padding: 20px;
  .listNum {
    p {
      line-height: 38px;
      &.status {
        padding: 0 10px;
        background: #f00;
        color: #fff;
        border-radius: 8px;
        margin-right: 30px;
      }
    }
  }
  .ulBox {
    height: auto;
    overflow: hidden;
    ul {
      width: 50%;
      height: auto;
      overflow: hidden;
      margin: 30px 0;
      float: left;
      li {
        line-height: 34px;
        &:first-child {
          font-weight: bold;
        }
        span.amount {
          color: #f00;
          font-weight: bold;
          font-size: 24px;
        }
      }
    }
  }
  .detailsTable {
    margin-top: 20px;
  }
}
</style>
