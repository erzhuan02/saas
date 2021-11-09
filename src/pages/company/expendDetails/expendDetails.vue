<template>
  <div id="orderMange">
    <el-tabs v-model="tabActive">
      <!-- 流水详单 -->
      <el-tab-pane :label="$t('expend.flowSheet')" name="flowSheet">
        <flow-sheet></flow-sheet>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FlowSheet from '@/pages/company/expendDetails/flowSheet'
export default {
  components: { FlowSheet },
  data() {
    return {
      tabActive: 'flowSheet'
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
