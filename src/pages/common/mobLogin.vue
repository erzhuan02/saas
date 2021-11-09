<template>
  <div class="mobLogin flex-dvc">
    <span class="logo logo1" v-if="language == 'cn'">
      <img src="../../assets/images/moblogo.png" alt />
    </span>
    <span class="logo logo2" v-else>
      <img src="../../assets/images/moblogo_1.png" alt />
    </span>
    <div class="logins">
      <div @click="LoginApp">{{ $t('login.login') }} APP</div>
      <div @click="toRegis">{{ $t('login.NewUser') }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['language'])
  },
  methods: {
    toRegis() {
      this.$router.push('/regis')
    },
    LoginApp() {
      var ua = window.navigator.userAgent.toLowerCase()
      // console.log(111)
      // //微信
      // if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      //   window.location.href = 'downLoadForPhone';
      // } else {//非微信浏览器
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        var loadDateTime = new Date()
        // window.setTimeout(function () {
        var timeOutDateTime = new Date()
        // if (timeOutDateTime - loadDateTime < 5000) {
        window.location = 'https://apps.apple.com/us/app/%E5%85%AD%E8%87%82%E4%BA%91/id1488276940'// ios下载地址
        //   } else {
        //     window.close();
        //   }
        // }, 2000);
        // window.location = "schema://";
      } else if (navigator.userAgent.match(/android/i)) {
        // var state = null
        // try {
        // window.location = 'schema://';
        // setTimeout(function () {
        this.getNewVersion()
        // window.location = 'https://sixarms-download.obs.cn-east-2.myhuaweicloud.com/Androidapp/Six-ArmsCloud-Ver1.0.0.9-20200327_164403.apk' // android下载地址
        // }, 500);
        // } catch (e) { }
      }
      // }
    },
    // 获取最新版本
    getNewVersion() {
      this.$http.posts1('getNewVersion', {}, '', { showSuccessMsg: false, showErrorMsg: true })
        .then(res => {
          let data = res.data
          window.location = data.fileUrl
        })
    }
  }
}
</script>

<style lang="less">
.mobLogin {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #f4f4f4;
  padding-top: 6rem;
  text-align: center;
  .logo {
    width: 168px;
    height: 142px;
    background: #fff;
    border-radius: 0.5rem;
    box-sizing: border-box;
  }
  .logo1 {
    padding-top: 52px;
    img {
      width: 141px;
      height: 44px;
    }
  }
  .logo2 {
    padding-top: 57px;
    img {
      width: 143px;
      height: 26px;
    }
  }
  .logins {
    margin-top: 4.5rem;
    div {
      width: 100%;
      height: 4.5rem;
      width: 18rem;
      line-height: 4.5rem;
      border-radius: 0.5rem;
      font-size: 1.3rem;
    }
    div:nth-child(1) {
      background: #f6a93b;
      color: #fff;
      margin-bottom: 2rem;
    }
    div:nth-child(2) {
      border: 1px solid #7a7a7a;
      color: #7a7a7a;
      margin-bottom: 2rem;
    }
  }
}
</style>
