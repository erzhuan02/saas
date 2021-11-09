<template>
  <div id="register">
    <div class="box regis">
      <p class="prevStep btnClrFont hidden-xs-only" @click="toLogin">
        <i class="el-icon-back"></i>{{ $t('button.backToIndex') }}
      </p>
      <el-steps :active="3" finish-status="success" simple class="steps hidden-xs-only">
        <el-step :title="type == 1 ? $t('regis.newBusiness') : $t('regis.withFCode')"></el-step>
        <el-step :title="$t('regis.uploadPic')"></el-step>
        <el-step :title="$t('forgot.complete')"></el-step>
      </el-steps>
      <p class="words first flex-hcvc">
        <i class="el-icon-success"></i><span>{{ $t('message.waitVerify') }}</span>
      </p>
      <p class="words words1">{{ $t('message.regisMes1') }} {{ $t('message.regisMes2') }}</p>
      <p class="words">{{ $t('order.tips2') }}：021-6451 8711 {{ $t('order.tips0') }} 150</p>
      <p class="words">{{ $t('account.email') }}： support@diveo.com.cn</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      type: 1
    }
  },
  mounted() {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.goBack, false)
    }
    this.type = this.$route.query.type || 1
  },
  computed: {
    ...mapGetters(['clientType'])
  },
  methods: {
    // 返回首页
    toLogin() {
      this.$router.push('/login')
    },
    goBack() {
      this.toLogin()
      history.pushState(null, null, document.URL)
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.goBack, false)
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/css/login.less';
</style>
