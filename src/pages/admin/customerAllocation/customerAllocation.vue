<template>
  <div id="orderMange">
    <el-tabs v-model="tabActive">
      <!-- 未分配客户 -->
      <el-tab-pane :label="$t('customerAllocation.tab1')" name="unassigned" v-if="button.unassigned">
        <unassigned :button="button" v-if="tabActive === 'unassigned'"></unassigned>
      </el-tab-pane>
      <!-- 已分配客户 -->
      <el-tab-pane :label="$t('customerAllocation.tab2')" name="allocated" v-if="button.allocated">
        <allocated :button="button" v-if="tabActive === 'allocated'"></allocated>
      </el-tab-pane>
      <!-- 我的客户 -->
      <el-tab-pane :label="$t('customerAllocation.tab3')" name="myCustomer" v-if="button.myClient">
        <my-customer :button="button" v-if="tabActive === 'myCustomer'"></my-customer>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Unassigned from '@/pages/admin/customerAllocation/unassigned'
import Allocated from '@/pages/admin/customerAllocation/allocated'
import MyCustomer from '@/pages/admin/customerAllocation/myCustomer'
export default {
  data() {
    return {
      tabActive: 'unassigned',
      button: {}
    }
  },
  created() {
    this.$utils.getButton(this.$route.path, 1).then(res => {
      this.button = res
      if (this.button.unassigned) {
        this.tabActive = 'unassigned'
        return
      }
      if (this.button.allocated) {
        this.tabActive = 'allocated'
        return
      }
      if (this.button.myClient) {
        this.tabActive = 'myCustomer'
      }
    })
  },
  methods: {},
  components: {
    MyCustomer,
    Unassigned,
    Allocated
  }
}
</script>

<style lang="less" scoped>
</style>
