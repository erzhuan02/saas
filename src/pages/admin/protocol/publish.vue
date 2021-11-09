<template>
  <div id="publish">
    <el-form ref="publishForm" :model="flowQuery" :rules="rules" label-width="125px" class="publishForm">
      <el-form-item>
        <el-radio v-model="flowQuery.language" label="1">{{ $t('versionRelease.releaseCn') }}</el-radio>
        <el-radio v-model="flowQuery.language" label="2">{{ $t('versionRelease.releaseEn') }}</el-radio>
      </el-form-item>
      <el-form-item :label="$t('versionRelease.agreementType')" prop="proTypeId">
        <el-select v-model="flowQuery.proTypeId" popper-class="z-index9000" :placeholder="$t('placeholder.select')" clearable>
          <el-option v-for="(item, index) in selectProType" :key="index" :label="language === 'cn' ? item.nameCn : item.nameEn" :value="item.id + '/' + item.nameCn + '/' + item.nameEn">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('versionRelease.version')" prop="versionNumb">
        <el-input v-model="flowQuery.versionNumb" :placeholder="$t('placeholder.verisonNumExp')" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item :label="$t('versionRelease.agreement')" prop="proContent">
        <wang-editor ref="wEditor" v-model="flowQuery.proContent" :content="flowQuery.proContent"></wang-editor>
        <span class="note">{{ $t('message.proNote') }}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="openDialog('publish')">{{ $t('button.publishNow') }}</el-button>
        <el-button @click="openDialog('preview')">{{ $t('button.preview') }}</el-button>
        <el-button type="primary" @click="openDialog('clear')">{{ $t('button.clearAll') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 预览 -->
    <el-dialog class="modeDia dlgWidthAuto preview" :title="$t('button.preview')" :visible.sync="showPreview" :close-on-click-modal="false">
      <div class="previewWangEd" v-html="flowQuery.proContent"></div>
    </el-dialog>
    <!-- 提示语 -->
    <el-dialog class="modeDia" :title="$t('dialog.tips')" :visible.sync="showTips" :close-on-click-modal="false">
      <span>{{ flag == 'publish' ? $t('dialog.protocolIsPublish') : $t('dialog.protocolIsClear') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showTips = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" :disabled="clickflag" @click="flag == 'publish' ? handleConfirm('publish') : handleConfirm('clear')">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import WangEditor from '../../../components/wangEditor'
import { mapGetters } from 'vuex'
export default {
  components: { WangEditor },
  data() {
    return {
      clickflag: false,
      loading: false,
      flowQuery: {
        language: '1',
        proTypeId: '',
        versionNumb: '',
        proContent: ''
        // proContentText: ''
      },
      typeId: '', // 当前选择协议id
      selectProType: [],
      editor: '',
      showPreview: false,
      showTips: false,
      flag: '' // 提示语标记
    }
  },
  mounted() {
    this.getProType()
  },
  watch: {
    'flowQuery.proTypeId': {
      handler(newVal) {
        this.typeId = newVal.split('/')[0]
        this.getProContent(this.typeId)
      },
      deep: true
    },
    'flowQuery.language': {
      handler(newVal) {
        this.getProContent(this.typeId)
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['language']),
    rules() {
      return {
        proTypeId: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('common.noEmpty')
          }
        ],
        versionNumb: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('common.noEmpty')
          }
        ],
        proContent: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value == '' || value == '<p><br></p>') {
                callback(new Error(this.$t('common.noEmpty')))
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    // 获取协议类型列表
    getProType() {
      // 类型：1.查询所有协议 0.排除订单协议
      this.$http.gets('getProTypeAuth', { type: 1 })
        .then(res => {
          this.selectProType = res.data || []
        })
    },
    // 获取最新的协议内容
    getProContent(typeId) {
      let params = {
        typeId,
        language: this.flowQuery.language
      }
      this.$http.gets('getProContentAuth', params)
        .then(res => {
          this.flowQuery.proContent = res.data || ''
        })
    },
    // 清除协议内容
    handleReset() {
      this.flowQuery.proContent = ''
      this.$refs.wEditor.handleReset()
    },
    // 打开对话框
    openDialog(type) {
      if (type === 'preview') {
        this.showPreview = true
      } else {
        // publish or clear
        this.flag = type
        if (this.flag == 'publish') {
          if (this.flowQuery.proTypeId == '') {
            this.$utils.$message({
              message: this.$t('message.proTypeNotEmpty'),
              type: 'error'
            })
            return
          }
          if (this.flowQuery.versionNumb == '') {
            this.$utils.$message({
              message: this.$t('message.versionNotEmpty'),
              type: 'error'
            })
            return
          }
        }
        if (this.flowQuery.proContent == '' || this.flowQuery.proContent == '<p><br></p>') {
          if (this.flag === 'publish') {
            this.$utils.$message({
              message: this.$t('message.proContentNotEmpty'),
              type: 'error'
            })
          }
        } else {
          this.showTips = true
        }
      }
    },
    // 确认
    handleConfirm(type) {
      if (type === 'publish') {
        this.clickflag = true
        // this.flowQuery.proContentText = this.$refs.wEditor.editor.txt.text()
        let query = { ...this.flowQuery }
        let idAndName = query.proTypeId.split('/')
        query.proTypeId = idAndName[0]
        query.proName = query.language == 1 ? idAndName[1] : idAndName[2]
        this.$http.posts('addProtocol', query, '', true)
          .then(res => {
            this.flowQuery.proTypeId = ''
            this.flowQuery.versionNumb = ''
            this.handleReset()
            setTimeout(() => {
              this.clickflag = false
            }, 200)
          })
          .catch(er => {
            this.clickflag = false
          })
      }
      if (type === 'clear') {
        this.handleReset()
      }
      this.showTips = false
    }
  }
}
</script>

<style lang="less" scoped>
#publish {
  width: 80%;
  .publishForm {
    padding: 20px 0;
    .el-select,
    .el-input {
      width: 400px;
    }
    .modeDia {
      z-index: 9000;
    }
    .note {
      color: #f00;
      font-size: 12px;
    }
  }
}
</style>
