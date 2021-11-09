<template>
  <div id="addWorkOrder" ref="addWorkOrder">
    <!-- <h2 style="color:#ff2825">{{ $t('noTest') }}</h2> -->
    <!-- 新增工单 -->
    <h3 class="comTitle">{{ $t('workOrder.addWorkOrder') }}</h3>
    <div class="form" v-loading="addLoading">
      <el-form :model="addForm" label-width="120px" :rules="addOrEditFormRules" ref="addForm" :validate-on-rule-change="false">
        <el-form-item :label="$t('workOrder.selectPro')" prop="productId">
          <el-select v-model="addForm.productId" :placeholder="$t('placeholder.select')" clearable>
            <el-option v-for="item in prodOptions" :key="item.productId" :label="item.productName" :value="item.productId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('workOrder.severity')" prop="severity">
          <el-select v-model="addForm.severity" :placeholder="$t('placeholder.select')" clearable>
            <el-option :label="$t('workOrder.severity1')" :value="1"></el-option>
            <el-option :label="$t('workOrder.severity2')" :value="2"></el-option>
            <el-option :label="$t('workOrder.severity3')" :value="3"></el-option>
            <el-option :label="$t('workOrder.severity4')" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('workOrder.problemDesc')" prop="content" class="textarea">
          <el-input v-model="addForm.content" :placeholder="$t('placeholder.input')" type="textarea" :autosize="{ minRows: 2, maxRows: 6}" maxlength="500" show-word-limit></el-input>
        </el-form-item>
        <el-form-item :label="$t('workOrder.uploadImg')" class="uploadImg">
          <!-- :on-remove="handleRemove"  -->
          <div class="flex-wvc1">
            <el-upload class ref="uploadImg" action="string" multiple list-type="picture-card" :before-upload="handleBeforeUploadImg" :on-change="handleChangeImg" :http-request="handleHttpRequest" :on-remove="handleRemoveImg" :limit="limitImg" :on-exceed="handleExceedImg" accept="image/bmp, image/jpeg, image/png">
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="tips">{{ $t('message.uploadImgTips') }}</div>
          </div>
          <!-- <el-input v-model.trim="addForm.img" :placeholder="$t('placeholder.input')"></el-input> -->
        </el-form-item>

        <el-form-item :label="$t('common.phone')" required>
          <el-col :span="9">
            <el-form-item prop="phonePrefix" style="width: 100%;min-width:auto">
              <el-select v-model="addForm.phonePrefix" filterable :placeholder="$t('placeholder.select')" style="width: 100%;">
                <el-option v-for="(item, index) in prefixOptions" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1" style="text-align:center;">-</el-col>
          <el-col :span="14">
            <el-form-item prop="phoneNumb" style="width: 100%;min-width:auto">
              <el-input v-model.trim="addForm.phoneNumb" :placeholder="$t('placeholder.input')" maxlength="30" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('common.email')" prop="email">
          <el-input v-model.trim="addForm.email" :placeholder="$t('placeholder.input')" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAddOrEdit('add')">{{ $t('button.submit') }}</el-button>
          <el-button type="primary" @click="handleReset">{{ $t('button.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $utils from '@/utils'
export default {
  data() {
    return {
      limitImg: 5,
      prodOptions: [], // 编辑或者新增的角色列表
      prefixOptions: [], // 号码前缀
      type: 'add', // 操作类型，如add/edit
      addLoading: false,
      addForm: {
        productId: '',
        severity: '',
        content: '',
        files: [], // 图片
        phonePrefix: '86',
        phoneNumb: '',
        email: '',

        productName: '',
        type: 1
      },

      moduleId: 1 // 基础模块
    }
  },
  computed: {
    ...mapGetters(['language']),
    // 新增 表单验证
    addOrEditFormRules() {
      return {
        productId: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('message.select')
          }
        ],
        severity: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('message.select')
          }
        ],
        content: [
          // {
          //   required: true,
          //   trigger: 'blur',
          //   message: this.$t('message.input'),
          //   pattern: this.$utils.reg.hasVal
          // },
          {
            required: true,
            trigger: 'blur',
            // message: this.$t('message.inputRight'),
            pattern: this.$utils.reg.content500,
            validator: this.$utils.validator.common
            // validator: (rule, value, callback) => {
            //   this.$utils.validator.common(rule, value, callback)
            //   console.log(this.$utils.validator.common(rule, value, callback))
            // }
          }
        ],
        phonePrefix: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('message.select'),
            validator: (rule, value, callback) => {
              var form = 'addForm'
              if (value) {
                // console.log(this.$refs[form])
                if (this.$utils.reg.phoneNoA.test(this[form].phoneNumb)) {
                  this.$refs[form].validateField('phoneNumb')
                }
                callback()
              } else {
                callback(new Error(this.$t('message.select')))
              }
            }
          }
        ],
        phoneNumb: [
          {
            required: true,
            trigger: 'blur',
            // pattern: this.$utils.reg.phoneNoA,
            // message: this.$t('message.inputRight'),
            validator: (rule, value, callback) => {
              // console.log(value)
              var form = 'addForm'
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
                let reg =
                  (this[form].phonePrefix === '86' &&
                    !phoneNORegC.test(value)) ||
                  (this[form].phonePrefix === '886' &&
                    !phoneNORegC1.test(value))
                if (reg) {
                  callback(new Error(this.$t('message.inputRight')))
                } else {
                  callback()
                }
              }
            }
          }
        ],
        email: [
          {
            required: true,
            trigger: 'blur',
            pattern: this.$utils.reg.email,
            message: this.$t('message.inputRight')
          }
        ]
      }
    }
  },
  watch: {
    language: {
      handler: function (newLang, oldLang) {
        // console.log(newLang, oldLang, this)
        if (newLang === 'cn') {
          this.prefixOptions = this.$utils.formatPrefixCN()
        } else if (newLang === 'en') {
          this.prefixOptions = this.$utils.formatPrefixEN()
        }
        this.$nextTick(() => {
          this.$refs.addForm.validate((valid) => {
            if (valid) { } else { return false }
          })
        })
      }
    }
  },
  created() {
    this.getProductList()
    if (this.language === 'cn') {
      this.prefixOptions = this.$utils.formatPrefixCN()
    } else if (this.language === 'en') {
      this.prefixOptions = this.$utils.formatPrefixEN()
    }
  },
  mounted() { },
  methods: {
    // 获取产品列表
    getProductList() {
      this.$http.posts('comProductList')
        .then(res => {
          var data = res.data
          this.prodOptions = data || []
        })
        .catch(er => {
          this.prodOptions = []
          console.log(er)
        })
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChangeImg(file, fileList) {
      // console.log('handleOnChange', file, fileList, fileList.length)
      this.addForm.files = fileList
    },
    // 所有图片上传之前
    handleBeforeUploadImg(file) {
      // console.log(file)
      const isrightType =
        file.type === 'image/bmp' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/png'
      var size = 5
      const isLtSize = file.size / 1024 / 1024 < size
      var errorArr = []
      if (!isrightType) {
        errorArr.push(this.$t('message.photoTypeWrong'))
      }
      // 两个消息一起弹出，执行太快，重叠，用定时器
      // setTimeout(() => {
      if (!isLtSize) {
        errorArr.push(this.$t('message.morePhotoSize1') + size + 'MB')
      }
      if (errorArr.length > 0) {
        this.$utils.$message({
          type: 'error',
          message: file.name + ',' + errorArr.join()
        })
      }
      // console.log(isrightType && isLt2M)
      return !errorArr.length
    },
    // 自定义上传
    handleHttpRequest(item, list) {
      // console.log('handleHttpRequest')
    },
    // 文件列表移除文件时的钩子
    handleRemoveImg(file, fileList) {
      // console.log('handleRemove', file, fileList)
      this.addForm.files = fileList
    },
    //  文件超出个数限制时的钩子
    handleExceedImg(files, fileList) {
      // console.log('handleExceed', files, fileList, fileList.length)
      this.$utils.$message({
        message:
          this.$t('message.uploadImg5') +
          this.limitImg +
          this.$t('message.uploadImg6') +
          (this.limitImg - fileList.length) +
          this.$t('message.uploadImg7') +
          files.length +
          this.$t('message.uploadImg8'),
        type: 'warning',
        duration: 3500
      })
    },
    // 新增
    handleAddOrEdit: $utils.debounce(function (type) {
      // console.log(type)
      this.$refs[`${type}Form`].validate(valid => {
        if (valid) {
          var form = { ...this[`${type}Form`] }
          form.productName = this.$utils.needItem(
            this.prodOptions,
            form.productId,
            'productId'
          ).productName
          if (form.phoneNumb) {
            form.phoneNumb = form.phonePrefix + '+' + form.phoneNumb
          }
          let formData = new FormData()
          formData.append('content', form.content)
          form.files.forEach((item, index) => {
            formData.append(`file${index}`, item.raw)
          })
          // console.log('全部', formData.get('file0'))
          delete form.phonePrefix
          delete form.content
          delete form.files
          // console.log(form)
          if (type === 'add') {
          } else if (type === 'edit') {
          }
          this.addLoading = true
          // form.content = encodeURI(form.content)
          this.$http.posts('comAddOrUpdateWk', formData, form, true)
            .then(res => {
              this.addLoading = false
              // if (res.data.resCode === 0) {
              //   // console.log(res)
              //   this.$utils.$message({
              //     message: res.data.resMsg,
              //     type: 'success'
              //   })
              this.handleReset()
              // } else {
              //   this.$utils.$message({
              //     message: res.data.resMsg,
              //     type: 'error'
              //   })
              // }
            })
            .catch(er => {
              this.addLoading = false
              // console.log(er)
            })

          // this[`${type}DialogVisible`] = false
        } else {
        }
      })
    }),
    // 重置表单
    handleReset() {
      this.$refs.addForm.resetFields()
      this.$refs.uploadImg.clearFiles()
      this.addForm.files = []
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#addWorkOrder {
  padding: 10px 18px 0 18px !important;
  min-width: 380px;
  .comTitle {
    font-size: 18px;
  }
  .form {
    padding-top: 20px;
    .el-form {
      max-width: 650px;
      width: 90%;
      // 覆盖服务器缓存
      // .el-form-item {
      //   margin-bottom: 22px;
      // }
      // .el-form-item .el-form-item {
      //   margin-bottom: 0;
      // }
      .textarea {
        height: auto;
        textarea {
          min-height: 54px;
        }
      }
    }
  }
}
</style>
