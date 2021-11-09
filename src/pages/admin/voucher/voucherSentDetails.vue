<template>
  <div id="orderDetails">
    <div class="breadcrumb comTitle">
      <strong class="pointer" @click="showPage">{{ $t('coupon.tab2') }}</strong>
      <i class="el-icon-arrow-right"></i>{{ $t('button.details') }}
    </div>
    <h4 class="num">{{ $t('home.nav11') }}</h4>
    <ul class="flex">
      <li>{{ $t('voucher.voucher') + ' ID' }}：{{ companyId }}</li>
      <li>{{ $t('coupon.tab2_3') }}：{{ data.balance }}</li>
      <li>{{ $t('login.product') }}：{{ data.productName }}</li>
      <li>{{ $t('expend.state') }}：{{ data.status }}</li>
      <li>{{ $t('coupon.tab2_1') }}：{{ data.createTime }}</li>
      <li>{{ $t('basicInfo.effectTime') }}：{{ data.startTime }}</li>
      <li>{{ $t('myClients.clientName') }}：{{ data.companyName }}</li>
      <li>{{ $t('myClients.accountName') }}：{{ data.userName }}</li>
    </ul>
    <h4 class="num num1">{{ $t('expend.consumption') }}</h4>
    <el-table class="detailsTable" ref="resultTable" stripe border :data="consume" max-height="578" style="width: 100%;" highlight-current-row>
      <el-table-column prop="confirmTime" :label="$t('expend.consumeTime')"></el-table-column>
      <el-table-column prop="amount" :label="$t('coupon.dAmount')"></el-table-column>
      <el-table-column prop="productName" :label="$t('order.productName')"></el-table-column>
      <el-table-column prop="orderId" :label="$t('order.orderNum')"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      consume: [],
      menuItem: []
    }
  },
  mounted() {
    this.getDetails()
  },
  props: ['companyId'],
  watch: {
    companyId(val) {
      if (val) {
        this.getDetails()
      }
    }
  },
  methods: {
    showPage() {
      this.$emit('show-page', false)
    },
    getDetails() {
      let params = {
        id: this.companyId,
        cardType: 2
      }
      this.$http.posts('detailsVoucher', '', params)
        .then(res => {
          this.consume = res.data.consume
          this.data = res.data.basicInfo || {}
          // 1可使用；2已用完；3已过期；4已回收
          if (this.data.status == 1) {
            this.data.status = '可使用'
          } else if (this.data.status == 2) {
            this.data.status = '已用完'
          } else if (this.data.status == 3) {
            this.data.status = '已过期'
          } else if (this.data.status == 4) {
            this.data.status = '已回收'
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
#orderDetails {
  .breadcrumb {
    padding-top: 10px;
  }
  .num {
    padding-top: 20px;
    border-top: solid 1px #dedede;
  }
  .num1 {
    border-top: none;
  }
  ul {
    width: auto;
    height: auto;
    overflow: hidden;
    padding: 20px 0;
    flex-wrap: wrap;
    li {
      margin-top: 20px;
      margin-left: 50px;
    }
  }
  .detailsTable {
    margin-top: 30px;
  }
}
</style>
