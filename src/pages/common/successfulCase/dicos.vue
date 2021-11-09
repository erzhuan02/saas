<template>
  <div id="dicos" class="coDetails">
    <div class="body">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/successfulCase' }">{{ $t('login.successfulCase') }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t('tabs.Catering') }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="bodyContent">
        <div class="newsContent">
          <h3>{{ $t('case.dicos') }}</h3>
          <div class="text">
            <img src="../../../assets/images/demos/dicos1.png" alt="">
            <span>
              {{ $t('case.dicos1') }}
            </span>
            <br>
            <img :src="language == 'cn' ? require('../../../assets/images/demos/dicos2.png') : require('../../../assets/images/demos/dicos2_1.png')" alt="">
            <img v-if="language == 'cn'" src="../../../assets/images/demos/dicos3.png" alt="">
            <span>{{ $t('case.dicos2') }}</span>
            <div class="h30"></div>
            <h3>{{ $t('case.dicos3') }}</h3>
            <p class="center">{{ $t('case.dicos4') }}</p>
            <div>
              <img class="specialImg" :src="language == 'cn' ? require('../../../assets/images/demos/dicos4.png') : require('../../../assets/images/demos/dicos4_1.png')" alt="">
            </div>
            <div class="h30"></div>
            <h3>{{ $t('case.dicos5') }}</h3>
            <p class="center">{{ $t('case.dicos6') }}</p>
            <div>
              <img class="specialImg" :src="language == 'cn' ? require('../../../assets/images/demos/dicos5.png') : require('../../../assets/images/demos/dicos5_1.png')" alt="">
            </div>
            <div class="h30"></div>
            <h3>{{ $t('case.dicos7') }}</h3>
            <p class="center">{{ $t('case.dicos8') }}</p>
            <div>
              <img class="specialImg" :src="language == 'cn' ? require('../../../assets/images/demos/dicos6.png') : require('../../../assets/images/demos/dicos6_1.png')" alt="">
            </div>
            <div class="h30"></div>
            <h3>{{ $t('case.dicos9') }}</h3>
            <p class="center">{{ $t('case.dicos10') }}</p>
            <img :src="language == 'cn' ? require('../../../assets/images/demos/dicos7.png') : require('../../../assets/images/demos/dicos7_1.png')" alt="">
            <span>
              {{ $t('case.dicos11') }}
            </span>
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
#dicos {
  h3,
  .center {
    text-align: center;
    padding-top: 0.5rem;
  }
}
@media only screen and (max-width: 767px) {
  #dicos {
    h3,
    .center {
      font-size: 1.3rem;
    }
  }
}
</style>
