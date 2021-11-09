<template>
  <div id="solution7">
    <div :class="['box', 'flex-vc', 'box1', { box1_1: language !== 'cn' }]">
      <div class="picText width1">
        <div class="title">{{ $t('solution.solution7_1_1') }}</div>
        <div class="content">{{ $t('solution.solution7_1_2') }}</div>
      </div>
    </div>
    <div :class="['box2', { box2_1: language !== 'cn' }]">
      <div class="picText width1 positionRight">
        <div class="title">{{ $t('solution.solution7_2_1') }}</div>
        <div class="content">{{ $t('solution.solution7_2_2') }}</div>
      </div>
      <div class="box"></div>
    </div>
    <div :class="['box3', { box3_1: language !== 'cn' }]">
      <div class="picText positionLeft">
        <div class="title">{{ $t('solution.solution7_3_1') }}</div>
        <div class="content">{{ $t('solution.solution7_3_2') }}</div>
      </div>
      <div class="box"></div>
    </div>
    <div :class="['box4',{box4_1:language !== 'cn'}]">
      <div class="picText positionRight">
        <div class="title">{{ $t('solution.solution7_4_1') }}</div>
        <div class="content">{{ $t('solution.solution7_4_2') }}</div>
      </div>
      <div class="box"></div>
    </div>
    <div :class="['box', 'boxC', 'box5', { box5_1: language !== 'cn' }]">
      <div class="picText">
        <div class="title">{{ $t('solution.solution7_5_1') }}</div>
        <div class="content">{{ $t('solution.solution7_5_2') }}</div>
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
#solution7 {
  .box1 {
    .title {
      color: @main;
    }
    background: url(../../../assets/images/common/solution7_01.png) no-repeat
        center/cover,
      #fff;
  }
  .box2 .box {
    background: url(../../../assets/images/common/solution7_02.png) no-repeat
        center/contain,
      #fff;
  }
  .box2_1 .box {
    background-image: url(../../../assets/images/common/solution7_02_1.png);
  }

  .box3 .box {
    background: url(../../../assets/images/common/solution7_03.png) no-repeat
        center/contain,
      #f5f5f5;
  }
  .box3_1 .box {
    background-image: url(../../../assets/images/common/solution7_03_1.png);
  }
  .box4 .box {
    height: 33rem;
    background: url(../../../assets/images/common/solution7_04.png) no-repeat
        center/contain,
      #fff;
  }
  .box4_1 .box {
    background-image: url(../../../assets/images/common/solution7_04_1.png);
  }
  .box5 {
    height: 37rem;
    .picText {
      padding-top: 30px;
      background-color: #f5f5f5;
    }
    background: url(../../../assets/images/common/solution7_05.png) no-repeat
        center/contain,
      #f5f5f5;
  }
  .box5_1 {
    background-image: url(../../../assets/images/common/solution7_05_1.png);
  }
}
@media screen and (max-width: 767px) {
  div#solution7 {
    .box2 .picText {
      position: relative;
      top: 3rem;
    }
    .box2 .box {
      background-position: -4rem -1rem;
    }
    .box3 {
      .picText {
        position: relative;
        top: 3rem;
      }
      background-color: #f4f4f4;
      .box {
        background-position: -33rem -1rem;
      }
    }
    .box4 .box {
      background-position: left center;
    }
    .box5 {
      .picText {
        padding-top: 5rem;
      }
      background-position: 0 11rem !important;
    }
  }
}
</style>
