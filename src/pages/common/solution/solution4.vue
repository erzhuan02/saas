<template>
  <div id="solution4">
    <div :class="['box', 'flex-vc', 'box1', {box1_1: language !== 'cn' }]">
      <div class="picText width1">
        <div class="title">{{ $t('solution.solution4_1_1') }}</div>
        <div class="content">{{ $t('solution.solution4_1_2') }}</div>
      </div>
    </div>
    <div :class="['box2', { box2_1: language !== 'cn' }]">
      <div class="picText positionRight">
        <div class="title">{{ $t('solution.solution4_2_1') }}</div>
        <div class="content">{{ $t('solution.solution4_2_2') }}</div>
      </div>
      <div class="box"></div>
    </div>
    <div :class="['box3', { box3_1: language !== 'cn' }]">
      <div class="picText positionLeft">
        <div class="title">{{ $t('solution.solution4_3_1') }}</div>
        <div class="content">{{ $t('solution.solution4_3_2') }}</div>
      </div>
      <div class="box"></div>
    </div>
    <div :class="['box', 'boxC ', 'box4',{ box4_1: language !== 'cn' }]">
      <div class="picText">
        <div class="title">{{ $t('solution.solution4_4_1') }}</div>
        <div class="content">{{ $t('solution.solution4_4_2') }}</div>
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
  computed: { ...mapGetters(['language']) },
  created() { },
  methods: {}
}
</script>

<style lang="less" scoped>
@import '../../../assets/color';
#solution4 {
  .box1 {
    background: url(../../../assets/images/common/solution4_01.png) no-repeat
        center/cover,
      #fff;
  }
  .box1_1 {
    background-image: url(../../../assets/images/common/solution4_01_1.png);
  }
  .box2 .box {
    background: url(../../../assets/images/common/solution4_02.png) no-repeat
        center/contain,
      #fff;
  }
  .box2_1 .box {
    background-image: url(../../../assets/images/common/solution4_02_1.png);
  }
  .box3 .box {
    background: url(../../../assets/images/common/solution4_03.png) no-repeat
        center/contain,
      #ebebeb;
  }
  .box3_1 .box {
    background-image: url(../../../assets/images/common/solution4_03_1.png);
  }
  .box4 {
    height: 37rem;
    background: url(../../../assets/images/common/solution4_04.png) no-repeat
        center/contain,
      #fff;
  }
  .box4_1 {
    background-image: url(../../../assets/images/common/solution4_04_1.png);
  }
}
@media screen and (max-width: 767px) {
  div#solution4 {
    .box1 {
      padding-left: 1.5rem;
      .picText {
        width: 52%;
        .title {
          padding-top: 0;
        }
        .content {
          line-height: 1.4;
        }
      }
      background-position: -11.5rem center;
    }
    .box2 .box {
      background-position: 1rem center;
    }
    .box3 {
      background-color: #ebebeb;
      .box {
        background-position: -36rem center;
      }
    }
    .box4 {
      height: 33rem;
      .picText {
        padding: 5rem 2rem 1rem 2rem;
      }
      background-position: 0 9rem !important;
    }
  }
}
</style>
