<!--sanjiang-->
<template>
  <div id="lvdi" class="coDetails">
    <div class="body">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/successfulCase' }">{{ $t('login.successfulCase') }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t('tabs.Retail') }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="bodyContent">
        <div class="newsContent">
          <h3>{{ $t('case.lvdi') }}</h3>
          <div class="h10"></div>
          <div class="h10"></div>
          <div class="text">
            <span>{{ $t('case.lvdi1') }}</span>
            <img src="../../../assets/images/demos/lvdi.png" alt="">
            <span>{{ $t('case.lvdi2') }}</span>
            <div class="h10"></div>
            <span>{{ $t('case.lvdi3') }}</span>
            <div class="h10"></div>
            <span>{{ $t('case.lvdi4') }}</span>
            <div class="h10"></div>
            <span>{{ $t('case.lvdi5') }}</span>
            <br>
            <span>{{ $t('case.lvdi6') }}</span>
            <img src="../../../assets/images/demos/lvdi1.png" alt="">
            <div class="h10"></div>
            <span>{{ $t('case.lvdi7') }}</span>
            <br>
            <span>{{ $t('case.lvdi8') }}</span>
            <div>
              <img class="specialImg" :src="language == 'cn' ? require('../../../assets/images/demos/lvdi2.png') : require('../../../assets/images/demos/lvdi2_1.png')" alt="">
            </div>
            <div class="h10"></div>
            <span>{{ $t('case.lvdi9') }}</span>
            <br>
            <span>{{ $t('case.lvdi10') }}</span>
            <div class="h10"></div>
            <div>
              <img class="specialImg" :src="language == 'cn' ? require('../../../assets/images/demos/lvdi3.png') : require('../../../assets/images/demos/lvdi3_1.png')" alt="">
            </div>

            <div class="h10"></div>
            <span>{{ $t('case.lvdi11') }}</span>
            <br>
            <span>{{ $t('case.lvdi12') }}</span>
            <div class="h10"></div>
            <div>
              <img style="width: 100%" :src="language == 'cn' ? require('../../../assets/images/demos/lvdi4.png') : require('../../../assets/images/demos/lvdi4_1.png')" alt="">
            </div>
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
  computed: {
    ...mapGetters(['language'])
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
#lvdi {
  .newsContent {
    .specialImg {
      width: auto;
    }
  }
}
@media only screen and (max-width: 767px) {
  #lvdi {
    .newsContent {
      .specialImg {
        width: 50%;
      }
    }
  }
}
</style>
