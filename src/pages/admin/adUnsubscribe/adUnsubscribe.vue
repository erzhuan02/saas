<template>
  <div id="adUnsubscribe">
    <el-tabs v-model="tabActive">
      <!-- 退订记录 -->
      <el-tab-pane :label="$t('unsubscribe.refundRecord')" name="unsubscribeRecord">
        <unsubscribe-record v-if="tabActive == 'unsubscribeRecord'"></unsubscribe-record>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import UnsubscribeRecord from '@/pages/admin/adUnsubscribe/unsubscribeRecord'
export default {
  data() {
    return {
      tabActive: 'unsubscribeRecord'
    }
  },
  components: {
    UnsubscribeRecord
  }
}
</script>

<style lang="less" scoped>
</style>
