<template>
  <div id="payInfo">
    <h3>{{ $t('order.orderInfo') }}</h3>
    <ul class="flex-wha orderInfo">
      <li v-if="orderId !== null">{{ $t('order.orderNum') }}：{{allPayMes.orderId}}</li>
      <li>{{ $t('order.productName') }}：{{allPayMes.productName}}</li>
      <li>{{ $t('order.payable1') }}：￥{{total | decimal2}}</li>
    </ul>

    <h3>{{ $t('order.selectPayWay') }}</h3>
    <div class="payBox">
      <el-radio-group v-model="radio" @change="choosePayWay">
        <!-- <el-radio label="1">余额支付</el-radio> -->
        <el-radio label="2">
          <span class="word">{{ $t('order.support1') }}</span>
          <img class="ipayImg ipay" src="@/assets/images/ipay.png" alt="ipay.png">
          <!-- <img class="ipayImg wx" src="@/assets/images/weixin.png" alt="weixin.png">
          <img class="ipayImg card" src="@/assets/images/bankcard.png" alt="weixin.png">
          <span class="word">{{ $t('order.support2') }}</span> -->
        </el-radio>
        <el-radio label="3" :disabled="voucherData.length == 0">
          <span class="word">{{ $t('order.payVoucher') }}</span>
        </el-radio>
      </el-radio-group>
    </div>
    <!-- 抵用券 -->
    <h3 v-show="radio == 2 && couponData.length !== 0">{{ $t('order.clipVoucher') }}</h3>
    <div v-show="radio == 2 && couponData.length !== 0" class="flex couponBox">
      <div class="voucher pointer" v-for="(item, index) in couponData" :key="index" @click="selectVoucher(index, item)">
        <div :class="item.status === 1 ? 'flex-hb use' : 'flex-hb noUse'">
          <span>￥{{item.balance}}</span>
          <span class="mark">
            {{ $t('voucher.voucher') }}
            <i style="font-style:normal;" v-if="item.status === 3">({{ $t('button.expired') }})</i>
          </span>
        </div>
        <p :class="item.status === 1 ? 'limit use' : 'limit noUse'">{{ $t('order.validUtill') }} {{item.endTime}}</p>
        <p class="service">{{ $t('order.universal') }}</p>
        <img src="../../../assets/images/youxiajiao.png" alt="">
      </div>
    </div>

    <!-- 代金券 -->
    <h3 v-show="radio == 3 && voucherData.length !== 0">{{ $t('order.clipCoupons') }}</h3>
    <div v-show="radio == 3 && voucherData.length !== 0" class="flex couponBox">
      <div class="coupon pointer" v-for="(item, index) in voucherData" :key="index" @click="selectCoupon(index, item)">
        <div class="flex-hb use">
          <span>￥{{item.balance}}</span>
          <span class="mark">{{ $t('coupon.coupon') }}</span>
        </div>
        <p class="limit use">{{ $t('order.validUtill') }} {{item.endTime}}</p>
        <p class="service">{{ $t('order.limitService') }}</p>
        <img style="display:none;" src="../../../assets/images/youxiajiao.png" alt="">
      </div>
    </div>

    <div class="payBtnBox">
      <p class="flex-hr amount">{{ $t('order.goodsAmount') }}：￥{{goodPrice}}</p>
      <p class="flex-hr amount" v-if="radio == 3">{{ $t('coupon.coupon') }}：-￥{{balance}}</p>
      <p class="flex-hr amount" v-else>{{ $t('voucher.voucher') }}：-￥{{balance}}</p>
      <div class="botBtn flex-hr">
        <p>
          {{ $t('order.payable1') }}：￥<span style="color:#f00;font-weight:bold;">{{total | decimal2}}</span>
        </p>
        <el-button type="primary" class="btnClr" @click="prev">{{ $t('button.prev') }}</el-button>
        <el-button type="primary" v-if="radio == 2" class="btnClr" @click="sureToPay">{{ $t('button.next') }}</el-button>
        <button v-if="radio == 3" class="btnClr vorPay pointer" @click="sureToPay">{{ $t('button.sureToPay') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import '../../../../static/js/jquery'
export default {
  data() {
    return {
      radio: '2',
      allPayMes: {},
      orders: [],
      productName: '',
      orderId: '',
      goodPrice: '',
      total: '',
      joinOrder: 0,
      couponData: [], // 可选代金券
      voucherData: [], // 可选抵用券
      voucherIds: [], // 代金券id
      couponId: '', // 抵用券id
      balance: 0
    }
  },
  created() {
    this.getVoucher()
  },
  watch: {
    balance(val) {
      this.total = this.goodPrice - val
    },
    total(val) {
      this.total = val < 0 ? 0.00 : val
      // if (this.radio == 3) {
      //   if (val < 0) {
      //     this.balance = this.goodPrice
      //     val = 0.00
      //   }
      // } else {
      //   this.total = val < 0 ? 0.00 : val
      // }
    }
  },
  mounted() {
    this.allPayMes = JSON.parse(sessionStorage.getItem('PAY_MES'))
    this.joinOrder = JSON.parse(sessionStorage.getItem('joinOrder')) || 0
    this.productName = this.allPayMes.productName
    this.orderId = this.allPayMes.orderId
    this.orders = this.allPayMes.orders
    this.goodPrice = this.allPayMes.paymentAmount
    this.total = this.goodPrice
  },
  methods: {
    getVoucher() {
      this.$http.posts('getVoucherData')
        .then(res => {
          let data = res.data
          this.couponData = data.coupon || []
          this.voucherData = data.voucher || []
        })
    },
    // 单选抵用券
    selectVoucher(index, item) {
      // item.status 1可使用 3已过期
      let isNoUse = $($('.voucher')[index]).children('div').hasClass('noUse')
      if (!isNoUse) {
        let vHas = $($('.voucher')[index]).hasClass('selector')
        if (!vHas) {
          $($('.voucher')[index]).addClass('selector').siblings().removeClass('selector')
          $($('.voucher')[index]).find('img').show()
          this.couponId = item.voucherId
          this.balance = item.balance
        } else {
          $($('.voucher')[index]).removeClass('selector')
          $($('.voucher')[index]).find('img').hide()
          this.couponId = ''
          this.balance = 0
        }
      }
    },
    // 多选代金券
    selectCoupon(index, data) {
      let vHas = $($('.coupon')[index]).hasClass('selector')
      if (!vHas) {
        // 不能超过10张
        if ($('.selector').length > 9) {
          this.$utils.$message({
            message: this.$t('order.nomore10'),
            type: 'error'
          })
          return false
        }
        // 代金券大于等于商品金额时不能继续勾选
        if (this.balance >= this.goodPrice) {
          this.$utils.$message({
            message: this.$t('order.nomore6'),
            type: 'error'
          })
          return false
        }
        $($('.coupon')[index]).addClass('selector')
        $($('.coupon')[index]).find('img').show()
        if (this.voucherIds.length === 0) {
          this.voucherIds.push(data.voucherId)
          this.balance = data.balance
        } else {
          this.voucherIds.forEach((item, idx) => {
            if (this.voucherIds.indexOf(data.voucherId) === -1) {
              this.voucherIds.push(data.voucherId)
              this.balance = this.balance + data.balance
            }
          })
        }
      } else {
        $($('.coupon')[index]).removeClass('selector')
        $($('.coupon')[index]).find('img').hide()
        this.voucherIds.forEach((item, idx) => {
          if (item === data.voucherId) {
            this.voucherIds.splice(idx, 1)
            this.balance = this.balance - data.balance
            return true
          }
        })
      }
    },
    choosePayWay(val) {
      this.radio = val
      if (val !== 3) {
        $('.selector').removeClass('selector')
      }
      if (val == 2) {
        this.voucherIds = []
      }
      if (val == 3) {
        this.couponId = ''
      }
      this.balance = 0
      this.total = this.goodPrice
    },
    sureToPay() {
      // 在线/抵用券支付
      if (this.radio == 2) {
        if (this.goodPrice <= this.balance) {
          this.$utils.$message({
            message: this.$t('message.noLessThanVoucher'),
            type: 'error'
          })
          return
        }
        this.$router.push('/toPay')
        sessionStorage.setItem('couponId', this.couponId)
      }
      // 代金券支付
      if (this.radio == 3) {
        if (this.voucherIds.length == 0) {
          this.$utils.$message({
            message: this.$t('message.selectVoucher'),
            type: 'error'
          })
          return
        }
        if (this.total !== 0) {
          this.$utils.$message({
            message: this.$t('code.S00096'),
            type: 'error'
          })
          return
        }
        let params = {
          orderId: this.orderId,
          joinOrder: this.joinOrder,
          voucherIds: this.voucherIds.join(',')
        }
        this.$http.posts('voucherPay', params)
          .then(res => {
            this.$router.push('/paySuccess')
          })
      }
      sessionStorage.setItem('payAmounts', this.total)
    },
    prev() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color';
#payInfo {
  h3,
  .orderInfo {
    padding: 20px 20px 0 20px;
  }
  .orderInfo {
    padding: 20px;
    border-bottom: solid 10px @background;
  }
  .payBox {
    padding: 20px 20px 0 20px;
    label {
      display: block;
      padding: 10px 0;
      .word {
        float: left;
        margin-left: 5px;
      }
      .ipayImg {
        float: left;
        display: inline-block;
        margin-top: -1px;
        margin-left: 8px;
        &.ipay {
          width: 18px;
          height: 18px;
          margin-top: -2px;
        }
        &.wx {
          width: 17px;
          height: 17px;
        }
        &.card {
          width: 19px;
          height: 15px;
        }
      }
    }
  }
  .couponBox {
    flex-wrap: wrap;
    height: 400px;
    overflow-y: scroll;
    @media screen and (min-height: 728px) and (max-height: 800px) {
      height: 230px;
    }
    .coupon,
    .voucher {
      min-width: 254px;
      height: 120px;
      margin: 20px 0 0 20px;
      position: relative;
      &.coupon > .use {
        background: #ffc125;
      }
      .noUse {
        background: grey;
      }
      &.voucher > .use {
        background: #74d2d4;
      }
      span {
        font-size: 20px;
        padding: 0 5px;
        line-height: 46px;
        color: #fff;
        &.mark {
          display: block;
        }
      }
      .limit {
        padding: 0 10px 10px 10px;
        color: #fff;
      }
      .service {
        line-height: 30px;
        background: #f1f1f1;
        padding: 5px 10px;
      }
      &.selector {
        border: solid 1px #f00;
        img {
          display: block;
          position: absolute;
          right: 0;
          bottom: 0;
          width: 15px;
          height: 15px;
        }
      }
      img {
        display: none;
      }
    }
  }
  .payBtnBox {
    width: calc(100% - 250px);
    height: auto;
    background: #fff;
    position: absolute;
    bottom: 0px;
    right: 30px;
    .amount {
      font-size: 16px;
      padding: 0 22px 15px 0;
    }
    .botBtn {
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      margin-bottom: 20px;
      p {
        padding-right: 20px;
        font-weight: bold;
      }
    }
    .vorPay {
      width: 98px;
      height: 40px;
      color: #fff;
      border-radius: 5px;
      margin-left: 10px;
      &:hover {
        background: #feb764;
        border-color: #feb764;
      }
    }
  }
}
</style>
