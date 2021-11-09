<template>
  <div id="publishQ">
    <el-form ref="publishForm" :model="flowQuery" :rules="rules" label-width="125px" class="publishForm">
      <el-form-item>
        <el-radio v-model="flowQuery.language" label="1">{{ $t('versionRelease.releaseCn') }}</el-radio>
        <el-radio v-model="flowQuery.language" label="2" disabled>{{ $t('versionRelease.releaseEn') }}</el-radio>
      </el-form-item>
      <el-form-item :label="$t('common.productName')" prop="productId">
        <el-select v-model="flowQuery.productId" :placeholder="$t('placeholder.select')" clearable>
          <el-option v-for="(item, index) in productData" :key="index" :label="item.productName" :value="item.productName + '#' + item.productId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('industry.tabs1')" prop="categoryId">
        <el-select v-model="flowQuery.categoryId" :placeholder="$t('placeholder.select')" clearable>
          <el-option v-for="(item, index) in cateData" :key="index" :label="item.categoryName" :value="item.categoryName + '#' + item.categoryId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('industry.busiName')" prop="businessId">
        <el-select v-model="flowQuery.businessId" :placeholder="$t('placeholder.select')" clearable>
          <el-option v-for="(item, index) in busiData" :key="index" :label="item.busName" :value="item.busName + '#' + item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('button.import')" prop="jsonAddr">
        <div class="flex">
          <el-input class="importInput" v-model="flowQuery.jsonAddr" :placeholder="$t('placeholder.import')" disabled></el-input>
          <div class="flex-hb">
            <label class="upload">
              <input type="file" @change="chooseFile" ref="file">
              <el-button type="primary">{{ $t('button.choose') }}</el-button>
            </label>
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('industry.tempName')" prop="templateName">
        <el-input v-model="flowQuery.templateName" :placeholder="$t('placeholder.import')" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('versionRelease.version')" prop="versionNumb">
        <el-input v-model.trim="flowQuery.versionNumb" :placeholder="$t('placeholder.verisonNumExp')" maxlength="30"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleReset">{{ $t('button.reset') }}</el-button>
        <el-button type="primary" @click="handlePublish">{{ $t('button.publishNow') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 提示语 -->
    <el-dialog class="modeDia" :title="$t('dialog.tips')" :visible.sync="showTips" :close-on-click-modal="false">
      <span>{{ $t('dialog.protocolIsPublish') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showTips = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" :disabled="clickflag" @click="handleConfirm">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $utils from '@/utils'
export default {
  data() {
    return {
      clickflag: false,
      flowQuery: {
        language: '1',
        productId: '',
        productName: '',
        categoryId: '',
        categoryName: '',
        businessId: '',
        busName: '',
        jsonAddr: '',
        templateName: '',
        versionNumb: ''
      },
      formData: [],
      productData: [],
      cateData: [],
      busiData: [],
      showTips: false
    }
  },
  mounted() {
    this.getProduct()
    this.getBusiness()
  },
  watch: {
    'flowQuery.categoryId': {
      handler(newVal) {
        this.flowQuery.businessId = ''
        this.flowQuery.busName = ''
        if (newVal === '') {
          this.busiData = []
          return
        }
        this.cateData.forEach(item => {
          if (item.categoryId == newVal.split('#')[1]) {
            if (item.busTypeList.length === 1 && item.busTypeList[0].id === null) {
              this.busiData = []
            } else {
              this.busiData = item.busTypeList
            }
          }
        })
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['language']),
    rules() {
      return {
        productId: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('common.noEmpty')
          }
        ],
        categoryId: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('common.noEmpty')
          }
        ],
        businessId: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('common.noEmpty')
          }
        ],
        jsonAddr: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('common.noEmpty')
          }
        ],
        templateName: [
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
        ]
      }
    }
  },
  methods: {
    // 获取产品名称
    getProduct() {
      this.$http.posts('getProductDataAuth', '', { type: 1 })
        .then(res => {
          this.productData = res.data
        })
    },
    // 获取行业和业态
    getBusiness() {
      this.$http.posts('categoryAndBusinessTypeList')
        .then(res => {
          this.cateData = res.data
        })
    },
    // 选择文件
    chooseFile(event) {
      let fileVal = this.$refs.file.value
      let file = event.target.files[0]
      let size = file.size / 1024 / 1024 > 20
      let fileName = file.name
      let appName = fileName.split('_')
      let name = fileName.split('.')

      this.$refs.file.value = ''
      // 必须上传json
      if (name[name.length - 1] !== 'json' || appName.length !== 5) {
        this.$utils.$message({
          message: this.$t('message.jsonFile'),
          type: 'error'
        })
        return
      }
      // 不能大于20mb
      if (size) {
        this.$utils.$message({
          message: this.$t('message.more20mb'),
          type: 'error'
        })
        return
      }
      this.formData = new FormData()
      this.formData.append('file', file)
      this.flowQuery.jsonAddr = fileVal
      this.flowQuery.templateName = fileName.split('.json')[0]
    },
    // 重置
    handleReset() {
      this.$nextTick(() => {
        this.$refs.publishForm.resetFields()
        this.$refs.publishForm.clearValidate()
      })
    },
    // 发布
    handlePublish() {
      this.$refs.publishForm.validate(valid => {
        if (valid) {
          this.showTips = true
        }
      })
    },
    // 确认
    handleConfirm: $utils.debounce(function (row) {
      let params = { ...this.flowQuery, timeout: 0 }
      let product = params.productId.split('#')
      let category = params.categoryId.split('#')
      let busi = params.businessId.split('#')
      params.productName = product[0]
      params.productId = product[1]
      params.categoryName = category[0]
      params.categoryId = category[1]
      params.busName = busi[0]
      params.businessId = busi[1]
      delete params.jsonAddr
      delete params.language
      this.$utils.disabledButton(this)
      this.$http.posts('addQuestionBank', this.formData, params, true)
        .then(res => {
          this.handleReset()
          this.showTips = false
        })
        .catch(er => {
          this.showTips = false
        })
    })
  }
}
</script>

<style lang="less" scoped>
#publishQ {
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
    .importInput {
      width: 320px;
    }
    label.upload {
      width: 80px;
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
        width: 80px;
        position: absolute;
        left: 0;
      }
    }
  }
}
</style>
