<template>
  <div id="toPay">
    <div class="flex-hb info">
      <p class="subSuc">
        <i class="el-icon-success"></i>
        {{ $t('order.mes1') }}
      </p>
      <p class="money">
        {{ $t('order.orderAmount1') }}：￥<span style="color:#f00;font-weight:bold;">{{total | decimal2}}</span>
      </p>
    </div>
    <div class="flex-hb deadTime">
      <p class="subSuc">
        {{ $t('order.mes2') }}{{paymentEndTime}}{{ $t('order.mes3') }}
      </p>
      <p style="color:#009fe8" @click="toDetails">
        {{ $t('order.orderDetails') }}
      </p>
    </div>
    <p class="orderNum" v-if="orderId !== null">{{ $t('order.orderNum') }}：{{orderId}}</p>
    <el-tabs type="border-card" class="pay">
      <el-tab-pane :label="$t('order.platForm')">
        <div class="flex-whc">
          <div class="payBox redBdr pointer">
            <img class='ipay' src="@/assets/images/ipay2.png" alt="ipay2.png">
            <img class="rightCorner" src="@/assets/images/youxiajiao.png" alt="youxiajiao">
          </div>
          <!-- <div class="payBox pointer" @click="toTips">
            <img class='wxpay' src="@/assets/images/wxpay.png" alt="wxpay.png">
          </div> -->
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane disabled :label="$t('order.personBank')"></el-tab-pane>
      <el-tab-pane disabled :label="$t('order.enterBank')"></el-tab-pane> -->
    </el-tabs>
    <div class="flex-hr operBox">
      <el-button type="primary" class="btnClr" @click="prev">{{ $t('button.prev') }}</el-button>
      <el-button type="primary" class="btnClr" @click="sureToPay" :disabled="clickflag">{{ $t('button.sureToPay') }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio: '1',
      allPayMes: {},
      orders: [],
      orderId: '',
      paymentEndTime: '',
      total: '',
      clickflag: false,
      joinOrder: ''
    }
  },
  mounted() {
    this.allPayMes = JSON.parse(sessionStorage.getItem('PAY_MES'))
    this.orders = this.allPayMes.orders
    this.paymentEndTime = this.allPayMes.paymentEndTime
    this.total = JSON.parse(sessionStorage.getItem('payAmounts'))
    this.orderId = this.allPayMes.orderId
    this.joinOrder = sessionStorage.getItem('joinOrder') || 0
    this.couponId = sessionStorage.getItem('couponId') || ''
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.path == '/payInfo') {
        window.location.reload()
      }
    })
  },
  methods: {
    prev() {
      this.$router.go(-1)
    },
    toTips() {
      this.$utils.$message({
        type: 'warning',
        message: this.$t('setting.notOpen')
      })
    },
    sureToPay() {
      this.clickflag = true
      let params = {
        orderId: this.orderId,
        joinOrder: this.joinOrder,
        paymentMethod: 1,
        couponId: this.couponId
      }
      // paymentMethod 1.支付宝 2.微信
      this.$http.posts('payOrder', params)
        .then(res => {
          let data = res.data // 拿到返回的form
          const div = document.createElement('div')
          div.id = 'alipay'
          div.innerHTML = data
          document.body.appendChild(div)
          document.forms[0].setAttribute('target', '_blank')
          document.querySelector('#alipay').children[0].submit()
          this.$alert(this.$t('message.newindowToPay'), this.$t('dialog.tips'), {
            showClose: false,
            callback: action => {
              if (action == 'confirm') {
                // 确定跳转至订单列表的全部
                this.$router.push('/finOrderMange')
              }
            }
          })
          this.clickflag = false
        }).catch((er) => {
          this.clickflag = false
        })
    },
    toDetails() {
      this.$router.push({
        path: 'finOrderDetails',
        query: {
          type: 3
        }
      })
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem('couponId')
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color';
#toPay {
  .info {
    padding: 20px 30px 20px 20px;
    .subSuc {
      color: #008000;
      font-size: 22px;
    }
    .money {
      line-height: 30px;
    }
  }
  .deadTime {
    padding: 0 30px 0 20px;
    p:last-child {
      cursor: pointer;
    }
  }
  .orderNum {
    padding: 25px 0 35px 20px;
    border-bottom: solid 22px @border1;
  }
  .pay {
    width: 96%;
    margin: 20px auto 0;
    .payBox {
      position: relative;
      width: 290px;
      height: 66px;
      margin-left: 30px;
      border: solid 1px @border;
      .ipay {
        width: 95px;
        height: 38px;
        margin: 14px auto 0;
        display: block;
      }
      .wxpay {
        width: 100%;
        height: 100%;
        margin: 0;
      }
      .rightCorner {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 15px;
        height: 15px;
      }
    }
  }
  .redBdr {
    border: solid 1px #f00 !important;
  }
  .operBox {
    margin: 20px 20px 0 0;
    .btnClr {
      height: 45px;
    }
  }
}
</style>
