<template>
  <div id="afterSale">
    <div class="banner flex-hcvc">
      <p>{{ $t('process.process7') }}</p>
    </div>
    <div class="body">
      <div class="bodyContent">
        <div class="flex-hb box">
          <div class="word">
            <h2>{{ $t('afterSale.afterSale1') }}</h2>
            <p>{{ $t('afterSale.afterSale2') }}</p>
          </div>
          <img src="../../assets/images/common/afterSale1.png" alt="">
        </div>
        <div class="flex-hb box">
          <img class="hidden-xs-only" src="../../assets/images/common/afterSale2.png" alt="">
          <div class="word">
            <h2>{{ $t('afterSale.afterSale3') }}</h2>
            <p>{{ $t('afterSale.afterSale4') }}</p>
          </div>
          <img class="hidden-sm-and-up" src="../../assets/images/common/afterSale2.png" alt="">
        </div>
        <div class="flex-hb box">
          <div class="word">
            <h2>{{ $t('afterSale.afterSale6') }}</h2>
            <p>{{ $t('afterSale.afterSale5') }}</p>
          </div>
          <img src="../../assets/images/common/afterSale3.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  created() { },
  methods: {}
}
</script>

<style lang="less">
@import '../../assets/color';
@import '../../assets/css/compatibility.less';
#afterSale {
  .banner {
    background: url('../../assets/images/common/afterSale_1.png') no-repeat
      center/cover;
  }
  .body {
    padding-right: 1rem;
    padding-left: 1rem;
    .box {
      height: 15rem;
      align-items: center;
      .word {
        padding: 0 1rem;
        p {
          padding-top: 0.6rem;
          line-height: 1.8;
        }
      }
      img {
        padding: 0 1rem;
      }
    }
  }
}
@media screen and (max-width: 767px) {
  div#afterSale {
    .body {
      padding: 0 2rem 3rem;
      .box {
        height: auto;
        .justify-content(flex-start);
        .flex-wrap(wrap);
        .word {
          text-align: center;
          width: 100%;
          padding: 3rem 1rem 1rem;
          h2 {
            font-size: 1.8rem;
          }
          p {
            font-size: 1.3rem;
          }
        }
        img {
          width: 100%;
          padding: 0;
        }
      }
    }
  }
}
</style>
