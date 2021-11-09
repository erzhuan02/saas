<template>
  <div id="orderMange">
    <el-tabs v-model="tabActive" v-show="!showDetails">
      <!-- 代金券额度 -->
      <el-tab-pane :label="$t('coupon.tab1')" name="quota">
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
    <sent-details v-show="showDetails" :couponId="couponId" @show-page="showPage"></sent-details>
  </div>
</template>

<script>
import Quota from '@/pages/admin/coupon/quota'
import SentOut from '@/pages/admin/coupon/sentOut'
import Record from '@/pages/admin/coupon/record'
import Recovery from '@/pages/admin/coupon/recovery'
import SentDetails from '@/pages/admin/coupon/couponSentDetails'
export default {
  data() {
    return {
      showDetails: false,
      couponId: '',
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
      this.couponId = val.id
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
