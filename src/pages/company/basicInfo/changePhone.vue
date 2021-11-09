<template>
  <div id="changePhone">
    <div class="findBox">
      <h3>{{ $t('basicInfo.modifyPhone') }}</h3>
      <!-- 步骤条 -->
      <el-steps :active="steps" finish-status="success" simple style="width: 86%;margin: auto;">
        <el-step :title="$t('common.identityVer')"></el-step>
        <el-step :title="$t('basicInfo.modifyPhone')"></el-step>
        <el-step :title="$t('forgot.complete')"></el-step>
      </el-steps>
      <!-- 身份核验 -->
      <div class="step1" v-if="steps == 0">
        <p class="one">{{ $t('basicInfo.check1') }}：</p>
        <p class="two">{{ $t('basicInfo.veriPhone') }} <span> {{phone}} </span></p>
        <div class="flex-vc veri">
          <span style="color:#f00;padding-right:3px;line-height:40px">*</span>
          <span>{{ $t('common.phoneCode') }}</span>
          <el-input v-model.trim="verCode" :placeholder="$t('placeholder.input') + $t('common.verification')" maxlength="6"></el-input>
          <el-button v-show="sendAuthCode" type="primary" @click="getAuthCode(0)">{{ $t('common.getVerCode') }}</el-button>
          <el-button v-show="!sendAuthCode" style="width: 92px;margin-left: 0" disabled>{{auth_time}}s</el-button>
        </div>
        <div class="flex-hc">
          <el-button class="stepTwo resetCancel" @click="backTo">{{ $t('button.cancel') }}</el-button>
          <el-button class="btnClr stepTwo" type="primary" @click="confirm(0)">{{ $t('button.confirm') }}</el-button>
        </div>
      </div>
      <!-- 修改手机号码 -->
      <div class="step2" v-if="steps == 1">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item :label="$t('basicInfo.originalPhone')">{{phone}}</el-form-item>
          <el-form-item :label="$t('basicInfo.newPhone')" prop="phoneNum">
            <el-select v-model="phonePrefix" filterable :placeholder="$t('placeholder.select')" class="prefix">
              <el-option v-for="(item,index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-input :placeholder="$t('placeholder.input') + $t('regis.phone')" v-model.trim="form.phoneNum" class="personPhone" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common.phoneCode')" prop="verifyCode">
            <div class="flex-hb">
              <el-input :placeholder="$t('placeholder.input') + $t('common.verification')" v-model.trim="form.verifyCode" style="width: 70%"></el-input>
              <el-button v-show="sendAuthCode" class="btnClr" type="warning" style="width: 28%;padding: 12px 0;" @click="getAuthCode(1)">{{ $t('common.getVerCode') }}</el-button>
              <el-button v-show="!sendAuthCode" class="btnNClick" type="info" style="width: 28%;padding: 12px 0;margin-left: 0" disabled>{{auth_time}}s</el-button>
            </div>
          </el-form-item>
        </el-form>
        <div class="flex-hcvc blocked">
          <el-button class="stepTwo resetCancel" @click="prev">{{ $t('button.cancel') }}</el-button>
          <el-button class="btnClr" type="primary" @click="confirm(1)">{{ $t('button.confirm') }}</el-button>
        </div>
      </div>
      <!-- 完成 -->
      <div class="step3" v-if="steps == 2">
        <p class="reset flex-hcvc">
          <i class="el-icon-success"></i>
          <span>{{ $t('basicInfo.successPhone') }}</span>
        </p>
        <p class="jump">{{ $t('forgot.fixed1') }}<span class="pointer" @click="backTo">{{ $t('realName.other2') }}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      phone: '',
      menuItem: [],
      steps: 0,
      userName: '',
      verCode: '', // 短信验证码
      auth_time: 0,
      sendAuthCode: true,
      data: {},
      form: {
        phoneNum: '',
        verifyCode: ''
      },
      phonePrefix: '86',
      prefixOptions: [],
      auth_timetimer: null,
      isRight: false,
      clearTime: null
    }
  },
  mounted() {
    this.phone = JSON.parse(sessionStorage.getItem('userData')).phoneNumb || ''
    if (this.language === 'cn') {
      this.prefixOptions = this.$utils.formatPrefixCN()
    } else if (this.language === 'en') {
      this.prefixOptions = this.$utils.formatPrefixEN()
    }
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
      if (val === 'cn') {
        this.prefixOptions = this.$utils.formatPrefixCN()
      }
      if (val === 'en') {
        this.prefixOptions = this.$utils.formatPrefixEN()
      }
      // 清除表单提示语
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    }
  },
  computed: {
    ...mapGetters(['language']),
    rules() {
      const rules = {
        phoneNum: [
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
                  this.isRight = false
                  callback(new Error(this.$t('message.inputRight')))
                } else {
                  let reg = (this.phonePrefix === '86' && !phoneNORegC.test(value)) ||
                    (this.phonePrefix === '886' && !phoneNORegC1.test(value))
                  if (reg) {
                    this.isRight = false
                    callback(new Error(this.$t('message.inputRight')))
                  } else {
                    this.isRight = true
                    callback()
                  }
                }
              }
            }
          }
        ],
        verifyCode: [
          { required: true, message: this.$t('placeholder.input') + this.$t('common.verification'), trigger: 'blur' }
        ]
      }
      return rules
    }
  },
  methods: {
    // 获取验证码
    getAuthCode(type) {
      if (type && this.form.phoneNum == '') {
        this.$utils.$message({
          type: 'error',
          message: this.$t('placeholder.input') + this.$t('realName.phone')
        })
        return
      }
      if (type && !this.isRight) {
        this.$utils.$message({
          type: 'error',
          message: this.$t('message.inputRight')
        })
        return
      }
      this.sendAuthCode = false
      this.auth_time = 60
      this.auth_timetimer = setInterval(() => {
        this.auth_time--
        if (this.auth_time <= 0) {
          this.auth_time = 60
          this.sendAuthCode = true
          clearInterval(this.auth_timetimer)
        }
      }, 1000)
      this.$http.posts('getVerifyCode', '', type ? { phoneNum: this.phonePrefix + '+' + this.form.phoneNum } : '', { showSuccessMsg: false, showErrorMsg: true })
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
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let params = {
              ...this.form,
              phoneNum: this.phonePrefix + '+' + this.form.phoneNum,
              status: 1,
              adminUser: JSON.parse(sessionStorage.getItem('userData')).adminUser
            }
            this.$http.posts('editPhoneAndEmail', '', params, { showSuccessMsg: false, showErrorMsg: true })
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
          this.$router.push('/bmBasicInfo')
        }, 3000)
      } else {
        this.$router.push('/bmBasicInfo')
      }
    },
    prev() {
      this.auth_time = 60
      this.sendAuthCode = true
      clearInterval(this.auth_timetimer)
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
#changePhone {
  .findBox {
    background: #fff;
    height: calc(100vh - 126px);
    margin: 10px;
    padding: 10px;
    h3 {
      margin-bottom: 20px;
    }
    .step1 {
      width: 500px;
      margin: 20px auto;
      .one {
        padding: 40px 0 12px 0;
        margin-bottom: 30px;
        border-bottom: solid 1px @text4;
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
      width: 500px;
      margin: 70px auto 0;
      .blocked {
        margin-top: 50px;
      }
      .prefix {
        float: left;
        width: 35% !important;
      }
      .personPhone {
        float: right;
        width: 61% !important;
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
