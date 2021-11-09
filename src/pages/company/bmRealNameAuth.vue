<template>
  <div id="realName">
    <!-- select Authenticate way page -->
    <div class="box flex-dhcvc" v-if="selectAuth">
      <div class="btn">
        <button class="btnClr" v-show="showPersonBtn" @click="toAuth(1, 'formPerson')">
          <i class="el-icon-user-solid"></i>
          {{ $t('realName.pAuth') }}
        </button>
        <button class="btnClr" v-show="showCompanyBtn" @click="toAuth(2, 'formEnter')">
          <i class="el-icon-office-building"></i>
          {{ $t('realName.eAuth') }}
        </button>
      </div>
    </div>
    <!-- personal Authenticate page -->
    <div class="box personalAuth" v-if="personalAuth">
      <div class="title">
        <span></span>
        <i>{{ $t('realName.pAuth') }}</i>
      </div>
      <el-steps align-center :active="personActive" class="steps steps1">
        <el-step :title="$t('realName.writePInfo')" icon="el-icon-edit"></el-step>
      </el-steps>
      <el-form ref="formPerson" :model="formPerson" :rules="rulesPerson" label-width="auto" class="regFormPerson">
        <el-form-item :label="$t('realName.name')" prop="realName">
          <el-input :placeholder="$t('placeholder.input')" v-model.trim="formPerson.realName" maxlength="128"></el-input>
        </el-form-item>
        <el-form-item :label="$t('realName.area')" prop="area">
          <el-col :span="7">
            <el-form-item prop="area7" style="width: 100%;min-width:auto">
              <el-select v-model="area7" @change="handleChangeArea1($event, 2, 'person1')" :disabled="disabled" :placeholder="$t('common.province')" filterable>
                <el-option v-for="item in area1Options" :key="item.areaId" :label="item.areaName" :value="item.areaName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="text-align:center;width:5%">-</el-col>
          <el-col :span="7">
            <el-form-item prop="area8" style="width: 100%;min-width:auto">
              <el-select v-model="area8" @change="handleChangeArea1($event, 3, 'person2')" :disabled="disabled" :placeholder="$t('common.city')" filterable>
                <el-option v-for="item in area2Options" :key="item.value" :label="item.areaName" :value="item.areaName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="text-align:center;width:5%">-</el-col>
          <el-col :span="7">
            <el-form-item prop="area9" style="width: 100%;min-width:auto">
              <el-select v-model="area9" :placeholder="$t('common.county')" :disabled="disabled" filterable>
                <el-option v-for="item in area3Options" :key="item.value" :label="item.areaName" :value="item.areaName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('realName.address')" prop="address">
          <el-input :placeholder="$t('placeholder.realName5')" :disabled="disabled" v-model.trim="formPerson.address" maxlength="128"></el-input>
        </el-form-item>
        <el-form-item :label="$t('realName.idCard')" prop="idCard">
          <el-input :placeholder="$t('placeholder.input')" v-model.trim="formPerson.idCard"></el-input>
        </el-form-item>
        <el-form-item :label="$t('realName.bankCard')" prop="showBankAccount">
          <el-input :placeholder="$t('placeholder.input')" v-model.trim="formPerson.showBankAccount" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item :label="$t('realName.phone')" required>
          <div class="flex-hb" style="width: 96%;">
            <el-form-item style="width: 34%;min-width:auto">
              <el-select v-model="phonePrefix" filterable :placeholder="$t('placeholder.select')" class="prefix">
                <el-option v-for="(item, index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <span>-</span>
            <el-form-item prop="phoneNumb" style="width: 62%;min-width:auto">
              <el-input v-model.trim="formPerson.phoneNumb" :placeholder="$t('placeholder.input')" maxlength="30" style="width: 100%;"></el-input>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item prop="vailCode" :label="$t('common.phoneCode')">
          <div class="flex-hb" style="width: 96%;">
            <el-input v-model.trim="formPerson.vailCode" :placeholder="$t('placeholder.input')" style="width: 70%"></el-input>
            <el-button v-show="sendAuthCode" type="primary" @click="getAuthCode('Person')" style="width: 28%;padding: 12px 0;">{{ $t('common.getVerCode') }}</el-button>
            <el-button v-show="!sendAuthCode" class="btnNClick" type="info" disabled style="width: 28%;padding: 12px 0;">{{ auth_time }}s</el-button>
          </div>
        </el-form-item>
        <div class="flex-ha">
          <el-button class="next btnClr" type="primary" @click="next('formPerson')">{{ $t('realName.subAuth') }}</el-button>
          <el-button class="next cancel" type="primary" @click="prevTo('btn1')" style="width:98px;">{{ $t('button.cancel') }}</el-button>
        </div>
      </el-form>
    </div>
    <!-- enterprice Authenticate page -->
    <div class="box enterpriceAuth" v-if="enterpriceAuth">
      <div class="title">
        <span></span>
        <i>{{ $t('realName.eAuth') }}</i>
      </div>
      <el-steps align-center :active="enterpriceActive" class="steps steps2">
        <el-step :title="$t('realName.writeBusiInfo')" icon="el-icon-edit"></el-step>
        <el-step :title="$t('realName.subAuth')" icon="el-icon-upload"></el-step>
        <el-step :title="$t('realName.subVeriCode')" icon="el-icon-success"></el-step>
      </el-steps>
      <!-- form -->
      <el-form ref="formEnter" v-if="formShow" :model="formEnter" :rules="rulesEnter" label-width="auto" class="regForm1 regFormPerson">
        <el-form-item :label="$t('realName.enterName')" prop="companyName">
          <el-input :placeholder="$t('placeholder.realName1')" v-model="formEnter.companyName" disabled v-if="disabled"></el-input>
          <el-input :placeholder="$t('placeholder.realName1')" v-model="formEnter.companyName" v-else maxlength="128"></el-input>
        </el-form-item>
        <el-form-item :label="$t('realName.enterLocation')" prop="area">
          <el-col :span="7">
            <el-form-item prop="area1" style="width: 100%;min-width:auto">
              <el-select v-model="area1" @change="handleChangeArea1($event, 2, 'com2')" :disabled="disabled" :placeholder="$t('common.province')" filterable>
                <el-option v-for="item in area1Options" :key="item.areaId" :label="item.areaName" :value="item.areaName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="text-align:center;width:5%">-</el-col>
          <el-col :span="7">
            <el-form-item prop="area2" style="width: 100%;min-width:auto">
              <el-select v-model="area2" @change="handleChangeArea1($event, 3, 'com3')" :disabled="disabled" :placeholder="$t('common.city')" filterable>
                <el-option v-for="item in com2AreaOptions" :key="item.value" :label="item.areaName" :value="item.areaName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="text-align:center;width:5%">-</el-col>
          <el-col :span="7">
            <el-form-item prop="area3" style="width: 100%;min-width:auto">
              <el-select v-model="area3" :placeholder="$t('common.county')" :disabled="disabled" filterable>
                <el-option v-for="item in com3AreaOptions" :key="item.value" :label="item.areaName" :value="item.areaName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('realName.address')" prop="address">
          <el-input :placeholder="$t('placeholder.realName5')" :disabled="disabled" v-model.trim="formEnter.address" maxlength="128"></el-input>
        </el-form-item>
        <el-form-item :label="$t('realName.identNum')" prop="showBusinessLicenseNumb">
          <el-input :placeholder="$t('placeholder.realName2')" v-model.trim="formEnter.showBusinessLicenseNumb" disabled v-if="disabled"></el-input>
          <el-input :placeholder="$t('placeholder.realName2')" v-model.trim="formEnter.showBusinessLicenseNumb" v-else maxlength="30"></el-input>
        </el-form-item>
        <el-form-item :label="$t('realName.bankAccountName')" prop="bankAccountName">
          <el-input :placeholder="$t('placeholder.realName3')" v-model.trim="formEnter.bankAccountName" disabled v-if="disabled"></el-input>
          <el-input :placeholder="$t('placeholder.realName3')" v-model.trim="formEnter.bankAccountName" v-else maxlength="30"></el-input>
        </el-form-item>
        <el-form-item :label="$t('realName.openBank')" prop="bankName">
          <el-select class="selectOnly" v-model="formEnter.bankName" :placeholder="$t('placeholder.select')" :disabled="disabled">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <!-- <el-select v-model="formEnter.bankName" :placeholder="$t('placeholder.select')" v-else>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item :label="$t('realName.locationBank')" prop="bankLocation">
          <!-- <el-cascader style="width:100%" size="large" :options="proAndCity" v-model="selectedOptions" disabled v-if="disabled">
          </el-cascader>
          <el-cascader style="width:100%" size="large" :options="proAndCity" v-model="selectedOptions" @change="handleChange" v-else>
          </el-cascader> -->
          <el-col :span="7">
            <el-form-item prop="area3" style="width: 100%;min-width:auto">
              <el-select v-model="area4" :placeholder="$t('common.province')" @change="handleChangeArea1($event, 2, 'bank2')" :disabled="disabled" filterable>
                <el-option v-for="item in area1Options" :key="item.areaId" :label="item.areaName" :value="item.areaName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="text-align:center;width:5%">-</el-col>
          <el-col :span="7">
            <el-form-item prop="area4" style="width: 100%;min-width:auto">
              <el-select v-model="area5" :placeholder="$t('common.city')" @change="handleChangeArea1($event, 3, 'bank3')" :disabled="disabled" filterable>
                <el-option v-for="item in bank2AreaOptions" :key="item.value" :label="item.areaName" :value="item.areaName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="text-align:center;width:5%">-</el-col>
          <el-col :span="7">
            <el-form-item prop="area6" style="width: 100%;min-width:auto">
              <el-select v-model="area6" :placeholder="$t('common.county')" :disabled="disabled" filterable>
                <el-option v-for="item in bank3AreaOptions" :key="item.value" :label="item.areaName" :value="item.areaName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('realName.openBranch')" prop="bankBranch">
          <el-input :placeholder="$t('placeholder.input')" v-model.trim="formEnter.bankBranch" disabled v-if="disabled"></el-input>
          <el-input :placeholder="$t('placeholder.input')" v-model.trim="formEnter.bankBranch" v-else maxlength="30"></el-input>
        </el-form-item>
        <el-form-item :label="$t('realName.bankAccount')" prop="showBankAccount">
          <el-input :placeholder="$t('placeholder.input')" v-model.trim="formEnter.showBankAccount" disabled v-if="disabled"></el-input>
          <el-input :placeholder="$t('placeholder.input')" v-model.trim="formEnter.showBankAccount" v-else maxlength="30"></el-input>
        </el-form-item>
        <el-form-item :label="$t('realName.contact')" prop="contactName">
          <el-input :placeholder="$t('placeholder.realName6')" :disabled="disabled" v-model.trim="formEnter.contactName" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item :label="$t('realName.contactNum')" required>
          <div class="flex-hb" style="width: 96%;">
            <el-form-item style="width: 34%;min-width:auto">
              <el-select v-model="phonePrefix" filterable :placeholder="$t('placeholder.select')" :disabled="disabled" class="prefix">
                <el-option v-for="(item, index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <span>-</span>
            <el-form-item prop="contactNumb" style="width: 62%;min-width:auto">
              <el-input v-model.trim="formEnter.contactNumb" :placeholder="$t('placeholder.input')" maxlength="30" :disabled="disabled" style="width: 100%;"></el-input>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item prop="vailCode" :label="$t('common.phoneCode')">
          <div class="flex-hb" style="width: 96%;">
            <el-input v-model.trim="formEnter.vailCode" :placeholder="$t('placeholder.input')" :disabled="disabled" style="width: 70%"></el-input>
            <el-button v-show="sendAuthCode" type="primary" @click="getAuthCode('Enter')" :disabled="disabled" style="width: 28%;padding: 12px 0;">{{ $t('common.getVerCode') }}</el-button>
            <el-button v-show="!sendAuthCode" class="btnNClick" type="info" disabled style="width: 28%;padding: 12px 0;">{{ auth_time }}s</el-button>
          </div>
        </el-form-item>
        <div class="flex-ha" v-if="disabled">
          <el-button class="next cancel" type="primary" @click="prevTo('btn3')">{{ $t('button.prev') }}</el-button>
          <el-button class="next btnClr" type="primary" @click="next('formEnterSubmit')">{{ $t('realName.subAuth') }}</el-button>
        </div>
        <div class="flex-ha" v-else>
          <el-button class="next btnClr" type="primary" @click="next('formEnter')">{{ $t('button.next') }}</el-button>
          <el-button class="next cancel" type="primary" @click="prevTo('btn2')" style="width:84px;">{{ $t('button.cancel') }}</el-button>
        </div>
      </el-form>
      <!-- veri Code -->
      <div v-else class="enterVeri">
        <h3>{{ $t('realName.message1') }} {{ today }} {{ $t('realName.message2') }}，{{ $t('realName.message3') }}</h3>
        <p>1.{{ $t('realName.message4') }} ( {{ showBankNum }} ) {{ $t('realName.message5') }} <i>0.01</i>.
          <strong>{{ $t('realName.message6') }}</strong>
        </p>
        <p>2.{{ $t('realName.message7') }}<i>{{ $t('realName.message8') }}</i>{{ $t('realName.message9') }}，{{ $t('realName.message10') }}</p>
        <p>3.{{ $t('realName.message11') }}</p>
        <div class="flex" style="margin-top:30px;">
          <span class="ver3">{{ $t('common.verification') }}: &nbsp;&nbsp;</span>
          <el-input v-model.trim="veri3" style="width:20%" maxlength="20"></el-input>
        </div>
        <div class="flex-hc" style="width:50%;">
          <el-button type="primary" class="btnClr" @click="TJenterVeriCode">{{ $t('realName.subAuth') }}</el-button>
          <el-button type="primary" class="btnClr" @click="prevTo('submitVeri')">{{ $t('realName.cancelAuth') }}</el-button>
        </div>
      </div>
    </div>
    <!-- success -->
    <div class="success" v-if="authSuccess">
      <p>{{ $t('realName.other1') }}<i @click="renew">{{ $t('realName.other2') }}</i>，{{ $t('realName.other3') }}</p>
      <div class="title flex">
        <i class="el-icon-folder-checked"></i>
        <h3>{{ $t('realName.authPassed') }}</h3>
      </div>
      <!-- 个人 -->
      <div class="auth1" v-if="certType == 1">
        <p>{{ $t('realName.acType') }}： {{ $t('realName.personAc') }}</p>
        <p>{{ $t('realName.name') }}： {{ personData.realName }}</p>
        <p>{{ $t('realName.area') }}： {{ personData.area }}</p>
        <p>{{ $t('realName.address') }}： {{ personData.address }}</p>
        <p>{{ $t('realName.idCard') }}： {{ personData.idCard }}</p>
        <p>{{ $t('realName.bankCard') }}： {{ personData.bankAccount }}</p>
        <p>{{ $t('realName.phone') }}： {{ personData.phoneNumb }}</p>
      </div>
      <!-- 企业 -->
      <div class="auth2" v-if="certType == 2">
        <p>{{ $t('realName.acType') }}： {{ $t('realName.enterAc') }}</p>
        <p>{{ $t('realName.enterName') }}： {{ companyData.companyName }}</p>
        <p>{{ $t('realName.enterLocation') }}： {{ companyData.area }}</p>
        <p>{{ $t('realName.address') }}： {{ companyData.address }}</p>
        <p>{{ $t('realName.contact') }}： {{ companyData.contactName }}</p>
        <p>{{ $t('realName.contactNum') }}： {{ companyData.contactNumb }}</p>
        <p>{{ $t('realName.identNum') }}： {{ companyData.businessLicenseNumb }}</p>
        <p>{{ $t('realName.bankAccountName') }}： {{ companyData.bankAccountName }}</p>
        <p>{{ $t('realName.openBank') }}： {{ companyData.bankName }}</p>
        <p>{{ $t('realName.locationBank') }}： {{ companyData.bankLocation }}</p>
        <p>{{ $t('realName.openBranch') }}： {{ companyData.bankBranch }}</p>
        <p>{{ $t('realName.bankAccount') }}： {{ companyData.bankAccount }}</p>
      </div>
      <img class="authComplete" :src="language == 'cn' ? require('@/assets/images/authComplete.png') : require('@/assets/images/authComplete_1.png')" alt="authComplete">
    </div>
  </div>
</template>

<script>
// import { provinceAndCityData, regionData, CodeToText, TextToCode } from 'element-china-area-data'
import { setTimeout } from 'timers'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      selectAuth: true,
      personalAuth: false,
      enterpriceAuth: false,
      authSuccess: false, // 是否显示成功页
      personActive: 1,
      enterpriceActive: 1,
      formPerson: { // 个人认证-表单
        realName: '',
        area: '',
        address: '',
        idCard: '',
        showBankAccount: '',
        phoneNumb: '',
        vailCode: '',
        bankAccount: ''
      },
      phonePrefix: '86',
      prefixOptions: [], // 全球手机号前缀
      formShow: true, // 是否显示企业认证表单
      formEnter: { // 企业认证-表单
        companyName: '',
        area: '',
        address: '',
        contactName: '',
        contactNumb: '',
        vailCode: '',
        businessLicenseNumb: '',
        bankAccountName: '',
        bankName: '',
        bankLocation: '',
        bankBranch: '',
        bankAccount: '',
        showBankAccount: '',
        showBusinessLicenseNumb: ''
      },
      area1: '',
      area2: '',
      area3: '',
      area4: '',
      area5: '',
      area6: '',
      area7: '',
      area8: '',
      area9: '',
      com2AreaOptions: [],
      com3AreaOptions: [],
      bank2AreaOptions: [],
      bank3AreaOptions: [],
      // proAndCity: provinceAndCityData,
      // selectedOptions: [], // 选择的省市(code)
      enterData: {}, // 提交公司信息参数
      personCertData: {}, // 提交个人信息参数
      options: [ // 开户银行选择项
        {
          value: '中国银行',
          label: '中国银行'
        }, {
          value: '中国工商银行',
          label: '中国工商银行'
        }, {
          value: '中国农业银行',
          label: '中国农业银行'
        }, {
          value: '交通银行',
          label: '交通银行'
        }, {
          value: '招商银行',
          label: '招商银行'
        }
      ],
      disabled: false,
      sendAuthCode: true,
      auth_time: 0, // countdown
      companyId: '',
      showBankNum: '', // 加密的银行账号
      certStatus: '', // 是否通过认证
      certType: 0, // 账号类型 1个人 2企业
      companyData: {},
      personData: {},
      today: '',
      veri3: '', // 企业认证-提交验证码
      loading: '',
      auth_timetimer: '',
      canSubmit: false,
      button: {},
      isClear: false, // (企业认证)是否清空，只有在认证成功时，才清空
      showPersonBtn: false,
      showCompanyBtn: false
    }
  },
  watch: {
    language(val) {
      if (val == 'cn') {
        this.prefixOptions = this.$utils.formatPrefixCN()
      }
      if (val == 'en') {
        this.prefixOptions = this.$utils.formatPrefixEN()
      }
      // 清除表单提示语
      if (this.personalAuth) {
        this.$refs['formPerson'].clearValidate()
      }
      if (this.enterpriceAuth) {
        this.$refs['formEnter'].clearValidate()
      }
    },
    certType(val) {
      if (val == '') {
        this.showPersonBtn = true
        this.showCompanyBtn = true
      }
      if (val == 1) {
        this.showPersonBtn = true
      }
      if (val == 2) {
        this.showCompanyBtn = true
      }
    }
  },
  created() {
    this.$store.dispatch('getArea', { level: 1, areaId: '' }) // 获取区域
  },
  mounted() {
    this.isStatusPassed()
    let data = JSON.parse(sessionStorage.getItem('user'))
    this.companyId = data.companyId
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    if (month < 10) {
      month = '0' + month
    }
    this.today = year + '.' + month + '.' + day
    if (this.language == 'cn') {
      this.prefixOptions = this.$utils.formatPrefixCN()
    } else if (this.language == 'en') {
      this.prefixOptions = this.$utils.formatPrefixEN()
    }
  },
  computed: {
    ...mapGetters(['language', 'area1Options', 'area2Options', 'area3Options']),
    // 实名认证-填写公司信息-验证表单
    rulesEnter() {
      const rulesEnter = {
        companyName: [
          {
            required: true,
            trigger: 'blur',
            pattern: this.$utils.reg.companyName,
            validator: this.$utils.validator.common
          }
        ],
        // companyName: [
        //   {
        //     required: true,
        //     trigger: 'blur',
        //     validator: (rule, value, callback) => {
        //       if (value == '') {
        //         callback(new Error(this.$t('placeholder.input') + this.$t('realName.enterName')))
        //       } else {
        //         var specialKey = '[`~!#@%$^&*=|{}\':;,，。.\'\\[\\]<>/?~！#￥……&*——|{}【】‘；：”“\']‘\''
        //         for (var i = 0; i < value.length; i++) {
        //           if (specialKey.indexOf(value.substr(i, 1)) != -1) {
        //             callback(new Error(this.$t('placeholder.specialCode')))
        //           }
        //         }
        //         callback()
        //       }
        //     }
        //   }
        // ],
        area: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.area1 == '' || this.area2 == '') {
                callback(new Error(this.$t('placeholder.select') + this.$t('realName.enterLocation')))
              }
              callback()
            }
          }
        ],
        address: [
          { required: true, message: this.$t('placeholder.input') + this.$t('realName.address'), trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: this.$t('placeholder.input') + this.$t('realName.contact'), trigger: 'blur' }
        ],
        contactNumb: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value == '') {
                callback(new Error(this.$t('placeholder.input') + this.$t('realName.phone')))
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
          { required: true, message: this.$t('placeholder.input') + this.$t('common.phoneCode'), trigger: 'blur' }
        ],
        showBusinessLicenseNumb: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value == '' || value == null) {
                callback(new Error(this.$t('placeholder.input') + this.$t('realName.identNum')))
              } else {
                if (value.length < 11) {
                  callback(new Error(this.$t('message.businessLicenseNumb')))
                }
                var specialKey = '[`~!#@%$^&*()=|{}\':;,，。.\'\\[\\]<>/?~！#￥……&*（）——|{}【】‘；：”“\']‘\''
                for (var i = 0; i < value.length; i++) {
                  if (specialKey.indexOf(value.substr(i, 1)) != -1) {
                    callback(new Error(this.$t('placeholder.specialCode')))
                  }
                }
                callback()
              }
            }
          }
        ],
        bankAccountName: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value == '' || value == null) {
                callback(new Error(this.$t('placeholder.input') + this.$t('realName.bankAccountName')))
              } else {
                var specialKey = '[`~!#@%$^&*()=|{}\':;,，。.\'\\[\\]<>/?~！#￥……&*（）——|{}【】‘；：”“\']‘\''
                for (var i = 0; i < value.length; i++) {
                  if (specialKey.indexOf(value.substr(i, 1)) != -1) {
                    callback(new Error(this.$t('placeholder.specialCode')))
                  }
                }
                callback()
              }
            }
          }
        ],
        bankName: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value == '' || value == null) {
                callback(new Error(this.$t('placeholder.select') + this.$t('realName.openBank')))
              }
              callback()
            }
          }
        ],
        bankLocation: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.area4 == '' || this.area5 == '') {
                callback(new Error(this.$t('placeholder.select') + this.$t('realName.locationBank')))
              }
              callback()
            }
          }
        ],
        bankBranch: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value == '' || value == null) {
                callback(new Error(this.$t('placeholder.input') + this.$t('realName.openBranch')))
              } else {
                var specialKey = '[`~!#@%$^&*()=|{}\':;,，。.\'\\[\\]<>/?~！#￥……&*（）——|{}【】‘；：”“\']‘\''
                for (var i = 0; i < value.length; i++) {
                  if (specialKey.indexOf(value.substr(i, 1)) != -1) {
                    callback(new Error(this.$t('placeholder.specialCode')))
                  }
                }
                callback()
              }
            }
          }
        ],
        showBankAccount: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value == '' || value == null) {
                callback(new Error(this.$t('placeholder.input') + this.$t('realName.bankAccount')))
              } else {
                var reg = /\D/g
                if (reg.test(value)) {
                  callback(new Error(this.$t('placeholder.onlyNumber')))
                }
                if (value.length < 16) {
                  callback(new Error(this.$t('placeholder.more16')))
                }
                callback()
              }
            }
          }
        ]
      }
      return rulesEnter
    },
    // 实名认证-填写个人信息-验证表单
    rulesPerson() {
      const rulesEnter = {
        realName: [
          { required: true, message: this.$t('placeholder.input') + this.$t('realName.name'), trigger: 'blur' }
        ],
        area: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.area7 == '' || this.area8 == '') {
                callback(new Error(this.$t('placeholder.select') + this.$t('realName.area')))
              }
              callback()
            }
          }
        ],
        address: [
          { required: true, message: this.$t('placeholder.input') + this.$t('realName.address'), trigger: 'blur' }
        ],
        idCard: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
              if (value == '' || value == null) {
                callback(new Error(this.$t('placeholder.input') + this.$t('realName.idCard')))
              } else if (value && !reg.test(value)) {
                callback(new Error(this.$t('common.plzRight') + this.$t('realName.idCard')))
              } else {
                callback()
              }
            }
          }
        ],
        showBankAccount: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value == '' || value == null) {
                callback(new Error(this.$t('placeholder.input') + this.$t('realName.bankCard')))
              } else {
                var reg = /\D/g
                if (reg.test(value)) {
                  callback(new Error(this.$t('placeholder.onlyNumber')))
                }
                if (value.length < 16) {
                  callback(new Error(this.$t('placeholder.more16')))
                }
                callback()
              }
            }
          }
        ],
        phoneNumb: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value == '') {
                callback(new Error(this.$t('placeholder.input') + this.$t('realName.phone')))
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
          { required: true, message: this.$t('placeholder.input') + this.$t('common.phoneCode'), trigger: 'blur' }
        ]
      }
      return rulesEnter
    }
  },
  methods: {
    // 初始化回显区域
    init() {
      if (this.area2 !== '') {
        let areaId = this.area1Options.find(item => item.areaName === this.area1).areaId
        this.getArea(areaId)
          .then(res => {
            this.com2AreaOptions = res
            if (this.area3 !== '') {
              let areaId2 = this.com2AreaOptions.find(item => item.areaName === this.area2).areaId
              this.getArea(areaId2).then(res => {
                this.com3AreaOptions = res
              })
            }
          })
      }
      if (this.area5 !== '') {
        let areaId = this.area1Options.find(item => item.areaName === this.area4).areaId
        this.getArea(areaId)
          .then(res => {
            this.bank2AreaOptions = res
            if (this.area6 !== '') {
              let areaId2 = this.bank2AreaOptions.find(item => item.areaName === this.area5).areaId
              this.getArea(areaId2).then(res => {
                this.bank3AreaOptions = res
              })
            }
          })
      }
    },
    // 省市联动
    // handleChange(value) {
    //   this.formEnter.bankLocation = CodeToText[value[0]] + '-' + CodeToText[value[1]]
    // },
    // 选择省市
    handleChangeArea1(val, level, sort) {
      var areaId
      if (level === 2) {
        if (sort === 'com2') {
          this.area2 = ''
          this.area3 = ''
          this.com3AreaOptions = []
        }
        if (sort === 'bank2') {
          this.area5 = ''
          this.area6 = ''
          this.bank3AreaOptions = []
        }
        if (sort === 'person1') {
          this.area8 = ''
          this.area9 = ''
        }
      }
      if (level === 3) {
        if (sort === 'com3') {
          this.area3 = ''
          areaId = this.com2AreaOptions.find(item => item.areaName === val).areaId
        }
        if (sort === 'bank3') {
          this.area6 = ''
          areaId = this.bank2AreaOptions.find(item => item.areaName === val).areaId
        }
        if (sort === 'person2') {
          this.area9 = ''
        }
      }
      if (sort !== 'com3' && sort !== 'bank3') {
        areaId = this[`area${level - 1}Options`].find(item => item.areaName === val).areaId
      }
      this.$store.dispatch('getArea', { level, areaId })
      this.getArea(areaId)
        .then(res => {
          this[`${sort}AreaOptions`] = res || []
        })
    },
    // 获取区域
    async getArea(areaId) {
      let res = await this.$http.posts('getArea', '', { areaId })
      return res.data
    },
    // getArea(areaId, level, sort) {
    //   this.$http.posts('getArea', '', { areaId })
    //     .then(res => {
    //       var data = res.data || []
    //       this[`${sort}AreaOptions`] = data
    //     })
    // },
    // 认证信息
    isStatusPassed() {
      this.$http.posts('certInfo')
        .then(res => {
          let data = res.data
          this.certStatus = data.certStatus
          this.certType = data.certType || ''
          if (this.certStatus) { // 通过
            this.selectAuth = false
            this.authSuccess = true
            this.getInfo(this.certType)
          } else { // 不通过
            return false
          }
        })
    },
    // 根据类型认证信息
    getInfo(certType) {
      this.$http.posts('getCertInfo', '', { certType })
        .then(res => {
          if (certType == 1) {
            // let data, pre
            // personData & companyData 为了在成功页直接展示省市
            // formPerson & formEnter 需要转换码 故再次赋一次值
            // this.personData = res.data.data
            this.personData = res.data
            // data = this.personData
            // pre = data.showPhone.split('+')
            // this.phonePrefix = pre[0]
            // data.phoneNumb = pre[1]
            // this.formPerson = data
          } else {
            this.companyData = res.data
            this.formEnter = this.companyData
            let contactNumb = this.formEnter.contactNumb == null ? '' : this.formEnter.contactNumb
            if (contactNumb !== '') {
              let numb = contactNumb.split('+')
              if (!this.authSuccess) {
                this.phonePrefix = numb[0]
                this.formEnter.contactNumb = numb[1]
              } else {
                this.formEnter.contactNumb = this.$utils.exchangePrefix(this.formEnter.contactNumb)
              }
            }
            if (this.formEnter.area !== null && this.formEnter.area.indexOf('-') !== -1) {
              let area = this.formEnter.area.split('-')
              this.area1 = area[0] || ''
              this.area2 = area[1] || ''
              this.area3 = area[2] || ''
            } else {
              this.area1 = ''
              this.area2 = ''
              this.area3 = ''
            }
            if (this.formEnter.bankLocation !== null && this.formEnter.bankLocation.indexOf('-') !== -1) {
              let location = this.formEnter.bankLocation.split('-')
              this.area4 = location[0] || ''
              this.area5 = location[1] || ''
              this.area6 = location[2] || ''
            } else {
              this.area4 = ''
              this.area5 = ''
              this.area6 = ''
            }
            // a = location[0]
            // b = location[1]
            // this.selectedOptions = TextToCode[a][b].code
          }
          this.init()
        })
    },
    // 选择认证方式
    toAuth(type, formName) {
      this.sendAuthCode = true
      this.selectAuth = false
      this.disabled = false
      if (type == 1) {
        this.personalAuth = true
        this.enterpriceAuth = false
        this.personActive = 1
      } else {
        this.enterpriceAuth = true
        this.personalAuth = false
        this.enterpriceActive = 1
      }
      if (!this.isClear) {
        this.getInfo(type)
      } else {
        // 重新认证
        this.formPerson = {}
        this.formEnter = {}
        for (var i = 1; i < 10; i++) {
          this[`area${i}`] = ''
        }
        this.com2AreaOptions = []
        this.com3AreaOptions = []
        this.bank2AreaOptions = []
        this.bank3AreaOptions = []
        this.$store.commit('AREA2_OPTIONS', [])
        this.$store.commit('AREA3_OPTIONS', [])
        // this.selectedOptions = []
      }
    },
    // 点击上一步
    prevTo(type) {
      if (type == 'btn1') {
        this.selectAuth = true
        this.personalAuth = false
        this.enterpriceAuth = false
        this.sendAuthCode = true // reset verification code button
        this.$refs['formPerson'].resetFields()
      }
      if (type == 'btn2') {
        this.selectAuth = true
        this.personalAuth = false
        this.enterpriceAuth = false
        // this.$refs['formEnter'].resetFields()
      }
      if (type == 'submitVeri') {
        this.selectAuth = true
        this.personalAuth = false
        this.enterpriceAuth = false
      }
      if (type == 'btn3' && this.enterpriceActive == 2) {
        this.enterpriceActive = 1
        this.disabled = false
      } else {
        this.enterpriceActive = 2
        this.disabled = true
        this.formShow = true
      }
    },
    // 获取短信验证码
    async getAuthCode(type) {
      let field = type === 'Person' ? 'phoneNumb' : 'contactNumb'
      if (
        (type === 'Person' && this.formPerson.phoneNumb === '') ||
        (type === 'Enter' && this.formEnter.contactNumb === '')
      ) {
        this.$utils.$message({
          message: this.$t('common.plzRight') + this.$t('common.phone'),
          type: 'error'
        })
        return
      }
      this.$refs[`form${type}`].validateField(field, error => {
        if (!error) {
          clearInterval(this.auth_timetimer)
          this.sendAuthCode = false
          this.auth_time = 60
          this.auth_timetimer = setInterval(() => {
            this.auth_time--
            if (this.auth_time <= 0) {
              this.sendAuthCode = true
              clearInterval(this.auth_timetimer)
            }
          }, 1000)
          let phone = this.phonePrefix + '+' + this[`form${type}`].phoneNumb
          if (type === 'Enter') {
            phone = this.phonePrefix + '+' + this[`form${type}`].contactNumb
          }
          this.$http.posts('getCodeAuth', '', { phoneNumb: phone }).then(res => { })
        }
      })
    },
    // 点击提交认证
    next(formName) {
      if (formName == 'formPerson') { // 填写个人信息
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitPerson()
          } else {
            return false
          }
        })
        this.isClear = false
      }
      if (formName == 'formEnter') { // 填写公司信息
        this.sendAuthCode = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.formEnter.area = this.area3 == ''
              ? this.area1 + '-' + this.area2
              : this.area1 + '-' + this.area2 + '-' + this.area3
            this.formEnter.bankAccount = this.formEnter.showBankAccount
            this.formEnter.businessLicenseNumb = this.formEnter.showBusinessLicenseNumb
            this.formEnter.bankLocation = this.area6 == ''
              ? this.area4 + '-' + this.area5
              : this.area4 + '-' + this.area5 + '-' + this.area6
            this.enterData = { ...this.formEnter, companyId: this.companyId }
            this.enterData.contactNumb = this.phonePrefix + '+' + this.formEnter.contactNumb
            this.$http.posts('comCertFirst', this.enterData, '', true)
              .then(res => {
                this.isClear = false
                this.enterpriceActive = 2
                this.disabled = true
                let str = this.formEnter.bankAccount.toString()
                let front = str.substring(0, 6)
                let end = str.substring(str.length - 4)
                this.showBankNum = front + '**********' + end
              })
          }
        })
      }
      if (formName == 'formEnterSubmit') { // 提交认证
        this.enterpriceActive = 3
        this.$http.posts('comCertSecond', '', { certType: 1 }, true)
          .then(res => {
            this.formShow = false
            setTimeout(() => {
              this.canSubmit = true
            }, 1000)
          })
      }
    },
    // 提交企业认证验证码
    TJenterVeriCode() {
      if (this.canSubmit) {
        if (this.veri3 == '') {
          this.$utils.$message({
            message: this.$t('realName.message11'),
            type: 'error'
          })
        } else {
          this.$http.posts('comCertThird', '', { vailCode: this.veri3 })
            .then(res => {
              // if (res.data.resCode == 0) {
              this.loading = this.$loading({
                lock: true,
                text: this.$t('message.jumpTo')
              })
              setTimeout(() => {
                this.loading.close()
                this.$router.push('/bmBasicInfo')
              }, 2000)
              // } else {
              //   this.$utils.$message({
              //     message: res.data.resMsg,
              //     type: 'error'
              //   })
              // }
            })
          // .catch((err) => {
          //   console.log(err)
          // })
        }
      }
    },
    // 提交个人信息
    submitPerson() {
      this.formPerson.area = this.area9 == ''
        ? this.area7 + '-' + this.area8
        : this.area7 + '-' + this.area8 + '-' + this.area9
      this.formPerson.bankAccount = this.formPerson.showBankAccount
      this.personCertData = { ...this.formPerson, companyId: this.companyId, coUserId: this.personData.coUserId }
      this.personCertData.phoneNumb = this.phonePrefix + '+' + this.personCertData.phoneNumb
      this.$http.posts('submitPersonCert', this.personCertData)
        .then(res => {
          this.loading = this.$loading({
            lock: true,
            text: this.$t('message.jumpTo')
          })
          setTimeout(() => {
            this.loading.close()
            this.$router.push('/bmBasicInfo')
          }, 2000)
        })
    },
    // 重新认证
    renew() {
      this.selectAuth = true
      this.authSuccess = false
      this.isClear = true
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/color';
@import '../../assets/css/login.less';
#realName {
  height: 100%;
  i {
    font-style: normal;
  }
  .box {
    width: 100%;
    height: 100%;
    .title {
      padding-top: 10px;
      height: 30px;
      span {
        width: 5px;
        float: left;
        height: 24px;
        display: inline-block;
        background: @main;
        margin-top: 3px;
        margin-right: 5px;
      }
      i {
        color: #333;
        line-height: 30px;
        float: left;
      }
    }
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
  /*兼容IE11*/
  // @media screen and(-ms-high-contrast:active), (-ms-high-contrast: none) {
  //   .vailIpt {
  //     width: 71%;
  //   }
  // }
  .btn {
    width: 220px;
    button {
      width: 100%;
      height: 80px;
      font-size: 22px;
      color: #fff;
      border-radius: 5px;
      margin-top: 20px;
    }
  }
  .steps {
    margin: 30px auto;
  }
  .steps1 {
    width: 70%;
  }
  .steps2 {
    width: 80%;
  }
  .regForm1,
  .regFormPerson {
    width: 40%;
    margin: 50px auto;
    @media screen and (min-width: 1280px) and (max-width: 1600px) {
      width: 51%;
    }
    @media (max-width: 1280px) {
      width: 50%;
    }
    .next {
      display: block;
      width: auto;
      // margin: 20px auto 0;
      margin-top: 20px;
    }
    .grey {
      color: #ffffff;
      background-color: #c8c9cc;
      border-color: #c8c9cc;
    }
    .cancel {
      color: #333;
      background-color: #fff;
      border-color: #333;
    }
    .btnNClick {
      margin-left: 0;
    }
  }
  .enterVeri {
    width: 80%;
    margin: 50px auto 0;
    h3 {
      text-align: center;
      padding-bottom: 40px;
    }
    p {
      line-height: 26px;
      padding-bottom: 10px;
      i {
        color: #f00;
      }
    }
    span.ver3 {
      line-height: 40px;
    }
    .btnClr {
      color: #fff;
      margin: 100px auto 0;
      display: inherit;
    }
  }
  .success {
    padding-top: 10px;
    i {
      color: @text3;
      &:hover {
        cursor: pointer;
      }
    }
    .title {
      padding: 70px 0;
      i.el-icon-folder-checked {
        color: rgb(28, 182, 13);
        font-size: 44px;
        padding: 0 10px 0 60px;
      }
      h3 {
        line-height: 44px;
      }
    }
    .auth1,
    .auth2 {
      width: 60%;
      margin: auto;
      p {
        line-height: 40px;
      }
    }
    .authComplete {
      position: absolute;
      right: 10%;
      bottom: 20%;
      float: right;
    }
  }
  .check {
    margin-top: 24px;
    margin-right: 10px;
  }
  a.afterCheck {
    color: #333;
    width: 92%;
    display: inline-block;
    height: auto;
    white-space: normal;
    font-size: 14px;
    span {
      color: @text3;
      cursor: pointer;
    }
  }
}
#register {
  .prevStep {
    display: inline-block;
    padding: 20px 0 0 8%;
  }
}
</style>
<style lang="less">
#realName {
  .prefix .el-input {
    width: 100%;
  }
}
</style>
