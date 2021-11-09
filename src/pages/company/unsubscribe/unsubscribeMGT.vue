<template>
  <div id="unsubscribe">
    <el-tabs v-model="tabActive">
      <!-- 可退款订单 -->
      <el-tab-pane :label="$t('unsubscribe.refundOrder')" name="RefundOrder">
        <refund-order :button="button" v-if="tabActive == 'RefundOrder'"></refund-order>
      </el-tab-pane>
      <!-- 退订记录 -->
      <el-tab-pane :label="$t('unsubscribe.refundRecord')" name="RefundRecord">
        <refund-record :button="button" v-if="tabActive == 'RefundRecord'"></refund-record>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RefundOrder from '@/pages/company/unsubscribe/refundOrder'
import RefundRecord from '@/pages/company/unsubscribe/refundRecord'
export default {
  data() {
    return {
      tabActive: 'RefundOrder',
      button: {}
    }
  },
  created() {
    this.$utils.getButton(this.$route.path, 1).then(res => {
      this.button = res
    })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.path == '/refundRecordDetails') {
        vm.tabActive = 'RefundRecord'
      }
    })
  },
  components: {
    RefundOrder,
    RefundRecord
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color';
#unsubscribe {
}
</style>
