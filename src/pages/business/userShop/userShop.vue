<template>
  <div id="userShop">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('tabs.shopMange')" name="first">
        <user-shop-mange v-if="activeName === 'first'"></user-shop-mange>
        <!-- <UserShopMange v-if="activeName === 'first'"></UserShopMange> -->
      </el-tab-pane>
      <el-tab-pane :label="$t('tabs.shopAuth')" name="second">
        <user-shop-auth v-if="activeName === 'second'"></user-shop-auth>
      </el-tab-pane>
      <el-tab-pane :label="$t('tabs.cameraAuth')" name="third">
        <user-camera-auth v-if="activeName === 'third'"></user-camera-auth>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import UserShopMange from '@/pages/business/userShop/userShopMange'
import UserShopAuth from '@/pages/business/userShop/userShopAuth'
import UserCameraAuth from '@/pages/business/userShop/userCameraAuth'
export default {
  components: {
    UserShopMange,
    UserShopAuth,
    UserCameraAuth
  },
  data() {
    return {
      activeName: 'first' // tab栏高亮
    }
  },
  computed: {},
  watch: {
    '$route': {
      handler: function (to, from) {
        // console.log('router shop', to)
        this.activeName = to.query.activeName || 'first'
      },
      immediate: true
    }
  },
  created() {
    this.$store.commit('BUSI_ORG_TREE', []) // 重置
    // 获取查询的组织架构，数据多请求的时间长，所有tab请求一次
    this.$store.dispatch('busiGetOrgTree', { url: 'getOrgTreeShop', orgType: 2 })
  },
  mounted() { },
  methods: {}
}
</script>

<style lang="less" scoped>
#userShop {
}
</style>
