<template>
  <div id="dingxin" class="coDetails">
    <div class="body">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/successfulCase' }">{{ $t('login.successfulCase') }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t('tabs.Catering') }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="bodyContent">
        <div class="newsContent">
          <h3>{{ $t('case.dingxin') }}</h3>
          <div class="text">
            <img src="../../../assets/images/demos/dingxin1.png" alt="">
            <span>{{ $t('case.dingxin1') }}</span>
            <br>
            <span>{{ $t('case.dingxin2') }}</span>
            <img src="../../../assets/images/demos/dingxin2.png" alt="">
            <div class="h10"></div>
            <span>{{ $t('case.dingxin3') }}</span>
            <div class="h10"></div>
            <img class="specialImg" :src="language == 'cn' ? require('../../../assets/images/demos/dingxin3.png') : require('../../../assets/images/demos/dingxin3_1.png')" alt="">
            <div class="h10"></div>
            <span>{{ $t('case.dingxin4') }}</span>
            <div class="h10"></div>
            <img class="specialImg" :src="language == 'cn' ? require('../../../assets/images/demos/dingxin4.png') : require('../../../assets/images/demos/dingxin4_1.png')" alt="">
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
#dingxin {
}
// .news {
//   min-height: calc(100% - 347px);
//   background: #fff;
//   padding-top: 20px;
//   padding-bottom: 120px;
//   .el-breadcrumb {
//     font-size: 16px;
//     margin-top: 30px;
//   }
//   .h10 {
//     height: 10px;
//   }
//   .newsContent {
//     text-align: center;
//     padding-top: 80px;
//     h3 {
//       font-size: 24px;
//     }
//     img {
//       width: 100%;
//       margin: 20px auto;
//       display: block;
//       &.phone {
//         width: 526px;
//         margin: auto;
//       }
//     }
//     span {
//       font-size: 16px;
//       line-height: 32px;
//     }
//     .text {
//       text-align: left;
//     }
//   }
// }
// @media only screen and (max-width: 767px) {
//   .w810 {
//     width: 90%;
//   }
//   .news {
//     padding-top: 1rem;
//     padding-bottom: 6rem;
//     .el-breadcrumb {
//       font-size: 1.3rem;
//       margin-top: 1.5rem;
//     }
//     .newsContent {
//       padding-top: 2rem;
//       h3 {
//         font-size: 1.8rem;
//       }
//       img {
//         width: 100%;
//       }
//       img.phone {
//         width: 100%;
//       }
//       span {
//         font-size: 1.3rem;
//         line-height: 2rem;
//       }
//     }
//   }
// }
</style>
