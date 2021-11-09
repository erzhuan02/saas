<template>
  <div id="adOverView">
    <div class="title flex">
      <p></p>
      <h4>{{ $t('OV.customerOV') }}</h4>
    </div>
    <div class="flex chart">
      <div id="pieChart"></div>
      <div id="barLineChart"></div>
    </div>
    <div class="greyShadow"></div>
    <div class="title flex">
      <p></p>
      <h4>{{ $t('OV.consumeOV') }}</h4>
    </div>
    <div class="flex chart">
      <div id="barChart"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      recom: '', // 推荐
      selfRecom: '', // 自荐
      xDateN: [],
      num: [],
      xDateM: [],
      amount: [],
      params: {
        companyId: '',
        userType: 3,
        dateType: 0
      }
    }
  },
  created() {
    let user = JSON.parse(sessionStorage.getItem('user'))
    this.params.companyId = user.companyId
  },
  mounted() {
    this.getPieData()
    this.getTrendData()
  },
  computed: {
    ...mapGetters(['language'])
  },
  watch: {
    language(val) {
      if (val) {
        this.initPie()
        this.initBarLine()
        this.initBar()
      }
    }
  },
  methods: {
    getPieData() {
      this.$http.posts('getUserGeneralData')
        .then(res => {
          let data = res.data
          let pieData = data.fCode
          let users = data.users
          if (pieData !== null) {
            pieData.forEach(e => {
              // asscType：来源类型 1 自荐 2 推荐
              // yCount 数量
              if (e.asscType == 1) {
                this.selfRecom = e.yCount
              } else {
                this.recom = e.yCount
              }
            })
          }
          this.initPie()
          if (users !== null) {
            users.forEach(e => {
              this.xDateN.push(e.xDate)
              this.num.push(e.yCount)
            })
          }
          this.initBarLine()
        })
    },
    getTrendData() {
      // dateType 0全部 1当月 2上月
      // userType 1企业用户 2业务用户 3dvo
      this.$http.posts('getConsumeGeneralData', this.params)
        .then(res => {
          let data = res.data
          if (data.length !== 0) {
            data.forEach(e => {
              this.xDateM.push(e.xDate)
              this.amount.push(e.yCount)
            })
          } else {
            this.xDateM = []
            this.amount = []
          }
          this.initBar()
        })
    },
    initPie() {
      var pieChart = this.$echarts.init(document.getElementById('pieChart'))
      pieChart.setOption({
        color: ['#fea53d', '#30d495'],
        title: {
          text: this.$t('OV.customerNum'),
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16
          },
          left: 20
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          x: 'center',
          bottom: 20,
          data: [this.$t('OV.fCodeRecom'), this.$t('OV.selfRecom')]
        },
        series: [
          {
            name: this.$t('OV.customerNum'),
            type: 'pie',
            radius: ['40%', '60%'],
            label: {
              normal: {
                show: true
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: [
              { value: this.recom, name: this.$t('OV.fCodeRecom') },
              { value: this.selfRecom, name: this.$t('OV.selfRecom') }
            ]
          }
        ]
      })
    },
    initBarLine() {
      var pieChart = this.$echarts.init(document.getElementById('barLineChart'))
      pieChart.setOption({
        color: ['#30d495', '#fe7271'],
        title: {
          text: this.$t('OV.newCustomer'),
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16
          },
          left: 38
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            type: 'category',
            data: this.xDateN,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.$t('OV.accountOne'),
            // min: 0,
            // max: 250,
            // interval: 50,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: this.$t('userShop.qty'),
            type: 'bar',
            data: this.num
          }
        ]
      })
    },
    initBar() {
      var pieChart = this.$echarts.init(document.getElementById('barChart'))
      pieChart.setOption({
        color: ['#fec400'],
        title: {
          text: this.$t('OV.ovStatus'),
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16
          },
          left: 84
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            type: 'category',
            data: this.xDateM,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.$t('OV.amount'),
            // min: 0,
            // max: 250,
            // interval: 50,
            axisLabel: {
              formatter: '{value} '
            }
          }
        ],
        series: [
          {
            name: this.$t('OV.amount'),
            type: 'bar',
            data: this.amount
          }
        ]
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/color';
#adOverView {
  padding: 0 !important;
  .title {
    line-height: 50px;
    padding: 0 10px;
    p {
      width: 4px;
      height: 30px;
      background: @main;
      margin: 10px 10px 0 10px;
    }
  }
  .chart {
    width: 100%;
    height: 350px;
    margin: 20px 0;
    #pieChart {
      width: 40%;
    }
    #barLineChart {
      width: 60%;
    }
    #barChart {
      width: 100%;
    }
  }
  .greyShadow {
    width: 100%;
    height: 20px;
    background: #eee;
    box-shadow: 0px 0px 10px #e8e8e9;
  }
}
</style>
