<template>
  <div id="comInvoice">
    <el-tabs v-model="tabActive">
      <!-- 发票列表 -->
      <el-tab-pane :label="$t('invoice.invoiceList')" name="invoiceList">
        <invoice-list v-if="tabActive == 'invoiceList'" :button="button"></invoice-list>
      </el-tab-pane>
      <!-- 开票信息管理 -->
      <el-tab-pane :label="$t('invoice.billingInfo')" name="billingInfo">
        <billing-info v-if="tabActive == 'billingInfo'" :button="button"></billing-info>
      </el-tab-pane>
      <!-- 寄送地址 -->
      <el-tab-pane :label="$t('invoice.sendAddr')" name="sendAddress">
        <send-address v-if="tabActive == 'sendAddress'" :button="button"></send-address>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import InvoiceList from '@/pages/company/invoice/invoiceList'
import BillingInfo from '@/pages/company/invoice/billingInfo'
import SendAddress from '@/pages/company/invoice/sendAddress'
export default {
  data() {
    return {
      tabActive: 'invoiceList',
      button: {}
    }
  },
  created() {
    this.$utils.getButton(this.$route.path, 1).then(res => {
      this.button = res
    })
  },
  components: {
    InvoiceList,
    BillingInfo,
    SendAddress
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color';
#comInvoice {
}
</style>
