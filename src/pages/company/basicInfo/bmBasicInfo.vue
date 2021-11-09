<template>
  <div id="basicInfo">
    <!-- 基本信息 -->
    <el-divider content-position="left">
      <i class="el-icon-message"></i>{{ $t('home.nav11') }}
    </el-divider>
    <el-main class="info">
      <el-upload :class="['avatar-uploader',{ disabledUpload: !userData.adminUser }]" ref="avatarUploader" :action="uploadUrl" :headers="importHeaders" :show-file-list="false" :disabled="!userData.adminUser" :before-upload="handleBeforeUploadImg" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" accept="image/bmp, image/jpeg, image/png">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <p v-if="userData.adminUser" class="mod">{{ $t('message.avatarMod') }}</p>
      <ul>
        <li>
          {{ $t('basicInfo.userName') }}： {{ userData.userName }}
        </li>
        <li>
          {{ $t('basicInfo.businessNum') }}： {{ basicInfo.companyId }}
        </li>
        <li :title="basicInfo.coUserId">
          {{ $t('basicInfo.userId') }}： {{ userData.coUserId }}
        </li>
        <li>
          {{ $t('basicInfo.regisTime') }}： {{ userData.createTime }}
        </li>
        <li>
          {{ $t('basicInfo.contacts') }}： {{ basicInfo.contactName }}
        </li>
        <li>
          {{ $t('basicInfo.maxNumS') }}： {{ basicInfo.shopNumb }}
        </li>
        <li>
          {{ $t('basicInfo.phone') }}： {{ userData.phoneNumb }}
        </li>
        <li>
          <span>{{ $t('basicInfo.maxNumPT') }}：</span> {{ basicInfo.userNumb }}
        </li>
        <li>
          {{ $t('basicInfo.businessName') }}： {{ basicInfo.companyName }}
        </li>
        <li v-if="fCodeAuth">
          {{ $t('basicInfo.FNum') }}：{{ basicInfo.friendNumb }}&nbsp;&nbsp;&nbsp;
          <a @click="join">{{ $t('basicInfo.invitation') }}</a>
        </li>
      </ul>
    </el-main>
    <!-- 实名认证 -->
    <div v-if="realNameAuth">
      <el-divider content-position="left">
        <i class="el-icon-postcard"></i>{{ $t('home.nav12') }}
      </el-divider>
      <el-main class="realName">
        <p class="isAdopt">
          <i v-if="!basicInfo.certStatus" class="el-icon-folder-checked"></i>
          <i v-if="basicInfo.certStatus" class="el-icon-folder-checked" style="color: #1cb60d"></i>
          <span v-if="basicInfo.auditStatus == 5">{{ $t('basicInfo.noPass') }}</span>
          <span v-if="basicInfo.auditStatus == 4">{{ $t('basicInfo.passed') }}</span>
          <span v-if="basicInfo.auditStatus == 1">{{ $t('basicInfo.waitAuth') }}</span>
          <span v-if="basicInfo.auditStatus == 3 || basicInfo.auditStatus == 6">{{ $t('basicInfo.authing') }}</span>
          <span v-if="basicInfo.auditStatus == 0 || basicInfo.auditStatus == 2">-</span>
          <a @click="toAuth" v-if="!basicInfo.certStatus">{{ $t('basicInfo.ToAuthenticate') }}</a>
        </p>
        <div class="flex" v-if="basicInfo.auditStatus == 5">
          <p class="name">
            {{ $t('basicInfo.refuseReason') }}：
          </p>
          <p style="width: 398px" class="name one-txt-cut" :title="basicInfo.refuseReason">{{ basicInfo.refuseReason }}</p>
        </div>
        <p class="name">{{ $t('basicInfo.businessName') }}：{{ basicInfo.companyName }}</p>
        <p class="name" v-if="basicInfo.businessLicenseNumb !== null">
          {{ $t('basicInfo.regisNumber') }}：
          <span v-if="!hidden">{{ basicInfo.businessLicenseNumb }}</span>
          <span v-if="hidden">{{ basicInfo.showBusinessLicenseNumb }}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a v-if="!hidden" @click="toHide">{{ $t('basicInfo.check') }}</a>
          <a v-if="hidden" @click="toHide">{{ $t('basicInfo.hidden') }}</a>
        </p>
        <p class="name" v-if="basicInfo.effectiveTime !== null">{{ $t('basicInfo.effectTime') }}：{{ basicInfo.effectiveTime }}</p>
      </el-main>
    </div>
    <!-- 安全信息 -->
    <el-divider content-position="left">
      <i class="el-icon-lock"></i>{{ $t('basicInfo.safeInfo') }}
    </el-divider>
    <el-main class="safeMass">
      <ul>
        <li>
          <p>{{ $t('basicInfo.accountSecurity') }}：</p>
          <div v-if="userData.pwdLevle == 1">
            <span class="safeLevel"><span class="low"></span></span>
            <i>&nbsp;&nbsp;&nbsp;{{ $t('basicInfo.weak') }}</i>
          </div>
          <div v-if="userData.pwdLevle == 2">
            <span class="safeLevel"><span class="medium"></span></span>
            <i>&nbsp;&nbsp;&nbsp;{{ $t('basicInfo.medium') }}</i>
          </div>
          <div v-if="userData.pwdLevle == 3">
            <span class="safeLevel"><span class="strong"></span></span>
            <i>&nbsp;&nbsp;&nbsp;{{ $t('basicInfo.strong') }}</i>
          </div>
        </li>
        <li class="flex">
          <p>{{ $t('basicInfo.phoneBind') }}：{{ userData.phoneNumb }}</p>
          <p class="jump" @click="toChange('phone')">&nbsp;&nbsp;&nbsp;{{ $t('button.revise') }}</p>
        </li>
        <li class="flex">
          <p>{{ $t('basicInfo.mailBind') }}：{{ userData.emailAddr }}</p>
          <p class="jump" v-if="basicInfo.emailAddr == null || basicInfo.emailAddr == ''" @click="toChange('email')">&nbsp;&nbsp;&nbsp;{{ $t('button.addNow') }}</p>
          <p class="jump" v-else @click="toChange('email')">&nbsp;&nbsp;&nbsp;{{ $t('button.verify') }}</p>
        </li>
        <li class="flex">
          <!-- v-show="basicInfo.adminUser" -->
          <p>{{ $t('basicInfo.loginPassword') }}：{{ $t('basicInfo.setting') }}</p>
          <p class="jump" @click="toChange('psd')">&nbsp;&nbsp;&nbsp;{{ $t('button.revise') }}</p>
        </li>
      </ul>
    </el-main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: '',
      imgIsTrue: false,
      formData: {},
      uploadUrl: '',
      importHeaders: {
        Authorization: sessionStorage.getItem('authorization')
      },
      hidden: false,
      realNameAuth: false, // 是否有实名认证权限
      fCodeAuth: false, // 是否有我的F码权限
      basicInfo: {}, // pwdLevle ->当前用户 1简单 2中级 3高级, certStatus -> 1已认证 0未认证
      userData: {} // 当前用户的信息
    }
  },
  created() {
    let realNameAuth = this.$utils.getButton('/bmRealNameAuth', 1, true)
    let fCodeAuth = this.$utils.getButton('/myFCode', 1, true)
    this.realNameAuth = Object.prototype.toString.call(realNameAuth) === '[object String]'
    this.fCodeAuth = Object.prototype.toString.call(fCodeAuth) === '[object String]'
    this.getBasicData()
    this.uploadUrl = this.$api.apiBase + this.$api.editLogo
  },
  mounted() { },
  methods: {
    // 获取基本信息数据
    getBasicData() {
      this.loading = true
      this.$http.posts('getBasicInfo')
        .then(res => {
          // console.log(res)
          let data = res.data || {}
          this.basicInfo = data.comData || {}
          this.userData = data.userData || {}
          this.userData.createTime = this.$utils.formatDate(data.userData.createTime)
          this.userData.adminUser = this.basicInfo.adminUser
          this.userData.pwdLevle = this.basicInfo.pwdLevle
          this.imageUrl = this.basicInfo.logoUrl
        })
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleBeforeUploadImg(file, fileList) {
      const isSize = new Promise((resolve, reject) => {
        var image = new Image()
        image.onload = function () {
          var width = image.width
          var height = image.height
          var size = width < 48 || width > 96 || height < 32 || height > 62
          size ? reject() : resolve()
        }
        // this.imageUrl = URL.createObjectURL(file)
        image.src = URL.createObjectURL(file)
      }).then(() => {
        return file
      }, () => {
        this.$message.error(this.$t('message.uploadImg9'))
        return Promise.reject()
      })
      return isSize
    },
    // 上传成功时
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.showMsg(res, 'success')
    },
    handleAvatarError(er, file) {
      this.showMsg(er, 'error')
    },
    showMsg(res, type) {
      var successMsg
      if (res.resMsg) {
        var i18nCode0 = this.$t(`code.${res.resMsg}`)
        i18nCode0.startsWith('code.')
          ? (successMsg = res.resMsg)
          : (successMsg = i18nCode0)
      } else {
        successMsg = this.$t('message.submitSuccess')
      }
      this.$utils.$message({
        message: successMsg,
        type: type
      })
    },
    // 点击邀请
    join() {
      this.$router.push('/myFCode')
    },
    // 立即去认证
    toAuth() {
      this.$router.push('/bmRealNameAuth')
    },
    // 查看&隐藏
    toHide() {
      this.hidden = !this.hidden
    },
    // 跳转验证
    toChange(type) {
      sessionStorage.setItem('userData', JSON.stringify(this.userData))
      if (type === 'phone') {
        this.$router.push('/changePhone')
        return
      }
      if (type === 'email') {
        this.$router.push('/verifyEmail')
        return
      }
      if (type === 'psd') {
        this.$router.push('/changePsd')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color';
#basicInfo {
  a,
  p.jump {
    color: @text3;
    &:hover {
      cursor: pointer;
    }
  }
  .el-divider__text {
    font-size: 16px;
    font-weight: bold;
    color: @main;
    i {
      font-weight: bold;
      font-size: 18px;
      padding-right: 5px;
      color: @main;
    }
  }
  .info {
    .avatar-uploader {
      width: 135px;
      height: 120px;
      padding-bottom: 10px;
    }
    .mod {
      font-size: 14px;
      color: #c0c0c0;
    }
    li {
      width: 50%;
      height: 36px;
      line-height: 36px;
      float: left;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .realName {
    p.isAdopt {
      height: auto;
      overflow: hidden;
      i {
        float: left;
        font-size: 44px;
        padding-right: 20px;
      }
      span {
        float: left;
        font-size: 26px;
        line-height: 44px;
      }
      a {
        float: left;
        line-height: 48px;
        padding-left: 30px;
      }
    }
    p.name {
      padding-top: 20px;
    }
  }
  .safeMass {
    li {
      padding-top: 18px;
      &:first-child {
        padding: 0 0 3px 0;
      }
      p {
        float: left;
      }
      span {
        display: inline-block;
        float: left;
      }
      i {
        font-style: normal;
      }
      .safeLevel {
        width: 165px;
        height: 16px;
        margin-top: 3px;
        background: @background;
        position: relative;
        span {
          height: 100%;
          position: absolute;
        }
        .low {
          width: 55px;
          background: @danger;
        }
        .medium {
          width: 110px;
          background: @warning;
        }
        .strong {
          width: 165px;
          background: @success;
        }
      }
    }
  }
}
</style>
