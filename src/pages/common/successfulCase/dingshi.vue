<template>
  <div id="dingshi" class="coDetails">
    <div class="body">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/successfulCase' }">{{ $t('login.successfulCase') }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t('tabs.Warehouse') }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="bodyContent">
        <div class="newsContent">
          <h3>{{ $t('case.dingshi') }}</h3>
          <div class="text">
            <img src="../../../assets/images/demos/dingshi1.png" alt="">
            <span>
              {{ $t('case.dingshi1') }}
            </span>
            <br>
            <span>{{ $t('case.dingshi2') }}</span>
            <br>
            <span>{{ $t('case.dingshi3') }}</span>
            <img v-if="language == 'cn'" src="../../../assets/images/demos/dingshi2.png" alt="">
            <div class="h10"></div>
            <span>
              {{ $t('case.dingshi4') }}
            </span>
            <div class="h10"></div>
            <img src="../../../assets/images/demos/dingshi3.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  components: {},
  computed: {
    ...mapGetters(['language'])
  },
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
#dingshi {
  // min-height: calc(100% - 347px);
  // background: #fff;
  // padding-top: 20px;
  // padding-bottom: 120px;
  // .el-breadcrumb {
  //   font-size: 16px;
  //   margin-top: 30px;
  // }
  // .h10 {
  //   height: 10px;
  // }
  // .newsContent {
  //   text-align: center;
  //   padding-top: 80px;
  //   h3 {
  //     font-size: 24px;
  //   }
  //   img {
  //     width: 100%;
  //     padding-top: 20px;
  //     padding-bottom: 20px;
  //   }
  //   span {
  //     font-size: 16px;
  //     line-height: 32px;
  //   }
  //   .text {
  //     text-align: left;
  //   }
  // }
}
</style>
