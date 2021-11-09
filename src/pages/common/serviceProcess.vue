<template>
  <div id="serviceProcess">
    <div class="banner flex-hcvc">
      <p>{{ $t('loginFooter.serviceProcess') }}</p>
    </div>
    <div class="body">
      <div class="bodyContent">
        <img src="../../assets/images/common/serviceProcess_2.png" alt="">
        <div class="exp flex">
          <p style="position:relative;left:-5%" :style="style.flex1">{{ $t('process.process1') }}</p>
          <p :style="style.flex2">{{ $t('process.process2') }}</p>
          <p :style="style.flex3">{{ $t('process.process3') }}</p>
          <p style="position:relative;left:5%" :style="style.flex4">{{ $t('process.process4') }}</p>
        </div>
        <img class="img2" src="../../assets/images/common/serviceProcess_3.png" alt="">
        <div class="exp flex">
          <p style="position:relative;left:3%" :style="style.flex5">{{ $t('process.process5') }}</p>
          <p :style="style.flex6">{{ $t('process.process6') }}</p>
          <p style="position:relative;left:-3%" :style="style.flex7">{{ $t('loginFooter.afterSale') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: '1',
      // ismobs: false,
      style: {
        flex1: 'width:22%',
        flex2: 'width:28%',
        flex3: 'width:28%',
        flex4: 'width:22%',
        flex5: 'width:35%',
        flex6: 'width:30%',
        flex7: 'width:35%'
      }
      // stylemob: {
      //   // flex1: 'margin-left:0rem;width:8.5rem',
      //   // flex2: 'margin-left:3.15rem;width:6rem',
      //   // flex3: 'margin-left:4rem;width:9rem',
      //   // flex4: 'margin-left:4.4rem;width:6rem',
      //   // flex5: 'margin-left:0rem;width:4rem',
      //   // flex6: 'margin-left:7.75rem;width:4rem',
      //   // flex7: 'margin-left:8rem;width:4.5rem',
      //   flex1: 'width:22%',
      //   flex2: 'width:28%',
      //   flex3: 'width:28%',
      //   flex4: 'width:22%',
      //   flex5: 'width:35%',
      //   flex6: 'width:30%',
      //   flex7: 'width:35%'
      // }
    }
  },
  created() {
    // let w = document.body.clientWidth
    // if (w < 768) {
    //   this.ismobs = true
    // } else {
    //   this.ismobs = false
    // }
    // window.onresize = () => {
    //   w = document.body.clientWidth;
    //   if (w < 768) {
    //     this.ismobs = true;
    //     // console.log(11)
    //   } else {
    //     this.ismobs = false
    //     // console.log(22)
    //   }
    // }
  },
  methods: {

  },
  mounted() {
    // let w = document.body.clientWidth;
    // if (w < 768) {
    //   this.ismobs = true
    // } else {
    //   this.ismobs = false
    // }
    // window.onresize = () => {
    //   w = document.body.clientWidth;
    //   if (w < 768) {
    //     this.ismobs = true;
    //   } else {
    //     this.ismobs = false
    //   }
    // }
  }
}
</script>

<style lang="less">
@import '../../assets/color';
#serviceProcess {
  .banner {
    background: url('../../assets/images/common/serviceProcess_1.png') no-repeat
      center/cover;
  }
  .body {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
    .bodyContent {
      max-width: 820px;
    }
    img {
      display: block;
      padding-top: 1rem;
      margin: auto;
      width: 100%;
      height: auto; //兼容ie10
    }
    .img2 {
      width: 70%;
      margin: auto;
    }
    .exp {
      p {
        padding: 1rem 0;
        font-size: 20px;
        text-align: center;
      }
    }
  }
}
@media only screen and (max-width: 767px) {
  #serviceProcess {
    .body {
      .exp {
        p {
          font-size: 1.3rem;
        }
      }
    }
  }
}
</style>
