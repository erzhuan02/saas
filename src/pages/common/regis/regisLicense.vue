<template>
  <div id="register">
    <div class="box regis">
      <p class="prevStep btnClrFont hidden-xs-only" @click="prevTo">
        <i class="el-icon-back"></i>{{ $t('button.prev') }}
      </p>
      <el-steps :active="2" finish-status="success" simple class="steps hidden-xs-only">
        <el-step :title="type == 1 ? $t('regis.newBusiness') : $t('regis.withFCode')"></el-step>
        <el-step :title="$t('regis.uploadPic')"></el-step>
        <el-step :title="$t('forgot.complete')"></el-step>
      </el-steps>
      <!-- <p class="title">{{ $t('regis.uploadPic') }}</p> -->
      <el-form class="flex-d">
        <div :class="clientType == 'mob' ? 'uploadBox flex' : 'uploadBox'">
          <span class="hidden-xs-only">{{ $t('regis.picFormat') }}：JPG,JPEG,BMP,PNG</span>
          <label v-if="clientType == 'mob'" class="avatar-uploader regisUploader" @change="handleBeforeUploadImg">
            <input type="file" hidden>
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </label>
          <el-upload v-else class="avatar-uploader regisUploader" ref="avatarUploader" action="string" :show-file-list="false" :before-upload="handleBeforeUploadImg" accept="image/bmp, image/jpeg, image/png">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="mobTxt dhc" :style="clientType == 'mob' ? '' : 'display: none'">
            <h3>{{ $t('regis.plzUpload') }}<strong>{{ $t('regis.license') }}</strong></h3>
            <p>{{ $t('regis.keepComplete') }}</p>
          </div>
        </div>
        <div :class="clientType == 'mob' ? 'flex1' : 'flex uploadBox'" style="margin-top: 0;">
          <el-button class="next btnClr agree agreeUp" type="primary" @click="sureRegis" :disabled="!imgIsTrue">{{ $t('button.submit') }}</el-button>
          <el-button class="next btnClr agree hidden-xs-only" type="primary" @click="resetImg">{{ $t('button.reset') }}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $utils from '@/utils'
import AES from '@/utils/aes'
import '../../../../static/js/jquery'
export default {
  data() {
    return {
      type: 1,
      phonePrefix: '',
      form: {},
      formData: {},
      imageUrl: '',
      imgIsTrue: false, // 营业执照是否通过要求
      loading: ''
    }
  },
  mounted() {
    this.type = this.$route.query.type || 1
    this.form = JSON.parse(sessionStorage.getItem('form'))
    this.phonePrefix = JSON.parse(sessionStorage.getItem('phonePrefix'))
    this.imgIsTrue = sessionStorage.getItem('imgIsTrue') || false
    this.imageUrl = sessionStorage.getItem('imageUrl') || ''
    this.formData = this.file || {}
  },
  computed: {
    ...mapGetters(['clientType', 'file'])
  },
  methods: {
    // 点击上一步
    prevTo() {
      this.$router.back()
    },
    // 点击同意注册
    sureRegis: $utils.debounce(function () {
      this.loading = this.$loading({
        lock: true,
        text: this.$t('message.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      })
      if (this.imageUrl == '') {
        this.$utils.$message({
          message: this.$t('message.uploadLicense'),
          type: 'error'
        })
      } else if (!this.imgIsTrue) {
        this.$utils.$message({
          message: this.$t('message.uploadRightLicense'),
          type: 'error'
        })
      } else {
        let formData = new FormData()
        formData.append('file', this.formData)
        let params = { ...this.form }
        params.phoneNumb = this.phonePrefix + '+' + this.form.phoneNumb
        params.password = AES.encrypt(this.form.userName + this.form.password, this.$api.AES_KEY)
        params.passwordTwo = AES.encrypt(this.form.userName + this.form.passwordTwo, this.$api.AES_KEY)
        params.language = sessionStorage.getItem('signLang') === 'cn' ? 1 : 2
        params.timeout = 120000
        this.$http.posts1('sumbitBusLicense', formData, params, true)
          .then(res => {
            this.$router.push({
              path: '/regisSuccess',
              query: {
                type: this.type
              }
            })
            sessionStorage.removeItem('form')
            sessionStorage.removeItem('phonePrefix')
            sessionStorage.removeItem('imgIsTrue')
            sessionStorage.removeItem('imageUrl')
            this.loading.close()
          })
          .catch(er => {
            this.loading.close()
          })
      }
    }),
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleBeforeUploadImg(file) {
      if (this.clientType === 'mob') {
        file = file.target.files[0]
      }
      var isLt2M = file.size / 1024 / 1024 < 10
      var imgType = file.type == 'image/bmp' || file.type == 'image/jpeg' || file.type == 'image/png'
      if (!isLt2M) {
        this.imgIsTrue = false
        this.$message.error({
          message: this.$t('message.uploadImg3'),
          duration: 4000
        })
      } else if (!imgType) {
        if (!this.imageUrl) this.imgIsTrue = false
        this.$message.error({
          message: this.$t('message.uploadImg2'),
          duration: 4000
        })
      } else {
        this.imgIsTrue = true
        this.imageUrl = URL.createObjectURL(file)
        this.formData = file
        sessionStorage.setItem('imgIsTrue', this.imgIsTrue)
        sessionStorage.setItem('imageUrl', this.imageUrl)
        this.$store.commit('FILE', this.formData)
      }
      // var reader = new FileReader()
      // // var size
      // reader.onload = function (event) {
      //   var image = new Image()
      //   // image.onload = function () {
      //   //   var width = image.width
      //   //   var height = image.height
      //   //   size = width < 800 || width > 2048 || height < 600 || height > 1536
      //   //   if (size) {
      //   //     _this.imgIsTrue = false
      //   //     _this.$message.error(_this.$t('message.uploadImg1'))
      //   //   } else if (!isLt2M) {
      //   //     _this.imgIsTrue = false
      //   //     _this.$message.error(_this.$t('message.uploadImg3'))
      //   //   } else {
      //   //     _this.imgIsTrue = true
      //   //     _this.formData = uploadFile
      //   //     _this.imageUrl = URL.createObjectURL(file)
      //   //   }
      //   // }
      //   // if (_this.isMob) {
      //   //   _this.$utils.compress(file, function(val) {
      //   //     isLt2M = val.size / 1024 / 1024 < 10
      //   //     if (!isLt2M) {
      //   //       _this.imgIsTrue = false
      //   //       _this.$message.error(_this.$t('message.uploadImg3'))
      //   //     } else {
      //   //       _this.imgIsTrue = true
      //   //       _this.imageUrl = URL.createObjectURL(file)
      //   //     }
      //   //   })
      //   // }
      //   if (!isLt2M) {
      //     _this.imgIsTrue = false
      //     _this.$message.error({
      //       message: _this.$t('message.uploadImg3'),
      //       duration: 5000
      //     })
      //   } else {
      //     console.log(file)
      //     _this.imgIsTrue = true
      //     _this.imageUrl = URL.createObjectURL(file)
      //     _this.formData = file
      //     sessionStorage.setItem('imgIsTrue', _this.imgIsTrue)
      //     sessionStorage.setItem('imageUrl', _this.imageUrl)
      //     _this.$store.commit('FILE', _this.formData)
      //   }
      // }
      // reader.readAsDataURL(file)
      // return false
    },
    // 重置图片
    resetImg() {
      this.imageUrl = ''
      this.$refs.avatarUploader.clearFiles()
      this.imgIsTrue = false
    }
  },
  destroyed() {
    sessionStorage.removeItem('signLang')
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/css/login.less';
</style>
