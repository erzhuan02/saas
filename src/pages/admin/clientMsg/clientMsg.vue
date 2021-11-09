<template>
  <div id="account">
    <el-tabs v-model="tabActive">
      <el-tab-pane :label="$t('clientMsg.newMsg')" name="new">
        <new v-if="tabActive == 'new'"></new>
      </el-tab-pane>
      <el-tab-pane :label="$t('clientMsg.processedMsg')" name="processed">
        <processed v-if="tabActive == 'processed'"></processed>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import New from '@/pages/admin/clientMsg/new'
import Processed from '@/pages/admin/clientMsg/processed'
export default {
  data() {
    return {
      tabActive: 'new'
    }
  },
  components: {
    New,
    Processed
  }
}
</script>

<style lang="less" scoped>
</style>
