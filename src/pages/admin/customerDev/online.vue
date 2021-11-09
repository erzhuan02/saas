<template>
  <div id="online">
    <div class="main">
      <h4>{{ $t('friend.customerReg') }}</h4>
      <p class="atInfo top">{{ $t('friend.onlineMsg1') }}</p>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="regForm">
        <el-form-item :label="$t('realName.enterName')" prop="invitCoName">
          <el-input :placeholder="$t('placeholder.input') + $t('realName.enterName')" v-model.trim="form.invitCoName" maxlength="128"></el-input>
        </el-form-item>
        <el-form-item :label="$t('regis.phone')" prop="invitPhoneNumb">
          <el-select v-model="phonePrefix" filterable :placeholder="$t('placeholder.select')" class="prefix">
            <el-option v-for="(item,index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input :placeholder="$t('placeholder.input') + $t('regis.phone')" v-model.trim="form.invitPhoneNumb" class="personPhone" maxlength="11"></el-input>
        </el-form-item>
        <p class="atInfo bot">{{ $t('friend.onlineMsg2') }}</p>
        <el-form-item :label="$t('common.email')" prop="invitEmail">
          <el-input :placeholder="$t('placeholder.input') + $t('common.email')" v-model.trim="form.invitEmail" maxlength="128"></el-input>
        </el-form-item>
        <el-form-item :label="$t('friend.affiliates')" prop="companyId">
          <el-select v-model="form.companyId" filterable :placeholder="$t('placeholder.select')">
            <el-option v-for="(item,index) in companyName" :key="index" :label="item[1]" :value="item[0]">
              <div class="flex">
                <div class="flex">
                  <p style="color: #8492a6;">{{ $t('login.enterpriceLogin') }}:</p>
                  <p>{{ item[0] }}</p>
                </div>
                &nbsp;&nbsp;&nbsp;
                <div class="flex">
                  <p style="color: #8492a6;">{{ $t('regis.businessName') }}:</p>
                  <p class="one-txt-cut" style="max-width: 300px" :title="item[1]">{{ item[1] }}</p>
                </div>
                &nbsp;&nbsp;&nbsp;
                <div class="flex">
                  <p style="color: #8492a6;">{{ $t('common.phone') }}:</p>
                  <p>{{ item[4] }}</p>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <div class="flex-hc">
          <el-button @click="reset">{{ $t('button.reset') }}</el-button>
          <el-button type="primary" @click="submit">{{ $t('button.submit') }}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      form: {
        status: 3, // 1.企业 3.DVO
        type: 1, // 1.添加 2.编辑
        invitCoName: '',
        invitPhoneNumb: '',
        invitEmail: '',
        companyId: ''
      },
      phonePrefix: '86',
      prefixOptions: [],
      companyName: [] // 0companyId 1name 2fcode
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
    }
  },
  mounted() {
    if (this.language == 'cn') {
      this.prefixOptions = this.$utils.formatPrefixCN()
    } else if (this.language == 'en') {
      this.prefixOptions = this.$utils.formatPrefixEN()
    }
    this.getComName()
    this.reset()
  },
  computed: {
    ...mapGetters(['language']),
    rules() {
      const rules = {
        invitCoName: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                var specialKey = '[`~!#@%$^&*=|{}\':;\'\\[\\]<>/?~！#￥……&*——|{}【】‘；：”“\']‘\''
                for (var i = 0; i < value.length; i++) {
                  if (specialKey.indexOf(value.substr(i, 1)) != -1) {
                    callback(new Error(this.$t('placeholder.specialCode')))
                  }
                }
              } else {
                callback(new Error(this.$t('placeholder.input') + this.$t('basicInfo.businessName')))
              }
              callback()
            }
          }
        ],
        invitPhoneNumb: [
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
                    if (this.hadPhone) {
                      callback(new Error(this.$t('common.phone') + this.$t('common.exist')))
                      return
                    }
                    callback()
                  }
                }
              }
            }
          }
        ],
        invitEmail: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              var email = this.$utils.reg.email
              if (value) {
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
        companyId: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error(this.$t('friend.selectAffiliates')))
              }
              callback()
            }
          }
        ]
      }
      return rules
    }
  },
  methods: {
    getComName() {
      this.companyName = []
      this.$http.posts('companyAll', '', '')
        .then(res => {
          let data = res.data || []
          data.forEach(item => {
            item[4] = this.$utils.exchangePrefix(item[4])
            this.companyName.push({ ...item })
          })
        })
    },
    reset() {
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          var formQuery = JSON.parse(JSON.stringify(this.form))
          formQuery.invitPhoneNumb = this.phonePrefix + '+' + this.form.invitPhoneNumb
          this.$http.posts('addComRecord', formQuery, '', { showSuccessMsg: false, showErrorMsg: true })
            .then(res => {
              this.$utils.$message({
                type: 'success',
                message: this.$t('message.recordSucess')
              })
              this.reset()
            })
            .catch(er => {
              this.reset()
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
#online {
  h4 {
    padding: 20px 0 0 40px;
  }
  .main {
    width: 50%;
    margin: 10px auto;
    p.atInfo {
      color: #a0a0a0;
      font-size: 14px;
      &.top {
        margin: 20px 0 30px 40px;
      }
      &.bot {
        margin: 0 0 22px 120px;
      }
    }
    .regForm {
      .prefix {
        float: left;
        width: 35% !important;
      }
      .personPhone {
        float: left;
        width: 60%;
        margin-left: 1%;
      }
    }
  }
}
</style>
