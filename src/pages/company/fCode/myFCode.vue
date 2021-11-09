<template>
  <div>
    <el-tabs v-model="tab1Active">
      <el-tab-pane :label="$t('friend.offlineInvt')" name="off">
        <off-line v-if="tab1Active == 'off'"></off-line>
      </el-tab-pane>
      <el-tab-pane :label="$t('friend.onlineInvt')" name="on">
        <on-line v-if="tab1Active == 'on'"></on-line>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import OffLine from '@/pages/company/fCode/offline'
import OnLine from '@/pages/company/fCode/online'
export default {
  data() {
    return {
      tab1Active: 'off',
      button: {}
    }
  },
  mounted() {
    let params = this.$route.query.online
    if (params) {
      this.tab1Active = 'on'
    } else {
      this.tab1Active = 'off'
    }
  },
  components: { OffLine, OnLine }
}
</script>
