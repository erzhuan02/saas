<template>
  <div id="adQuestion">
    <el-tabs v-model="tabActive">
      <el-tab-pane :label="$t('industry.tabs')" name="publish">
        <publish v-if="tabActive === 'publish'" ref="$publish"></publish>
      </el-tab-pane>
      <el-tab-pane :label="$t('versionRelease.published')" name="published">
        <published v-if="tabActive === 'published'"></published>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Publish from './publish'
import Published from './published'
export default {
  data() {
    return {
      tabActive: 'publish'
    }
  },
  methods: {},
  components: {
    Publish,
    Published
  }
}
</script>
