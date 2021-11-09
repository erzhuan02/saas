<template>
  <div id="register">
    <!-- 选择注册方式 -->
    <div class="box flex-dhcvc chose">
      <el-button class="btnClr" type="warning" @click="toRegis(1)">{{ $t('regis.newBusiness') }}</el-button>
      <el-button class="btnClr button2" type="warning" @click="toRegis(2)">{{ $t('regis.withFCode') }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() { },
  methods: {
    toRegis(type) {
      this.$router.push({
        path: '/regisForm',
        query: {
          type: type
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/css/login.less';
</style>
