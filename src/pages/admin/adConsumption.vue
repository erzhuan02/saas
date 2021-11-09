<template>
  <div id="adConsumption">
    <consumption-date :type="1" :total="total1" @query-data="queryData"></consumption-date>
    <h4 class="title">{{ $t('consumption.statistics') }}</h4>
    <div class="flex chart">
      <div v-show="showChart1" id="vBar"></div>
      <div v-show="!showChart1" class="noData flex-hcvc">{{ $t('common.noData') }}</div>
    </div>
    <div class="greyShadow"></div>

    <consumption-date :type="2" :total="total2" @query-data="queryData"></consumption-date>
    <h4 class="title">{{ $t('consumption.trafficStatistics') }}</h4>
    <div class="flex chart">
      <div v-show="showChart2" id="pieChart"></div>
      <div v-show="!showChart2" class="noData flex-hcvc">{{ $t('common.noData') }}</div>
    </div>
    <div class="greyShadow"></div>
    <!-- @rank-data="rankData" -->
    <consumption-date :type="3" :total="total3" :showRank="true" @query-data="queryData"></consumption-date>
    <h4 class="title">{{ $t('consumption.ranking') }}</h4>
    <div class="flex chart">
      <div v-show="showChart3" id="hBar"></div>
      <div v-show="!showChart3" class="noData flex-hcvc">{{ $t('common.noData') }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ConsumptionDate from '../../components/consumptionDate'
export default {
  components: { ConsumptionDate },
  data() {
    return {
      // 消费
      // userType: 1 // 用户类型：1.企业用户 2.业务用户 3.dvo用户 参数(必填)
      // reportName: 1 // 报表名称：1.消费统计 2. 消费趋势 3.消费排名 参数(必填)
      // startTime: '',
      // endTime: '',
      // xDataType: 1, // 横坐标类型：1.日 2.月 3.年 4.自定义 5.品牌
      // rankingType: 1, // 排名类型：1.前十 2.后十
      // shortcut: '' // 快捷方式：1.一个月 2.三个月 3.六个月
      // =============================================================
      // 流量
      // userType: 1 // 用户类型：1.企业用户 2.业务用户 3.dvo用户 参数(必填)
      // startTime: '',
      // endTime: '',
      // xDataType: 1 // 横坐标类型：1.日 2.月 3.年 4.自定义  5.企业
      query: {
        userType: 3 // 用户类型：1.企业用户 2.业务用户 3.dvo用户
        // reportName: 1 // 报表名称：1.消费统计 2. 消费趋势 3.消费排名
      },
      realQuery: {},

      chart1Data: {}, // 切换中英文渲染用
      total1No: 0, // 单位万元,切换中英文渲染用
      total1: '',
      showChart1: false,

      chart2Data: {},
      total2: '',
      showChart2: false,

      chart3Data: [],
      total3No: 0,
      total3: '',
      showChart3: false
    }
  },
  computed: { ...mapGetters(['language']) },
  watch: {
    language(val) {
      if (val) {
        if (this.showChart1) this.initvBar(this.chart1Data.keys, this.chart1Data.values)
        if (this.showChart2) this.initPie(this.chart2Data)
        if (this.showChart3) this.inithBar(this.chart3Data.keys, this.chart3Data.values)
        this.total1 = this.total1No + this.$t('unit.tenThousYuan')
        this.total3 = this.total3No + this.$t('unit.jia')
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    // 获取消费数据
    getConsumerData() {
      var type = this.realQuery.reportName
      this.$http.gets('getConsumerData', this.realQuery)
        .then(res => {
          let data = res.data || {}
          let list = data.list || []
          if (type === 3) {
            list.reverse()
          }
          let keys = [], values = [], total = 0// eslint-disable-line
          list.forEach(item => {
            // 浮点数的精度问题 如8.54
            var itemValue = (+item.value || 0) * 1000 / 10000000
            var value
            if (itemValue < 0.01) { // 小于100元全保留小数，最多6位（单位万元），浮点数双控
              value = +itemValue.toFixed(6)
            } else {
              value = +itemValue.toFixed(2)
            }
            total += +value
            values.push(value)
            keys.push(item.key)
          })
          if (type === 1) {
            // 饼图的数据格式为：{value: 11, name: 11}
            // 中英文切换
            if (total < 0.01) { // 小于100元全保留小数，浮点数双控
              this.total1No = +total.toFixed(6)
            } else {
              this.total1No = +total.toFixed(2)
            }
            this.total1 = this.total1No + this.$t('unit.tenThousYuan')
            this.chart1Data = { keys, values }
            if (keys.length === 0 || +total === 0) {
              this.showChart1 = false
            } else {
              this.showChart1 = true
              this.$nextTick(() => {
                this.initvBar(keys, values)
              })
            }
          } else {
            this.total3No = data.total
            this.total3 = this.total3No + this.$t('unit.jia')
            this.chart3Data = { keys, values }
            if (keys.length === 0) {
              this.showChart3 = false
            } else {
              this.showChart3 = true
              this.$nextTick(() => {
                this.inithBar(keys, values)
              })
            }
          }
        })
    },
    // 获取流量统计数据
    getTrafficData() {
      this.$http.gets('getTrafficData', this.realQuery)
        .then(res => {
          let data = res.data || []
          let total = 0
          var result = data.map(item => {
            // value单位为bit /1024为kb
            var itemValue = (+item.value || 0) / 1024 / 1024 / 1024
            var value
            if (itemValue < 0.01) { // 小于0.01GB最多保留五位小数
              value = +itemValue.toFixed(5)
            } else {
              value = +itemValue.toFixed(2)
            }
            total += +value
            return {
              value: value,
              name: item.key
            }
          })
          if (total < 0.01) { // 小于0.01GB最多保留五位小数
            total = +total.toFixed(5)
          } else {
            total = +total.toFixed(2)
          }
          this.total2 = total + 'GB'
          this.chart2Data = result
          if (data.length === 0) {
            this.showChart2 = false
          } else {
            this.showChart2 = true
            this.$nextTick(() => {
              this.initPie(result)
            })
          }
        })
    },
    // 消费统计
    initvBar(keys, values) {
      let vBar = this.$echarts.init(document.getElementById('vBar'))
      vBar.setOption({
        // title: {
        //   text: this.$t('consumption.statistics'),
        //   textStyle: {
        //     fontWeight: 'bold',
        //     fontSize: 16
        //   },
        //   left: 20
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b0}: {c0}' + this.$t('unit.tenThousYuan')
        },
        xAxis: {
          type: 'category',
          data: keys
        },
        yAxis: {
          name: this.$t('unit.unit') + ': ' + this.$t('unit.tenThousYuan'),
          type: 'value'
        },
        series: [{
          data: values,
          type: 'bar'
        }]
      })
    },
    // 流量统计
    initPie(data) {
      let pieChart = this.$echarts.init(document.getElementById('pieChart'))
      pieChart.setOption({
        // color: ['#fea53d', '#30d495'],
        // title: {
        //   text: this.$t('consumption.trafficStatistics'),
        //   textStyle: {
        //     fontWeight: 'bold',
        //     fontSize: 16
        //   },
        //   left: 20
        // },
        tooltip: {
          trigger: 'item',
          formatter: '{b0}: {c0}GB'
        },
        legend: {
          // x: 'center',
          right: 200,
          top: 20,
          bottom: 20,
          orient: 'vertical',
          formatter: function (key) {
            let value
            data.forEach(item => {
              if (key === item.name) {
                value = item.value
              }
            })
            return key + ' : ' + value + 'GB'
          }
        },
        series: [
          {
            // name: '访问来源',
            type: 'pie',
            radius: '50%',
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false
            },
            data: data
          }
        ]
      })
    },
    // 消费排名
    inithBar(keys, values) {
      let hBar = this.$echarts.init(document.getElementById('hBar'))
      hBar.setOption({
        // title: {
        //   text: this.$t('consumption.ranking'),
        //   textStyle: {
        //     fontWeight: 'bold',
        //     fontSize: 16
        //   },
        //   left: 20
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b0}: {c0}' + this.$t('unit.tenThousYuan')
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: keys
        },
        series: [
          {
            name: '2011年',
            type: 'bar',
            data: values
          }
        ]
      })
    },
    // 接收查询数据
    queryData(queryObj) {
      let { reportName } = queryObj
      this.realQuery = { ...queryObj, ...this.query }
      if (reportName === 2) {
        delete this.realQuery.reportName
        this.getTrafficData()
      } else {
        this.getConsumerData()
      }
    }
    // // 接收排名数据
    // rankData(queryObj) {
    //   // console.log('rankData', data)
    //   this.realQuery = { ...this.query, ...queryObj }
    //   // console.log('rankData', this.realQuery)
    //   this.getConsumerData(3)
    // }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/color';
#adConsumption {
  padding: 0 !important;
  h4.title {
    line-height: 50px;
    padding: 0 20px;
  }
  .noData {
    margin: auto;
  }
  .chart {
    width: 100%;
    height: 400px;
    // margin: 20px 0;
    #vBar,
    #pieChart,
    #hBar {
      width: 100%;
      height: 350px;
    }
  }
  .greyShadow {
    width: 100%;
    height: 10px;
    background: @background;
  }
}
</style>
