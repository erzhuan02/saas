<template>
  <div id="adDingding">
    <el-tabs v-model="tabActive">
      <!-- 钉钉域名管理 -->
      <el-tab-pane :label="$t('dingding.tabs1')" name="dingTalk">
        <ding-talk v-if="tabActive == 'dingTalk'"></ding-talk>
      </el-tab-pane>
      <!-- 推流域名管理 -->
      <el-tab-pane :label="$t('dingding.tabs2')" name="pushStream">
        <push-stream v-if="tabActive == 'pushStream'"></push-stream>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DingTalk from './dingTalk'
import PushStream from './pushStream'
export default {
  components: { DingTalk, PushStream },
  data() {
    return {
      tabActive: 'dingTalk'
    }
  },
  mounted() { }
}
</script>
