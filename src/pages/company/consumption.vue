<template>
  <div id="consumption">
    <consumption-date :type="1" :total="total1" @query-data="queryData"></consumption-date>
    <h4 class="title">{{ $t('consumption.statistics') }}</h4>
    <div class="flex chart">
      <div v-show="showChart1" id="pieChart"></div>
      <div v-show="!showChart1" class="noData flex-hcvc">{{ $t('common.noData') }}</div>
    </div>
    <div class="greyShadow"></div>

    <consumption-date :type="2" :total="total2" :showHotKey="true" @query-data="queryData" @hotkey-data="hotkeyData"></consumption-date>
    <h4 class="title">{{ $t('consumption.trend') }}</h4>
    <div class="flex chart">
      <div v-show="showChart2" id="areaLineChart"></div>
      <div v-show="!showChart2" class="noData flex-hcvc">{{ $t('common.noData') }}</div>
    </div>
    <div class="greyShadow"></div>

    <consumption-date :type="3" :total="total3" @query-data="queryData"></consumption-date>
    <h4 class="title">{{ $t('consumption.trafficStatistics') }}</h4>
    <div class="flex chart">
      <div v-show="showChart3" id="lineChart"></div>
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
        userType: 1 // 用户类型：1.企业用户 2.业务用户 3.dvo用户
        // reportName: 1 // 报表名称：1.消费统计 2. 消费趋势 3.消费排名
      },
      realQuery: {},
      chart1Data: [], // 切换中英文渲染用
      total1: '',
      showChart1: false,

      chart2Data: {},
      total2: '',
      showChart2: false,

      chart3Data: {},
      total3: '',
      showChart3: false
    }
  },
  mounted() {
    // this.init()
  },
  computed: { ...mapGetters(['language']) },
  watch: {
    language(val) {
      if (val) {
        if (this.showChart1) this.initPie(this.chart1Data)
        if (this.showChart2) this.initAreaLine(this.chart2Data.keys, this.chart2Data.values)
        if (this.showChart3) this.initLine(this.chart3Data.keys, this.chart3Data.values)
      }
    }
  },
  methods: {
    // 获取消费数据
    getConsumerData() {
      // this.realQuery = { ...this.realQuery, ...this.query }
      // this.realQuery.reportName = type
      var type = this.realQuery.reportName
      this.$http.gets('getConsumerData', this.realQuery)
        .then(res => {
          let data = res.data || {}
          let list = data.list || []
          let keys = [], values = [], total = 0 // eslint-disable-line
          list.forEach(item => {
            let value = +item.value.toFixed(2)
            total += +value
            values.push(value)
            keys.push(item.key)
          })
          // 浮点数的精度问题
          total = +total.toFixed(2)
          if (type === 1) {
            // 饼图的数据格式为：{value: 11, name: 11}
            var result = list.map(item => { return { value: item.value, name: item.key } })
            this.total1 = '￥' + total
            this.chart1Data = result
            if (result.length === 0 || +total === 0) {
              this.showChart1 = false
            } else {
              this.showChart1 = true
              this.$nextTick(() => {
                this.initPie(result)
              })
            }
          } else {
            this.total2 = '￥' + total
            this.chart2Data = { keys, values }
            if (keys.length === 0 || +total === 0) {
              this.showChart2 = false
            } else {
              this.showChart2 = true
              this.$nextTick(() => {
                this.initAreaLine(keys, values, total)
              })
            }
          }
        })
    },
    // 获取流量统计数据
    getTrafficData() {
      // this.realQuery = { ...this.realQuery, ...this.query }
      this.$http.gets('getTrafficData', this.realQuery)
        .then(res => {
          let data = res.data || []
          let keys = [], values = [], total = 0// eslint-disable-line
          data.forEach(item => {
            // value单位为bit /1024为kb
            // value单位为bit /1024为kb
            var itemValue = (+item.value || 0) / 1024 / 1024 / 1024
            var value
            if (itemValue < 0.01) { // 小于0.01GB最多保留五位小数
              value = +itemValue.toFixed(5)
            } else {
              value = +itemValue.toFixed(2)
            }
            total += +value
            values.push(value)
            keys.push(item.key)
          })
          if (total < 0.01) { // 小于0.01GB最多保留五位小数
            total = +total.toFixed(5)
          } else {
            total = +total.toFixed(2)
          }
          this.total3 = total + 'GB'
          this.chart3Data = { keys, values }
          if (data.length === 0) {
            this.showChart3 = false
          } else {
            this.showChart3 = true
            this.$nextTick(() => {
              this.initLine(keys, values)
            })
          }
        })
    },
    // 消费统计
    initPie(data) {
      let pieChart = this.$echarts.init(document.getElementById('pieChart'))
      pieChart.setOption({
        // color: ['#fea53d', '#30d495'],
        // title: {
        //   text: this.$t('consumption.statistics'),
        //   textStyle: {
        //     fontWeight: 'bold',
        //     fontSize: 16
        //   },
        //   left: 20
        // },
        tooltip: {
          trigger: 'item',
          formatter: '{b0}: ￥{c0}'
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
            return key + ' ￥' + value
          }
        },
        series: [
          {
            // name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false
            },
            // labelLine: {
            //   normal: {
            //     show: true
            //   }
            // },
            data: data
          }
        ]
      })
    },
    // 消费趋势
    initAreaLine(keys, values) {
      let areaLineChart = this.$echarts.init(document.getElementById('areaLineChart'))
      areaLineChart.setOption({
        // title: {
        //   text: this.$t('consumption.trend'),
        //   textStyle: {
        //     fontWeight: 'bold',
        //     fontSize: 16
        //   },
        //   left: 20
        // },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: keys
        },
        yAxis: {
          name: this.$t('unit.unit') + ': ￥',
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b0}<br>' + this.$t('expend.consumption') + ': ￥{c0}'
        },
        series: [{
          data: values,
          type: 'line',
          areaStyle: {}
        }]
      })
    },
    // 流量统计
    initLine(keys, values) {
      let lineChart = this.$echarts.init(document.getElementById('lineChart'))
      lineChart.setOption({
        // title: {
        //   text: this.$t('consumption.trafficStatistics'),
        //   textStyle: {
        //     fontWeight: 'bold',
        //     fontSize: 16
        //   },
        //   left: 20
        // },
        xAxis: {
          type: 'category',
          data: keys
        },
        yAxis: {
          name: this.$t('unit.unit') + ': ' + 'GB',
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b0}<br>' + this.$t('order.usedTraffic') + ': {c0}GB'
        },
        series: [{
          data: values,
          type: 'line'
        }]
      })
    },
    // 接收查询数据
    queryData(queryObj) {
      let { reportName } = queryObj
      this.realQuery = { ...queryObj, ...this.query }
      if (reportName === 3) {
        delete this.realQuery.reportName
        this.getTrafficData()
      } else {
        this.getConsumerData()
      }
    },
    // 接收快捷键数据
    hotkeyData(data) {
      this.realQuery = { ...this.query, shortcut: data, reportName: 2 }
      this.getConsumerData()
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/color';
#consumption {
  padding: 0 !important;
  h4.title {
    line-height: 50px;
    padding: 0 20px;
  }
  .chart {
    width: 100%;
    height: 400px;
    // margin: 20px 0;
    #pieChart,
    #lineChart,
    #areaLineChart {
      width: 100%;
      height: 350px;
    }
    .noData {
      margin: auto;
    }
  }
  .greyShadow {
    width: 100%;
    height: 10px;
    background: @background;
  }
}
</style>
