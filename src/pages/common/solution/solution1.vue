<template>
  <div id="solution1">
    <div class="box box1 flex-vc">
      <div class="picText">
        <div class="title">{{ $t('solution.solution1_1_1') }}</div>
        <div class="content">
          {{ $t('solution.solution1_1_2') }}
          <span class="mark">{{ $t('solution.solution1_1_3') }}</span>
          {{ $t('solution.solution1_1_4') }}
        </div>
      </div>
    </div>
    <div :class="['box2',{box2_1:language !== 'cn'}]">
      <div class="picText positionRight">
        <div class="title">{{ $t('solution.solution1_2_1') }}</div>
        <div class="content">{{ $t('solution.solution1_2_2') }}</div>
      </div>
      <div class="box"></div>
    </div>
    <div :class="['box3',{box3_1:language !== 'cn'}]">
      <div class="picText width2 positionLeft">
        <div class="title">{{ $t('solution.solution1_3_1') }}</div>
        <div class="content">{{ $t('solution.solution1_3_2') }}</div>
      </div>
      <div class="box"></div>
    </div>
    <div class="box boxC box4" :class="['box','boxC','box4',{box4_1:language !== 'cn'}]">
      <div class="picText">
        <div class="title">{{ $t('solution.solution1_4_1') }}</div>
        <div class="content">{{ $t('solution.solution1_4_2') }}</div>
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
#solution1 {
  .box1 {
    background: url(../../../assets/images/common/solution1_01.png) no-repeat
        center/cover,
      #fff;
  }
  .box2 {
    .box {
      background: url(../../../assets/images/common/solution1_02.png) no-repeat
          center/contain,
        #fff;
    }
  }
  .box2_1 .box {
    background-image: url(../../../assets/images/common/solution1_02_1.png);
  }
  .box3 .box {
    background: url(../../../assets/images/common/solution1_03.png) no-repeat
        center/contain,
      #ebebeb;
  }
  .box3_1 .box {
    background-image: url(../../../assets/images/common/solution1_03_1.png);
  }
  .box4 {
    background: url(../../../assets/images/common/solution1_04.png) no-repeat
        center/contain,
      #fff;
  }
  .box4_1 {
    background-image: url(../../../assets/images/common/solution1_04_1.png);
  }
}
@media screen and (max-width: 767px) {
  div#solution1 {
    .box1 .picText {
      width: 85%;
    }
    .box2 .picText {
      position: relative;
      top: 3rem;
      padding-top: 1rem;
    }
    .box2 .box {
      background-position: left center;
    }
    .box3 {
      background-color: #ebebeb;
      .box {
        background-position: right center;
      }
    }
  }
}
</style>
