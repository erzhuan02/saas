<template>
  <div id="paySuccess">
    <p class="subSuc">
      <i class="el-icon-success"></i>
      {{ $t('order.mes4') }}
    </p>
    <div class="flex numb">
      <p>{{ $t('order.orderNum') }}：{{orderId}}</p>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <p>{{ $t('order.pay') }}：{{paymentAmount}}</p>
    </div>
    <div class="flex backTo">
      {{ $t('order.mes5') }}
      <span @click="toDetails">{{ $t('order.mes6') }}</span>
      <span @click="toMarket">{{ $t('order.mes7') }}</span>
      <span @click="toOrder">{{ $t('order.mes8') }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderId: '',
      paymentAmount: ''
    }
  },
  mounted() {
    let allPayMes = JSON.parse(sessionStorage.getItem('PAY_MES'))
    this.orderId = allPayMes.orderId
    let payA = sessionStorage.getItem('payAmounts') || allPayMes.paymentAmount
    this.paymentAmount = this.$utils.decimal2(payA)
  },
  beforeRouteEnter(to, from, next) {
    // console.log(to, from, next)
    next()
  },
  methods: {
    toMarket() {
      this.$router.push('/resMarket')
    },
    toOrder() {
      this.$router.push('/finOrderMange')
    },
    toDetails() {
      this.$router.push({
        path: 'finOrderDetails',
        query: {
          type: 2
        }
      })
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem('renewOrderId')
    sessionStorage.removeItem('canFix')
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color';
#paySuccess {
  .subSuc {
    padding-top: 20px;
    color: #008000;
    font-size: 22px;
  }
  .numb {
    text-indent: 30px;
    padding-top: 30px;
  }
  .backTo {
    text-indent: 20px;
    padding-top: 50px;
    span {
      cursor: pointer;
      color: @text3;
      padding-right: 30px;
    }
  }
}
</style>
