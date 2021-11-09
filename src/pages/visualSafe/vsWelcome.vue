<template>
  <div id="welcome">
    <div class="box flex-hcvc">
      <img src="@/assets/images/logoBg.png" :alt="$t('companySign')">
      <div class="right">
        <p class="word">{{ $t('welcomeToUse') }}</p>
        <p class="website">www.six-armscloud.com</p>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
window.onmessage = e => {
  // console.log('iframe传入数据：================')
  // console.log(e)
  if (e.data && Object.prototype.toString.call(e.data) === '[object String]') {
    if (e.data.indexOf('webpack') !== -1) { } else { store.commit('LANGUAGE', e.data) }
  }
}
export default {}
</script>

<style lang="less" scoped>
@import '../../assets/color';
#welcome {
  height: 100%;
  background-color: #fff;
  .box {
    height: 100%;
    // 解决49.0谷歌低版本不能撑开flex1下高度100%的问题
    height: calc(100vh - 108px);
    img {
      display: block;
      width: auto;
      height: auto;
    }
    .right {
      padding-left: 30px;
      p {
        color: #434343;
        font-weight: bold;
        white-space: nowrap;
        @media screen and (min-width: 1024px) and (max-width: 1280px) {
          white-space: normal;
        }
        &.word {
          font-size: 42px;
          line-height: 42px;
        }
        &.website {
          font-size: 34px;
        }
      }
    }
  }
}
</style>
