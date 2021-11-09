<!--sanjiang-->
<template>
  <div class="coDetails">
    <div class="body">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/successfulCase' }">{{ $t('login.successfulCase') }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t('tabs.Retail') }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="bodyContent">
        <div class="newsContent">
          <h3>{{ $t('case.sanjiang1') }}</h3>
          <div class="text">
            <img src="../../../assets/images/demos/newsanjiang.png" alt="">
            <span>{{ $t('case.sanjiang2') }}</span>
            <br>
            <span>{{ $t('case.sanjiang3') }}</span>
            <img src="../../../assets/images/demos/qj6989874761.png" alt="">
            <span>
              {{ $t('case.sanjiang4') }}
            </span>
            <div class="h10"></div>
            <span>{{ $t('case.sanjiang5') }}</span>
            <img :src="language == 'cn' ? require('../../../assets/images/demos/newsxiti.png') : require('../../../assets/images/demos/newsxiti_1.png')" alt="">
            <span>{{ $t('case.sanjiang6') }}</span>
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
// .news {
//   .bodyContent {
//     max-width: 810px;
//   }
//   .el-breadcrumb {
//     font-size: 16px;
//     margin-bottom: 1.5rem;
//   }
//   .h10 {
//     height: 0.5rem;
//   }
//   .newsContent {
//     text-align: center;
//     h3 {
//       font-size: 24px;
//     }
//     img {
//       padding-top: 1rem;
//       padding-bottom: 1rem;
//     }
//     span {
//       font-size: 16px;
//       line-height: 2;
//     }
//     .text {
//       text-align: left;
//     }
//   }
// }
// @media only screen and (max-width: 767px) {
//   .news {
//     .el-breadcrumb {
//       font-size: 1.3rem;
//     }
//     .newsContent {
//       h3 {
//         font-size: 1.5rem;
//       }
//       span {
//         font-size: 1.3rem;
//       }
//     }
//   }
// }
</style>
