<template>
  <div id="register">
    <div class="box regis" v-show="isShow.register">
      <p class="prevStep btnClrFont hidden-xs-only" @click="prevTo('btn')">
        <i class="el-icon-back"></i>{{ $t('button.prev') }}
      </p>
      <el-steps :active="1" finish-status="success" simple class="steps hidden-xs-only">
        <el-step :title="form.type == 1 ? $t('regis.newBusiness') : $t('regis.withFCode')"></el-step>
        <el-step :title="$t('regis.uploadPic')"></el-step>
        <el-step :title="$t('forgot.complete')"></el-step>
      </el-steps>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px" class="regForm">
        <el-form-item v-if="form.type == 2" :label="$t('basicInfo.FNum')" prop="beInvitedCode">
          <el-input :placeholder="$t('placeholder.input') + $t('basicInfo.FNum')" v-model.trim="form.beInvitedCode" :disabled="fCode !== '' && fCode !== undefined"></el-input>
        </el-form-item>
        <el-form-item :label="$t('realName.enterName')" prop="companyName">
          <el-input :placeholder="$t('placeholder.input') + $t('realName.enterName')" v-model="form.companyName" maxlength="128"></el-input>
        </el-form-item>
        <el-form-item :label="$t('regis.agentName')" prop="agentName">
          <el-input :placeholder="$t('placeholder.input') + $t('regis.agentName')" v-model.trim="form.agentName" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item :label="$t('regis.realName')" prop="realName">
          <el-input :placeholder="$t('placeholder.input') + $t('regis.realName')" v-model="form.realName" maxlength="16"></el-input>
        </el-form-item>
        <el-form-item :label="$t('regis.userName')" prop="userName">
          <el-input :placeholder="$t('placeholder.input') + $t('regis.userName')" v-model="form.userName" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.password')" prop="password">
          <el-input :placeholder="$t('placeholder.input') + $t('common.password')" v-model.trim="form.password" maxlength="20" show-password class="paswordNoEye"></el-input>
        </el-form-item>
        <el-form-item :label="$t('regis.reInput')" prop="passwordTwo">
          <el-input type="password" :placeholder="$t('account.pasAgain')" v-model.trim="form.passwordTwo" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.email')" prop="emailAddr">
          <el-input v-model.trim="form.emailAddr" :placeholder="$t('regis.inputEmail')" maxlength="50" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.emailCode')" prop="emailCode">
          <div class="flex-hb">
            <el-input v-model.trim="form.emailCode" :placeholder="$t('placeholder.input')" maxlength="6" clearable style="width: 70%"></el-input>
            <el-button v-show="sendEmailCode" class="btnClr" type="warning" style="width: 28%;padding: 12px 0;" @click="getEmailCode">{{ $t('realName.getVerCode1') }}</el-button>
            <el-button v-show="!sendEmailCode" class="btnNClick" type="info" disabled style="width: 28%;padding: 12px 0;">{{authEmail_time}}s</el-button>
          </div>
        </el-form-item>
        <el-form-item :label="$t('regis.phone')" prop="phoneNumb">
          <el-select v-model="phonePrefix" filterable :placeholder="$t('placeholder.select')" class="prefix">
            <el-option v-for="(item,index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input :placeholder="$t('placeholder.input') + $t('regis.phone')" v-model.trim="form.phoneNumb" class="personPhone" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.verification')" prop="vailCode">
          <div class="flex-hb">
            <el-input :placeholder="$t('placeholder.input') + $t('common.verification')" v-model.trim="form.vailCode" style="width: 70%"></el-input>
            <el-button v-show="sendAuthCode" class="btnClr" type="warning" style="width: 28%;padding: 12px 0;" @click="getAuthCode">{{ $t('realName.getVerCode1') }}</el-button>
            <el-button v-show="!sendAuthCode" class="btnNClick" type="info" disabled style="width: 28%;padding: 12px 0;">{{auth_time}}s</el-button>
          </div>
        </el-form-item>
        <el-button class="agree btnClr" type="primary" @click="next('form')" v-if="checked && clickflag">{{ $t('button.agreeAndRegis') }}</el-button>
        <el-button class="agree" type="info" disabled v-else>{{ $t('button.agreeAndRegis') }}</el-button>
        <div class="flex-whc flexRegis">
          <el-checkbox class="check" v-model="checked"></el-checkbox>
          <a class="blue" @click="toRead(1)" target="_blank">{{ $t('regis.service') }} /&nbsp;&nbsp;</a>
          <a class="blue" @click="toRead(2)" target="_blank">{{ $t('regis.policy') }} /&nbsp;&nbsp;</a>
          <a class="blue" @click="toRead(3)" target="_blank">{{ $t('regis.userProtocol') }}</a>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setTimeout } from 'timers'
import AES from '@/utils/aes'
import '../../../../static/js/jquery'
export default {
  data() {
    return {
      isShow: {
        register: true // register page
      },
      formData: {},
      form: {
        beInvitedCode: '',
        companyName: '',
        agentName: '',
        realName: '',
        userName: '',
        phoneNumb: '',
        password: '',
        passwordTwo: '',
        emailAddr: '',
        emailCode: '',
        vailCode: '',
        type: 1 // 1新企业 2持F码
      },
      phonePrefix: '86',
      prefixOptions: [],
      coUserId: '',
      companyId: 0,
      checked: false,
      sendAuthCode: true, // 手机验证码
      sendEmailCode: true, // 邮箱验证码
      auth_time: 0, // countdown
      authEmail_time: 0,
      userInfo: {},
      clickflag: true, // 控制点击次数
      fCode: ''
    }
  },
  watch: {
    checked(val) {
      if (val) {
        this.checked = true
      } else {
        this.checked = false
      }
    },
    language(val) {
      if (val == 'cn') {
        this.prefixOptions = this.$utils.formatPrefixCN()
      }
      if (val == 'en') {
        this.prefixOptions = this.$utils.formatPrefixEN()
      }
      // 清除表单提示语
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    }
  },
  mounted() {
    this.init()
    // if (window.history && window.history.pushState) {
    //   history.pushState(null, null, document.URL)
    //   window.addEventListener('popstate', this.goBack, false)
    // }
    // 解决ios键盘弹出后收回页面上移的问题
    $('input').blur(function () {
      $(window).scrollTop(0)
    })
  },
  computed: {
    ...mapGetters(['language', 'clientType']),
    rules() {
      const rules = {
        beInvitedCode: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value.trim().length === 0) {
                callback(new Error(this.$t('placeholder.input') + this.$t('basicInfo.FNum')))
              } else {
                // eslint-disable-next-line
                this.isRepeat('friendNumb', callback)
              }
            }
          }
        ],
        companyName: [
          {
            required: true,
            trigger: 'blur',
            pattern: this.$utils.reg.companyName,
            validator: this.$utils.validator.common
          }
        ],
        agentName: [
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              var newVal = this.$utils.emoji2Str(value)
              if (newVal !== value) {
                // eslint-disable-next-line
                this.form.agentName = newVal
              }
              var specialKey = '[`~!#@%$^&*=|{}\':;\'\\[\\]<>/?~！#￥……&*——|{}【】‘；：”“\']‘\''
              for (var i = 0; i < value.length; i++) {
                if (specialKey.indexOf(value.substr(i, 1)) != -1) {
                  callback(new Error(this.$t('placeholder.specialCode')))
                }
              }
              callback()
            }
          }
        ],
        realName: [
          {
            required: true,
            trigger: 'change',
            pattern: this.$utils.reg.content16,
            validator: (rule, value, callback) => {
              let data = this.$utils.validator.common(rule, value, callback)
              // eslint-disable-next-line
              this.form.realName = data
            }
          }
        ],
        userName: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              var newVal = this.$utils.emoji2Str(value) // 手机表情
              // eslint-disable-next-line
              this.form.userName = newVal
              if (!this.$utils.reg.noCnChar.test(newVal.trim())) {
                callback(new Error(this.$t('placeholder.notCnChar')))
              } else {
                // eslint-disable-next-line
                this.isRepeat('userName', callback)
              }
            }
          }
        ],
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
                if (value !== this.form.password) {
                  callback(new Error(this.$t('message.psdNotSame')))
                  return
                }
                callback()
              }
            }
          }
        ],
        emailAddr: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              var email = this.$utils.reg.email
              if (value == '') {
                callback(new Error(this.$t('placeholder.input') + this.$t('common.email')))
              } else {
                if (!email.test(value)) {
                  callback(
                    new Error(
                      this.$t('placeholder.input') +
                      this.$t('openPlatform.message3')
                    )
                  )
                }
              }
              callback()
            }
          }
        ],
        emailCode: [
          {
            required: true,
            message: this.$t('placeholder.input') + this.$t('common.emailCode'),
            trigger: 'blur'
          }
        ],
        phoneNumb: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value == '') {
                callback(new Error(this.$t('common.plzRight') + this.$t('common.phone')))
              } else {
                var phoneNORegA = this.$utils.reg.phoneNoA
                var phoneNORegC = this.$utils.reg.phoneNoC1
                var phoneNORegC1 = this.$utils.reg.phoneNoC2
                if (!phoneNORegA.test(value)) {
                  callback(new Error(this.$t('message.inputRight')))
                } else {
                  let reg = (this.phonePrefix === '86' && !phoneNORegC.test(value)) ||
                    (this.phonePrefix === '886' && !phoneNORegC1.test(value))
                  if (reg) {
                    callback(new Error(this.$t('message.inputRight')))
                  } else {
                    callback()
                  }
                }
              }
            }
          }
        ],
        vailCode: [
          { required: true, message: this.$t('placeholder.input') + this.$t('common.verification'), trigger: 'blur' }
        ]
      }
      return rules
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.path === '/regisLicense' || from.name === 'GenernalAgreement') {
        vm.form = JSON.parse(sessionStorage.getItem('form'))
        vm.phonePrefix = JSON.parse(sessionStorage.getItem('phonePrefix'))
      }
    })
  },
  methods: {
    init() {
      this.form.type = this.$route.query.type || 1
      // 从重新注册页跳转过来的
      if (this.$route.query.from == 1) {
        this.userInfo = JSON.parse(sessionStorage.getItem('user'))
        // 这里不能直接赋值，因为提交照片接口的认证参数必须和第一次注册保持一致
        // this.form = this.userInfo
        for (let i in this.form) {
          for (let j in this.userInfo) {
            if (i === j) {
              this.form[i] = this.userInfo[j]
            }
          }
        }
        let showPhone = this.userInfo.showPhoneNumb.split('+')
        this.phonePrefix = showPhone[0]
        this.form.phoneNumb = showPhone[1]
        this.form.type = this.userInfo.asscType == 2 ? 2 : 1
      }
      // 语言
      if (this.language == 'cn') {
        this.prefixOptions = this.$utils.formatPrefixCN()
      } else if (this.language == 'en') {
        this.prefixOptions = this.$utils.formatPrefixEN()
      }
      // 获取F码
      this.fCode = this.$route.query.fCode
      if (this.fCode) {
        this.form.beInvitedCode = this.fCode
      }
    },
    // 检验重名(邀请码/用户名)
    isRepeat(column, callback) {
      let value
      if (column === 'userName') {
        value = this.form.userName
      } else if (column === 'friendNumb') {
        value = this.form.beInvitedCode
      }
      let params = {
        column: column,
        value: value
      }
      if (this.$route.query.from == 1) {
        this.$http.posts('vailRegData', '', params, { showErrorMsg: false })
          .then(res => {
            callback()
          })
          .catch(er => {
            if (typeof er === 'object') {
              callback(new Error(this.$t(`code.${er.resMsg}`)))
            } else {
              callback()
            }
          })
      } else {
        this.$http.posts1('verifyData', params, '', { showErrorMsg: false })
          .then(res => {
            callback()
          })
          .catch(er => {
            if (typeof er === 'object') {
              callback(new Error(this.$t(`code.${er.resMsg}`)))
            } else {
              callback()
            }
          })
      }
    },
    // 点击上一步
    prevTo(type) {
      if (type == 'btn') {
        if (this.$route.query.from == 1) {
          this.$router.push('/regisAgain')
        } else {
          this.$router.push('/regis')
        }
      } else if (type == 'license') {
        this.isShow.register = true
        // this.isShow.privacy = false
      }
    },
    // 点击同意条款并注册
    next(formName) {
      this.clickflag = false
      this.sendAuthCode = true
      this.sendEmailCode = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.password !== '' && this.form.password !== this.form.passwordTwo) {
            this.$utils.$message({
              message: this.$t('message.pasWordDiff'),
              type: 'error'
            })
            this.clickflag = true
            return
          }
          let params = { ...this.form }
          if (this.$route.query.from === 1) {
            let coUserId = JSON.parse(sessionStorage.getItem('user')).coUserId
            let companyId = JSON.parse(sessionStorage.getItem('user')).companyId
            let setParams = { ...params, coUserId: coUserId, companyId: companyId }
            sessionStorage.setItem('form', JSON.stringify(setParams))
          } else {
            sessionStorage.setItem('form', JSON.stringify(params))
          }
          sessionStorage.setItem('phonePrefix', JSON.stringify(this.phonePrefix))
          params.phoneNumb = this.phonePrefix + '+' + this.form.phoneNumb
          params.password = AES.encrypt(this.form.userName + this.form.password, this.$api.AES_KEY)
          params.passwordTwo = AES.encrypt(this.form.userName + this.form.passwordTwo, this.$api.AES_KEY)
          sessionStorage.setItem('signLang', this.language)
          // 根据query判断是注册还是重新注册
          // 注册调register 重新注册调anewRegister传coUserId和companyId
          if (this.$route.query.from == 1) {
            this.coUserId = JSON.parse(sessionStorage.getItem('user')).coUserId
            this.companyId = JSON.parse(sessionStorage.getItem('user')).companyId
            params = { ...params, coUserId: this.coUserId, companyId: this.companyId }
            this.$http.posts('anewRegister', params, '', true)
              .then(res => {
                this.clickflag = true
                this.$router.push({
                  path: '/regisLicense',
                  query: {
                    type: this.form.type
                  }
                })
              })
              .catch(er => {
                this.clickflag = true
              })
          } else {
            this.$http.posts1('register', params, '', true)
              .then(res => {
                this.clickflag = true
                this.$router.push({
                  path: '/regisLicense',
                  query: {
                    type: this.form.type
                  }
                })
              })
              .catch(er => {
                this.clickflag = true
              })
          }
        } else {
          setTimeout(() => {
            this.clickflag = true
          }, 2000)
          return false
        }
      })
    },
    // 读迪维欧条款
    toRead(type) {
      if (this.clientType === 'mob') {
        sessionStorage.setItem('form', JSON.stringify(this.form))
        sessionStorage.setItem('phonePrefix', JSON.stringify(this.phonePrefix))
        this.$router.push({
          path: '/genernalAgreement/' + type
        })
      } else {
        let router = this.$router.resolve({
          name: 'GenernalAgreement',
          params: {
            id: type
          }
        })
        this.$utils.openWindow(router.href)
        // window.open(router.href, '_blank')
      }
    },
    // 获取验证码
    getAuthCode() {
      if (this.form.phoneNumb !== '') {
        this.$refs['form'].validateField('phoneNumb', error => {
          if (!error) {
            this.sendAuthCode = false
            this.auth_time = 60
            var auth_timetimer = setInterval(() => {
              this.auth_time--
              if (this.auth_time <= 0) {
                this.sendAuthCode = true
                clearInterval(auth_timetimer)
              }
            }, 1000)
            this.$http.posts1('getCode', {
              phoneNumb: this.phonePrefix + '+' + this.form.phoneNumb
            }).then(res => { })
          }
        })
      } else {
        this.$utils.$message({
          message: this.$t('placeholder.input') + this.$t('common.phone'),
          type: 'error'
        })
      }
    },
    // 获取邮箱验证码
    getEmailCode() {
      if (this.form.emailAddr !== '') {
        this.$refs['form'].validateField('emailAddr', error => {
          if (!error) {
            this.sendEmailCode = false
            this.authEmail_time = 60
            var auth_timetimer = setInterval(() => {
              this.authEmail_time--
              if (this.authEmail_time <= 0) {
                this.sendEmailCode = true
                clearInterval(auth_timetimer)
              }
            }, 1000)
            this.$http.posts1('getEmailCode', {
              emailAddr: this.form.emailAddr,
              language: this.language === 'cn' ? 1 : 2
            }).then(res => { })
          }
        })
      } else {
        this.$utils.$message({
          message: this.$t('placeholder.input') + this.$t('common.email'),
          type: 'error'
        })
      }
    }
  }
  // destroyed() {
  //   window.removeEventListener('popstate', this.goBack, false)
  // }
}
</script>

<style lang="less" scoped>
@import '../../../assets/css/login.less';
</style>
