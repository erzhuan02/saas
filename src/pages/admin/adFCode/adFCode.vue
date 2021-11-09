<template>
  <div id="adFCode">
    <el-tabs v-model="tabActive">
      <!-- 已生成的F码 -->
      <el-tab-pane :label="$t('friend.generatedFCode')" name="generated">
        <generated v-if="tabActive === 'generated'"></generated>
      </el-tab-pane>
      <!-- F码邀请的客户 -->
      <el-tab-pane :label="$t('friend.fCodeInvisted')" name="invisted">
        <invisted v-if="tabActive === 'invisted'"></invisted>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Generated from '@/pages/admin/adFCode/generated'
import Invisted from '@/pages/admin/adFCode/invisted'
export default {
  components: { Generated, Invisted },
  data() {
    return {
      tabActive: 'generated'
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
