<template>
  <div id="review">
    <el-page-header @back="goBack" :content="$t('button.review')" class="pageHeader"></el-page-header>
    <div class="regisInfo">
      <h2 v-if="companyTitle">{{ $t('myClients.enterInfo') }}</h2>
      <h2 v-if="personTitle">{{ $t('myClients.personInfo') }}</h2>
      <h2 v-if="regisTitle">{{ $t('myClients.regisInfo') }}</h2>
      <!-- 企业信息 -->
      <ul v-if="companyTitle">
        <li>
          <i>{{ $t('realName.enterName') }}：</i>
          <span>{{ companyData.companyName }}</span>
        </li>
        <li :title="companyData.businessLicenseNumb">
          <i>{{ $t('realName.identNum') }}：</i>
          <span>{{ companyData.businessLicenseNumb }}</span>
        </li>
        <li>
          <i>{{ $t('realName.enterLocation') }}：</i>
          <span>{{ companyData.area }}</span>
        </li>
        <li>
          <i>{{ $t('realName.address') }}：</i>
          <span>{{ companyData.address }}</span>
        </li>
        <li>
          <i>{{ $t('realName.contact') }}：</i>
          <span>{{ companyData.contactName }}</span>
        </li>
        <li>
          <i>{{ $t('realName.contactNum') }}：</i>
          <span>{{ companyData.contactNumb }}</span>
        </li>
        <li>
          <i>{{ $t('realName.bankAccountName') }}：</i>
          <span>{{ companyData.bankAccountName }}</span>
        </li>
        <li>
          <i>{{ $t('realName.openBank') }}：</i>
          <span>{{ companyData.bankName }}</span>
        </li>
        <li>
          <i>{{ $t('realName.locationBank') }}：</i>
          <span>{{ companyData.bankLocation }}</span>
        </li>
        <li>
          <i>{{ $t('realName.openBranch') }}：</i>
          <span>{{ companyData.bankBranch }}</span>
        </li>
        <li>
          <i>{{ $t('realName.bankAccount') }}：</i>
          <span>{{ companyData.bankAccount }}</span>
        </li>
        <li>
          <i>{{ $t('myClients.certCode') }}：</i>
          <span>{{ companyData.certCode }}</span>
        </li>
      </ul>
      <!-- 注册信息 -->
      <ul v-if="regisTitle">
        <li>
          <i>{{ $t('regis.fCode') }}：</i>
          <span>{{ regisData.beInvitedCode }}</span>
        </li>
        <li>
          <i>{{ $t('regis.businessName') }}：</i>
          <span :title="regisData.companyName">{{ regisData.companyName }}</span>
        </li>
        <li>
          <i>{{ $t('regis.realName') }}：</i>
          <span :title="regisData.realName">{{ regisData.realName }}</span>
        </li>
        <li>
          <i>{{ $t('regis.userName') }}：</i>
          <span :title="regisData.userName">{{ regisData.userName }}</span>
        </li>
        <li>
          <i>{{ $t('regis.phone') }}：</i>
          <span :title="regisData.phoneNumb">{{ regisData.phoneNumb }}</span>
        </li>
        <li>
          <i>{{ $t('common.email') }}：</i>
          <span :title="regisData.emailAddr">{{ regisData.emailAddr }}</span>
        </li>
        <li>
          <i>{{ $t('regis.license') }}：</i>
          <span v-if="regisData.businessLicensePath == null || regisData.businessLicensePath == ''">
            {{ $t('common.noImg') }}
          </span>
          <span v-else>
            <img width="300" height="200" :src="regisData.businessLicensePath" @click="enlargeImg">
          </span>
        </li>
      </ul>
      <!-- 个人信息 -->
      <ul v-if="personTitle">
        <li>
          <i>{{ $t('common.name') }}：</i>
          <span>{{ personData.realName }}</span>
        </li>
        <li>
          <i>{{ $t('realName.area') }}：</i>
          <span :title="personData.area">{{ personData.area }}</span>
        </li>
        <li>
          <i>{{ $t('realName.address') }}：</i>
          <span :title="personData.address">{{ personData.address }}</span>
        </li>
        <li>
          <i>{{ $t('realName.idCard') }}：</i>
          <span :title="personData.idCard">{{ personData.idCard }}</span>
        </li>
        <li>
          <i>{{ $t('realName.bankCard') }}：</i>
          <span :title="personData.bankAccount">{{ personData.bankAccount }}</span>
        </li>
        <li>
          <i>{{ $t('common.phone') }}：</i>
          <span :title="personData.phoneNumb">{{ personData.phoneNumb }}</span>
        </li>
      </ul>
      <!-- 不通过原因 -->
      <el-input class="failureReason flex" type="textarea" :placeholder="$t('placeholder.failureReason')" v-model.trim="textarea" maxlength="100" show-word-limit></el-input>
      <!-- 操作按钮 -->
      <div class="operaBtn flex1">
        <el-button type="success" @click="agree" :disabled="buttonDisabled">{{ $t('button.agree') }}</el-button>
        <el-button type="danger" @click="reject" :disabled="buttonDisabled">{{ $t('button.reject') }}</el-button>
      </div>
      <Dialog :imgUrl="regisData.businessLicensePath" v-if="showLargePic" v-on:closeDialog="closeDia"></Dialog>
    </div>
  </div>
</template>

<script>
import Dialog from '@/components/dialogImg'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      textarea: '',
      showLargePic: false,
      companyId: '',
      personTitle: false,
      companyTitle: false,
      regisTitle: true,
      personData: { // 展示的个人信息
        realName: '',
        idCard: '',
        bankAccount: '',
        phoneNumb: ''
      },
      companyData: { // 展示的企业信息
        companyName: '',
        businessLicenseNumb: '',
        bankAccountName: '',
        bankName: '',
        bankLocation: '',
        bankBranch: '',
        bankAccount: '',
        certCode: ''
      },
      regisData: { // 展示的注册信息
        beInvitedCode: '',
        companyName: '',
        realName: '',
        userName: '',
        phoneNumb: '',
        businessLicensePath: '',
        emailAddr: ''
      },
      buttonDisabled: false,
      auditStatus: '' // 0?3?6?
    }
  },
  mounted() {
    this.auditType = this.$route.query.audited
    this.companyId = this.$route.query.companyId
    this.getData(this.companyId)
    // 强制给左侧导航加class保持高亮
    this.$nextTick(() => {
      if (document.querySelector('.el-menu-item').innerHTML === '我的客户') {
        document.getElementsByClassName('el-menu-item')[0].classList.add('is-active')
      }
    })
  },
  watch: {
    language(val) {
      var title = document.getElementsByClassName('el-page-header__title')
      if (val == 'en') {
        title[0].innerText = 'Back'
      } else {
        title[0].innerText = '返回'
      }
    }
  },
  computed: {
    ...mapGetters(['language'])
  },
  methods: {
    // 获取审核数据
    getData(companyId) {
      this.$http.posts('getAuditInfo', '', { companyId })
        .then(res => {
          let data = res.data
          let company = data.company
          this.auditStatus = company.auditStatus
          let user = data.user
          if (company.auditStatus == 0) { // 从注册来
            this.regisTitle = true
            this.companyTitle = false
            this.personTitle = false
            this.regisData.beInvitedCode = company.beInvitedCode
            this.regisData.companyName = company.companyName
            this.regisData.realName = user.realName
            this.regisData.userName = user.userName
            this.regisData.phoneNumb = this.$utils.exchangePrefix(user.phoneNumb)
            this.regisData.businessLicensePath = company.businessLicensePath
            this.regisData.emailAddr = user.emailAddr
          }
          if (company.auditStatus == 3) { // 从个人认证来
            this.regisTitle = false
            this.companyTitle = false
            this.personTitle = true
            user.phoneNumb = this.$utils.exchangePrefix(user.phoneNumb)
            this.personData = user
          }
          if (company.auditStatus == 6) { // 从企业认证来
            this.regisTitle = false
            this.companyTitle = true
            this.personTitle = false
            company.contactNumb = this.$utils.exchangePrefix(company.contactNumb)
            this.companyData = company
          }
        })
    },
    // 提交审核数据
    submitData(companyId, auditStatus, auditType, remark) {
      // auditStatus：审核状态
      // auditType:审核类型 1.通过 2.不通过
      this.$http.posts('submitAudit', '', { companyId, auditStatus, auditType, remark })
        .then(res => {
          // if (res.data.resCode == 0) {
          const loading = this.$loading({
            lock: true,
            text: this.$t('message.jumpTo'),
            spinner: 'el-icon-loading'
          })
          setTimeout(() => {
            loading.close()
            this.$router.push({
              path: '/tmMyClients',
              query: {
                companyId: companyId
              }
            })
          }, 1000)
        })
    },
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    // 同意
    agree() {
      this.$utils.disabledButton(this)
      this.submitData(this.companyId, this.auditStatus, 1, '')
    },
    // 拒绝
    reject() {
      if (this.textarea == '') {
        this.$utils.$message({
          message: this.$t('placeholder.failureReason'),
          type: 'error'
        })
      } else {
        this.$utils.disabledButton(this)
        this.submitData(this.companyId, this.auditStatus, 2, this.textarea)
      }
    },
    // 点击图片
    enlargeImg() {
      this.showLargePic = true
    },
    // 关闭对话框图片
    closeDia(data) {
      if (!data) {
        this.showLargePic = false
      }
    }
  },
  components: {
    Dialog
  }
}
</script>

<style lang="less">
#review {
  padding: 15px 18px 0 18px !important;
  // .pageHeader {
  //   padding-top: 13px;
  // }
  .regisInfo {
    padding: 10px 0;
    h2 {
      padding: 10px 0 33px;
      text-align: center;
    }
    ul {
      li {
        display: flex;
        width: 30%;
        text-align: center;
        line-height: 50px;
        margin: auto;
        i {
          display: inline-block;
          width: 150px;
          text-align: right;
          font-style: normal;
        }
        span {
          display: inline-block;
          width: auto;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          img {
          }
        }
      }
    }
    .failureReason {
      width: 60%;
      margin: 30px auto;
      height: 100px;
      font-size: 16px;
      textarea {
        resize: none;
      }
    }
    .operaBtn {
      margin: 50px auto;
      margin-bottom: 0;
      text-align: center;
      button {
        width: 100px;
        height: 50px;
        font-size: 16px;
      }
    }
  }
}
</style>
