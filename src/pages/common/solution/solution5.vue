<template>
  <div id="solution5">
    <div class="box flex-vc box1">
      <div class="picText">
        <div class="title">{{ $t('solution.solution5_1_1') }}</div>
        <div class="content">{{ $t('solution.solution5_1_2') }}</div>
      </div>
    </div>
    <div :class="['box', 'boxC', 'box2', { box2_1: language !== 'cn' }]">
      <div class="picText">
        <div class="title">{{ $t('solution.solution5_2_1') }}</div>
        <div class="content">{{ $t('solution.solution5_2_2') }}</div>
      </div>
    </div>
    <div :class="['box3', { box3_1: language !== 'cn' }]">
      <div class="picText width2 positionLeft">
        <div class="title">{{ $t('solution.solution5_3_1') }}</div>
        <div class="content">{{ $t('solution.solution5_3_2') }}</div>
      </div>
      <div class="box"></div>
    </div>
    <div class="box4">
      <div class="picText width2 positionLeft">
        <div class="title">{{ $t('solution.solution5_4_1') }}</div>
        <div class="content">{{ $t('solution.solution5_4_2') }}</div>
      </div>
      <div class="box"></div>
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
#solution5 {
  .box1 {
    background: url(../../../assets/images/login/planDisplay/visual.gif)
        no-repeat center/cover,
      #fff;
  }
  .box2 {
    background: url(../../../assets/images/common/solution5_02.png) no-repeat
        center/contain,
      #fff;
  }
  .box2_1 {
    background: url(../../../assets/images/common/solution5_02_1.png) no-repeat
        center/contain,
      #fff;
  }
  .box3 {
    color: #fff;
    .box {
      background: url(../../../assets/images/common/solution5_03.png) no-repeat
          center/cover,
        #0c0c0b;
    }
  }
  .box3_1 .box {
    background-image: url(../../../assets/images/common/solution5_03_1.png);
  }
  .box4 .box {
    background: url(../../../assets/images/common/solution5_04.png) no-repeat
        center/contain,
      #fff;
  }
}
@media screen and (max-width: 767px) {
  div#solution5 {
    .box2 .box {
      background-position: left center;
    }
    .box3 {
      .picText {
        padding-bottom: 2rem;
        background: url(../../../assets/images/common/solution5_03_mob.png)
            repeat center/contain,
          #0c0c0b;
      }
      .box {
        height: 25rem;
      }
    }
    .box4 {
      .picText {
        padding-bottom: 2rem;
      }
      .box {
        background-position: -33rem center;
      }
    }
  }
}
</style>
