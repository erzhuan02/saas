<template>
  <div id="versionRelease">
    <el-tabs v-model="tabActive">
      <el-tab-pane :label="$t('versionRelease.tab1')" name="publish">
        <publish v-if="tabActive === 'publish'"></publish>
      </el-tab-pane>
      <el-tab-pane :label="$t('versionRelease.tab2')" name="published">
        <published v-if="tabActive === 'published'"></published>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Publish from './publish'
import Published from './published'
export default {
  components: { Publish, Published },
  data() {
    return {
      tabActive: 'publish'
    }
  }
}
</script>

<style lang="less" scoped>
#versionRelease {
}
</style>
