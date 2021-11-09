<template>
  <div id="hours">
    <el-container>
      <el-aside style="width:300px;">
        <tree :showFilter="true" :showOrgCheckbox="true" :showShopCheckbox="true" @isCurrentOrg="isChangeTree" @curData="curData" @checkedNodes="checkedNodes"></tree>
      </el-aside>
      <el-main>
        <div class="title flex">
          <div class="tag"></div>
          <h3>{{ $t('hourSetting.busiHour') }}</h3>
        </div>
        <el-form class="hSetting" :model="time" label-width="110px">
          <el-form-item :label="$t('hourSetting.openTime')">
            <el-time-picker v-model="time.businessTime" value-format="HH:mm:ss" :editable="false" :clearable="false" :disabled="disabled">
            </el-time-picker>
          </el-form-item>
          <el-form-item :label="$t('hourSetting.shiftTime')">
            <el-time-picker v-model="time.changeShiftTime" value-format="HH:mm:ss" :editable="false" :clearable="false" :disabled="disabled">
            </el-time-picker>
            <p class="exp">{{ $t('hourSetting.exp1') }}</p>
          </el-form-item>
          <el-form-item :label="$t('hourSetting.shutUpTime')">
            <el-time-picker v-model="time.stopBusinessTime" value-format="HH:mm:ss" :editable="false" :clearable="false" :disabled="disabled">
            </el-time-picker>
            <p class="exp">{{ $t('hourSetting.exp2') }}</p>
          </el-form-item>
          <el-form-item :label="$t('hourSetting.closeTime')">
            <el-time-picker v-model="time.closingTime" value-format="HH:mm:ss" :editable="false" :clearable="false" :disabled="disabled">
            </el-time-picker>
          </el-form-item>
          <el-form-item style="margin-top: 85px">
            <el-button class="resetBtn" type="primary" style="margin-left: 20px" @click="init">{{ $t('button.reset') }}</el-button>
            <el-button type="primary" style="margin-left: 120px" @click="openDialog">{{ $t('button.save') }}</el-button>
          </el-form-item>
        </el-form>
      </el-main>
      <!-- 提示语 -->
      <el-dialog class="modeDia" :title="$t('dialog.tips')" :visible.sync="tipshow" :close-on-click-modal="false">
        <span>{{ $t('message.hourSaveTip') }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="tipshow = false">{{ $t('button.cancel') }}</el-button>
          <el-button type="primary" @click="saveTime">{{ $t('button.confirm') }}</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import Tree from '../../../components/tree'
import '../../../../static/js/jquery'
export default {
  components: { Tree },
  data() {
    return {
      tipshow: false,
      time: {
        businessTime: '00:00:00', // 开店时间
        changeShiftTime: '14:00:00', // 交班时间
        stopBusinessTime: '23:00:00', // 停业时间
        closingTime: '23:59:59' // 打烊时间
      },
      disabled: true,
      isCurrentOrg: true, // 当前是否组织架构
      checkedShopData: [] // 多选的门店数据
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    isCurrentOrg(val) {
      this.init()
      this.disabled = true
    }
  },
  methods: {
    // 初始化
    init() {
      this.time.businessTime = '00:00:00'
      this.time.changeShiftTime = '14:00:00'
      this.time.stopBusinessTime = '23:00:00'
      this.time.closingTime = '23:59:59'
      if (this.checkedShopData.length === 0) {
        this.disabled = true
      }
    },
    // 获取门店时间
    getShopHours(id) {
      this.$http.gets('getShopHours', { id })
        .then(res => {
          let data = res.data || {}
          this.time.businessTime = data.businessTime || '00:00:00'
          this.time.changeShiftTime = data.changeShiftTime || '14:00:00'
          this.time.stopBusinessTime = data.stopBusinessTime || '23:00:00'
          this.time.closingTime = data.closingTime || '23:59:59'
        })
    },
    openDialog() {
      let open = this.getSeconds(this.time.businessTime)
      let change = this.getSeconds(this.time.changeShiftTime)
      let stop = this.getSeconds(this.time.stopBusinessTime)
      let close = this.getSeconds(this.time.closingTime)
      // console.log('open:' + open + '--' + 'change:' + change + '--' + 'stop:' + stop + '--' + 'close:' + close)
      // 打烊时间不能为00:00:00
      if (close == 0) {
        this.$utils.$message({
          message: this.$t('message.selectCloseTime'),
          type: 'error'
        })
        return
      }
      // 交班和停业时间为空
      if (change == 0 && stop == 0) {
        if (open >= close) {
          this.$utils.$message({
            message: this.$t('message.openLessClose'),
            type: 'error'
          })
          return
        }
      } else if (change !== 0 && stop !== 0) {
        // 交班和停业时间都不为空
        if (open >= change || change >= stop || stop >= close) {
          this.$utils.$message({
            message: this.$t('message.effectTime'),
            type: 'error'
          })
          return
        }
      } else if (change == 0) {
        // 交班时间为空
        if (stop <= open || stop >= close) {
          this.$utils.$message({
            message: this.$t('message.effectTime'),
            type: 'error'
          })
          return
        }
      } else if (stop == 0) {
        // 停业时间为空
        if (change <= open || change >= close) {
          this.$utils.$message({
            message: this.$t('message.effectTime'),
            type: 'error'
          })
          return
        }
      }
      if (this.checkedShopData.length === 0) {
        this.$message({
          message: this.$t('message.noShopId'),
          type: 'error'
        })
      } else {
        this.tipshow = true
      }
    },
    // 保存时间
    saveTime() {
      let ids = this.checkedShopData.map(item => this.isCurrentOrg ? item.id : item.orgId)
      let params = { ...this.time, ids: ids.join(',') }
      this.$http.posts('addHours', params, '', true)
        .then((res) => {
          this.tipshow = false
        })
    },
    // 时间转换为秒
    getSeconds(data) {
      let time = data.split(':')
      let sec = parseInt(time[0]) * 60 * 60 + parseInt(time[1]) * 60 + parseInt(time[2])
      return sec
    },
    isChangeTree(data) {
      this.isCurrentOrg = data
    },
    curData(data) {
      let id = this.isCurrentOrg ? data.id : data.orgId
      this.getShopHours(id)
    },
    checkedNodes(data) {
      this.checkedShopData = []
      data.forEach(item => {
        if (item.isShop === 1) {
          this.checkedShopData.push(item)
        }
      })
      if (this.checkedShopData.length !== 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color.less';
#hours {
  section {
    height: calc(100vh - 128px);
    aside {
      padding: 10px 10px 10px 2px;
      height: 100%;
      border-right: solid 1px @border1;
      overflow: hidden;
      position: relative;
    }
  }
  .el-main {
    padding: 0 0 0 8px;
    .title {
      margin: 60px 0 30px 180px;
      line-height: 25px;
      .tag {
        background: @main;
        width: 3px;
        height: 25px;
        margin-right: 10px;
      }
    }
    .hSetting {
      width: 410px;
      margin-left: 150px;
      .exp {
        color: @text5;
        font-size: 12px;
        position: absolute;
        top: 0;
        right: -230px;
        width: 220px;
      }
      .resetBtn {
        color: #333;
        background-color: #fff;
        border-color: #333;
      }
    }
  }
  @media screen and (max-width: 1400px) {
    .exp {
      position: initial !important;
    }
  }
}
</style>
