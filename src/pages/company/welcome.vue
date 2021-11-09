<template>
  <div id="welcome">
    <ul class="intro flex">
      <li class="flex">
        <div class="icon" @click="toInfo" v-if="companyData.logoUrl == null">
          <i class="el-icon-office-building"></i>
        </div>
        <img v-else class="icon" @click="toInfo" :src="companyData.logoUrl">
        <div class="info">
          <p>{{ $t('common.hello') }}~</p>
          <p class="one-txt-cut" :title="companyData.companyName">{{ companyData.companyName }}</p>
        </div>
        <div class="line"></div>
      </li>
      <!-- <li class="flex">
        <div class="amount">
          <p>{{ $t('title.balance') }}</p>
          <p>￥0.00</p>
        </div>
        <button class="in">{{ $t('button.recharge') }}</button>
        <button class="out">{{ $t('button.cash') }}</button>
        <div class="line"></div>
      </li> -->
      <li class="flex" @click="toExpendDetails">
        <i class="el-icon-collection"></i>
        <p>{{ $t('home.nav72') }}</p>
      </li>
    </ul>
    <!-- 消费趋势 -->
    <!-- <div class="greyShadow"></div>
    <div class="title flex-hb">
      <div class="flex">
        <p></p>
        <h4>{{ $t('title.trend') }}</h4>
      </div>
      <div>
        <button :class="active == 1 ? 'active' : ''" @click="toMonth('curMon')">{{ $t('time.curMon') }}</button>
        <button :class="active == 2 ? 'active' : ''" @click="toMonth('lastMon')">{{ $t('time.lastMon') }}</button>
      </div>
    </div>
    <div id="trend"></div> -->
    <div class="content">
      <market-module></market-module>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MarketModule from '@/components/marketModule'
export default {
  components: { MarketModule },
  data() {
    return {
      active: 1, // 1当月 2上月
      params: {
        companyId: '',
        userType: 1,
        dateType: 1
      },
      xDate: [],
      amount: [],
      companyData: {}
    }
  },
  created() {
    this.getComData()
  },
  mounted() {
    // this.getTrendData()
  },
  computed: {
    ...mapGetters(['language'])
  },
  // watch: {
  //   language(val) {
  //     if (val) {
  //       this.init()
  //     }
  //   }
  // },
  methods: {
    getTrendData() {
      // dateType 0全部 1当月 2上月
      // userType 1企业用户 2业务用户 3dvo
      this.$http.posts('getConsumeGeneralData', this.params)
        .then(res => {
          // if (res.data.resCode === 0) {
          this.xDate = []
          this.amount = []
          let data = res.data.data
          if (data.length !== 0) {
            data.forEach(e => {
              this.xDate.push(e.xDate)
              this.amount.push(e.yCount)
            })
          }
          // this.init()
        })
    },
    toMonth(type) {
      if (type == 'curMon') { // 当月
        this.params.dateType = 1
        this.active = 1
        this.getTrendData()
      } else { // 上个月
        this.params.dateType = 2
        this.active = 2
        this.getTrendData()
      }
    },
    init() {
      var chart = this.$echarts.init(document.getElementById('trend'))
      chart.setOption({
        color: ['#fea53d'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.xDate
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: this.$t('expend.consumption'),
            type: 'line',
            areaStyle: {},
            data: this.amount
          }
        ]
      })
    },
    // 获取企业数据
    getComData() {
      this.$http.posts('getComData')
        .then(res => {
          let data = res.data
          this.companyData = data.company
          this.params.companyId = this.companyData.companyId
        })
    },
    toInfo() {
      this.$router.push('/bmBasicInfo')
    },
    toExpendDetails() {
      this.$router.push('/expendDetails')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/color';
#welcome {
  position: relative;
  background-color: #fff;
  padding: 0 !important;
  ul.intro {
    width: 100%;
    height: 100px;
    padding: 0 25px;
    margin-bottom: 10px;
    li {
      position: relative;
      &:first-child {
        width: 40%;
        .icon {
          width: 75px;
          height: 60px;
          background: #edf0f5;
          border-radius: 5px;
          margin-top: 20px;
          text-align: center;
          i {
            font-size: 38px;
            line-height: 60px;
            color: #bdcad2;
          }
          &:hover {
            cursor: pointer;
          }
        }
        .info {
          max-width: 75%;
          margin: 23px 0 0 20px;
          p {
            color: #898989;
            &:last-child {
              font-weight: bold;
              color: #454545;
              padding-top: 10px;
            }
          }
        }
      }
      &:nth-child(2) {
        width: 45%;
        .amount {
          padding: 23px 10px 0 20px;
          p {
            color: #898989;
            &:last-child {
              color: #fe4c4c;
              font-weight: bold;
              padding-top: 10px;
            }
          }
        }
        button {
          width: 60px;
          height: 30px;
          line-height: 30px;
          color: #fff;
          border-radius: 5px;
          margin: 35px 0 0 22px;
          &.in {
            background: #ff4946;
            box-shadow: 1px 4px 9px #ffb4b3;
          }
          &.out {
            background: @main;
            box-shadow: 1px 4px 9px #ffdbae;
          }
          &:hover {
            cursor: pointer;
          }
        }
      }
      &:last-child {
        width: 22%;
        i {
          font-size: 36px;
          color: #898989;
          line-height: 100px;
          margin: 0 15px 0 24px;
        }
        p {
          line-height: 100px;
          color: #898989;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
  .content {
    padding: 0 8px;
    border-top: solid 20px @background;
  }
  div.title {
    line-height: 50px;
    padding: 0 10px;
    p {
      width: 4px;
      height: 30px;
      background: @main;
      margin: 10px 10px 0 10px;
    }
    button {
      width: auto;
      height: 30px;
      line-height: 30px;
      border-radius: 5px;
      background: #fff;
      color: #909090;
      border: solid 1px #dfdfe1;
      margin: 10px 0 0 15px;
      padding: 0 10px;
      &.active {
        background: @main;
        border: solid 1px @main;
        color: #fff;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
  #trend {
    width: 98%;
    height: 250px;
  }
  .line {
    width: 1px;
    height: 36px;
    background: #dfdfe1;
    position: absolute;
    top: 34px;
    right: 0px;
  }
  .greyShadow {
    width: 100%;
    height: 20px;
    background: @background;
  }
}
</style>
