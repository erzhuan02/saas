<template>
  <div id="association">
    <el-tabs v-model="tabActive">
      <el-tab-pane :label="$t('association.tabs1')" name="first">
        <account-first v-if="tabActive === 'first'"></account-first>
      </el-tab-pane>
      <el-tab-pane :label="$t('myClients.passed')" name="second">
        <account-second v-if="tabActive === 'second'"></account-second>
      </el-tab-pane>
      <el-tab-pane :label="$t('myClients.rejected')" name="third">
        <account-third v-if="tabActive === 'third'"></account-third>
      </el-tab-pane>
      <el-tab-pane :label="$t('association.locked')" name="fourth">
        <account-fourth v-if="tabActive === 'fourth'"></account-fourth>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AccountFirst from '@/pages/admin/developer/devAccount/accountFirst'
import AccountSecond from '@/pages/admin/developer/devAccount/accountSecond'
import AccountThird from '@/pages/admin/developer/devAccount/accountThird'
import AccountFourth from '@/pages/admin/developer/devAccount/accountFourth'
export default {
  components: { AccountFirst, AccountSecond, AccountThird, AccountFourth },
  data() {
    return {
      tabActive: 'first'
    }
  },
  mounted() { }
}
</script>

<style lang="less">
</style>
