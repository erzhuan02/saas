<template>
  <div id="msgSeetings">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('tabs.receiveSettings')" name="first">
        <settings v-if="activeName === 'first'"></settings>
      </el-tab-pane>
      <!-- <el-tab-pane :label="$t('tabs.receiver')" name="second">
        <receiver v-if="activeName === 'second'"></receiver>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
// 引入富文本的css
import Settings from '@/pages/company/message/settings'
import Receiver from '@/pages/company/message/receiver'

export default {
  components: {
    Settings,
    Receiver
  },
  data() {
    return {
      activeName: 'first' // tab栏高亮
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {}
}
</script>

<style lang="less">
#msgSeetings {
}
</style>
