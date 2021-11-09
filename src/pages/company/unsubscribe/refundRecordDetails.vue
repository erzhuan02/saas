<template>
  <div id="orderDetails">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/unsubscribeMGT' }">{{
        $t('home.nav74')
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('button.details') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="num">{{ $t('unsubscribe.orderInfo') }}</div>
    <ul>
      <li>{{ $t('order.orderNum') }}：{{list2.orderId}}</li>
      <li>{{ $t('order.productName') }}：{{list2.productName}}</li>
      <li>{{ $t('expend.payStatus') }}：{{list2.status}}</li>
      <li>{{ $t('unsubscribe.payMethod') }}：{{list2.paymentMethod}}</li>
      <li>{{ $t('unsubscribe.orderCreateTime') }}：{{list2.createTime}}</li>
      <li>{{ $t('order.payTime') }}：{{list2.confirmTime}}</li>
    </ul>
    <h4>{{ $t('unsubscribe.orderalAlocation') }}</h4>
    <el-table class="detailsTable" ref="resultTable" stripe border :data="list" max-height="578" style="width: 100%;" highlight-current-row>
      <el-table-column prop="productName" :label="$t('order.productName')"></el-table-column>
      <el-table-column :label="$t('unsubscribe.productGG')">
        <template slot-scope="scope">
          <span v-if="scope.row.productType == 1">{{scope.row.pointNumb}}{{ $t('unit.one') }}</span>
          <span v-else>{{scope.row.userNumb}}{{ $t('unit.digit') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="shopNumb" :label="$t('order.shopNum')"></el-table-column>
      <el-table-column prop="usedDays" :label="$t('unsubscribe.useTime')"></el-table-column>
      <el-table-column prop="paymentAmount" :label="$t('unsubscribe.productAmount')"></el-table-column>
      <!-- <el-table-column prop="liqu" :label="$t('unsubscribe.liqu')"></el-table-column> -->
    </el-table>
    <div class="flex-hr cash">{{ $t('order.orderAmount1') }}: ￥{{list2.unRegAmount}}</div>
    <div class="flex-hr cash">{{ $t('unsubscribe.cashTotal') }}: ￥{{list2.unRegAmount}}</div>
  </div>
</template>

<script>
import { setTimeout, clearTimeout } from 'timers'
export default {
  data() {
    return {
      orderId: '',
      menuItem: [],
      list: [],
      list2: {}
    }
  },
  created() {
    this.orderId = this.$route.query.orderId
  },
  mounted() {
    this.getList()
    // 强制给左侧导航加class保持高亮
    this.$nextTick(() => {
      this.menuItem = document.getElementsByClassName('el-menu-item')
      for (let i of this.menuItem) {
        if (i.innerText == '退订管理' || i.innerText == 'Unsubscribe MGT') {
          i.classList.add('is-active')
        }
      }
    })
  },
  methods: {
    getList() {
      this.$http.posts('getUnregResourceDetail', '', { orderId: this.orderId, isUnreg: 0 }, '', false)
        .then(res => {
          let data = res.data
          this.list2 = data
          /** 支付状态 1.退订成功 0 退订失败 */
          if (this.list2.status == 1) {
            this.list2.status = '待支付'
          } else if (this.list2.status == 2) {
            this.list2.status = '支付成功'
          } else if (this.list2.status == 3) {
            this.list2.status = '订单取消'
          } else {
            this.list2.status = '退订成功'
          }
          /** 支付方式：1.支付宝 */
          if (this.list2.paymentMethod == 1) {
            this.list2.paymentMethod = '支付宝'
          } else {
            this.list2.paymentMethod = '-'
          }
          if (this.list2.unRegStartTime == null) {
            this.list2.unRegStartTime = '-'
          }
          if (this.list2.unRegEndTime == null) {
            this.list2.unRegEndTime = '-'
          }
          this.list.push(data)
        })
    }
  },
  beforeDestroy() {
    for (let i of this.menuItem) {
      if (i.innerText == '退订管理' || i.innerText == 'Unsubscribe MGT') {
        i.classList.remove('is-active')
      }
    }
  }
}
</script>

<style lang="less" scoped>
#orderDetails {
  padding: 0 15px !important;
  .breadcrumb {
    padding-top: 15px;
  }
  .num {
    font-weight: bold;
    margin-top: 20px;
  }
  ul {
    width: 60%;
    height: auto;
    overflow: hidden;
    margin-top: 20px;
    li {
      float: left;
      margin: 0 30px 0 0;
      line-height: 35px;
    }
  }
  h4 {
    margin-top: 50px;
  }
  .detailsTable {
    margin-top: 20px;
  }
  .cash {
    margin-top: 20px;
  }
}
</style>
