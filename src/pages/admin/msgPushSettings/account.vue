<template>
  <div id="account" v-loading="listLoading">
    <div class="comTitle">{{ $t('msgCenter.rules') }}</div>
    <el-form :model="pushForm" ref="pushForm" class="form" label-width="20px">
      <el-form-item v-for="(pushForm,index) in pushForm.pushFormList" :key="index">
        <div class="flex-w">
          <div class="flex" :style="{width:width}">
            <template v-if="pushForm.cnfId === 8">
              <span>{{ $t('msgCenter.consumption') }}&nbsp;￥</span>
              <el-form-item :prop="`pushFormList[${index}].deadline`" :rules="pushFormRules.consumption">
                <el-input v-model.trim="pushForm.deadline" maxlength="8"></el-input>
              </el-form-item>
              <span>&nbsp;,</span>
            </template>
            <template v-else-if="pushForm.cnfId === 9">
              <span>{{ $t('msgCenter.issuance') }}&nbsp;</span>
            </template>
            <template v-else-if="pushForm.cnfId === 10 || pushForm.cnfId === 11">
              <span>{{ $t('msgCenter.expiration') }}&nbsp;</span>
              <el-form-item>
                <el-input v-model.trim="pushForm.deadline" type="number" disabled></el-input>
              </el-form-item>
              <span>&nbsp;{{ $t('msgCenter.expiration1') }},</span>
            </template>
            <template v-else-if="pushForm.cnfId === 12">
              <span>{{ $t('msgCenter.expired') }}&nbsp;</span>
            </template>
            <template v-else-if="pushForm.cnfId === 13">
              <span>{{ $t('msgCenter.applyFormalContr') }}&nbsp;</span>
            </template>
          </div>
          <div class="flex">
            <span>{{ $t('msgCenter.sendTo') }}&nbsp;&nbsp;&nbsp;</span>
            <el-form-item :prop="`pushFormList[${index}].sendTo`" :rules="pushFormRules.sendTo">
              <el-checkbox-group v-model="pushForm.sendTo">
                <el-checkbox :label="1" :disabled="!pushForm.isEnableEmail">{{ $t('common.mail') }}</el-checkbox>
                <el-checkbox :label="2" :disabled="!pushForm.isEnableCms">{{ $t('common.shortMessages') }}</el-checkbox>
                <el-checkbox :label="3" :disabled="!pushForm.isEnableWeb">{{ $t('msgCenter.backEnd') }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div class="flex">
            <template v-if="pushForm.cnfId !== 10 && pushForm.cnfId !== 11">
              <span>{{ $t('msgCenter.sendImmediately2') }}</span>
            </template>
            <template v-else>
              <span>{{ $t('msgCenter.frequency') }},&nbsp;{{ $t('common.every') }}&nbsp;</span>
              <el-form-item :prop="`pushFormList[${index}].frequencyDay`" :rules="pushFormRules.frequencyDay(index)">
                <el-input v-model.trim="pushForm.frequencyDay" type="number"></el-input>
              </el-form-item>
              <span class="every">&nbsp;{{ $t('time.day') }}&nbsp;</span>
              <el-form-item>
                <el-input v-model.trim="pushForm.frequencyNumb" type="number" disabled></el-input>
              </el-form-item>
              <span>&nbsp;{{ $t('unit.times') }}</span>
            </template>
          </div>
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
      pushForm: {
        pushFormList: [
          { cnfId: 8, deadline: '', sendTo: [], frequencyDay: '0', frequencyNumb: '1' },
          { cnfId: 9, deadline: 0, sendTo: [], frequencyDay: '0', frequencyNumb: '1' },
          { cnfId: 10, deadline: 7, sendTo: [], frequencyDay: '', frequencyNumb: '1' },
          { cnfId: 11, deadline: 3, sendTo: [], frequencyDay: '', frequencyNumb: '1' },
          { cnfId: 12, deadline: 0, sendTo: [], frequencyDay: '0', frequencyNumb: '1' },
          { cnfId: 13, deadline: 0, sendTo: [], frequencyDay: '0', frequencyNumb: '1' }
        ]
        // // 如果数据库没有，就是从来没有设置过，采用默认的
        // defaultPushFormList: [
        //   { cnfId: 8, deadline: 5000, sendTo: [1, 3], frequencyDay: '0', frequencyNumb: '1' },
        //   { cnfId: 9, deadline: 0, sendTo: [1, 3], frequencyDay: '0', frequencyNumb: '1' },
        //   { cnfId: 10, deadline: 7, sendTo: [1, 3], frequencyDay: '2', frequencyNumb: '1' },
        //   { cnfId: 11, deadline: 3, sendTo: [1, 3], frequencyDay: '1', frequencyNumb: '1' },
        //   { cnfId: 12, deadline: 0, sendTo: [1, 3], frequencyDay: '0', frequencyNumb: '1' },
        //   { cnfId: 13, deadline: 0, sendTo: [1, 3], frequencyDay: '0', frequencyNumb: '1' }
        // ]
      },
      listLoading: false,
      width: '260px',
      button: {}
    }
  },
  computed: {
    ...mapGetters(['language']),
    pushFormRules() {
      return {
        consumption: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('message.inputNo1'),
            pattern: this.$utils.reg.consumption
          }
        ],
        sendTo: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('message.select')
          }
        ],
        frequencyDay: (index) => {
          return [
            {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                // console.log('handleFrequencyDayRule', value, index)
                if (!this.$utils.reg.numberDay.test(value)) {
                  callback(new Error(this.$t('message.numberDay')))
                } else {
                  var deadline = this.pushForm.pushFormList[index].deadline
                  if (value > 0 && +value <= deadline) {
                    // console.log('value > 0 && +value <= deadline')
                    callback()
                  } else {
                    callback(new Error(this.$t('message.exceedDeadline')))
                  }
                }
              }
            }
          ]
        }
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
      if (newLang === 'en') {
        this.width = '515px'
      } else {
        this.width = '260px'
      }
    }
  },
  created() {
    this.getList()
    this.$utils.getButton(this.$route.path, 1).then(res => {
      // console.log('accutnButton', res)
      this.button = res
    })
    if (this.language === 'en') {
      this.width = '515px'
    } else {
      this.width = '260px'
    }
  },
  mounted() { },
  methods: {
    // 获取列表数据
    getList() {
      this.listLoading = true
      this.$http.posts('accountInfoRule')
        .then(res => {
          // console.log('getList', res)
          this.listLoading = false
          // if (res.data.resCode === 0) {
          // var data = res.data
          var data = res
          var list = data.data || []
          if (list.length !== 0) {
            list.forEach((item) => {
              item.sendTo = item.sendTo.filter(sendItem => sendItem)
            })
          }
          this.pushForm.pushFormList = list
          // else {
          //   this.pushForm.pushFormList = this.pushForm.defaultPushFormList
          // }
          this.$nextTick((item) => {
            this.$refs.pushForm.clearValidate()
          })
          // } else {
          //   this.$utils.$message({
          //     message: res.data.resMsg,
          //     type: 'error'
          //   })
          // }
        })
        .catch(er => {
          // console.log(er)
          this.listLoading = false
          // this.list = []
        })
    },
    // 保存
    handleAddOrEdit() {
      this.$refs.pushForm.validate(valid => {
        if (valid) {
          this.listLoading = true
          this.$http.posts('addOrUpdatePushRules', this.pushForm.pushFormList, '', true)
            .then(res => {
              // console.log('res.data', res.data)
              // if (res.data.resCode === 0) {
              // this.$utils.$message({
              //   message: this.$t('message.submitSuccess'),
              //   type: 'success'
              // })
              this.getList()
              // } else {
              //   this.listLoading = false
              //   this.$utils.$message({
              //     message: res.data.resMsg,
              //     type: 'error'
              //   })
              // }
            })
            .catch(er => {
              this.listLoading = false
              // console.log(er)
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
</style>
