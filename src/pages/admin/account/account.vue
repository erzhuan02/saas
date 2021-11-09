<template>
  <div id="adAccount">
    <el-tabs v-model="tab1Active">
      <el-tab-pane :label="$t('tabs.peopleM')" name="user">
        <ad-user v-if="tab1Active === 'user'"></ad-user>
      </el-tab-pane>
      <el-tab-pane :label="$t('tabs.rolePM')" name="role">
        <ad-role v-if="tab1Active === 'role'"></ad-role>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AdUser from '@/pages/admin/account/adUser'
import AdRole from '@/pages/admin/account/adRole'
export default {
  name: 'AdAccount',
  components: { AdUser, AdRole },
  data() {
    return {
      tab1Active: 'user'
    }
  },
  watch: {},
  mounted() { },
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
