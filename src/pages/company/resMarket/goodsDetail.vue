<template>
  <div id="goodsDetail" class="flex">
    <!-- part left -->
    <div class="left">
      <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/resMarket' }">{{ $t('home.nav81') }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ goods.productName }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="brief flex">
        <p class="image" v-if="goods.logoUrl == '/'">{{ $t('common.noImg') }}</p>
        <img class="image" v-else :src="goods.logoUrl" />
        <div class="bBox">
          <p class="name" :title="goods.productName">{{ goods.productName }}</p>
          <p class="intro">{{ goods.introduction }}</p>
        </div>
      </div>
      <!-- 注 -->
      <p class="ps" v-if="goods.pointPrice > 0 || goods.billingCycle === 3">
        {{ $t('order.px1') }}{{ goods.productName }}{{ $t('order.px2') }}
        <span v-if="goods.billingCycle === 3">{{ $t('order.px3') }}</span>
        <br>
        {{ $t('order.tips2') }}: 021-6451 8711 {{ $t('order.tips0') }} 150
      </p>
      <!-- 规格 -->
      <div class="specif">
        {{ $t('order.specification') }}：
        <div class="flex">
          <p v-if="goods.billingCycle == 1">
            <span class="flex" v-if="goods.pointPrice !== -1">
              {{ goods.productName }}{{ $t('order.pointNum') }}
              <el-input v-model="pointNum" :placeholder="$t('placeholder.input')" max='9999999'></el-input>
              {{ $t('unit.point') }}
            </span>
            <span class="flex" v-if="goods.shopPrice !== -1">
              {{ goods.productName }}{{ $t('order.shopNum') }}
              <el-input v-model="shopNum" :placeholder="$t('placeholder.input')" max='9999999'></el-input>
              {{ $t('unit.one') }}
            </span>
          </p>
          <p v-else-if="goods.billingCycle == 3" style="line-height:normal">
            <span class="flex" style="line-height:40px">{{ $t('order.flow') }} ￥{{ goods.trafficPrice }}/GB</span>
            <span class="flex">{{ $t('order.videoFlow') }}</span>
            <!-- <span class="flex">
                {{ goods.productName }}{{ $t('order.shopNum') }}
                <el-input v-model="shopNum" :placeholder="$t('placeholder.input')" max='9999999'></el-input>
                {{ $t('unit.jia') }}
              </span> -->
          </p>
          <p v-else>
            <span class="flex">
              {{ goods.productName }}{{ $t('order.userNum') }}
              <el-input v-model="userNum" :placeholder="$t('placeholder.input')" max='9999999'></el-input>
              {{ $t('unit.digit') }}
            </span>
          </p>
        </div>
      </div>
      <div class="cycle" v-if="goods.productType !== 2 && goods.billingCycle !== 3">
        {{ $t('order.cycle') }}：
        <p>{{ $t('order.timeLen') }}：</p>
        <el-slider v-model="slider" show-stops :show-tooltip="tooltip" :step="8" :max='88' @input="getCycle" :marks="marks">
        </el-slider>
      </div>
      <div class="promise flex-wha">
        <p v-if="goods.billingCycle !== 3">
          <img src="@/assets/images/7days.png" alt="7days.png">
          {{ $t('order.mes9') }}
        </p>
        <p>
          <img src="@/assets/images/heart.png" alt="heart.png">
          {{ $t('order.mes10') }}
        </p>
      </div>
      <div class="details">
        {{ $t('order.goodsDetails') }}
        <hr>
        <img :src="detailImg" />
        <p>{{ $t('order.preSale') }}</p>
        <p>021-6451 8711 {{ $t('order.tips0') }} 150</p>
      </div>
    </div>
    <!-- part right -->
    <div class="right">
      <div class="information">
        <h4>{{ $t('order.goodsGG') }}：</h4>
        <template>
          <p v-if="goods.billingCycle == 3">
            <span class="flex">{{ $t('order.flow') }} ￥{{ goods.trafficPrice }}/GB</span>
          </p>
          <div v-else>
            <p v-if="goods.productType == 1">
              <span class="flex" v-if="goods.pointPrice !== -1">{{ goods.productName }}{{ $t('order.pointNum') }} {{ pointNum }} {{ $t('unit.point') }}</span>
              <span class="flex" v-if="goods.shopPrice !== -1">{{ goods.productName }}{{ $t('order.shopNum') }} {{ shopNum }} {{ $t('unit.one') }}</span>
            </p>
            <p v-else>
              <span class="flex">{{ goods.productName }}{{ $t('order.userNum') }} {{ userNum }} {{ $t('unit.digit') }}</span>
            </p>
          </div>
        </template>
        <h4>{{ $t('order.cycle') }}：</h4>
        <template>
          <p v-if="goods.productId == 6 || goods.billingCycle === 3">{{ $t('order.permanent') }}</p>
          <p v-else>{{slider1}}</p>
        </template>
        <h4>{{ $t('order.price') }}：
          <span v-if="goods.billingCycle === 3" style="color: #f00">{{ $t('order.postpaid') }}</span>
          <span v-else class="h2">￥{{ price | decimal2 }}</span>
        </h4>
        <div class="flex-wha payBtn">
          <el-button v-if="goods.billingCycle === 3" type="primary" class="btnClr" @click="openNow">{{ $t('button.openNow') }}</el-button>
          <div v-else>
            <el-button type="primary" class="btnClr" @click="toPay" :disabled="clickflag && price <= 0">{{ $t('button.toPay') }}</el-button>
            <el-button type="primary" class="btnClr" @click="payLater" :disabled="clickflag && price <= 0">{{ $t('button.laterToPay') }}</el-button>
          </div>
        </div>
        <div class="flex-whc protocol1">
          <el-checkbox v-model="checked"></el-checkbox>
          <div style="margin-right:5px">{{ $t('order.IAgree') }}</div>
          <a class="blue" @click="toRead">{{ $t('resource.lastUser') }}</a>
        </div>
      </div>
      <ul>
        <li>
          <strong>{{ $t('order.tips1') }}</strong>
          {{ $t('order.tips11') }}
        </li>
        <li>
          <strong>{{ $t('order.tips2') }}：</strong>
          021-6451 8711 {{ $t('order.tips0') }} 150
        </li>
        <li>
          <strong>{{ $t('order.tips21') }}：</strong>
          021-6451 8711 {{ $t('order.tips0') }} 114
        </li>
        <li>
          <strong>{{ $t('order.tips3') }}</strong>
          9:00~18:00
        </li>
        <li>
          <strong>{{ $t('order.tips4') }}</strong>
          support@diveo.com.cn
        </li>
        <li class="line3 three hidden" style="-webkit-box-orient: vertical;box-orient: vertical;">
          <strong>{{ $t('order.tips5') }}</strong>
          {{ $t('order.tips51') }}
        </li>
        <li>
          <span class="seeMore" @click="seeMore">{{words}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setTimeout } from 'timers'
export default {
  data() {
    return {
      clickflag: true,
      goods: {},
      pointNum: 0,
      shopNum: 1,
      userNum: 0,
      slider: 0,
      slider1: 0, // 展示右侧周期
      sliderVal: 0, // 用来计算，单位为月
      price: 0.00,
      tooltip: false,
      orderType: '', // 订单类型 1购买 2续费
      companyId: '',
      words: this.$t('common.checkMore'),
      up: this.$t('common.up'),
      num: 0,
      payMes: {}, // 所有支付商品信息
      menuItem: [],
      save: {},
      detailImg: '',
      checked: false
    }
  },
  watch: {
    pointNum(val) {
      // 不能为空
      if (val !== '') {
        // 不能输入小数
        var onlyNum = this.$utils.reg.onlyNum
        if (!onlyNum.test(val) || !onlyNum.test(this.shopNum)) {
          this.$utils.$message({
            message: this.$t('message.wrongInput'),
            type: 'error'
          })
          this.price = 0.00
          return false
        }
        // 不能大于一千万
        if (val.length > 7) {
          this.$utils.$message({
            message: this.$t('message.sevenDigits'),
            type: 'error'
          })
          let str = val.toString()
          this.pointNum = str.substr(0, 7)
          return false
        }
        // 门店数不能大于 (点位数/5)+10
        let number = Math.round((val / 5) + 10)
        if (this.shopNum > number) {
          this.$utils.$message({
            message: this.$t('message.exceedLimit'),
            type: 'error'
          })
          this.clickflag = false
        } else {
          this.clickflag = true
        }
        // 门店不为-1
        if (this.goods.shopPrice == -1) {
          this.shopNum = 0
        }
        this.price = (val * this.goods.pointPrice + this.shopNum * this.goods.shopPrice) * this.sliderVal
      } else {
        this.$utils.$message({
          message: this.$t('message.noBlank'),
          type: 'error'
        })
        this.price = (this.pointNum * this.goods.pointPrice + this.shopNum * this.goods.shopPrice) * this.sliderVal
      }
    },
    shopNum(val) {
      // 不能为空
      if (val !== '') {
        // 不能输入小数
        var onlyNum = this.$utils.reg.onlyNum
        if (!onlyNum.test(val) || !onlyNum.test(this.pointNum)) {
          this.$utils.$message({
            message: this.$t('message.wrongInput'),
            type: 'error'
          })
          this.price = 0.00
          return false
        }
        // 不能大于一千万
        if (val.length > 7) {
          this.$utils.$message({
            message: this.$t('message.sevenDigits'),
            type: 'error'
          })
          let str = val.toString()
          this.shopNum = str.substr(0, 7)
          return false
        }
        // 门店数不能大于 (点位数/5)+10 ps:如果没有点位数，此条无
        let number = Math.round((this.pointNum / 5) + 10)
        if (this.pointNum !== 0 && val > number) {
          this.$utils.$message({
            message: this.$t('message.exceedLimit'),
            type: 'error'
          })
          this.clickflag = false
        } else {
          this.clickflag = true
        }
        this.price = (this.pointNum * this.goods.pointPrice + val * this.goods.shopPrice) * this.sliderVal
      } else {
        this.$utils.$message({
          message: this.$t('message.noBlank'),
          type: 'error'
        })
        this.price = (this.pointNum * this.goods.pointPrice + this.shopNum * this.goods.shopPrice) * this.sliderVal
      }
    },
    userNum(val) {
      // 不能为空
      if (val !== '') {
        // 不能输入小数
        var onlyNum = this.$utils.reg.onlyNum
        if (!onlyNum.test(val)) {
          this.$utils.$message({
            message: this.$t('message.wrongInput'),
            type: 'error'
          })
          this.price = 0.00
          return false
        }
        // 不能大于一千万
        if (val.length > 7) {
          this.$utils.$message({
            message: this.$t('message.sevenDigits'),
            type: 'error'
          })
          let str = val.toString()
          this.userNum = str.substr(0, 7)
          return false
        }
        this.price = val * this.goods.userPrice
      } else {
        this.$utils.$message({
          message: this.$t('message.noBlank'),
          type: 'error'
        })
        this.price = val * this.goods.userPrice
      }
    },
    slider(val) {
      setTimeout(() => {
        var onlyNum = this.$utils.reg.onlyNum
        if (!onlyNum.test(this.pointNum) || !onlyNum.test(this.shopNum)) {
          this.price = 0.00
          return false
        }
        if (this.goods.productType == 1) {
          this.price = (this.pointNum * this.goods.pointPrice + this.shopNum * this.goods.shopPrice) * this.sliderVal
        } else {
          this.price = this.userNum * this.goods.userPrice * this.sliderVal
        }
      }, 500)
    },
    language: {
      handler: function (val, oldLang) {
        this.words = this.$t('common.checkMore')
        this.up = this.$t('common.up')
      },
      immediate: true
    }
  },
  created() {
    this.goods = JSON.parse(sessionStorage.getItem('GOODS_MES'))
    this.detailImg = this.$api.staticUrl + '/static/itemLogo/' + this.goods.details
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.path == '/payInfo') {
        vm.save = JSON.parse(sessionStorage.getItem('save'))
        vm.init(vm.save)
      }
    })
  },
  mounted() {
    this.orderType = this.$route.query.type
    this.companyId = JSON.parse(sessionStorage.getItem('user')).companyId
    // 强制给左侧导航加class保持高亮
    this.$nextTick(() => {
      this.menuItem = document.getElementsByClassName('el-menu-item')
      for (let i of this.menuItem) {
        if (i.innerText == '资源市场' || i.innerText == 'Resource Market') {
          i.classList.add('is-active')
        }
      }
      // 页面置顶
      let container = document.getElementsByClassName('el-main')[0]
      container.scrollTop = 0
    })
  },
  computed: {
    ...mapGetters(['language']),
    marks() {
      return {
        8: '1' + this.$t('time.month'),
        16: '2' + this.$t('time.month'),
        24: '3' + this.$t('time.month'),
        32: '4' + this.$t('time.month'),
        40: '5' + this.$t('time.month'),
        48: '6' + this.$t('time.month'),
        56: '7' + this.$t('time.month'),
        64: '8' + this.$t('time.month'),
        72: '9' + this.$t('time.month'),
        80: '1' + this.$t('time.year'),
        88: '2' + this.$t('time.year')
      }
    }
  },
  methods: {
    init(data) {
      this.pointNum = data.pointNum
      this.shopNum = data.shopNum
      this.userNum = data.userNum
      this.slider = data.slider
      this.slider1 = data.slider1
      this.sliderVal = data.sliderVal
      this.price = data.price
      this.checked = data.checked
    },
    goBack() {
      this.$router.go(-1)
    },
    // 请求参数
    getParams() {
      let params = {
        buyMonth: this.sliderVal,
        companyId: this.companyId,
        orderType: this.orderType,
        productId: this.goods.productId
      }
      if (this.goods.productType == 1) {
        params = {
          ...params,
          pointNumb: this.pointNum,
          shopNumb: this.shopNum
        }
      } else {
        params = { ...params, userNumb: this.userNum }
      }
      return params
    },
    toPay() {
      let params = this.getParams()
      this.clickflag = false
      if (params.shopNumb == 0) {
        this.$utils.$message({
          message: this.$t('placeholder.shopNumNot0'),
          type: 'error',
          duration: 1000
        })
        setTimeout(() => {
          this.clickflag = true
        }, 1000)
      } else {
        this.addOrder(params, () => {
          this.$router.push('payInfo')
          let save = {
            pointNum: this.pointNum,
            shopNum: this.shopNum,
            userNum: this.userNum,
            slider: this.slider,
            slider1: this.slider1,
            sliderVal: this.sliderVal,
            price: this.price,
            checked: this.checked
          }
          sessionStorage.setItem('save', JSON.stringify(save))
        })
      }
    },
    payLater() {
      let params = this.getParams()
      this.clickflag = false
      if (params.shopNumb == 0) {
        this.$utils.$message({
          message: this.$t('placeholder.shopNumNot0'),
          type: 'error',
          duration: 1000
        })
        setTimeout(() => {
          this.clickflag = true
        }, 1000)
      } else {
        this.addOrder(params, () => {
          this.$router.push('resMarket')
        })
      }
    },
    // 立即开通
    openNow() {
      let params = {
        productId: this.goods.productId,
        shopNumb: this.shopNum,
        isAddProtocol: this.checked
      }
      this.$http.posts('promptlyOpenOrder', params, '', true)
        .then(res => {
          this.$router.push('/welcome')
        })
    },
    getCycle() {
      switch (this.slider) {
        case 0:
          this.slider1 = 0
          this.sliderVal = 0
          break
        case 8:
          this.slider1 = '1个月'
          this.sliderVal = 1
          break
        case 16:
          this.slider1 = '2个月'
          this.sliderVal = 2
          break
        case 24:
          this.slider1 = '3个月'
          this.sliderVal = 3
          break
        case 32:
          this.slider1 = '4个月'
          this.sliderVal = 4
          break
        case 40:
          this.slider1 = '5个月'
          this.sliderVal = 5
          break
        case 48:
          this.slider1 = '6个月'
          this.sliderVal = 6
          break
        case 56:
          this.slider1 = '7个月'
          this.sliderVal = 7
          break
        case 64:
          this.slider1 = '8个月'
          this.sliderVal = 8
          break
        case 72:
          this.slider1 = '9个月'
          this.sliderVal = 9
          break
        case 80:
          this.slider1 = '1年'
          this.sliderVal = 12
          break
        case 88:
          this.slider1 = '2年'
          this.sliderVal = 24
          break
        case 96:
          this.slider1 = '2年'
          this.sliderVal = 24
          break
      }
    },
    // 请求添加订单
    addOrder(params, callback) {
      // isAddProtocol未上线正式
      params = { ...params, isAddProtocol: this.checked }
      this.$http.posts('addOrder', params, '', false)
        .then(res => {
          this.payMes = res.data
          sessionStorage.setItem('PAY_MES', JSON.stringify(this.payMes))
          sessionStorage.setItem('GOODS_MES', JSON.stringify(this.goods))
          this.clickflag = true
          callback()
        }).catch((er) => {
          setTimeout(() => {
            this.clickflag = true
          }, 1000)
        })
    },
    seeMore() {
      if (this.num % 2 == 0) {
        this.num++
        let lines3 = document.getElementsByClassName('line3')
        lines3[0].classList.remove('three')
        lines3[0].classList.remove('hidden')
        lines3[0].classList.add('vis')
        this.words = this.$t('common.up')
      } else {
        this.num++
        let data = document.getElementsByClassName('vis')
        data[0].classList.add('hidden')
        data[0].classList.add('three')
        data[0].classList.remove('vis')
        this.words = this.$t('common.checkMore')
      }
    },
    // 读取《六臂云最终用户许可协议》
    toRead() {
      let router = this.$router.resolve({
        name: 'GenernalAgreement',
        params: {
          id: 4
        }
      })
      window.open(router.href, '_blank')
    }
  },
  beforeDestroy() {
    for (let i of this.menuItem) {
      if (i.innerText == '资源市场' || i.innerText == 'Resource Market') {
        i.classList.remove('is-active')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color';
#goodsDetail {
  .left {
    width: calc(100% - 25%);
    padding-top: 10px;
    .breadcrumb {
      padding: 15px 0 20px;
    }
    .brief {
      height: auto;
      .image {
        width: 100px;
        height: 100px;
        background-color: @background;
        text-align: center;
        line-height: 100px;
        font-size: 12px;
        border-radius: 5px;
      }
      .bBox {
        width: calc(100% - 200px);
        padding-left: 10px;
        .name {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding-top: 3px;
        }
        .intro {
          padding-top: 10px;
        }
      }
    }
    .specif {
      padding: 30px;
      p {
        line-height: 40px;
        span {
          padding: 0 0 10px 20px;
        }
      }
      .el-input {
        width: 200px;
        padding: 0 10px;
      }
    }
    .cycle {
      margin: 30px 30px 0 30px;
      height: 130px;
    }
    .ps {
      font-weight: bold;
      color: #f00;
      margin: 30px 30px 0 30px;
    }
    .promise {
      border-bottom: solid 10px @background;
      p {
        color: #f00;
        font-weight: bold;
        line-height: 60px;
      }
      img {
        width: 34px;
        height: 34px;
        margin: 14px 6px 0 0;
      }
    }
    .details {
      padding: 15px;
      p {
        font-weight: bold;
        line-height: 30px;
        font-size: 18px;
        padding-left: 20px;
        &:last-child {
          text-indent: 20px;
          padding-bottom: 20px;
        }
      }
    }
  }
  .right {
    width: 23%;
    .information,
    ul {
      padding: 10px;
    }
    .information {
      border-bottom: solid 1px @border1;
      p,
      .h2 {
        line-height: 30px;
        text-indent: 10px;
        padding-bottom: 10px;
      }
      .h2 {
        color: #f00;
        font-size: 24px;
      }
      .payBtn {
        margin-top: 20px;
        margin-bottom: 10px;
      }
    }
    ul {
      position: relative;
      li {
        line-height: 26px;
      }
      .line3 {
        position: relative;
      }
      .three:after {
        content: '...';
        position: absolute;
        width: 20px;
        bottom: 0;
        right: 0;
        background: #fff;
      }
      .hidden {
        overflow: hidden;
        height: 80px;
      }
      .vis {
        overflow: visible;
        height: auto;
      }
      span.seeMore {
        cursor: pointer;
        position: absolute;
        bottom: -15px;
        right: 25px;
        font-size: 14px;
        color: @text3;
      }
    }
    .protocol1 {
      margin-top: 10px;
      line-height: 21px;
      font-size: 14px;
      .el-checkbox {
        margin-right: 8px;
      }
    }
    // .blue {
    //   margin: 10px;
    // }
  }
}
</style>
