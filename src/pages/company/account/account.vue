<template>
  <div id="account">
    <el-tabs v-model="tab1Active">
      <el-tab-pane :label="$t('tabs.EAM')" name="qy">
        <el-tabs v-if="tab1Active === 'qy'" v-model="tab11Active">
          <el-tab-pane :label="$t('tabs.peopleM')" name="qyPerson">
            <bm-account-co v-if="tab11Active === 'qyPerson'"></bm-account-co>
          </el-tab-pane>
          <el-tab-pane :label="$t('tabs.rolePM')" name="qyRole">
            <bm-role v-if="tab11Active === 'qyRole'"></bm-role>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane :label="$t('tabs.BAM')" name="yw">
        <el-tabs v-if="tab1Active === 'yw'" v-model="tab21Active">
          <el-tab-pane :label="$t('tabs.peopleM')" name="ywPerson">
            <bm-user></bm-user>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BmUser from '@/pages/company/account/user'
import BmAccountCo from '@/pages/company/account/coAccount'
import BmRole from '@/pages/company/account/role'
export default {
  name: 'Account',
  components: { BmUser, BmAccountCo, BmRole },
  data() {
    return {
      tab1Active: 'qy',
      tab11Active: 'qyPerson',
      tab21Active: 'ywPerson'
    }
  },
  watch: {},
  mounted() { },
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
