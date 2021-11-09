<template>
  <div id="forgotPsd">
    <div class="findBox">
      <h3>{{ $t('forgot.findPsd') }}</h3>
      <!-- 步骤条 -->
      <el-steps :active="steps" finish-status="success" simple style="width: 86%;margin: auto;">
        <el-step :title="$t('forgot.confirmAc')"></el-step>
        <el-step :title="$t('common.identityVer')"></el-step>
        <el-step :title="$t('forgot.resetPsd')"></el-step>
        <el-step :title="$t('forgot.complete')"></el-step>
      </el-steps>
      <!-- 确认账号 -->
      <div class="step0" v-if="steps == 0">
        <div class="user flex">
          <span>{{ $t('forgot.name') }}: </span>
          <el-input v-model.trim="userName" :placeholder="$t('placeholder.input') + $t('regis.userName')" maxlength="30"></el-input>
        </div>
        <el-popover id="slideBtn" placement="top-start" width="310" v-model="visible" :disabled="isVerify" trigger="manual">
          <div id="verfifyBox"></div>
          <button slot="reference" class="pointer" id="bg" @click="verifySquare">
            <i class="el-icon-thumb" v-if="!isVerify"></i>
            <span v-if="!isVerify">{{ $t('forgot.clickToVerify') }}</span>
            <i class="el-icon-circle-check success" v-if="isVerify"></i>
            <span class="success" v-if="isVerify">{{ $t('forgot.verSuccess') }}</span>
          </button>
        </el-popover>
        <el-button class="btnClr stepOne" type="primary" @click="confirm(1)">{{ $t('button.confirm') }}</el-button>
      </div>
      <!-- 身份核验 -->
      <div class="step1" v-if="steps == 1">
        <div v-if="data.phoneNo">
          <p class="one">{{ $t('forgot.check1') }}<span> {{data.userName}} </span>{{ $t('forgot.check2') }}：</p>
          <p class="two">{{ $t('common.phone') }} <span> {{data.phoneNo}} </span></p>
          <div class="flex veri">
            <span>{{ $t('common.verification') }}</span>
            <el-input v-model.trim="verCode" :placeholder="$t('placeholder.input') + $t('common.verification')" maxlength="6"></el-input>
            <el-button v-show="sendAuthCode" @click="getAuthCode" style="width: 28%;">{{ $t('common.getVerCode') }}</el-button>
            <el-button v-show="!sendAuthCode" disabled="disabled" style="width: 28%;">{{auth_time}}s</el-button>
          </div>
          <el-button class="btnClr stepTwo" type="primary" @click="confirm(2)">{{ $t('button.confirm') }}</el-button>
          <div class="ps">
            <p>{{ $t('forgot.message') }}？</p>
            <p>1.{{ $t('forgot.message1') }}</p>
            <p>2.{{ $t('forgot.message2') }}</p>
            <p>3.{{ $t('forgot.message3') }}</p>
            <p>4.{{ $t('forgot.message4') }}</p>
          </div>
        </div>
        <div v-else class="noPhone">{{ $t('forgot.noPhone') }}</div>
      </div>
      <!-- 重置密码 -->
      <div class="step2" v-if="steps == 2">
        <el-form ref="form" :model="form" :rules="rules" label-width="200px">
          <el-form-item :label="$t('forgot.newPsd')" prop="password">
            <el-input v-model.trim="form.password" show-password class="paswordNoEye" :placeholder="$t('placeholder.input') + $t('forgot.newPsd')" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item :label="$t('forgot.newPsd2')" prop="twoPassword">
            <el-input v-model.trim="form.twoPassword" type="password" :placeholder="$t('regis.inputPasAgain')" maxlength="30"></el-input>
          </el-form-item>
        </el-form>
        <div class="flex-hcvc blocked">
          <el-button class="btnClr stepThree" type="primary" @click="confirm(3)">{{ $t('button.confirm') }}</el-button>
        </div>
      </div>
      <!-- 完成 -->
      <div class="step3" v-if="steps == 3">
        <p class="reset flex-hcvc">
          <i class="el-icon-success"></i>
          <span>{{ $t('forgot.fixed') }}</span>
        </p>
        <p class="jump">{{ $t('forgot.fixed1') }}<span class="pointer" @click="toLogin">{{ $t('realName.other2') }}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { SlideVerify } from 'vue-monoplasty-slide-verify'
import AES from '@/utils/aes'
import '../../../static/js/jquery'
import '../../../static/js/verify'
export default {
  components: {
    SlideVerify
  },
  data() {
    return {
      userType: this.$route.query.type, // 2业务用户 4开放平台 其它''企业/dvo
      steps: 0,
      userName: '',
      text: this.$t('forgot.plzVerify'),
      isVerify: false, // 是否验证成功
      verCode: '', // 校验码
      auth_time: 0,
      sendAuthCode: true,
      data: {},
      form: {
        password: '',
        twoPassword: ''
      },
      visible: false,
      timeoutId: null// X秒跳登录，离开页面清延时器
    }
  },
  computed: {
    ...mapGetters(['language']),
    rules() {
      const rules = {
        password: [
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
        twoPassword: [
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
                if (value !== this.form.password) {
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
  watch: {
    language(val) {
      // this.text = this.$t('forgot.plzVerify')
    }
  },
  created() { },
  mounted() {
    this.changeVer()
  },
  methods: {
    // 点击验证
    verifySquare() {
      this.visible = !this.visible
    },
    changeVer() {
      let _this = this
      $('#verfifyBox').slideVerify({
        type: 2,
        vOffset: 5,
        vSpace: 5,
        imgUrl: _this.$api.staticUrl + '/static/itemLogo/puzzle/',
        imgName: ['a1.png', 'a2.png', 'a3.png', 'a4.png', 'a5.png'],
        imgSize: {
          width: '280px',
          height: '200px'
        },
        blockSize: {
          width: '40px',
          height: '40px'
        },
        explain: _this.text,
        barSize: {
          width: '280px',
          height: '40px'
        },
        ready: function () { },
        success: function (obj) {
          _this.visible = false
          setTimeout(() => {
            obj.refresh()
          }, 200)
          if (_this.userName === '') {
            _this.$utils.$message({
              message: _this.$t('placeholder.input') + _this.$t('regis.userName'),
              type: 'error'
            })
            return
          }
          _this.isVerify = true
        },
        error: function () {
          _this.isVerify = false
        }
      })
    },
    // 确定
    confirm(type) {
      if (type == 1) {
        if (this.userName == '') {
          this.$utils.$message({
            type: 'error',
            message: this.$t('placeholder.input') + this.$t('regis.userName')
          })
          return
        }
        if (!this.isVerify) {
          this.$utils.$message({
            type: 'error',
            message: this.$t('forgot.plzVerify')
          })
          return
        }
        this.$http.posts1('getConfirmCoUser', { userName: this.userName, type: this.userType }, '', true)
          .then(res => {
            this.data = res.data
            this.steps = type
            if (!this.data.phoneNo) {
              this.timeoutId = setTimeout(() => {
                this.$router.push('/login')
              }, 8000)
            }
          })
          .catch(er => {
            if (typeof er === 'object') {
              this.isVerify = false
            }
          })
      }
      if (type == 2) {
        if (this.verCode == '') {
          this.$utils.$message({
            type: 'error',
            message: this.$t('placeholder.input') + this.$t('common.verification')
          })
          return
        }
        let params = {
          userName: this.userName,
          code: this.verCode,
          type: this.userType
        }
        this.$http.posts1('authVail', params, '', true)
          .then(res => {
            this.steps = type
          })
      }
      if (type == 3) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let params = {
              userName: this.userName,
              code: this.verCode,
              password: AES.encrypt(this.userName + this.form.password, this.$api.AES_KEY),
              twoPassword: AES.encrypt(this.userName + this.form.twoPassword, this.$api.AES_KEY),
              type: this.userType
            }
            this.$http.posts1('upCoUserPwd', params, '', true)
              .then(res => {
                this.steps = type
                this.toLogin('countdown')
              })
          }
        })
      }
    },
    // 获取验证码
    getAuthCode() {
      this.sendAuthCode = false
      this.auth_time = 60
      var auth_timetimer = setInterval(() => {
        this.auth_time--
        if (this.auth_time <= 0) {
          this.sendAuthCode = true
          clearInterval(auth_timetimer)
        }
      }, 1000)
      let params = {
        userName: this.userName,
        code: this.verCode,
        type: this.userType
      }
      this.$http.posts1('getCodeByUserName', params, '', true)
        .then(res => { })
    },
    toLogin(mes) {
      if (mes === 'countdown') {
        this.timeoutId = setTimeout(() => {
          this.$router.push('/login')
        }, 3000)
      } else {
        this.$router.push('/login')
      }
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/color';
#forgotPsd {
  .findBox {
    background: #fff;
    height: calc(100vh - 126px);
    margin: 10px;
    padding: 10px;
    h3 {
      margin-bottom: 20px;
    }
    .step0 {
      .user {
        width: 310px;
        margin: 40px auto 20px;
        span {
          width: 80px;
          text-align: left;
          line-height: 40px;
        }
      }
      #slideBtn {
        display: block;
        width: 100%;
        margin: auto;
        button {
          display: block;
          margin: 40px auto 0;
          width: 310px;
          height: 42px;
          color: #999;
          background: @background;
          border: 1px solid @border;
        }
        #bg {
          background: #fff;
        }
        .success {
          color: #0c8;
        }
        i {
          padding: 2px 0 0 10px;
        }
        span {
          line-height: 42px;
        }
      }
      #verfifyBox {
        width: 400px;
        height: 250px;
        margin: auto;
      }
      .stepOne {
        display: block;
        width: 310px;
        margin: 30px auto 0;
      }
    }
    .step1 {
      width: 520px;
      margin: 20px auto;
      .one {
        padding: 40px 0;
        span {
          color: @main;
        }
      }
      .two {
        margin-bottom: 20px;
      }
      .veri {
        span {
          width: 75px;
          line-height: 40px;
        }
        .el-input {
          width: 200px;
          margin-right: 20px;
        }
      }
      .stepTwo {
        display: block;
        width: 310px;
        margin: 46px auto 0;
      }
      .ps {
        margin-top: 40px;
        color: #999;
        font-size: 14px;
        line-height: 30px;
      }
      .noPhone {
        margin: 70px auto 0;
        line-height: 1.8;
        text-align: center;
      }
    }
    .step2 {
      width: 40%;
      margin: 70px auto 0;
      .blocked {
        margin-top: 50px;
      }
      .stepThree {
        margin-left: 135px;
        width: 310px;
      }
    }
    .step3 {
      width: 40%;
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
