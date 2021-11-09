<template>
  <div id="busiInfo">
    <el-dropdown class="dropdown" placement="bottom" @command="handleDialogOpen">
      <span><i class="el-icon-more" style="transform:rotate(90deg)"></i></span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="info">{{ $t('basicInfo.personalInfo') }} </el-dropdown-item>
        <el-dropdown-item command="password">{{ $t('basicInfo.modifyPsd') }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 个人信息对话框 -->
    <el-dialog :title="$t('myClients.personInfo')" :visible.sync="infoDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('info')">
      <div v-if="originalInfoForm.editType === 1" class="dialogTitle">{{ $t('basicInfo.complete') }}</div>
      <el-form ref="infoForm" v-loading="listLoading" :model="infoForm" label-width="140px" :rules="infoFormRules" :validate-on-rule-change="false">
        <el-form-item prop="userPic" label-width="0" class="avatarItem">
          <el-upload class="avatar-uploader" action="string" :show-file-list="false" :before-upload="handleBeforePhotoUpload" accept="image/bmp, image/jpeg, image/png">
            <el-image v-if="infoForm.userPic" :src="infoForm.userPic" class="avatar" fit="cover">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="tip">{{ $t('message.photoMessage') }}</div>
          </el-upload>
          <el-input v-model="infoForm.userPic" :placeholder="$t('placeholder.input')" type="hidden" style="display:none"></el-input>
        </el-form-item>
        <el-form-item prop="realName" :label="$t('account.realName')">
          <el-input v-model.trim="infoForm.realName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('account.entryTime')" prop="entryTime">
          <el-date-picker v-model="infoForm.entryTime" :placeholder="$t('placeholder.select')" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('account.phoneNo')" required>
          <div class="flex-hb">
            <el-form-item prop="phonePrefix" :style="{ width: phoneDisabledEdit ? '29%' : '34%','min-width': 'auto' }">
              <el-select v-model="infoForm.phonePrefix" filterable :placeholder="$t('placeholder.select')" :disabled="phoneDisabledEdit">
                <el-option v-for="(item, index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <span>-</span>
            <el-form-item prop="phoneNumb" :style="{ width: phoneDisabledEdit ? '38%' : '62%','min-width': 'auto' }">
              <el-input v-model.trim="infoForm.phoneNumb" :placeholder="$t('placeholder.input')" maxlength="30" :disabled="phoneDisabledEdit"></el-input>
            </el-form-item>
            <el-button v-show="phoneDisabledEdit" type="primary" @click="handleDialogOpen('phone')" style="width: 28%;padding: 12px 0;margin-left: 1%;">{{ $t('button.revise') }}</el-button>
          </div>
        </el-form-item>
        <el-form-item prop="vailCode" :label="$t('common.phoneCode')">
          <div class="flex-hb">
            <el-input v-model.trim="infoForm.vailCode" :placeholder="$t('placeholder.input')" :disabled="phoneDisabledEdit" style="width: 70%"></el-input>
            <el-button v-show="phoneCodeShow" type="primary" @click="getPhoneCode('info')" :disabled="phoneDisabledEdit" style="width: 28%;padding: 12px 0;">{{ $t('common.getVerCode') }}</el-button>
            <el-button v-show="!phoneCodeShow" type="info" disabled style="width: 28%;padding: 12px 0;">{{ phoneTime }}s</el-button>
          </div>
        </el-form-item>
        <el-form-item prop="emailAddr" :label="$t('common.email')">
          <div class="flex-hb">
            <el-input v-model.trim="infoForm.emailAddr" :placeholder="$t('placeholder.input')" :disabled="emailDisabledEdit" maxlength="50" :style="{ width: emailDisabledEdit ? '70%' : '100%' }"></el-input>
            <el-button v-show="emailDisabledEdit" type="primary" @click="handleDialogOpen('email')" style="width: 28%;padding: 12px 0;margin-left: 1%;">{{ $t('button.revise') }}</el-button>
          </div>
        </el-form-item>
        <el-form-item prop="emailCode" :label="$t('common.emailCode')">
          <div class="flex-hb">
            <el-input v-model.trim="infoForm.emailCode" :placeholder="$t('placeholder.input')" :disabled="emailDisabledEdit" maxlength="6" style="width: 70%"></el-input>
            <el-button v-show="emailCodeShow" type="primary" @click="getEmailCode('info')" :disabled="emailDisabledEdit" style="width: 28%;padding: 12px 0;">{{ $t('common.getVerCode') }}</el-button>
            <el-button v-show="!emailCodeShow" type="info" disabled style="width: 28%;padding: 12px 0;">{{ emailTime }}s</el-button>
          </div>
        </el-form-item>
        <!-- <el-form-item :label="$t('account.dingAccount')" prop="dingdingUserId">
          <el-select v-model="infoForm.dingdingUserId" :placeholder="$t('placeholder.select')">
            <el-option label="钉钉账号1" :value="1"></el-option>
            <el-option label="钉钉账号2" :value="2"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="infoDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleEditInfo('info')" :disabled="infoDisabled">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 旧手机号码身份验证对话框 -->
    <el-dialog :title="$t('common.identityVer')" :visible.sync="phoneDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('phone')">
      <el-form ref="phoneForm" :model="phoneForm" :rules="phoneFormRules" label-width="140px" :validate-on-rule-change="false">
        <el-form-item :label="$t('common.oldPhone')" required>
          <div class="flex-hb">
            <el-form-item prop="phonePrefix" style="width: 34%;min-width:auto">
              <el-select v-model="phoneForm.phonePrefix" filterable :placeholder="$t('placeholder.select')" disabled>
                <el-option v-for="(item, index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <span>-</span>
            <el-form-item prop="phoneNumb" style="width: 62%;min-width:auto">
              <el-input v-model.trim="phoneForm.phoneNumb" :placeholder="$t('placeholder.input')" maxlength="30" disabled></el-input>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item prop="vailCode" :label="$t('common.phoneCode')">
          <div class="flex-hb">
            <el-input v-model.trim="phoneForm.vailCode" :placeholder="$t('placeholder.input')" style="width: 70%"></el-input>
            <el-button v-show="phoneCodeShowOld" type="primary" @click="getPhoneCode('phone','Old')" style="width: 28%;padding: 12px 0;">{{ $t('common.getVerCode') }}</el-button>
            <el-button v-show="!phoneCodeShowOld" type="info" disabled style="width: 28%;padding: 12px 0;">{{ phoneTime }}s</el-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="phoneDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleVerify('phone')">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 旧邮箱身份验证对话框 -->
    <el-dialog :title="$t('common.identityVer')" :visible.sync="emailDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('email')">
      <el-form ref="emailForm" :model="emailForm" :rules="emailFormRules" label-width="140px" :validate-on-rule-change="false">
        <el-form-item :label="$t('common.oldEmail')" required>
          <el-form-item prop="emailAddr" style="width:100%">
            <el-input v-model.trim="emailForm.emailAddr" :placeholder="$t('placeholder.input')" maxlength="50" disabled></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item prop="emailCode" :label="$t('common.emailCode')">
          <div class="flex-hb">
            <el-input v-model.trim="emailForm.emailCode" :placeholder="$t('placeholder.input')" style="width: 70%"></el-input>
            <el-button v-show="emailCodeShowOld" type="primary" @click="getEmailCode('email','Old')" style="width: 28%;padding: 12px 0;">{{ $t('common.getVerCode') }}</el-button>
            <el-button v-show="!emailCodeShowOld" type="info" disabled style="width: 28%;padding: 12px 0;">{{ emailTime }}s</el-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="emailDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleVerify('email')">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 修改密码对话框 -->
    <el-dialog :title="$t('basicInfo.modifyPsd')" :visible.sync="passwordDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('password')">
      <!-- 步骤条 -->
      <el-steps :active="activeStep" finish-status="success" simple style="width: 97%;margin: auto;margin-bottom: 30px;">
        <el-step :title="$t('common.identityVer')"></el-step>
        <el-step :title="$t('basicInfo.modifyPsd')"></el-step>
        <el-step :title="$t('forgot.complete')"></el-step>
      </el-steps>
      <!-- 身份核验 -->
      <div v-show="activeStep == 0">
        <el-form ref="passwordForm0" :model="passwordForm0" :rules="passwordForm0Rules" label-width="140px" :validate-on-rule-change="false">
          <el-form-item :label="$t('account.userName')" required>
            <el-input :value="userName" :placeholder="$t('placeholder.input')" disabled></el-input>
          </el-form-item>
          <el-form-item prop="password" :label="$t('common.password')">
            <el-input v-model.trim="passwordForm0.password" :placeholder="$t('placeholder.input')" type="password" maxlength="30" autocomplete="new-password"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 修改密码 -->
      <div v-show="activeStep == 1">
        <el-form ref="passwordForm1" :model="passwordForm1" :rules="passwordForm1Rules" label-width="140px" :validate-on-rule-change="false">
          <el-form-item prop="password" :label="$t('account.newPassword')">
            <el-input v-model.trim="passwordForm1.password" :placeholder="$t('placeholder.input')" type="password" maxlength="30" autocomplete="new-password"></el-input>
          </el-form-item>
          <el-form-item prop="passwordAgain" :label="$t('account.newPasswordAgain')">
            <el-input v-model.trim="passwordForm1.passwordAgain" :placeholder="$t('placeholder.input')" type="password" maxlength="30" autocomplete="new-password"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 完成 -->
      <div class="step2" v-show="activeStep == 2">
        <span>{{ $t('basicInfo.successPsd') }}</span>
      </div>
      <span slot="footer" class="dialog-footer" v-if="this.activeStep !== 2">
        <el-button @click="passwordDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handlePassword(activeStep)">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $utils from '@/utils'
import AES from '@/utils/aes'
export default {
  data() {
    return {
      showInfoDialog: +sessionStorage.getItem('showInfoDialog'), // 1-true 0-false 首次登录且不是超级管理员打开弹框。组件首次渲染弹出
      userId: JSON.parse(sessionStorage.getItem('user')).userId,
      userName: JSON.parse(sessionStorage.getItem('user')).userName,
      photoFile: '', // 图片文件
      prefixOptions: [], // 号码前缀
      type: 'info',
      listLoading: false,

      infoDialogVisible: false,
      originalInfoForm: {}, // 请求回来的原始数据，验证旧手机/邮箱/完善信息提示是否显示(进页面默认不显)
      infoForm: {
        userId: JSON.parse(sessionStorage.getItem('user')).userId,
        userName: JSON.parse(sessionStorage.getItem('user')).userName,
        userPic: '',
        realName: '',
        entryTime: '',
        phonePrefix: '86',
        phoneNumb: '',
        vailCode: '',
        emailAddr: '',
        emailCode: '',
        status: 1,
        editType: 1 // 1新增 2编辑
      },
      infoDisabled: false,

      phoneCodeShow: true,
      phoneTime: 60,
      phoneTimer: '',
      phoneDisabledEdit: false, // 手机框禁用
      // 旧手机验证
      phoneDialogVisible: false,
      phoneForm: {},
      phoneCodeShowOld: true, // 手机身份验证

      emailCodeShow: true,
      emailTime: 60,
      emailTimer: '',
      emailDisabledEdit: false, // 邮箱框禁用
      // 旧邮箱验证
      emailDialogVisible: false,
      emailForm: {},
      emailCodeShowOld: true, // 邮箱身份验证

      passwordDialogVisible: false,
      activeStep: 0,
      passwordForm0: {
        password: ''
      },
      passwordForm1: {
        password: '',
        passwordAgain: ''
      },
      timeoutId: null, // 3秒跳登录，离开页面清延时器
      button: {},
      options: []
    }
  },
  computed: {
    ...mapGetters(['language']),
    // 编辑/新增 表单验证
    infoFormRules() {
      return {
        // userPic: [
        //   {
        //     required: true,
        //     trigger: 'change',
        //     message: this.$t('message.choosePhoto')
        //     // pattern: this.$utils.reg.name
        //   }
        // ],
        realName: [
          {
            required: true,
            trigger: 'blur',
            pattern: this.$utils.reg.name,
            message: this.$t('message.noEmpty')
          }
        ],
        entryTime: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('message.select')
          }
        ],
        phonePrefix: [{
          required: true,
          trigger: 'change',
          message: this.$t('message.select'),
          validator: (rule, value, callback) => {
            var form = `${this.type}Form`
            // if (this[form].phoneNumb) {
            // console.log(form)
            if (value) {
              if (this.$utils.reg.phoneNoA.test(this[form].phoneNumb)) {
                this.$refs[form].validateField('phoneNumb')
              }
              callback()
            } else {
              callback(new Error(this.$t('message.select')))
            }
            // } else {
            // callback(new Error(this.$t('message.select')))
            // }
          }
        }],
        phoneNumb: [{
          required: true,
          trigger: 'blur',
          // pattern: this.$utils.reg.phoneNoA,
          // message: this.$t('message.inputRight'),
          validator: (rule, value, callback) => {
            var form = `${this.type}Form`
            var phoneNORegA = this.$utils.reg.phoneNoA
            var phoneNORegC = this.$utils.reg.phoneNoC1
            var phoneNORegC1 = this.$utils.reg.phoneNoC2
            // 全部的手机号码验证
            if (!phoneNORegA.test(value)) {
              // 验证不通过
              callback(new Error(this.$t('message.inputRight')))
            } else {
              // this.$refs[form].validateField('phonePrefix')
              // 验证通过
              // if (this[form].phonePrefix === '86' && !phoneNORegC.test(value)) {
              //   // 是中国的且验证不通过
              //   callback(new Error(this.$t('message.inputPhoneC')))
              // } else {
              //   // 不是/是且验证通过
              //   callback()
              // }
              let reg = (this[form].phonePrefix === '86' && !phoneNORegC.test(value)) ||
                (this[form].phonePrefix === '886' && !phoneNORegC1.test(value))
              if (reg) {
                callback(new Error(this.$t('message.inputRight')))
              } else {
                callback()
              }
            }
            // else {
            //   // callback()
            //   callback(new Error(this.$t('message.input')))
            // }
          }
        }],
        vailCode: [{
          required: true,
          trigger: 'blur',
          message: this.$t('message.input'),
          validator: (rule, value, callback) => {
            if (!this.phoneDisabledEdit && value.trim().length === 0) {
              callback(new Error(this.$t('message.input')))
            } else {
              callback()
            }
          }
        }],
        emailAddr: [{
          trigger: 'blur',
          pattern: this.$utils.reg.email,
          message: this.$t('message.inputRight')
        }],
        emailCode: [{
          // required: true,
          trigger: 'blur',
          message: this.$t('message.input'),
          validator: (rule, value, callback) => {
            var form = `${this.type}Form`
            if (this[form].emailAddr && !this.emailDisabledEdit && value.trim().length === 0) {
              callback(new Error(this.$t('message.input')))
            } else {
              callback()
            }
          }
        }]
      }
    },
    phoneFormRules() {
      return {
        vailCode: [{ required: true, trigger: 'blur', message: this.$t('message.input') }]
      }
    },
    emailFormRules() {
      return {
        emailCode: [{ required: true, trigger: 'blur', message: this.$t('message.input') }]
      }
    },
    passwordForm0Rules() {
      return {
        password: [{
          required: true,
          trigger: 'blur',
          message: this.$t('message.inputPassword'),
          pattern: this.$utils.reg.password
        }]
      }
    },
    passwordForm1Rules() {
      return {
        password: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            var form = 'passwordForm1'
            var psdReg = this.$utils.reg.password
            // console.log(value)
            // console.log(psdReg.test(value))
            if (!psdReg.test(value)) {
              callback(new Error(this.$t('message.inputPassword')))
            } else {
              if (this[form].passwordAgain !== '') {
                this.$refs[form].validateField('passwordAgain')
              }
              callback()
            }
          }
        }],
        passwordAgain: [{
          required: true,
          trigger: 'blur',
          // pattern: this.$utils.reg.password,
          validator: (rule, value, callback) => {
            var form = 'passwordForm1'
            var psdReg = this.$utils.reg.password
            if (!psdReg.test(value)) {
              callback(new Error(this.$t('message.inputPassword')))
            } else if (value !== this[form].password) {
              callback(new Error(this.$t('message.psdNotSame')))
            } else {
              callback()
            }
          }
        }]
      }
    }
  },
  watch: {
    language: {
      handler: function (newLang, oldLang) {
        if (newLang === 'cn') {
          this.prefixOptions = this.$utils.formatPrefixCN()
        } else if (newLang === 'en') {
          this.prefixOptions = this.$utils.formatPrefixEN()
        }
      },
      immediate: true
    }
  },
  created() {
    if (this.showInfoDialog) {
      this.handleDialogOpen('info')
    }
  },
  methods: {
    getInfo() {
      this.listLoading = true
      this.$http.posts('getPersonalInfo', { userId: this.userId })
        .then(res => {
          this.listLoading = false
          let data = res.data || {}
          var { userId, userName, userPic, realName, entryTime, phoneNumb: phoneNumb1, emailAddr, status } = data
          var phone = this.$utils.splitPhone(phoneNumb1)
          let { phonePrefix, phoneNumb } = phone
          this.infoForm = {
            userId,
            userName,
            userPic,
            realName,
            entryTime,
            phonePrefix: phonePrefix || '86',
            phoneNumb,
            emailAddr,
            vailCode: '',
            emailCode: '',
            status,
            editType: phoneNumb1 ? 2 : 1 // 1新增 2编辑
          }
          this.originalInfoForm = { ...this.infoForm }
          this.phoneDisabledEdit = !!this.infoForm.phoneNumb
          this.emailDisabledEdit = !!this.infoForm.emailAddr
          this.$nextTick(() => {
            this.$refs.infoForm.clearValidate()
          })
        })
        .catch(er => {
          console.log(er)
          this.listLoading = false
          this.originalInfoForm = {}
        })
    },
    // 获取短信验证码
    getPhoneCode(type, showType = '') {
      // type 'info'
      // showType ''新增/编辑  'Old'身份核验
      this.$refs[`${type}Form`].validateField('phoneNumb', errorMessage => {
        if (!errorMessage) { // 验证通过
          clearInterval(this.phoneTimer)
          this.phoneTime = 60
          this[`phoneCodeShow${showType}`] = false
          this.phoneTimer = setInterval(() => {
            this.phoneTime--
            if (this.phoneTime <= 0) {
              this[`phoneCodeShow${showType}`] = true
              clearInterval(this.phoneTimer)
              // this.phoneTime = 60
            }
          }, 1000)
          this.$http.posts('getCodeAuth', '', { phoneNumb: this[`${type}Form`].phonePrefix + '+' + this[`${type}Form`].phoneNumb })
            .then(res => { })
            .catch(er => {
              this[`phoneCodeShow${showType}`] = true
              clearInterval(this.phoneTimer)
              // this.phoneTime = 60
            })
        }
      })
    },
    // 获取邮箱验证码
    getEmailCode(type, showType = '') {
      // type 'info'
      // showType ''新增/编辑  'Old'身份核验
      this.$refs[`${type}Form`].validateField('emailAddr', errorMessage => {
        if (!errorMessage) { // 验证通过
          clearInterval(this.emailTimer)
          this.emailTime = 60
          this[`emailCodeShow${showType}`] = false
          this.emailTimer = setInterval(() => {
            this.emailTime--
            if (this.emailTime <= 0) {
              this[`emailCodeShow${showType}`] = true
              clearInterval(this.emailTimer)
            }
          }, 1000)
          this.$http.posts('newSendEmail', '', { emailAddr: this[`${type}Form`].emailAddr })
            .then(res => { })
            .catch(er => {
              this[`emailCodeShow${showType}`] = true
              clearInterval(this.emailTimer)
            })
        }
      })
    },
    // 对话框打开
    handleDialogOpen(type, row) {
      if (type !== 'phone' && type !== 'email') {
        this.type = type
      }
      if (type === 'info') {
        this.getInfo()
      } else if (type === 'phone') {
        let { phonePrefix, phoneNumb } = this.originalInfoForm
        this.phoneForm = { phonePrefix, phoneNumb, vailCode: '' }
      } else if (type === 'email') {
        let { emailAddr } = this.originalInfoForm
        this.emailForm = { emailAddr, emailCode: '' }
      } else if (type === 'password') {

      }
      this[`${type}DialogVisible`] = true
    },
    // 所有图片上传之前
    handleBeforePhotoUpload(file) {
      // console.log(file)
      const isrightType =
        file.type === 'image/bmp' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      // console.log(isrightType)
      if (!isrightType) {
        this.$utils.$message({
          type: 'error',
          message: file.name + ',' + this.$t('message.photoTypeWrong')
        })
      }
      if (!isLt2M) {
        this.$utils.$message({
          type: 'error',
          message: file.name + ',' + this.$t('message.morePhotoSize')
        })
      }
      if (isrightType && isLt2M) {
        this[`${this.type}Form`].userPic = URL.createObjectURL(file)
        this.photoFile = file
      }
      return false
    },
    // 旧手机/旧邮箱身份核验
    handleVerify: $utils.debounce(function (type) {
      // type 'phone' 'email'
      this.$refs[`${type}Form`].validate(valid => {
        if (valid) {
          var params
          let { phonePrefix, phoneNumb, vailCode, emailAddr, emailCode } = this[`${type}Form`]
          if (type === 'phone') {
            params = { verifyAddr: [`${phonePrefix}+${phoneNumb}`], verifyCode: vailCode, status: 1 } // status 1手机号 2邮箱
          } else {
            params = { verifyAddr: emailAddr, verifyCode: emailCode, status: 2 }
          }
          // console.log('params', params)
          this.$http.posts('newCodeVerify', '', params).then(res => {
            this[`${type}DialogVisible`] = false
            clearInterval(this[`${type}Timer`]) // 关闭对话框也会清，双控
            this[`${type}DisabledEdit`] = false // 解禁，可修改
          })
        } else {
          // console.log('error 验证错误query!!')
          return false
        }
      })
    }),
    // 编辑个人信息
    handleEditInfo(type = 'info') {
      // console.log(type)
      this.$refs[`${type}Form`].validate(valid => {
        if (valid) {
          var form = { ...this[`${type}Form`] }
          this[`${type}Disabled`] = true // 接口时间长，不用定时器了。对话框关闭了，也解禁。双控
          if (form.phoneNumb) form.phoneNumb = form.phonePrefix + '+' + form.phoneNumb
          // if (form.phoneNumb) form.phoneNumb = '86' + '+' + '15301669039'
          delete form.phonePrefix
          var formData
          if (form.userPic && form.userPic.startsWith('blob:')) {
            // 本地预览上传了图片先调用图片接口
            formData = new FormData()
            formData.append('file', this.photoFile)
          } else {
            formData = ''
          }
          delete form.userPic
          // this.listLoading = true
          this.$http.posts('updatePersonalInfo', formData, form, true)
            .then(res => {
              this[`${type}Disabled`] = false // 对话框关闭了，也解禁。双控，可注释掉
              // this.listLoading = false // getInfo中会再次用，可注释掉
              this[`${type}DialogVisible`] = false
              // this.getInfo()
            })
            .catch(er => {
              console.log(er)
              this[`${type}Disabled`] = false
              this.phoneCodeShow = true
              clearInterval(this.phoneTimer)
              this.emailCodeShow = true
              clearInterval(this.emailTimer)
            })
        }
      })
    },
    handlePassword(activeStep) {
      if (activeStep === 0) {
        this.$refs.passwordForm0.validate(valid => {
          if (valid) {
            var form = { ...this.passwordForm0 }
            form.password = AES.encrypt(this.userName + form.password, this.$api.AES_KEY)
            this.$http.posts('conPassword', '', form).then((res) => {
              this.activeStep++
            })
          }
        })
      } else if (activeStep === 1) {
        this.$refs.passwordForm1.validate(valid => {
          if (valid) {
            var form = { password: this.passwordForm1.password }
            form.password = AES.encrypt(this.userName + form.password, this.$api.AES_KEY)
            this.$http.posts('updatePassword', '', form).then((res) => {
              this.activeStep++
              this.timeoutId = setTimeout(() => {
                this.$router.push('/login')
              }, 3000)
            })
          }
        })
      } else if (activeStep === 2) {
      }
    },
    // 对话框关闭,重置表单
    handleDialogClose(type) {
      if (type === 'info') {
        this.photoFile = ''
        this.$refs.infoForm.resetFields()
        this.infoDisabled = false
        sessionStorage.setItem('showInfoDialog', 0) // 只要关闭就不再自动弹出

        this.phoneCodeShow = true
        clearInterval(this.phoneTimer)
        this.phoneDisabledEdit = false

        this.emailCodeShow = true
        clearInterval(this.emailTimer)
        this.emailDisabledEdit = false
      } else if (type === 'phone') {
        this.$refs.phoneForm.resetFields()
        this.phoneCodeShowOld = true
        clearInterval(this.phoneTimer)
      } else if (type === 'email') {
        this.$refs.emailForm.resetFields()
        this.emailCodeShowOld = true
        clearInterval(this.emailTimer)
      } else if (type === 'password') {
        this.activeStep = 0
        this.$refs.passwordForm0.resetFields()
        this.$refs.passwordForm1.resetFields()
      }
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  }
}
</script>
<style lang="less">
@import '../assets/color';
#busiInfo {
  display: inline;
  i.el-icon-more {
    font-size: 22px;
    color: #fff;
  }
  .dialogTitle {
    color: @danger;
    line-height: 35px;
    font-weight: 700;
    width: 100% !important;
  }
  .el-dialog {
    .avatarItem {
      height: auto;
      width: 100% !important;
      .el-form-item__error {
        left: 50%;
        transform: translateX(-50%);
        padding-top: 0;
      }
    }
  }
  .step2 {
    text-align: center;
    font-size: 16px;
    padding: 20px 0;
  }
  .el-loading-mask {
    background-color: rgba(255, 255, 255, 0.7);
  }
}
</style>
<style lang="less" scoped>
.el-dropdown-menu {
  top: 30px !important;
}
</style>
