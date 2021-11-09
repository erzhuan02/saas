<template>
  <div id="adInvoice">
    <el-tabs v-model="tabActive">
      <!-- 申请发票列表 -->
      <el-tab-pane :label="$t('invoice.reqInvoiceList')" name="invoiceList">
        <invoice-list v-if="tabActive == 'invoiceList'" :button="button"></invoice-list>
      </el-tab-pane>
      <!-- 已寄出列表 -->
      <el-tab-pane :label="$t('invoice.sentList')" name="sentList">
        <sent-list v-if="tabActive == 'sentList'"></sent-list>
      </el-tab-pane>
      <!-- 退票列表 -->
      <el-tab-pane :label="$t('invoice.refundList')" name="refundList">
        <refund-list v-if="tabActive == 'refundList'" :button="button"></refund-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import InvoiceList from '@/pages/admin/invoice/invoiceList'
import SentList from '@/pages/admin/invoice/sentList'
import RefundList from '@/pages/admin/invoice/refundList'
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
    SentList,
    RefundList
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color';
#adInvoice {
}
</style>
