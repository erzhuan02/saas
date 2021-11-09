<template>
  <div id="dingLogin">
    <!-- 头部 -->
    <!-- <div class="header flex-hbvc">
      <div @click="back"><i class="el-icon-arrow-left"></i>{{ $t('button.back') }}</div>
      <div>{{ $t('title.dingBindPage') }}</div>
      <div style="width: 35px"></div>
    </div> -->
    <!-- 内容 -->
    <div class="content">
      <div class="form">
        <el-input :placeholder="$t('placeholder.userName1')" v-model="form.username" clearable></el-input>
        <el-input type="password" :placeholder="$t('placeholder.input') + $t('common.password')" v-model="form.password" clearable></el-input>
      </div>
      <el-button type="primary" @click="login">{{ $t('button.bind') }}</el-button>
      <p class="tips">{{ $t('message.accountLink') }}</p>
    </div>
  </div>
</template>

<script>
import AES from '@/utils/aes'
import * as dd from 'dingtalk-jsapi'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      // oAuth授权所需参数
      oAuthQuery: {
        client_id: '', // 客户端id
        response_type: '', // 返回类型
        redirect_uri: '', // 回调地址
        bus_id: '' // 业务id
      }
    }
  },
  mounted() {
    // console.log(this.$route.query)
    this.oAuthQuery.client_id = this.$utils.getQueryValue('client_id')
    this.oAuthQuery.response_type = this.$utils.getQueryValue('response_type')
    this.oAuthQuery.redirect_uri = this.$utils.getQueryValue('redirect_uri', true)
    this.oAuthQuery.bus_id = this.$utils.getQueryValue('bus_id')
    document.addEventListener('backbutton', function (e) {
      e.preventDefault()
      dd.biz.navigation.close({
        onSuccess: function (result) { },
        onFail: function (er) { }
      })
    }, false)
  },
  methods: {
    back() {
      dd.biz.navigation.close({
        onSuccess: function (result) { },
        onFail: function (er) { }
      })
    },
    login() {
      if (this.form.username === '') {
        this.$utils.$message({
          message: this.$t('regis.userName') + this.$t('common.noEmpty'),
          type: 'error'
        })
        return
      }
      if (this.form.password === '') {
        this.$utils.$message({
          message: this.$t('common.password') + this.$t('common.noEmpty'),
          type: 'error'
        })
        return
      }
      let timestamp = new Date().getTime()
      let params = {
        method: 'getServerCode',
        sign: AES.encrypt(timestamp + 'getServerCode', this.$api.AES_KEY),
        timestamp: timestamp
      }
      this.form.password = AES.encrypt(this.form.username + this.form.password, this.$api.AES_KEY)
      params = { ...this.form, ...this.oAuthQuery }
      this.$http.posts('getServerCode', '', params, { showSuccessMsg: false, showErrorMsg: true })
        .then(res => {
          // console.log(decodeURIComponent(res.data.redirect_uri))
          dd.biz.navigation.replace({
            url: decodeURIComponent(res.data.redirect_uri), // 新的页面链接
            onSuccess: function (result) { },
            onFail: function (er) { }
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/color.less';
#dingLogin {
  // .header{
  //   background: @main1;
  //   line-height: 4.2rem;
  //   font-size: 1.5rem;
  //   color: #fff;
  //   padding: 0 1rem;
  // }
  .content {
    height: 100vh;
    background: @background;
    padding: 0 1rem;
    .form {
      padding: 2rem 0;
      .el-input {
        margin-top: 2rem;
      }
    }
    .el-button {
      width: 100%;
    }
    .tips {
      font-size: 0.8rem;
      color: @text5;
      text-align: center;
      padding-top: 1.5rem;
    }
  }
}
</style>
