<!--sanjiang-->
<template>
  <div id="srsFace" class="coDetails">
    <div class="body">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/successfulCase' }">{{ $t('login.successfulCase') }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t('tabs.Factory') }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="bodyContent">
        <div class="newsContent">
          <h3>{{ $t('case.guangda') }}</h3>
          <div class="text">
            <img src="../../../assets/images/demos/srsFace1.png" alt="">
            <span>
              {{ $t('case.guangda1') }}
            </span>
            <br>
            <span>{{ $t('case.guangda2') }}</span>
            <div class="h10"></div>
            <img src="../../../assets/images/demos/srsFace2.png" alt="">
            <span>{{ $t('case.guangda3') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped >
#srsFace {
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
