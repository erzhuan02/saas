<template>
  <div id="solution3">
    <div class="box box1 flex-vc">
      <div class="picText">
        <div class="title">{{ $t('solution.solution3_1_1') }}</div>
        <div class="content">{{ $t('solution.solution3_1_2') }}</div>
      </div>
    </div>
    <div :class="['box2', { box2_1: language !== 'cn' }]">
      <div class="picText positionRight">
        <div class="title">{{ $t('solution.solution3_2_1') }}</div>
        <div class="content">{{ $t('solution.solution3_2_2') }}</div>
      </div>
      <div class="box"></div>
    </div>
    <div :class="['box3',{ box3_1: language !== 'cn' }]">
      <div class="picText positionLeft">
        <div class="title">{{ $t('solution.solution3_3_1') }}</div>
        <div class="content">{{ $t('solution.solution3_3_2') }}</div>
      </div>
      <div class="box"></div>
    </div>
    <div :class="['box', 'boxC', 'box4',{ box4_1: language !== 'cn' }]">
      <div class="picText">
        <div class="title">{{ $t('solution.solution3_4_1') }}</div>
        <div class="content">{{ $t('solution.solution3_4_2') }}</div>
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
#solution3 {
  .box1 {
    color: #ddd;
    .title {
      color: @main;
    }
    background: url(../../../assets/images/common/solution3_01.png) no-repeat
        center/cover,
      #fff;
  }
  .box2 .box {
    background: url(../../../assets/images/common/solution3_02.png) no-repeat
        center/contain,
      #fff;
  }
  .box2_1 .box {
    background-image: url(../../../assets/images/common/solution3_02_1.png);
  }
  .box3 .box {
    background: url(../../../assets/images/common/solution3_03.png) no-repeat
        center/contain,
      #ebebeb;
  }
  .box3_1 .box {
    background-image: url(../../../assets/images/common/solution3_03_1.png);
  }
  .box4 {
    height: 37rem;
    background: url(../../../assets/images/common/solution3_04.png) no-repeat
        center/contain,
      #fff;
  }
  .box4_1 {
    background-image: url(../../../assets/images/common/solution3_04_1.png);
  }
}
@media screen and (max-width: 767px) {
  div#solution3 {
    .box1 {
      padding: 0 1.5rem;
    }
    .box1 .picText {
      width: 85%;
    }
    .box2 .box {
      background-position: -4rem center;
    }
    .box3 {
      background-color: #ebebeb;
      .box {
        background-position: -34rem center;
      }
    }
    .box4 {
      background-position: 0 10rem !important;
    }
  }
}
</style>
