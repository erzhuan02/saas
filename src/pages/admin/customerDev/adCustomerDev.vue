<template>
  <div id="customerDev">
    <el-tabs v-model="tabActive">
      <!-- 已邀请的客户 -->
      <el-tab-pane :label="$t('friend.invisted')" name="invited">
        <invisted v-if="tabActive === 'invited'"></invisted>
      </el-tab-pane>
      <!-- 已报备的客户 -->
      <el-tab-pane :label="$t('friend.filed')" name="filed">
        <filed v-if="tabActive === 'filed'" :button="button"></filed>
      </el-tab-pane>
      <!-- 线上邀请 -->
      <el-tab-pane :label="$t('friend.onlineInvt')" name="online">
        <on-line v-if="tabActive === 'online'"></on-line>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Invisted from '@/pages/admin/customerDev/invisted'
import Filed from '@/pages/admin/customerDev/filed'
import OnLine from '@/pages/admin/customerDev/online'
export default {
  data() {
    return {
      tabActive: 'invited',
      button: {}
    }
  },
  created() {
    this.$utils.getButton(this.$route.path, 1).then(res => {
      this.button = res
    })
  },
  methods: {},
  components: {
    OnLine,
    Invisted,
    Filed
  }
}
</script>

<style lang="less" scoped>
</style>
