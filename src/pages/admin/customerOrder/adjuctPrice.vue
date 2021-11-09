<template>
  <div id="adjuctPrice">
    <p>{{ $t('order.orderNum') }}：123456</p>
    <ul class="bgYellow">
      <li>
        <i class="el-icon-time"></i>
      </li>
      <li>{{ $t('order.orderAmount1') }}：￥123</li>
      <li>{{ $t('customerOrder.maxAccount1') }}：￥123</li>
    </ul>
    <ul class="bgWhite">
      <li>{{ $t('myClients.clientName') }}：$123456</li>
      <li>{{ $t('myClients.accountName') }}：已支付</li>
    </ul>
    <el-table class="detailsTable" ref="resultTable" stripe border :data="list" max-height="578" style="width: 100%;" highlight-current-row>
      <el-table-column prop="consumeTime" :label="$t('login.product') + ' ID'"></el-table-column>
      <el-table-column prop="productName" :label="$t('order.productName')"></el-table-column>
      <el-table-column prop="shopNumb" :label="$t('unsubscribe.productGG')"></el-table-column>
      <el-table-column prop="pointNumb" :label="$t('order.billingModel')"></el-table-column>
      <el-table-column prop="billingCycle" :label="$t('common.amount')"></el-table-column>
      <el-table-column prop="validityPeriod" :label="$t('customerOrder.maxAccount')"></el-table-column>
      <el-table-column prop="totalAmount" :label="$t('customerOrder.prefAccount')"></el-table-column>
      <el-table-column prop="totalAmount" :label="$t('customerOrder.adjustAccount')"></el-table-column>
    </el-table>
    <ul class="bgBlue">
      <li>{{ $t('order.orderAmount1') }}({{ $t('customerOrder.afterAdjust') }})：<span>￥123</span></li>
      <li>{{ $t('customerOrder.listPrefAccount') }}：<span>￥123</span></li>
    </ul>
    <div class="flex">
      <el-button class="confirmBtn">{{ $t('button.confirm') }}</el-button>
      <el-button>{{ $t('button.cancel') }}</el-button>
    </div>
  </div>
</template>

<script>
import { setTimeout, clearTimeout } from 'timers'
export default {
  data() {
    return {
      list: []
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color';
#adjuctPrice {
  width: 100%;
  padding: 20px;
  ul {
    width: auto;
    height: 50px;
    overflow: hidden;
    margin-top: 30px;
    &.bgYellow {
      background: #fff0e1;
      li:first-child {
        margin-top: 0px;
        border-right: none;
        padding: 0 0 0;
        i {
          font-size: 30px;
          color: @text2;
          font-weight: bold;
          line-height: 50px;
          margin-left: 20px;
        }
      }
    }
    &.bgWhite {
      background: #fff;
      li {
        border-right: none;
        margin-right: 30px;
      }
    }
    &.bgBlue {
      background: #ccebff;
      margin-bottom: 30px;
      span {
        color: #f00;
        font-weight: bold;
      }
    }
    li {
      float: left;
      line-height: 34px;
      padding: 0 15px;
      margin-top: 8px;
      border-right: solid 1px #d1d6d9;
      &:last-child {
        border-right: none;
      }
    }
  }
  .detailsTable {
    margin-top: 30px;
  }
  .confirmBtn {
    background: #f00;
    color: #fff;
  }
}
</style>
