<template>
  <div id="visual" class="coDetails">
    <div class="body">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/successfulCase' }">{{ $t('login.successfulCase') }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t('tabs.Logistics') }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="bodyContent">
        <div class="newsContent">
          <h3>{{ $t('case.visual') }}</h3>
          <div class="text">
            <img src="../../../assets/images/demos/visual1.png" alt="">
            <span>{{ $t('case.visual1') }}</span>
            <br>
            <img src="../../../assets/images/demos/visual2.png" alt="">
            <span>{{ $t('case.visual2') }}</span>
            <div class="h10"></div>
            <span>{{ $t('case.visual3') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped >
#visual {
}
</style>
<script>
export default {
  data() {
    return {}
  },
  components: {},
  beforeCreate: function () {
    // console.group('beforeCreate 创建前状态===============》');
  },
  created: function () {
    // console.group('created 创建完毕状态 初始化===============》');
  },
  beforeMount: function () {
    // console.group('beforeMount 挂载前状态===============》');
  },
  mounted: function () {
    // console.group('mounted 挂载结束状态===============》');

  },
  beforeUpdate: function () {
    // console.group('beforeUpdate 更新前状态===============》');

  },
  methods: {}
}
</script>
