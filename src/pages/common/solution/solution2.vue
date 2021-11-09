<template>
  <div id="solution2">
    <div :class="['box','flex-vc','box1',{box1_1:language !== 'cn'}]">
      <div class="picText">
        <div class="title">{{ $t('solution.solution2_1_1') }}</div>
        <div class="content">{{ $t('solution.solution2_1_2') }}</div>
      </div>
    </div>
    <div :class="['box2',{box2_1:language !== 'cn'}]">
      <div class="picText width1 positionRight">
        <div class="title">{{ $t('solution.solution2_2_1') }}</div>
        <div class="content">{{ $t('solution.solution2_2_2') }}</div>
      </div>
      <div class="box"></div>
    </div>
    <div :class="['box3',{box3_1:language !== 'cn'}]">
      <div class="picText positionLeft">
        <div class="title">{{ $t('solution.solution2_3_1') }}</div>
        <div class="content">{{ $t('solution.solution2_3_2') }}</div>
      </div>
      <div class="box"></div>
    </div>
    <div :class="['box','boxC','box4',{box4_1:language !== 'cn' }]">
      <div class="picText">
        <div class="title">{{ $t('solution.solution2_4_1') }}</div>
        <div class="content">{{ $t('solution.solution2_4_2') }}</div>
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
#solution2 {
  .box1 {
    color: @text;
    background: url(../../../assets/images/common/solution2_01.png) no-repeat
        center/cover,
      #fff;
  }
  .box1_1 {
    background-image: url(../../../assets/images/common/solution2_01_1.png);
  }
  .box2 .box {
    background: url(../../../assets/images/common/solution2_02.png) no-repeat
        center/contain,
      #fff;
  }
  .box2_1 .box {
    background-image: url(../../../assets/images/common/solution2_02_1.png);
  }
  .box3 .box {
    background: url(../../../assets/images/common/solution2_03.png) no-repeat
        center/contain,
      #ebebeb;
  }
  .box3_1 .box {
    background-image: url(../../../assets/images/common/solution2_03_1.png);
  }
  .box4 {
    background: url(../../../assets/images/common/solution2_04.png) no-repeat
        center/contain,
      #fff;
  }
  .box4_1 {
    background-image: url(../../../assets/images/common/solution2_04_1.png);
  }
}
@media screen and (max-width: 767px) {
  div#solution2 {
    .box2 .picText {
      position: relative;
      top: 3rem;
      padding-top: 1rem;
    }
    .box2 .box {
      background-position: -2rem center;
    }
    .box3 {
      background-color: #ebebeb;
      .box {
        background-position: -36rem center;
      }
    }
  }
}
</style>
