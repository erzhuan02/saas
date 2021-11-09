<template>
  <div id="publish">
    <div class="form" v-loading="addLoading">
      <el-form :model="addForm" label-width="135px" :rules="addOrEditFormRules" ref="addForm">
        <el-form-item :label="$t('msgCenter.title')" prop="title">
          <el-input v-model.trim="addForm.title" :placeholder="$t('placeholder.input')" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item :label="$t('msgCenter.msgContent')" prop="content" style="height:auto">
          <!-- :http-request="handleHttpRequest" :before-upload="handleBeforeUploadImg" :on-change="handleChangeImg" :limit="limitImg" :on-remove="handleRemoveImg" :on-exceed="handleExceedImg"-->
          <el-upload ref="uploadImg" class="uploadImg" :action="uploadImgAction" :headers="uploadImgHeaders" :show-file-list="false" :before-upload="handleBeforeUploadImg" :on-success="handleSuccessImg" :on-error="handleErrorImg" accept="image/bmp, image/jpeg, image/png">
            <i class="el-icon-plus uploadImgIcon" ref="uploadImgIcon"></i>
          </el-upload>
          <quill-editor v-loading="quillLoading" ref="quillEditor" v-model="addForm.content" @blur="handleBlurEditor" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item :label="$t('msgCenter.publishTime')" required>
          <div class="flex">
            <el-form-item prop="releaseType" style="margin-right:15px">
              <el-radio-group v-model="addForm.releaseType" @change="handleRadioChange">
                <el-radio :label="1">{{ $t('msgCenter.immediately') }}</el-radio>
                <el-radio :label="2">{{ $t('msgCenter.timing') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="releaseTime" class="flex1" v-if="addForm.releaseType===2">
              <el-date-picker v-model="addForm.releaseTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('placeholder.select')" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button v-if="button.release" type="primary" @click="handleAddOrEdit('add')">{{ $t('button.publish') }}</el-button>
          <el-button v-if="button.release" type="primary" @click="handleReset">{{ $t('button.reset') }}</el-button>
          <el-button v-if="button.release" type="primary" @click="handleDialogOpen('preview',addForm)">{{ $t('button.preview') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 预览 -->
    <el-dialog class="preview" :title="$t('button.preview')" :visible.sync="previewDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('preview')">
      <div class="previewBox">
        <div class="title">{{previewForm.title}}</div>
        <!-- <div v-text="previewForm.content"></div> -->
        <!-- 富文本回显 需要外面包裹下 ql-container类可不带,不需要边框-->
        <div class="ql-snow">
          <!-- ql-editor 可解决多个空格的问题 -->
          <div class="ql-editor" v-html="previewForm.content">
          </div>
        </div>
        <div class="pt10">{{ $t('company') }} {{previewForm.releaseTime}}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import { mapGetters } from 'vuex'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      limitImg: 5,
      prodOptions: [], // 编辑或者新增的角色列表

      uploadImgAction: this.$api.apiBase + this.$api.uploadPic,
      uploadImgHeaders: { Authorization: sessionStorage.getItem('authorization') },
      quillLoading: false, // 富文本上传的loading
      addLoading: false,
      addForm: {
        title: '',
        content: '',
        releaseType: '',
        releaseTime: '',

        contentText: ''
        // type: 1
      },
      pickerOptions: {
        disabledDate(time) {
          // console.log(222222)
          // time.getTime()
          return time.getTime() < Date.now() - 24 * 3600 * 1000
        }
        // selectableRange: '18:30:00 - 20:30:00'?'': '00:00:00 - 23:59:59'
      },
      // 富文本的设置
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'], // toggled buttons
              ['blockquote', 'code-block'],

              [{ 'header': 1 }, { 'header': 2 }], // custom button values
              [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
              [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
              [{ 'direction': 'rtl' }], // text direction

              [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

              [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
              // [{ 'font': [] }],
              [{ 'align': [] }],
              ['link', 'image']
            ], // 工具栏
            handlers: {
              'image': function (value) {
                if (value) {
                  // alert('自定义图片')
                  // 调用iview图片上传
                  document.querySelector('.uploadImgIcon').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
          // syntax: {
          //   highlight: text => hljs.highlightAuto(text).value
          // },
        },
        placeholder: ''
      },

      previewDialogVisible: false,
      previewForm: {},

      moduleId: 1, // 基础模块
      button: {}
    }
  },
  computed: {
    ...mapGetters(['language']),
    // 新增 表单验证
    addOrEditFormRules() {
      return {
        title: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('message.input')
          }
        ],
        content: [
          {
            required: true,
            trigger: 'blur',
            // message: this.$t('message.input'),
            validator: (rule, value, callback) => {
              // console.log('content', value)
              var form = 'addForm'
              if (!value) {
                callback(this.$t('message.input'))
              } else {
                var qlEditor = document.querySelector('.ql-editor')
                var qlImg = document.querySelector('.ql-editor img')
                var contentText = qlEditor.innerText.trim()
                this[form].contentText = contentText// eslint-disable-line
                // console.log(contentText, qlImg, qlEditor.innerText.length, contentText.trim().length)
                if ((contentText.length <= 0 || contentText.length > 2000) && !qlImg) {
                  callback(this.$t('message.noticeContent'))
                } else {
                  callback()
                }
              }
            }
          }
        ],
        releaseType: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('message.select')
            // pattern: this.$utils.reg.name
          }
        ],
        releaseTime: [{
          trigger: 'change',
          // type: 'date',
          validator: (rule, value, callback) => {
            // console.log(value)
            if (this.addForm.releaseType === 2) {
              // console.log(value, this.$utils.contrastTime(value))
              if (!value) {
                callback(new Error(this.$t('message.select')))
              } else if (this.$utils.contrastTime(value) !== 1) {
                callback(new Error(this.$t('message.moreThenNow')))
              } else {
                callback()
              }
            } else {
              callback()
            }
          }
        }]
      }
    }
    // editorOption () {
    //   return {
    //     placeholder: this.$t('placeholder.input')
    //   }
    // }
  },
  watch: {
    // language: {
    //   handler: function (newLang, oldLang) {
    //     console.log(newLang, oldLang, this)
    //     // 获取button权限
    //     this.editorOption = {
    //       placeholder: 3333
    //     }
    //   }
    // }
  },
  created() {
    this.$utils.getButton(this.$route.path, 1).then(res => {
      // console.log('Button', res)
      this.button = res
    })
  },
  mounted() { },
  methods: {
    // 所有图片上传之前
    handleBeforeUploadImg(file) {
      // console.log( file)
      this.quillLoading = true
      const isrightType =
        file.type === 'image/bmp' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/png'
      var size = 2
      const isLtSize = file.size / 1024 / 1024 < size
      var errorArr = []
      if (!isrightType) {
        errorArr.push(this.$t('message.photoTypeWrong'))
      }
      if (!isLtSize) {
        errorArr.push(this.$t('message.morePhotoSize1') + size + 'MB')
      }
      if (errorArr.length > 0) {
        this.$utils.$message({
          type: 'error',
          message: file.name + ',' + errorArr.join()
        })
        this.quillLoading = false
      }
      // console.log(isrightType && isLt2M)
      return !errorArr.length
    },
    handleSuccessImg(res, file, fileList) {
      // console.log(res, file, fileList)
      // 获取富文本组件实例
      this.quillLoading = false
      let quill = this.$refs.quillEditor.quill
      // 如果上传成功
      if (res) {
        // 获取光标所在位置
        let length = quill.getSelection() && quill.getSelection().index
        // 插入图片，res为服务器返回的图片链接地址
        quill.insertEmbed(length, 'image', res.data.imagePath)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        // 提示信息，需引入Message
        // Message.error('图片插入失败')
      }
    },
    handleErrorImg(res) {
      this.quillLoading = false
      this.$utils.$message({
        message: res.data.resMsg || this.$t('message.uploadImg4'),
        type: 'error'
      })
    },
    // 新增/修改/详情/删除对话框打开
    handleDialogOpen(type, row) {
      // console.log('dia')
      if (type === 'preview') {
        this.previewForm = { ...row }
        if (this.addForm.content) {
          this.handleBlurEditor() // 防止直接富文本就直接预览了，blur没调用
        }
        if (this.previewForm.releaseType && this.previewForm.releaseType !== 2) {
          this.previewForm.releaseTime = this.$utils.formatDate(new Date())
        }
      }
      this[`${type}DialogVisible`] = true
    },
    // 新增
    handleAddOrEdit(type) {
      // console.log(type)
      this.$refs[`${type}Form`].validate(valid => {
        if (valid) {
          var form = { ...this[`${type}Form`] }
          if (type === 'add') {
          } else if (type === 'edit') {
          }
          this.addLoading = true
          this.$http.posts('addAnnouncement', form, '', true)
            .then(res => {
              this.addLoading = false
              // console.log('res', res.data)
              // if (res.data.resCode === 0) {
              // console.log(res)
              // this.$utils.$message({
              //   message: res.data.resMsg,
              //   type: 'success'
              // })
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
        }
      })
    },
    // // 处理下富文本的所有空格,html中只会渲染一个空格
    handleBlurEditor() {
      // console.log('handleBlurEditor')
      this.$refs.addForm.validateField('content')

      // sessionStorage.setItem('content', this.addForm.content)
    },
    // handleFocusEditor () {
    //   console.log('handleFocusEditor')
    // },
    // 复选框选中
    handleRadioChange() {
      // 直接点了这个，富文本的blur不调用，此处调用下
      if (this.addForm.content) {
        this.handleBlurEditor()
      }
    },
    // 重置表单
    handleReset() {
      this.$refs.addForm.resetFields()
    },
    // 对话框关闭
    handleDialogClose(type) {
      if (type === 'preview') {
      }
    }

  }
}
</script>

<style lang="less">
#publish {
  padding: 10px;
  .form {
    padding-top: 20px;
    .el-form {
      max-width: 850px;
      width: 90%;
      & > .el-form-item {
        min-width: 330px;
        height: 40px;
      }
      .uploadImg {
        display: none;
      }
    }
    // 富文本编辑器
    .quill-editor {
      .ql-editor {
        min-height: 200px;
        font-size: 16px;
      }
    }
  }
  .preview {
    .el-dialog {
      max-width: 740px;
    }
    .el-dialog__body {
      overflow: auto;
      .previewBox {
        min-height: 150px;
        .title {
          margin-bottom: 15px;
          // text-align: center; //折行的话文字还是居中
          width: 100%;
          font-size: 18px;
        }
      }
    }
  }
}
</style>
