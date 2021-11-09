<template>
  <div id="publish">
    <el-form ref="publishForm" :model="flowQuery" label-width="125px" class="publishForm">
      <el-form-item :label="$t('versionRelease.uploadApp')">
        <div class="flex-hb">
          <label>
            <input type="file" @change="chooseFile" title="">
            <el-button type="primary" :loading="loading">{{ $t('button.choose') }}</el-button>
          </label>
          <!-- <el-progress :percentage="percentage" color="#fea53d"></el-progress> -->
        </div>
      </el-form-item>
      <el-form-item prop="orderId" :label="$t('versionRelease.appName')">
        <el-input v-model="flowQuery.appName" disabled :placeholder="$t('versionRelease.placeholder1')"></el-input>
      </el-form-item>
      <el-form-item prop="orderId" :label="$t('versionRelease.currentVersion')">
        <el-input v-model="flowQuery.versionNumb" disabled :placeholder="$t('versionRelease.placeholder2')"></el-input>
      </el-form-item>
      <el-form-item prop="orderId" :label="$t('versionRelease.featureDesc')">
        <el-input type="textarea" :rows="4" v-model="flowQuery.explanation" maxlength="400" show-word-limit :placeholder="$t('versionRelease.placeholder3')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="veriData">{{ $t('button.publishNow') }}</el-button>
        <el-button @click="handleReset">{{ $t('button.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <el-dialog class="modeDia" :title="$t('dialog.tips')" :visible.sync="showDialog" :close-on-click-modal="false">
      <span>{{ $t('dialog.isPublish') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="publish">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      // percentage: 20,
      flowQuery: {
        fileUrl: '',
        appName: '',
        versionNumb: '',
        explanation: '',
        fileName: ''
      },
      showDialog: false
    }
  },
  mounted() {
    this.handleReset()
  },
  methods: {
    // 重置
    handleReset() {
      this.flowQuery.fileUrl = ''
      this.flowQuery.appName = ''
      this.flowQuery.versionNumb = ''
      this.flowQuery.explanation = ''
      this.flowQuery.fileName = ''
    },
    // 选择文件
    chooseFile(event) {
      let file = event.target.files[0]
      let size = file.size / 1024 / 1024 > 100
      let fileName = file.name
      let appName = fileName.split('-')
      let name = fileName.split('.')
      // 必须上传apk
      if (name[name.length - 1] !== 'apk') {
        this.$utils.$message({
          message: this.$t('message.apkFile'),
          type: 'error'
        })
        return
      }
      // 不能大于100mb
      if (size) {
        this.$utils.$message({
          message: this.$t('message.more100mb'),
          type: 'error'
        })
        return
      }
      this.loading = true
      this.handleReset()
      let formData = new FormData()
      formData.append('file', file)
      this.$http.posts('verUploadFile', formData, { timeout: 0 }, true)
        .then(res => {
          let data = res.data
          this.flowQuery = { ...this.flowQuery, ...data }
          this.flowQuery.appName = appName[0]
          this.flowQuery.fileName = fileName
          this.loading = false
        })
        .catch(er => {
          this.loading = false
        })
    },
    veriData() {
      if (this.flowQuery.fileUrl === '') {
        this.$utils.$message({
          message: this.$t('message.upFile'),
          type: 'error'
        })
        return
      }
      if (this.flowQuery.explanation.trim() === '') {
        this.$utils.$message({
          message: this.$t('message.inpExp'),
          type: 'error'
        })
        return
      }
      this.showDialog = true
    },
    // 立即发布
    publish() {
      this.$http.posts('verAdd', this.flowQuery, '', true)
        .then(res => {
          this.handleReset()
          this.showDialog = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
#publish {
  width: 50%;
  min-width: 450px;
  .publishForm {
    padding: 20px 0;
    label {
      width: 90px;
      height: 40px;
      position: relative;
      input[type='file'] {
        opacity: 0;
        width: 100%;
        height: 40px;
        position: absolute;
        top: 0;
        z-index: 2;
      }
      button {
        width: 90px;
        position: absolute;
        left: 0;
      }
    }
    // .el-progress{
    //   width: 79%;
    //   line-height: 40px;
    //   padding-left: 10px;
    // }
  }
}
</style>
