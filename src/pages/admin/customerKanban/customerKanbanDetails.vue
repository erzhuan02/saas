<template>
  <div id="customerOrderDetails">
    <ul class="breadCrumb">
      <li @click="resetPage">
        <h3>{{ $t('home.nav016_2') }}</h3>
      </li>
      <li><i class="el-icon-arrow-right"></i>{{ $t('button.details') }}</li>
    </ul>
    <p class="title">{{ $t('expend.flow') }}</p>
    <ul class="info">
      <li>{{ $t('expend.payStatus') }}：
        <!-- 1.待支付 2.支付成功 3.订单取消 4.已退订(此处后台过滤掉) 5.支付成功 支付成功后过期订单点了删除 6.支付成功 支付成功后点了禁用 -->
        <span>{{ $t(`order.orderStatus${dpInfo.status}`) }}</span>
      </li>
      <li>{{ $t('common.orderNo') }}：{{ dpInfo.orderId }}</li>
      <li>{{ $t('order.orderType') }}：
        <!-- 1.新购 2.续费 3.后付费 -->
        <span>{{ $t(`order.orderType${dpInfo.orderType}`) }}</span>
        <!-- <span v-if="dpInfo.orderType == 1">新购</span>
        <span v-if="dpInfo.orderType == 2">续费</span>
        <span v-if="dpInfo.orderType == 3">后付费</span> -->
      </li>
    </ul>
    <el-table class="detailsTable" ref="resultTable" stripe border :data="list" max-height="578" style="width: 100%;" highlight-current-row>
      <el-table-column prop="confirmTime" :label="$t('expend.consumeTime')">
        <span slot-scope="scope">{{ scope.row.confirmTime | toRung() }}</span>
      </el-table-column>
      <el-table-column prop="productName" :label="$t('order.productName')"></el-table-column>
      <el-table-column prop="shopNumb" :label="$t('order.shopNum')">
        <span slot-scope="scope">{{ scope.row.shopNumb | toRung() }}</span>
      </el-table-column>
      <el-table-column v-if="dpInfo.orderType === 3" prop="trafficPrice" :label="`${$t('order.unitPrice')}(￥)`">
        <span slot-scope="scope">￥{{ scope.row.trafficPrice }}/GB</span>
      </el-table-column>
      <el-table-column prop="pointNumb" v-else :label="$t('order.specification')">
        <template slot-scope="scope">
          <span v-if="scope.row.productId == 6">{{ scope.row.userNumb | toRung(2) }}</span>
          <span v-else>{{ scope.row.pointNumb | toRung(1) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ext2" v-if="dpInfo.orderType === 3" :label="$t('order.usedTraffic')"></el-table-column>
      <el-table-column prop="billingCycle" :label="$t('order.billingModel')">
        <template slot-scope="scope">
          <!-- billingModel1: '包月',billingModel2: '永久',billingModel3: '按月结算' -->
          <span v-if="scope.row.orderType === 3">{{ $t('order.billingModel3') }}</span>
          <span v-else-if="scope.row.billingCycle === 1">{{ $t('order.billingModel1') }}</span>
          <span v-else>{{ $t('order.billingModel2') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" :label="$t('time.startAndStop')" min-width="130px">
        <template slot-scope="scope">
          <div v-if="dpInfo.orderType === 3">
            <span v-if="!scope.row.startTime || !scope.row.endTime">-</span>
            <span v-else>{{ scope.row.startTime }} - {{ scope.row.endTime }}</span>
          </div>
          <div v-else>
            <span v-if="!scope.row.confirmTime || !scope.row.endTime">-</span>
            <span v-else>{{ scope.row.confirmTime }} - {{ scope.row.endTime }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="totalAmount" :label="$t('order.consumptions')"></el-table-column>
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
  created() { this.getDetails(this.orderId, 0) },
  mounted() { },
  methods: {
    // joinOrder 都传0单个订单
    getDetails(orderId, joinOrder) {
      this.$http.posts('getJoinOrderDetail', '', { orderId, joinOrder }, false)
        .then(res => {
          let data = res.data || {}
          this.list = data.orders || []
          this.dpInfo = data.orders[0]
        })
    },
    resetPage() {
      this.$emit('show-details', false)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color.less';
#customerOrderDetails {
  width: 100%;
  padding: 20px 10px;
  .breadCrumb {
    margin-bottom: 10px;
    height: auto;
    overflow: hidden;
    border-bottom: solid 1px #eee;
    i {
      margin: 0 4px;
      font-size: 12px;
    }
    li {
      float: left;
      font-size: 14px;
      padding: 10px 0;
      &:first-child {
        cursor: pointer;
      }
    }
  }
  .title {
    font-size: 18px;
    padding: 10px 0;
  }
  ul.info {
    padding-bottom: 20px;
    overflow: hidden;
    li {
      // float: left;
      width: 100%;
      margin-right: 50px;
      line-height: 30px;
    }
  }
  .success {
    color: @success;
  }
  .error {
    color: @danger;
  }
}
</style>
