<template>
  <div id="solution">
    <solution1 v-if="activeName === '1'"></solution1>
    <solution2 v-else-if="activeName === '2'"></solution2>
    <solution3 v-else-if="activeName === '3'"></solution3>
    <solution4 v-else-if="activeName === '4'"></solution4>
    <solution5 v-else-if="activeName === '5'"></solution5>
    <solution6 v-else-if="activeName === '6'"></solution6>
    <solution7 v-else-if="activeName === '7'"></solution7>
    <solution1 v-else></solution1>
  </div>
</template>

<script>
import Solution1 from '@/pages/common/solution/solution1'
import Solution2 from '@/pages/common/solution/solution2'
import Solution3 from '@/pages/common/solution/solution3'
import Solution4 from '@/pages/common/solution/solution4'
import Solution5 from '@/pages/common/solution/solution5'
import Solution6 from '@/pages/common/solution/solution6'
import Solution7 from '@/pages/common/solution/solution7'
export default {
  components: { Solution1, Solution2, Solution3, Solution4, Solution5, Solution6, Solution7 },
  data() {
    return {
      activeName: '1'
    }
  },
  watch: {
    '$route': {
      handler: function (to, from) {
        this.activeName = to.params.id || '1'
      },
      immediate: true
    }
  },
  created() { }
}
</script>

<style lang="less">
@import '../../../assets/color';
#solution {
  & > div {
    & > div {
      position: relative;
    }
    .box {
      height: 625px;
      background-color: #fff;
    }
    .box1 {
      color: #fff;
      height: 815px;
      padding: 0 7%;
      .picText {
        .title {
          font-size: 50px;
          width: 210%;
          max-width: calc(100vw - 4rem);
        }
      }
    }
    // 文字在中间
    .boxC {
      .picText {
        padding: 60px 15% 0 15%;
        width: auto;
        text-align: center;
        background-color: #fff;
      }
    }
  }
  // 图片的文字
  .positionLeft {
    position: absolute;
    left: 7%;
    top: 50%;
    transform: translateY(-50%);
  }
  .positionRight {
    position: absolute;
    right: 7%;
    top: 50%;
    transform: translateY(-50%);
  }
  .picText {
    width: 43%;
    .title {
      font-size: 36px;
      padding-bottom: 0.5rem;
    }
    .content {
      font-size: 22px;
      line-height: 1.8;
    }
  }
  .mark {
    color: @main;
  }
  .width1 {
    width: 40%;
  }
  .width2 {
    width: 36%;
  }
}
@media screen and (max-width: 767px) {
  div#solution {
    & > div {
      .box {
        height: 31rem;
        &:not(.boxC) {
          background-size: cover !important;
        }
      }
      .box1 {
        height: 36rem;
        padding: 0 2rem;
        .picText {
          width: 43%;
          padding: 0;
          .title {
            font-size: 2.5rem;
            // max-width: 34rem;
            text-align: left;
          }
        }
        .width40 {
          width: 40%;
        }
      }
      // 文字在中间
      .boxC {
        background-position: 0 9rem !important;
        .picText {
          padding: 6rem 3rem 1rem;
        }
      }
    }
    // 图片的文字
    .positionLeft {
      position: static;
      left: 0;
      top: 0;
      transform: translateY(0);
    }
    .positionRight {
      position: static;
      left: 0;
      top: 0;
      transform: translateY(0);
    }
    .picText {
      width: 100%;
      padding: 3rem 3rem 0;
      .title {
        font-size: 1.8rem;
        text-align: center;
      }
      .content {
        font-size: 1.3rem;
      }
    }
    .width40 {
      width: 100%;
    }
    .width38 {
      width: 100%;
    }
  }
}
</style>
