<template>
  <div id="downloadApplication">
    <el-tabs v-model="tabActive">
      <el-tab-pane :label="$t('downloadApply.new')" name="new">
        <new v-if="tabActive == 'new'"></new>
      </el-tab-pane>
      <el-tab-pane :label="$t('downloadApply.processed')" name="processed">
        <processed v-if="tabActive == 'processed'"></processed>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import New from '@/pages/admin/downloadApplication/new'
import Processed from '@/pages/admin/downloadApplication/processed'
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
