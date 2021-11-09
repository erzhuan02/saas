<template>
  <div id="emailAndServer1">
    <div class="form" v-loading="listLoading">
      <el-form :model="editForm" label-width="120px" :rules="addOrEditFormRules" ref="editForm" :validate-on-rule-change="false">
        <el-form-item :label="$t('emailAndServer.host')" prop="host">
          <el-input v-model.trim="editForm.host" :placeholder="$t('placeholder.input')+', '+$t('placeholder.note')" maxlength="128"></el-input>
        </el-form-item>
        <el-form-item :label="$t('emailAndServer.port')" prop="port">
          <el-input v-model.trim="editForm.port" :placeholder="$t('placeholder.input')" maxlength="5"></el-input>
        </el-form-item>
        <el-form-item :label="$t('emailAndServer.userEmail')" prop="userEmail">
          <el-input v-model.trim="editForm.userEmail" :placeholder="$t('placeholder.input')" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item :label="$t('emailAndServer.password')" prop="password" class="mb12">
          <el-input v-model.trim="editForm.password" :placeholder="$t('placeholder.input')" type="password" maxlength="30" autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item prop="isSsl" class="mb12">
          <el-checkbox v-model="editForm.isSsl" disabled>SSL</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button v-if="button.save" type="primary" @click="handleAddOrEdit('edit')">{{ $t('button.save') }}</el-button>
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
      type: 'edit', // 操作类型，如add/edit
      listLoading: false,
      editForm: {
        host: '',
        port: '',
        userEmail: '',
        password: '',
        isSsl: true
      },
      button: {}
    }
  },
  computed: {
    ...mapGetters(['language']),
    // 新增 表单验证
    addOrEditFormRules() {
      return {
        host: [
          {
            required: true,
            trigger: 'blur',
            pattern: this.$utils.reg.ip1,
            message: this.$t('message.inputRight')
          }
        ],
        port: [
          {
            required: true,
            trigger: 'blur',
            pattern: this.$utils.reg.port,
            message: this.$t('message.inputRight')
          }
        ],
        userEmail: [
          {
            required: true,
            trigger: 'blur',
            pattern: this.$utils.reg.email,
            message: this.$t('message.inputRight')
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            pattern: this.$utils.reg.password,
            message: this.$t('message.inputRight')
          }
        ]
      }
    }
  },
  watch: {
    language: {
      handler: function (newLang, oldLang) {
        this.$nextTick(() => {
          this.$refs.editForm.validate((valid) => {
            if (valid) { } else { return false }
          })
        })
      }
    }
  },
  created() {
    this.getList()
    this.$utils.getButton(this.$route.path, 1).then(res => {
      // console.log('accutnButton', res)
      this.button = res
    })
  },
  mounted() { },
  methods: {
    getList() {
      this.listLoading = true
      this.$http.posts('getMessageCnfEmailInfo')
        .then(res => {
          this.listLoading = false
          var data = res.data
          this.editForm = data
          this.$nextTick(() => {
            this.$refs.editForm.clearValidate()
          })
        })
        .catch(er => {
          this.listLoading = false
        })
    },
    // 修改
    handleAddOrEdit: $utils.debounce(function (type) {
      // console.log(type)
      this.$refs[`${type}Form`].validate(valid => {
        if (valid) {
          var form = { ...this[`${type}Form`] }
          this.listLoading = true
          this.$http.posts('saveOrUpdateConfigEmail', form, '', true)
            .then(res => {
              this.getList()
            })
            .catch(er => {
              this.listLoading = false
            })
        } else {
        }
      })
    }),
    // 重置表单
    handleReset() {
      this.$refs.editForm.resetFields()
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#emailAndServer1 {
  padding: 10px 18px 0 18px !important;
  min-width: 380px;
  .form {
    padding-top: 20px;
    .el-form {
      max-width: 650px;
      width: 90%;
    }
    .el-checkbox {
      vertical-align: middle;
    }
  }
}
</style>
