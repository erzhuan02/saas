<template>
  <div class="onlineMsg">
    <div class="msgContent">
      <p>{{ $t('order.tips11') }}</p>
      <p>{{ $t('order.tips2') }}: 021-6451 8711 {{ $t('order.tips0') }} 150</p>
      <el-form ref="msgForm" :model="msgForm" :rules="msgRules">
        <el-form-item :label="$t('login.product')" prop="productId">
          <el-select v-model="msgForm.productId" :placeholder="$t('placeholder.select') + $t('placeholder.softMes') + $t(`placeholder.required_${clientType}`)">
            <el-option v-for="item in options" :key="item.productId" :label="item.productName" :value="item.productId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('order.mesContent')" prop="content">
          <el-input type="textarea" :rows="3" :placeholder="$t('order.message2') + $t(`placeholder.required_${clientType}`)" maxlength="200" v-model="msgForm.content"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.name')" prop="userName">
          <el-input v-model="msgForm.userName" :placeholder="$t('placeholder.input') + $t('common.name') + $t(`placeholder.required_${clientType}`)" maxlength="30"></el-input>
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
    </div>
    <div class="el-dialog__footer dialog-footer">
      <el-button type="primary" @click="handleCancel" class="hidden-xs-only cancel">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" @click="handleSend('msgForm')" class="sendBtn">{{ $t('button.send') }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $utils from '@/utils'
export default {
  data() {
    return {
      msgForm: {
        productId: '',
        content: '',
        userName: '',
        phonePrefix: '86',
        phoneNumb: '',
        companyName: '',
        sourceId: 2, // 1.硬件产品购买 2.购买问题咨询 3.产品功能咨询 4.申请体验
        type: 1 // 1.普通留言 2.协议申请留言
      },
      prefixOptions: [],
      options: []
    }
  },
  computed: {
    ...mapGetters(['language', 'clientType']),
    msgRules() {
      // 'change',
      return {
        productId: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('placeholder.select') + this.$t('placeholder.softMes')
          }
        ],
        content: [
          {
            required: true,
            trigger: 'change',
            pattern: this.$utils.reg.content200,
            validator: (rule, value, callback) => {
              let data = this.$utils.validator.common(rule, value, callback)
              // this.$utils.validateTextArea(value, callback)
              // eslint-disable-next-line
              this.msgForm.content = data
            }
          }
        ],
        userName: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let data = this.$utils.validator.common(rule, value, callback)
              // eslint-disable-next-line
              this.msgForm.userName = data
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
            // message: this.$t('message.inputRight'),
            pattern: this.$utils.reg.companyName,
            validator: this.$utils.validator.common
          }
        ]
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
    this.getProductData()
  },
  mounted() { },
  methods: {
    // 获取产品数据
    getProductData() {
      // type:1 软件 2 门店用户许可证 3.硬件
      this.$http.posts1('getProductData', { type: 1 }).then(res => {
        this.options = res.data
      })
    },
    handleCancel() {
      // console.log('cancel')
      this.$emit('show-dialog', false)
    },
    // 在线留言
    handleSend: $utils.debounce(function (formName) {
      // console.log('liuyan')
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .posts1('addCoLeave', this.msgForm, '', true)
            .then(res => {
              this.$emit('show-dialog', false)
              this.$refs.msgForm.resetFields()
              // this.dialogFormVisible = false
            })
            .catch(er => {
              this.$emit('show-dialog', false)
              // this.$refs.msgForm.resetFields()
              // this.dialogFormVisible = false
            })
        } else {
          return false
        }
      })
    })
  }
}
</script>

<style lang="less" scoped>
@import '../assets/color.less';
@import '../assets/css/compatibility.less';
.onlineMsg {
  .msgContent {
    padding: 30px 20px 0;
    margin-bottom: 30px;
  }
  p {
    font-size: 16px;
    line-height: 1.8;
  }
  .el-form-item {
    width: 100%;
  }
  .phoneNumber {
    width: 100%;
  }
}
@media screen and (max-width: 767px) {
  .onlineMsg {
    .msgContent {
      padding: 2rem 2rem 0rem;
      margin-bottom: 0;
    }
    p {
      font-size: 14px;
    }
    .el-form {
      margin-top: 20px;
    }
    // .el-form-item {
    //   margin-bottom: 22px;
    // }
    .dialog-footer {
      border-top: none;
      padding: 1rem 2rem;
      .flex();
      .justify-content(center);
      .sendBtn {
        width: 100%;
        margin-left: 0;
      }
    }
  }
}
</style>
<style lang="less">
@media screen and (max-width: 767px) {
  .onlineMsg {
    .el-form-item .el-form-item__label {
      display: none;
    }
    .el-select-dropdown__item.hover,
    .el-select-dropdown__item:hover {
      background-color: #fff;
    }
  }
}
</style>
