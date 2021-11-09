<template>
  <div id="renew">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/renewMange' }">{{
        $t('home.nav73')
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('button.renew') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="result clearfix">
      <el-table class="detailsTable" ref="resultTable" stripe border :data="list" max-height="578" style="width: 100%;" @selection-change="handleSelectionChange" highlight-current-row v-loading="loading">
        <el-table-column type="selection" v-if="list.length > 1"></el-table-column>
        <el-table-column prop="productName" :label="$t('order.productName')"></el-table-column>
        <el-table-column :label="$t('order.specification')">
          <template slot-scope="scope">
            <span>{{ scope.row.productType | spec(scope.row.pointNumb, scope.row.userNumb) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('order.shopNum')">
          <template slot-scope="scope" v-if="scope.row.productType == 1">
            <span>{{ scope.row.shopNumb | toRung(0) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="billingCycle" :label="$t('order.billingModel')"></el-table-column>
        <el-table-column prop="isExpire" :label="$t('expend.state')"></el-table-column>
        <el-table-column prop="expireDateNum" :label="$t('resource.dueTime')"></el-table-column>
        <el-table-column :label="$t('expend.dateAfterRenewal')">
          <template slot-scope="scope">
            <span>{{ scope.row.renewExpireDate1 | toRung(0) }}</span>
          </template>
        </el-table-column>
        <!-- 自动续费开关 -->
        <!-- <el-table-column :label="$t('expend.autoRenewal')">
          <template slot-scope="scope">
            <div class="flex-hcvc">
              <el-switch v-model="value" active-color="#fea53d" inactive-color="#E4E7ED"></el-switch>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('common.operation')" v-if="this.list.length === 1">
          <template slot-scope="scope">
            <div class="flex-hcvc">
              <el-button v-if="canFix" size="mini" type="primary" @click="examine(scope)" plain>{{ $t('button.revise') }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="cycle">
      <p>{{ $t('expend.renewalDur') }}：</p>
      <el-slider v-model="slider" show-stops :show-tooltip="tooltip" :step="8" :max='88' @input="getCycle" :marks="marks" :disabled="disabled">
      </el-slider>
    </div>
    <div class="toPay flex-hr">
      <p>{{ $t('expend.expend')+$t('common.amount') }}：<span>{{totalCast | decimal2}}</span></p>
      <el-button type="primary" class="btnClr" :disabled="totalCast == 0 ? true : false" @click="toPay">{{ $t('button.toPay') }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      loading: false,
      list: [],
      productsChecked: [],
      value: true,
      totalCast: 0,
      slider: 0,
      sliderVal: 0,
      tooltip: false,
      companyId: '',
      marks: {
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
      },
      disabled: true,
      menuItem: [],

      canFix: '',
      orderId: ''
    }
  },
  computed: {
    ...mapGetters(['language'])
  },
  created() {
    this.$utils.getButton('/renewMange', 1).then(res => {
      this.canFix = res.edit
    })
    this.orderId = sessionStorage.getItem('renewOrderId')

    this.companyId = JSON.parse(sessionStorage.getItem('user')).companyId
    this.getOrderDetails()
  },
  mounted() {
    // 强制给左侧导航加class保持高亮
    this.$nextTick(() => {
      this.menuItem = document.getElementsByClassName('el-menu-item')
      for (let i of this.menuItem) {
        if (i.innerText == '续费管理' || i.innerText == 'Renew Manage') {
          i.classList.add('is-active')
        }
      }
    })
  },
  watch: {
    slider(val) {
      this.getRenewDate()
    },
    language(val) {
      this.marks = {
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
    getRenewDate() {
      if (this.list.length > 1) {
        this.list.forEach(item => {
          let date = item.renewExpireDate
          if (this.sliderVal === 1) {
            item.renewExpireDate1 = date
          } else {
            if (item.selected) {
              item.renewExpireDate1 = this.addMonth(date, this.sliderVal - 1)
            } else {
              item.renewExpireDate1 = date
            }
          }
        })
      } else {
        this.$http.posts('getRenewDate', { orderId: this.orderId, month: this.sliderVal }, '', false)
          .then(res => {
            let list = this.list[0]
            let data = res.resMsg
            list.renewExpireDate1 = data
          })
      }
      this.caluCast()
    },
    // 计算续费后到期时间
    addMonth(time, n) {
      // ie不兼容YYYY-MM-DD HH:mm:ss 转换为YYYY/MM/DD HH:mm:ss
      let dateValue = time.replace(new RegExp(/-/gm), '/')
      let t = new Date(dateValue)
      t.setMonth(t.getMonth() + n)
      return this.$utils.formatDate(t)
    },
    // 计算价格
    caluCast() {
      this.totalCast = 0
      this.list.forEach(item => {
        if (item.selected) {
          if (item.productType == 1) {
            item.total = (item.pointNumb * item.pointPrice + item.shopNumb * item.shopPrice) * this.sliderVal
          } else {
            item.total = item.userNumb * item.userPrice * this.sliderVal
          }
          this.totalCast = this.totalCast + item.total
        }
      })
    },
    getOrderDetails() {
      this.$http.posts('getRenewDetailOrder', '', { orderId: this.orderId })
        .then(res => {
          // productType 1系统 2用户
          let data = res.data || []
          if (data.length > 1) this.disabled = false
          data.forEach(item => {
            item.selected = true
            // 计费模式 1.包月 2.永久
            item.billingCycle = item.billingCycle === 1 ? '包月' : '永久'
            // isExpire 1.过期 0.使用中 到期时间expireDateNum
            item.expireDateNum = item.isExpire == 0 ? item.expireDateNum + this.$t('expend.dueIn1') : '-'
            item.isExpire = item.isExpire == 0 ? '使用中' : '过期'
            item.renewExpireDate1 = item.renewExpireDate

            this.slider = data.length > 1 ? 8 : item.buyMonth * 8
            this.sliderVal = data.length > 1 ? 1 : item.buyMonth
          })
          this.list = data
          this.$nextTick(() => {
            this.list.forEach(item => {
              this.$refs.resultTable.toggleRowSelection(item, true)
            })
          })
          this.loading = false
        }).catch((er) => {
          this.loading = false
        })
    },
    // 点击去支付
    toPay() {
      let orderId = []
      this.list.forEach(item => {
        if (item.selected) orderId.push(item.orderId)
      })
      let params = {
        orderId: orderId.join(','),
        month: this.sliderVal,
        paymentAmount: this.totalCast.toFixed(2)
      }
      this.$http.posts('joinRenewOrderId', params, '', false)
        .then(res => {
          this.$router.push('payInfo')
          sessionStorage.setItem('PAY_MES', JSON.stringify(res.data))
          sessionStorage.setItem('joinOrder', res.data.joinOrder)
          console.log('renew to pay success')
        })
    },
    // 点击操作
    examine(scope) {
      this.disabled = false
    },
    getCycle() {
      this.sliderVal = this.slider / 8
      if (this.slider === 80) this.sliderVal = 12
      if (this.slider === 88 || this.slider === 96) this.sliderVal = 24
    },
    // 多选
    handleSelectionChange(val) {
      if (val.length === 0) {
        this.list.forEach(item => {
          item.selected = false
        })
        this.totalCast = 0
        this.sliderVal = 1
        this.slider = 8
        return
      }
      this.list.forEach(item => {
        item.selected = false
      })
      this.list.forEach(item => {
        val.forEach(pro => {
          if (item.orderId === pro.orderId) {
            item.selected = true
          }
        })
      })
      this.caluCast()
      this.getRenewDate()
    }
  },
  beforeDestroy() {
    for (let i of this.menuItem) {
      if (i.innerText == '续费管理' || i.innerText == 'Renew Manage') {
        i.classList.remove('is-active')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color';
#renew {
  position: relative;
  height: calc(100vh - 70px);
  .breadcrumb {
    padding-top: 15px;
  }
  .detailsTable {
    margin-top: 20px;
  }
  .cycle {
    width: 80%;
    margin: 30px;
    height: 130px;
  }
  .toPay {
    width: calc(100vw - 210px);
    height: 55px;
    border-top: solid 1px grey;
    position: fixed;
    right: 0;
    bottom: 0;
    background: #fff;
    .btnClr {
      margin: 7px 20px;
      height: 40px;
    }
    p {
      font-weight: bold;
      line-height: 56px;
      span {
        color: #f00;
      }
    }
  }
}
</style>
