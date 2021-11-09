<template>
  <div id="changePsd">
    <div class="findBox">
      <h3>{{ $t('basicInfo.modifyPsd') }}</h3>
      <!-- 步骤条 -->
      <el-steps :active="steps" finish-status="success" simple style="width: 86%;margin: auto;">
        <el-step :title="$t('common.identityVer')"></el-step>
        <el-step :title="$t('basicInfo.modifyPsd')"></el-step>
        <el-step :title="$t('forgot.complete')"></el-step>
      </el-steps>
      <!-- 身份核验 -->
      <div class="step1" v-if="steps == 0">
        <p class="one">{{ $t('forgot.check1') }}<span> {{userName}} </span>{{ $t('basicInfo.check1') }}：</p>
        <p class="two">{{ $t('common.phone') }} <span> {{phone}} </span></p>
        <div class="flex-vc veri">
          <span style="color:#f00;padding-right:3px;line-height:40px">*</span>
          <span>{{ $t('common.phoneCode') }}</span>
          <el-input v-model.trim="verCode" :placeholder="$t('placeholder.input') + $t('common.verification')" maxlength="6"></el-input>
          <el-button v-show="sendAuthCode" type="primary" @click="getAuthCode">{{ $t('common.getVerCode') }}</el-button>
          <el-button v-show="!sendAuthCode" style="width: 92px;margin-left: 0" disabled>{{auth_time}}s</el-button>
        </div>
        <div class="flex-hcvc">
          <el-button class="stepTwo resetCancel" @click="backTo">{{ $t('button.cancel') }}</el-button>
          <el-button class="btnClr stepTwo" type="primary" @click="confirm(0)">{{ $t('button.confirm') }}</el-button>
        </div>
      </div>
      <!-- 修改手机号码 -->
      <div class="step2" v-if="steps == 1">
        <el-form ref="form" :model="form" :rules="rules" label-width="200px">
          <el-form-item :label="$t('placeholder.input') + $t('forgot.newPsd')" prop="passwordOne">
            <el-input v-model.trim="form.passwordOne" show-password class="paswordNoEye" :placeholder="$t('placeholder.input') + $t('forgot.newPsd')" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item :label="$t('forgot.newPsd2')" prop="passwordTwo">
            <el-input v-model.trim="form.passwordTwo" type="password" :placeholder="$t('regis.inputPasAgain')" maxlength="30"></el-input>
          </el-form-item>
        </el-form>
        <div class="flex-hcvc blocked">
          <el-button class="stepTwo resetCancel" @click="prev">{{ $t('button.cancel') }}</el-button>
          <el-button class="btnClr stepThree" type="primary" @click="confirm(1)">{{ $t('button.confirm') }}</el-button>
        </div>
      </div>
      <!-- 完成 -->
      <div class="step3" v-if="steps == 2">
        <p class="reset flex-hcvc">
          <i class="el-icon-success"></i>
          <span>{{ $t('basicInfo.successPsd') }}</span>
        </p>
        <p class="jump">{{ $t('forgot.fixed1') }}<span class="pointer" @click="backTo('login')">{{ $t('realName.other2') }}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AES from '@/utils/aes'
export default {
  data() {
    return {
      menuItem: [],
      steps: 0,
      phone: '',
      userName: '',
      verCode: '', // 短信验证码
      auth_time: 0,
      sendAuthCode: true,
      data: {},
      form: {
        passwordOne: '',
        passwordTwo: ''
      },
      auth_timetimer: null,
      clearTime: null
    }
  },
  mounted() {
    this.phone = JSON.parse(sessionStorage.getItem('userData')).phoneNumb || ''
    this.userName = JSON.parse(sessionStorage.getItem('userData')).userName || ''
    // 强制给左侧导航加class保持高亮
    this.$nextTick(() => {
      this.menuItem = document.getElementsByClassName('el-menu-item')
      for (let i of this.menuItem) {
        if (i.innerText === '基本信息' || i.innerText === 'Basic Information') {
          i.classList.add('is-active')
        }
      }
    })
  },
  beforeRouteLeave(to, from, next) {
    if (to.path !== '/bmBasicInfo') {
      for (let i of this.menuItem) {
        if (i.innerText == '基本信息' || i.innerText === 'Basic Information') {
          i.classList.remove('is-active')
        }
      }
    }
    next()
  },
  watch: {
    language(val) {
      // this.text = this.$t('forgot.plzVerify')
    }
  },
  computed: {
    ...mapGetters(['language']),
    rules() {
      const rules = {
        passwordOne: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              var cnChar = this.$utils.reg.cnChar
              var psdReg = this.$utils.reg.password
              if (value == '') {
                callback(new Error(this.$t('placeholder.input') + this.$t('common.password')))
              } else {
                if (cnChar.test(value)) {
                  callback(new Error(this.$t('placeholder.notCnChar')))
                  return
                }
                if (!psdReg.test(value)) {
                  callback(new Error(this.$t('message.inputPassword')))
                  return
                }
                callback()
              }
            }
          }
        ],
        passwordTwo: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              var cnChar = this.$utils.reg.cnChar
              var psdReg = this.$utils.reg.password
              if (value == '') {
                callback(new Error(this.$t('regis.inputPasAgain')))
              } else {
                if (cnChar.test(value)) {
                  callback(new Error(this.$t('placeholder.notCnChar')))
                  return
                }
                if (!psdReg.test(value)) {
                  callback(new Error(this.$t('message.inputPassword')))
                  return
                }
                if (value !== this.form.passwordOne) {
                  callback(new Error(this.$t('message.psdNotSame')))
                  return
                }
                callback()
              }
            }
          }
        ]
      }
      return rules
    }
  },
  methods: {
    // 获取验证码
    getAuthCode() {
      this.sendAuthCode = false
      this.auth_time = 60
      this.auth_timetimer = setInterval(() => {
        this.auth_time--
        if (this.auth_time <= 0) {
          this.sendAuthCode = true
          clearInterval(this.auth_timetimer)
        }
      }, 1000)
      this.$http.posts('getVerifyCode', '', '', { showSuccessMsg: false, showErrorMsg: true })
        .then(res => { })
        .catch(er => {
          this.auth_time = 60
          this.sendAuthCode = true
          clearInterval(this.auth_timetimer)
        })
    },
    // 确定
    confirm(type) {
      if (!type) {
        if (this.verCode == '') {
          this.$utils.$message({
            type: 'error',
            message: this.$t('placeholder.input') + this.$t('common.phoneCode')
          })
          return
        }
        let params = {
          verifyCode: this.verCode,
          status: 1 // 1手机号 2邮箱
        }
        this.$http.posts('codeVerify', '', params).then(res => {
          this.steps = 1
          this.auth_time = 60
          this.sendAuthCode = true
          clearInterval(this.auth_timetimer)
        })
      } else {
        let params = { ...this.form }
        params.passwordOne = AES.encrypt(this.userName + this.form.passwordOne, this.$api.AES_KEY)
        params.passwordTwo = AES.encrypt(this.userName + this.form.passwordTwo, this.$api.AES_KEY)
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$http.posts('editPassword', '', params, { showSuccessMsg: false, showErrorMsg: true })
              .then(res => {
                this.steps = 2
                this.backTo('countdown')
              })
          }
        })
      }
    },
    backTo(mes) {
      if (mes === 'countdown') {
        this.clearTime = setTimeout(() => {
          this.$router.push('/login')
        }, 3000)
      } else if (mes === 'login') {
        this.$router.push('/login')
      } else {
        this.$router.push('/bmBasicInfo')
      }
    },
    prev() {
      // this.steps = 0
      this.$router.push('/bmBasicInfo')
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem('basicInfo')
    clearInterval(this.clearTime)
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color';
#changePsd {
  .findBox {
    background: #fff;
    height: calc(100vh - 126px);
    margin: 10px;
    padding: 10px;
    h3 {
      margin-bottom: 20px;
    }
    .step1 {
      width: 550px;
      margin: 20px auto;
      .one {
        padding: 40px 0 12px 0;
        margin-bottom: 30px;
        border-bottom: solid 1px @text4;
        span {
          color: @main;
        }
      }
      .two {
        margin-bottom: 20px;
      }
      .veri {
        span {
          padding-right: 10px;
          line-height: 40px;
        }
        .el-input {
          width: 240px;
          margin-right: 20px;
        }
      }
      .stepTwo {
        margin: 46px 15px;
      }
    }
    .step2 {
      width: 550px;
      margin: 70px auto 0;
      .blocked {
        margin-top: 50px;
      }
      .stepThree {
        margin-left: 135px;
      }
    }
    .step3 {
      width: 50%;
      margin: 100px auto 0;
      text-align: center;
      .reset {
        color: @main;
        font-size: 24px;
        line-height: 36px;
        text-align: center;
        i {
          font-size: 36px;
          margin-right: 5px;
        }
      }
      .jump {
        padding-top: 22px;
        span {
          color: #638cfc;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
