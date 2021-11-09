<template>
  <div id="contract">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('tabs.formalContract')" name="first">
        <formal-contract v-if="activeName === 'first'"></formal-contract>
      </el-tab-pane>
      <el-tab-pane :label="$t('tabs.voidRecord')" name="second">
        <void-record v-if="activeName === 'second'"></void-record>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FormalContract from '@/pages/admin/contract/formalContract'
import VoidRecord from '@/pages/admin/contract/voidRecord'
export default {
  components: { FormalContract, VoidRecord },
  data() {
    return {
      activeName: 'first' // tab栏高亮
    }
  },
  created() { },
  methods: {}
}
</script>

<style lang="less" scoped>
#contract {
}
</style>
