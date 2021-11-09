<template>
  <div id="voucher">
    <el-tabs v-model="tabActive" v-show="!showDetails">
      <!-- 抵用券额度 -->
      <el-tab-pane :label="$t('voucher.tab1')" name="quota">
        <quota v-if="tabActive == 'quota'" :button="button"></quota>
      </el-tab-pane>
      <!-- 已发放 -->
      <el-tab-pane :label="$t('coupon.tab2')" name="sentOut">
        <sent-out v-if="tabActive == 'sentOut'" :button="button" @show-details="showD"></sent-out>
      </el-tab-pane>
      <!-- 操作记录 -->
      <el-tab-pane :label="$t('coupon.tab3')" name="record">
        <record v-if="tabActive == 'record'" :button="button"></record>
      </el-tab-pane>
      <!-- 回收记录 -->
      <el-tab-pane :label="$t('coupon.tab4')" name="recovery">
        <recovery v-if="tabActive == 'recovery'" :button="button"></recovery>
      </el-tab-pane>
    </el-tabs>
    <!-- 已发放详情 -->
    <sent-details v-show="showDetails" :companyId="companyId" @show-page="showPage"></sent-details>
  </div>
</template>

<script>
import Quota from './quota'
import SentOut from './sentOut'
import Record from './record'
import Recovery from './recovery'
import SentDetails from './voucherSentDetails'
export default {
  data() {
    return {
      showDetails: false,
      companyId: '',
      tabActive: 'quota',
      button: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$utils.getButton(this.$route.path, 1).then(res => {
        this.button = res
      })
    })
  },
  methods: {
    showD(val) {
      this.showDetails = val.showDetails
      this.companyId = val.id
    },
    showPage(val) {
      this.showDetails = val
    }
  },
  components: {
    Quota,
    Recovery,
    SentOut,
    Record,
    SentDetails
  }
}
</script>

<style lang="less" scoped>
</style>
