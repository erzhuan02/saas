<template>
  <div id="openPlatform">
    <!-- banner -->
    <!-- <div class="banner">
      <img :src="language == 'cn' ? require('../../assets/images/openPlatformBg.png') : require('../../assets/images/openPlatformBg_1.png')" alt />
    </div> -->
    <!-- content1 -->
    <div class="content body" v-show="apply">
      <div class="bodyContent">
        <el-button @click="handleGoBack">{{ $t('button.back') }}</el-button>
        <p class="diveo" style="font-size: 1.3rem;">{{ $t('openPlatform.title1') }}</p>
        <table>
          <tr>
            <td>{{ $t('openPlatform.name1') }}</td>
            <td class="pointer clearfix">
              <span class="fl" style="width:80%">{{ $t('openPlatform.title1') }}</span>
              <p class="fr icon flex-hrvc" @click="showPage" style="width:20%;">
                <img src="../../assets/images/download.png" alt />
                {{ $t('button.download') }}
              </p>
            </td>
          </tr>
          <tr>
            <td>{{ $t('openPlatform.name2') }}</td>
            <td>{{ $t('openPlatform.desp1') }}</td>
          </tr>
        </table>
      </div>
    </div>
    <!-- content2 -->
    <div class="content body" v-show="!apply">
      <div class="bodyContent" style="max-width:900px">
        <p class="diveo">{{ $t('openPlatform.title2') }}:</p>
        <p class="diveo">{{ $t('openPlatform.title1') }}</p>
        <el-form ref="msgForm" :model="msgForm" :rules="msgRules">
          <!-- <el-form-item :label="$t('login.product')" prop="productId">
            <el-select v-model="msgForm.productId" :placeholder="$t('placeholder.select') + $t('placeholder.softMes') + $t(`placeholder.required_${clientType}`)">
              <el-option v-for="item in options" :key="item.productId" :label="item.productName" :value="item.productId"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item :label="$t('openPlatform.apply1')" prop="content">
            <el-input type="textarea" :rows="3" :placeholder="$t('order.message2') + $t(`placeholder.required_${clientType}`)" maxlength="200" v-model="msgForm.content"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common.name')" prop="userName">
            <el-input v-model="msgForm.userName" :placeholder="$t('placeholder.input') + $t('common.name') + $t(`placeholder.required_${clientType}`)" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item :label="$t('openPlatform.apply2')" prop="email">
            <el-input v-model.trim="msgForm.email" :placeholder="$t('openPlatform.message2') + $t(`placeholder.required_${clientType}`)" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common.phone')" required>
            <div class="phoneNumber flex-hb">
              <el-form-item prop="phonePrefix" style="width: 34%;min-width:auto">
                <el-select v-model="msgForm.phonePrefix" filterable :placeholder="$t('placeholder.select') + $t(`placeholder.required_${clientType}`)" style="width: 100%;">
                  <el-option v-for="(item, index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <span>-</span>
              <el-form-item prop="phoneNumb" style="width: 62%;min-width:auto">
                <el-input v-model.trim="msgForm.phoneNumb" :placeholder="$t('placeholder.input') + $t('common.phone') + $t(`placeholder.required_${clientType}`)" maxlength="30" style="width: 100%;"></el-input>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item :label="$t('common.companyName')" prop="companyName">
            <el-input v-model="msgForm.companyName" :placeholder="$t('placeholder.input') + $t('common.companyName') + $t(`placeholder.required_${clientType}`)" maxlength="128"></el-input>
          </el-form-item>
        </el-form>
        <!-- <el-form ref="msgForm" :model="msgForm" :rules="rules">
          <el-form-item :label="$t('openPlatform.apply1')" prop="content">
            <el-input type="textarea" :rows="3" :placeholder="$t('openPlatform.message1')" maxlength="200" v-model="msgForm.content"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common.name')" prop="userName">
            <el-input v-model.trim="msgForm.userName" :placeholder="$t('placeholder.input') + $t('common.name')" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item :label="$t('openPlatform.apply2')" prop="email">
            <el-input v-model.trim="msgForm.email" :placeholder="$t('openPlatform.message2')" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common.phone')" prop="phoneNumb">
            <div class="phoneNumber flex-hb">
              <el-select v-model="phonePrefix" filterable :placeholder="$t('placeholder.select')" class="prefix">
                <el-option v-for="(item,index) in prefixOptions" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-input v-model.trim="msgForm.phoneNumb" :placeholder="$t('placeholder.input') + $t('common.phone')" maxlength="11" class="phone"></el-input>
            </div>
          </el-form-item>
          <el-form-item :label="$t('common.companyName')" prop="companyName">
            <el-input v-model.trim="msgForm.companyName" :placeholder="$t('placeholder.input') + $t('common.companyName')" maxlength="128"></el-input>
          </el-form-item>
        </el-form> -->
        <!-- <div slot="footer" class="dialog-footer flex-hc">
          <el-button type="primary" @click="toMes('msgForm')">{{ $t('button.send') }}</el-button>
          <el-button @click="showPage">{{ $t('button.cancel') }}</el-button>
        </div> -->
        <div class="dialog-footer flex-hc">
          <el-button type="primary" @click="handleSend('msgForm')">{{ $t('button.send') }}</el-button>
          <el-button @click="showPage">{{ $t('button.cancel') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import $utils from '@/utils'
export default {
  data() {
    return {
      // ...mapState(['language', 'clientType']),
      apply: true,
      msgForm: {
        content: '',
        userName: '',
        email: '',
        phonePrefix: '86',
        phoneNumb: '',
        companyName: '',
        sourceId: 2, // 1.硬件产品购买 2.购买问题咨询 3.产品功能咨询 4.申请体验
        type: 2 // 1.普通留言 2.协议申请留言
      },
      prefixOptions: [],
      options: []
      // phonePrefix: '86',
      // msgForm: {
      //   content: '',
      //   userName: '',
      //   email: '',
      //   phoneNumb: '',
      //   companyName: '',
      //   sourceId: 1, // 1.硬件产品购买 2.购买问题咨询 3.产品功能咨询 4.申请体验
      //   type: 2 // 1.普通留言 2.协议申请留言
      // },
      // prefixOptions: [],
      // options: []
    }
  },
  computed: {
    ...mapGetters(['language', 'clientType']),
    msgRules() {
      return {
        content: [
          {
            required: true,
            trigger: 'change',
            pattern: this.$utils.reg.content200,
            validator: (rule, value, callback) => {
              let data = this.$utils.validator.common(rule, value, callback)
              // eslint-disable-next-line
              this.msgForm.content = data
            }
            // validator: (rule, value, callback) => {
            //   var newVal = this.$utils.emoji2Str(value)
            //   if (newVal !== value) {
            //     // eslint-disable-next-line
            //     this.msgForm.content = newVal
            //   }
            //   if (newVal.trim().length === 0) {
            //     callback(new Error(this.$t('message.inputRight')))
            //   }
            //   callback()
            // }
          }
        ],
        userName: [
          {
            required: true,
            trigger: 'change',
            pattern: this.$utils.reg.content30,
            validator: (rule, value, callback) => {
              let data = this.$utils.validator.common(rule, value, callback)
              // if (data) {
              // eslint-disable-next-line
              this.msgForm.userName = data
              // }
            }
            // validator: (rule, value, callback) => {
            //   var emoji = this.$utils.emoji2Str(value)
            //   var newVal = this.$utils.trim(emoji)
            //   if (newVal === '') {
            //     callback(new Error(this.$t('message.inputRight')))
            //   } else {
            //     // eslint-disable-next-line
            //     this.msgForm.userName = newVal
            //     callback()
            //   }
            // }
          }
        ],
        email: [
          {
            required: true,
            trigger: 'blur',
            pattern: this.$utils.reg.email,
            message: this.$t('placeholder.input') + this.$t('openPlatform.message3')
          }
        ],
        phonePrefix: [{
          required: true,
          trigger: 'change',
          message: this.$t('message.select'),
          validator: (rule, value, callback) => {
            var form = 'msgForm'
            if (value) {
              if (this.$utils.reg.phoneNoA.test(this[form].phoneNumb)) {
                this.$refs[form].validateField('phoneNumb')
              }
              callback()
            } else {
              callback(new Error(this.$t('message.select')))
            }
          }
        }],
        phoneNumb: [{
          required: true,
          trigger: 'blur',
          // pattern: this.$utils.reg.phoneNoA,
          // message: this.$t('message.inputRight'),
          validator: (rule, value, callback) => {
            var form = 'msgForm'
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
        companyName: [
          {
            required: true,
            trigger: 'blur',
            pattern: this.$utils.reg.companyName,
            validator: this.$utils.validator.common
          }
        ]
        // companyName: [
        //   {
        //     required: true,
        //     trigger: 'change',
        //     validator: (rule, value, callback) => {
        //       let data = this.$utils.validator.common(rule, value, callback)
        //       // if (data) {
        //       // eslint-disable-next-line
        //       this.msgForm.companyName = data
        //       // }
        //     }
        //     // validator: (rule, value, callback) => {
        //     //   var emoji = this.$utils.emoji2Str(value)
        //     //   var newVal = this.$utils.trim(emoji)
        //     //   if (newVal === '') {
        //     //     callback(new Error(this.$t('message.inputRight')))
        //     //   } else {
        //     //     // eslint-disable-next-line
        //     //     this.msgForm.companyName = newVal
        //     //     callback()
        //     //   }
        //     // }
        //   }
        // ]
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
  methods: {
    handleGoBack() {
      this.$emit('showOp', false)
    },
    // 点击下载
    showPage() {
      document.querySelector('.bg').scrollTop = 0
      // $('.bg').scrollTop(0)
      this.apply = !this.apply
      if (this.$refs['msgForm']) {
        this.$refs['msgForm'].resetFields()
      }
    },
    // 发送
    handleSend: $utils.debounce(function (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .posts1('addCoLeave', this.msgForm, '', true)
            .then(res => {
              this.$refs.msgForm.resetFields()
              this.$router.push('/login')
            })
        } else {
          return false
        }
      })
    })
  }
}
</script>

<style lang="less">
@import '../../assets/color';
@import '../../assets/css/compatibility.less';
#openPlatform {
  .banner {
    // background: url('../../assets/images/openPlatformBg.png') no-repeat
    //   center/cover;
    height: auto;
    img {
      width: 100%;
      height: auto;
    }
  }
  .content.body {
    .diveo {
      font-size: 16px;
      line-height: 1.8;
    }
    .phoneNumber {
      width: 100%;
    }
    table {
      border-collapse: collapse;
      tr {
        td {
          border: 1px solid @border;
          font-size: 14px;
          padding: 10px;
          &:first-child {
            background: @background;
            min-width: 150px;
          }
          .icon {
            // float: right;
            // overflow: hidden;
            img {
              width: 16px;
              height: 16px;
              margin-top: 3px;
            }
          }
        }
      }
    }
  }
}
@media only screen and (max-width: 767px) {
  #openPlatform {
    .content.body {
      .diveo {
        font-size: 14px;
      }
      table {
        border-collapse: collapse;
        tr {
          td {
            border: 1px solid @border;
            font-size: 1rem;
            padding: 0.5rem;
            &:first-child {
              background: @background;
              min-width: 6rem;
            }
            .icon {
              // float: right;
              img {
                width: 0.8rem;
                height: 0.8rem;
                margin-top: 0.15rem;
              }
            }
          }
        }
      }
    }
  }
}
</style>
