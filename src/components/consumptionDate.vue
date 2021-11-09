<template>
  <div id="consumptionDate">
    <!-- 查询表单 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline>
        <el-form-item>
          <el-button :class="{active:activeQueryButton === 'day'}" type="primary" plain @click="handleButtonActive('day', 1)">{{ $t('unit.day') }}</el-button>
          <el-button :class="{active:activeQueryButton === 'month'}" type="primary" plain @click="handleButtonActive('month', 2)">{{ $t('unit.month') }}</el-button>
          <el-button :class="{active:activeQueryButton === 'year'}" type="primary" plain @click="handleButtonActive('year', 3)">{{ $t('unit.year') }}</el-button>
          <el-button :class="{active:activeQueryButton === 'dateRange'}" type="primary" plain @click="handleButtonActive('dateRange', 4)">{{ $t('unit.customize') }}</el-button>
        </el-form-item>
        <!-- value-format="yyyy-MM-dd" prop一样，value-format不一样，选择了日期，再选月后台会报TypeError: date.getFullYear is not a function，
        但不影响使用，为了不报错可分别绑定prop，或者value-format设置成一样的，自己截取 -->
        <el-form-item prop="day" v-show="activeQueryButton === 'day'">
          <el-date-picker v-model="queryForm.day" type="date" value-format="yyyy-MM-dd" :placeholder="$t('placeholder.select')"></el-date-picker>
        </el-form-item>
        <el-form-item prop="month" v-show="activeQueryButton === 'month'">
          <el-date-picker v-model="queryForm.month" type="month" value-format="yyyy-MM" :placeholder="$t('placeholder.select')"></el-date-picker>
        </el-form-item>
        <el-form-item prop="year" v-show="activeQueryButton === 'year'">
          <el-date-picker v-model="queryForm.year" type="year" value-format="yyyy" :placeholder="$t('placeholder.select')"></el-date-picker>
        </el-form-item>
        <el-form-item prop="dateRange" v-show="activeQueryButton === 'dateRange'">
          <!-- :picker-options="pickerOptions" @change=":picker-options="pickerOptions" @change="changeDate"" -->
          <el-date-picker v-model="queryForm.dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
          <el-button icon="el-icon-refresh-left" @click="handleReset">{{ $t('button.reset') }}</el-button>
        </el-form-item>
        <el-form-item v-show="total !== null || total !== undefined">{{ $t('common.total1') }}: {{ total }}</el-form-item>
      </el-form>
    </div>

    <div class="flex-hr hotkey" v-show="showHotKey">
      <!-- 点击直接查询快捷键 -->
      <el-button :class="{active:realQuery.shortcut === 1}" type="warning" size="small" plain @click="handleSelect(1)">{{ $t('consumption.nearlyAMon') }}</el-button>
      <el-button :class="{active:realQuery.shortcut === 2}" type="warning" size="small" plain @click="handleSelect(2)">{{ $t('consumption.nearlyThreeMon') }}</el-button>
      <el-button :class="{active:realQuery.shortcut === 3}" type="warning" size="small" plain @click="handleSelect(3)">{{ $t('consumption.nearlySixMon') }}</el-button>
    </div>

    <div class="flex-hc rank" v-show="showRank">
      <!-- 点击直接查询 -->
      <el-button :class="{active:queryForm.rankingType === 1}" type="warning" size="small" plain @click="handleRank(1)">{{ $t('consumption.topTen') }}</el-button>
      <el-button :class="{active:queryForm.rankingType === 2}" type="warning" size="small" plain @click="handleRank(2)">{{ $t('consumption.bottomTen') }}</el-button>
    </div>
  </div>
</template>

<script>
/**
 * @type 必传 传入1，2，3 用来区分是哪个图表 流量的不需要这个参数，传也不用
 * @total 选传 共计的值
 * @showHotKey 选传 是否显示快捷键
 * @showRank 选传 是否显示排名快捷键
 */
export default {
  props: {
    type: {
      type: Number,
      default: 1
    },
    total: {
      type: String,
      default: ''
    },
    showHotKey: {
      type: Boolean,
      default: false
    },
    showRank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      queryForm: {
        // date: '',
        day: '',
        month: '',
        year: '',
        dateRange: [], // 如有值，为数组
        xDataType: 4,
        rankingType: 1, // showRank为true时有这个字段，没有删掉此字段
        // 只要查询时需要验证表单的字段都放queryForm中
        startTime: '',
        endTime: ''
      },
      realQuery: {
        reportName: '',
        shortcut: '' // showHotKey为true时有这个字段，没有删掉此字段
      },
      activeQueryButton: 'dateRange',
      activeQueryKey: ''
      // activeQueryRank: 1
      // minDate: '',
      // maxDate: '',
      // valuePicker: ''
      // pickerOptions: {
      //   onPick: ({ maxDate, minDate }) => {
      //     this.minDate = minDate
      //     this.maxDate = maxDate
      //   },
      //   disabledDate: (time) => {
      //     let curDate = new Date().getTime()
      //     let three = 30 * 24 * 3600 * 1000
      //     if (this.minDate) {
      //       return (
      //         time.getTime() > Date.now() ||
      //         time >= new Date(this.minDate.getTime() + three) ||
      //         time <= new Date(this.minDate.getTime() - three)
      //       )
      //     }
      //     return time.getTime() > Date.now()
      //   }
      // }
    }
  },
  computed: {
    queryFormRules() {
      // 验证必有值
      var dateRule = (queryButton) => {
        return {
          trigger: 'change',
          message: this.$t('message.select'),
          validator: (rule, value, callback) => {
            if (this.activeQueryButton === queryButton) {
              if (value && value.length > 0) {
                callback()
              } else {
                callback(new Error(this.$t('placeholder.select')))
              }
            } else {
              callback()
            }
          }
        }
      }
      return {
        day: [dateRule('day')],
        month: [dateRule('month')],
        year: [dateRule('year')],
        dateRange: [dateRule('dateRange'), {
          trigger: 'change',
          validator: (rule, value, callback) => {
            if (this.activeQueryButton === 'dateRange') {
              // dataRange 时间是30天内,有值了已经
              var interval = (new Date(value[1]).getTime() - (new Date(value[0]).getTime())) / (24 * 3600 * 1000)
              if (interval >= 30) {
                callback(new Error(this.$t('message.within30days')))
              } else {
                callback()
              }
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  created() { this.init() },
  mounted() { },
  methods: {
    init() {
      this.realQuery.reportName = this.type
      if (!this.showHotKey) { delete this.realQuery.shortcut }
      if (!this.showRank) { delete this.queryForm.rankingType }
      this.getDefaultTime()
    },
    // 获取默认时间
    getDefaultTime() {
      this.$http.gets('getSysDate', { data: Math.random() })
        .then(res => {
          let date = res.data || 0
          let date1 = date - (1000 * 60 * 60 * 24 * 29)
          let now = this.$utils.formatDate(new Date(date), 'YYYY-MM-DD')
          let lastMonth = this.$utils.formatDate(new Date(date1), 'YYYY-MM-DD')
          // this.handleButtonActive('dateRange', 4)
          this.queryForm.dateRange = [lastMonth, now]
          this.handleQuery()
        })
    },
    // 查询表单提交
    handleQuery() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          if (this.showHotKey) { this.realQuery.shortcut = '' }
          this.realQuery = { ...this.realQuery, ...this.queryForm }
          var realQuery = this.realQuery
          var date = this.queryForm[this.activeQueryButton]
          if (date) {
            if (this.activeQueryButton === 'dateRange' && date.length > 0) {
              realQuery.startTime = date[0]
              realQuery.endTime = date[1]
            } else {
              realQuery.startTime = date
              realQuery.endTime = date
            }
          }
          delete realQuery.day
          delete realQuery.month
          delete realQuery.year
          delete realQuery.dateRange
          this.$emit('query-data', this.realQuery)
        } else {
          if (this.activeQueryButton === '') {
            this.$utils.$message({
              type: 'error',
              message: this.$t('message.selectCheckDate')
            })
          }
        }
      })
    },
    // 日期选择模式高亮
    handleButtonActive(type, xDataType) {
      this.activeQueryButton = type
      this.queryForm.xDataType = xDataType
      this.$refs.queryForm.resetFields()
    },
    // 日期快捷键选择
    handleSelect(type) {
      this.realQuery.shortcut = type
      this.activeQueryButton = ''
      this.handleReset()
      this.$emit('hotkey-data', this.realQuery.shortcut)
    },
    // 排名快捷键选择
    handleRank(type) {
      this.queryForm.rankingType = type
      this.handleQuery()
    },
    // 重置查询表单
    handleReset() {
      this.$refs.queryForm.resetFields()
    }
    // changeDate(e) {
    //   if (e === null) {
    //     this.minDate = ''
    //     this.maxDate = ''
    //     this.pickerBeginDateBefore = {
    //       disabledDate: (time) => {
    //         let curDate = new Date().getTime()
    //         let three = 30 * 24 * 3600 * 1000
    //         if (this.minDate) {
    //           return (
    //             time.getTime() > Date.now() ||
    //             time >= new Date(this.minDate.getTime() + three) ||
    //             time <= new Date(this.minDate.getTime() - three)
    //           )
    //         }
    //         return time.getTime() > Date.now()
    //       }
    //     }
    //   }
    // }
  }
}
</script>

<style lang="less">
@import '../assets/color.less';
#consumptionDate {
  width: 100%;
  .queryForm {
    padding: 20px 0 0 20px;
    .el-form .el-form-item__content {
      width: auto;
    }
    .el-date-editor {
      width: 220px;
    }
  }
  .hotkey,
  .rank {
    padding-right: 20px;
  }
  .el-button.active {
    background-color: @main;
    color: white;
    border: 1px solid @main;
  }
}
</style>
