<template>
  <div id="orderMange">
    <el-tabs v-model="tabActive">
      <!-- 待支付 -->
      <el-tab-pane :label="$t('order.toPaid')" name="toPaid">
        <to-paid v-if="tabActive === 'toPaid'"></to-paid>
      </el-tab-pane>
      <!-- 全部 -->
      <el-tab-pane :label="$t('order.all')" name="all">
        <all v-if="tabActive === 'all'"></all>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ToPaid from '@/pages/company/order/toPaid'
import All from '@/pages/company/order/all'
export default {
  data() {
    return {
      tabActive: 'toPaid'
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.query.back == 2) { // 从全部来
        vm.tabActive = 'all'
      } else { // 从待支付来
        vm.tabActive = 'toPaid'
      }
      // 从支付页面跳转来
      if (from.path == '/toPay' || from.path == '/paySuccess') {
        vm.tabActive = 'all'
      }
    })
  },
  methods: {},
  components: { ToPaid, All }
}
</script>
