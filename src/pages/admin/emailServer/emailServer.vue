<template>
  <div id="emailAndServer">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('tabs.emailAndServer')" name="first">
        <settings v-if="activeName === 'first'"></settings>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Settings from '@/pages/admin/emailServer/emailServerCnfg'
// import { mapGetters } from 'vuex'
export default {
  components: {
    Settings
  },
  data() {
    return {
      activeName: 'first' // tab栏高亮
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="less">
#emailAndServer {
}
</style>
