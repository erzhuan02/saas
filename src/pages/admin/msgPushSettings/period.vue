<template>
  <div id="period" v-loading="listLoading">
    <div class="comTitle">{{ $t('msgCenter.rules') }}</div>
    <el-form :model="pushForm" ref="pushForm" label-width="140px" :rules="pushFormRules">
      <el-form-item :label="$t('tabs.pushPeriod')" required>
        <div class="flex">
          <el-form-item prop="startTime">
            <el-time-select :placeholder="$t('placeholder.select')" v-model="pushForm.startTime" :picker-options="{start: '00:00',step: '01:00',end: '23:00',maxTime:pushForm.endTime}">
            </el-time-select>
          </el-form-item>
          <span style="margin:0 5px;">-</span>
          <el-form-item prop="endTime">
            <el-time-select :placeholder="$t('placeholder.select')" v-model="pushForm.endTime" :picker-options="{start: '00:00',step: '01:00',end: '23:00',minTime: pushForm.startTime}">
            </el-time-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item style="margin-bottom:18px">
        <el-button v-if="button.save" type="primary" @click="handleAddOrEdit">{{ $t('button.save') }}</el-button>
        <el-button v-if="button.save" @click="handleReset">{{ $t('button.reset') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      value1: '',
      pushForm: {
        startTime: '08:00',
        endTime: '21:00'
      },
      listLoading: false,
      button: {}
    }
  },
  computed: {
    ...mapGetters(['language']),
    pushFormRules() {
      return {
        startTime: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('message.select')
          }
        ],
        endTime: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('message.select')
          }
        ]
      }
    }
  },
  watch: {
    language(newLang, oldLang) {
      // 解决中英文切换，验证提示语切换问题
      this.$nextTick(() => {
        this.$refs.pushForm.validate((valid) => {
          if (valid) { } else { return false }
        })
      })
    }
  },
  created() {
    this.getList()
    this.$utils.getButton(this.$route.path, 1).then(res => {
      this.button = res
    })
  },
  mounted() { },
  methods: {
    // 获取列表数据
    getList() {
      this.listLoading = true
      this.$http.posts('getPushPeriod')
        .then(res => {
          this.listLoading = false
          // if (res.data.resCode === 0) {
          var data = res.data
          var { startTime, endTime } = data
          this.pushForm = { startTime, endTime }
          this.$nextTick((item) => {
            this.$refs.pushForm.clearValidate()
          })
        })
    },
    // 保存
    handleAddOrEdit() {
      this.$refs.pushForm.validate(valid => {
        if (valid) {
          this.listLoading = true
          this.$http.posts('pushPeriod', this.pushForm, '', true)
            .then(res => {
              this.getList()
            })
            .catch(er => {
              this.listLoading = false
            })
        } else {
          return false
        }
      })
    },
    // 重置
    handleReset() {
      this.$refs.pushForm.resetFields()
    }
  }
}
</script>

<style lang="less">
#period .el-form-item .el-input {
  width: 150px;
}
</style>
