<template>
  <div id="solution6">
    <div :class="['box', 'flex-vc','box1', { box1_1: language !== 'cn' }]">
      <div class="picText">
        <div class="title">{{ $t('solution.solution6_1_1') }}</div>
        <div class="content">{{ $t('solution.solution6_1_2') }}</div>
      </div>
    </div>
    <div :class="['box2', { box2_1: language !== 'cn' }]">
      <div class="picText width2 positionRight">
        <div class="title">{{ $t('solution.solution6_2_1') }}</div>
        <div class="content">{{ $t('solution.solution6_2_2') }}</div>
      </div>
      <div class="box"></div>
    </div>
    <div :class="['box3',{ box3_1: language !== 'cn' }]">
      <div class="picText width2 positionLeft">
        <div class="title">{{ $t('solution.solution6_3_1') }}</div>
        <div class="content">{{ $t('solution.solution6_3_2') }}</div>
      </div>
      <div class="box"></div>
    </div>
    <div :class="['box4',{ box4_1: language !== 'cn'}]">
      <div class="picText positionLeft">
        <div class="title">{{ $t('solution.solution6_4_1') }}</div>
        <div class="content">{{ $t('solution.solution6_4_2') }}</div>
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
#solution6 {
  .box1 {
    background: url(../../../assets/images/login/planDisplay/face.gif) no-repeat
        center/cover,
      #fff;
  }
  .box1_1 {
    background-image: url(../../../assets/images/login/planDisplay/face_1.gif);
  }
  .box2 .box {
    background: url(../../../assets/images/common/solution6_02.png) no-repeat
        center/contain,
      #fff;
  }
  .box2_1 .box {
    background-image: url(../../../assets/images/common/solution6_02_1.png);
  }
  .box3 {
    color: #fff;
  }
  .box3 .box {
    background: url(../../../assets/images/common/solution6_03.png) no-repeat
        center/cover,
      #fff;
  }
  .box3_1 .box {
    background-image: url(../../../assets/images/common/solution6_03_1.png);
  }
  .box4 .box {
    background: url(../../../assets/images/common/solution6_04.png) no-repeat
        center/contain,
      #fff;
  }
  .box4_1 .box {
    background-image: url(../../../assets/images/common/solution6_04_1.png);
  }
}
@media screen and (max-width: 767px) {
  div#solution6 {
    .box1 {
      background-image: url(../../../assets/images/common/solution6_01_cn_mob.gif);
      background-position: -11rem center;
      .picText {
        width: 60%;
      }
    }
    .box1_1 {
      background-image: url(../../../assets/images/common/solution6_01_en_mob.gif);
    }
    .box2 .box {
      background-position: -1.5rem center;
    }
    .box3 {
      .picText {
        padding-top: 2rem;
        padding-bottom: 2rem;
        color: @text;
      }
      .box {
        height: 20rem;
      }
    }
    .box4 {
      .picText {
        position: relative;
        top: 2rem;
      }
      .box {
        // height: 27rem;
        // width: 130%;
        background-position: -33rem -1rem;
      }
    }
  }
}
</style>
