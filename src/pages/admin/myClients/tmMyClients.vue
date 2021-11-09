<template>
  <div id="myClients">
    <el-tabs v-model="tabActive">
      <el-tab-pane :label="$t('myClients.audited')" name="audited">
        <Audited v-if="tabActive == 'audited'"></Audited>
      </el-tab-pane>
      <el-tab-pane :label="$t('myClients.passed')" name="passed">
        <Passed v-if="tabActive == 'passed'"></Passed>
      </el-tab-pane>
      <el-tab-pane :label="$t('myClients.rejected')" name="rejected">
        <Rejected v-if="tabActive == 'rejected'"></Rejected>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Audited from './audited'
import Passed from './passed'
import Rejected from './rejected'
export default {
  components: { Audited, Passed, Rejected },
  data() {
    return {
      tabActive: 'audited'
    }
  }
}
</script>
