<template>
  <div id="userLog">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('tabs.loginLog')" name="first">
        <login-log v-if="activeName === 'first'"></login-log>
      </el-tab-pane>
      <!-- <el-tab-pane :label="$t('tabs.operationLog')" name="second">
        <operation-log v-if="activeName === 'second'"></operation-log>
      </el-tab-pane>
      <el-tab-pane :label="$t('tabs.loginDetails')" name="third" disabled>
        <login-details v-if="activeName === 'third'"></login-details>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import LoginLog from '@/pages/business/userLog/loginLog'
import OperationLog from '@/pages/business/userLog/operationLog'
import LoginDetails from '@/pages/business/userLog/loginDetails'
export default {
  components: { LoginLog, OperationLog, LoginDetails },
  data() {
    return {
      activeName: 'first' // tab栏高亮
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
#userLog {
}
</style>
