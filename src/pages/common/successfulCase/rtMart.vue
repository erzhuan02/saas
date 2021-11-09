<!--sanjiang-->
<template>
  <div id="rtMart" class="coDetails">
    <div class="body">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/successfulCase' }">{{ $t('login.successfulCase') }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t('tabs.Retail') }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="bodyContent">
        <div class="newsContent">
          <h3>{{ $t('case.rtMart') }}</h3>
          <div class="h10"></div>
          <div class="text">
            <img src="../../../assets/images/demos/rtMart1.png" alt="">
            <span>
              {{ $t('case.rtMart1') }}
            </span>
            <div class="h10"></div>
            <span>
              {{ $t('case.rtMart2') }}
            </span>
            <div class="h10"></div>
            <span>
              {{ $t('case.rtMart3') }}
            </span>
            <div class="h10"></div>
            <span>
              {{ $t('case.rtMart4') }}
            </span>
            <div class="h10"></div>
            <span>
              {{ $t('case.rtMart5') }}
            </span>
            <img src="../../../assets/images/demos/rtMart2.png" alt="">
            <div class="h10"></div>
            <span>
              {{ $t('case.rtMart6') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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

<style lang="less" scoped >
#rtMart {
}
</style>
