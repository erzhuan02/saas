<template>
  <div id="billingInfo">
    <!-- 按钮 -->
    <div class="CRUD">
      <el-button type="primary" v-if="button.add" @click="handleDialogOpen(1)" :disabled="total >= 10">{{ $t('button.add') }}</el-button>
    </div>
    <!-- 查询结果 -->
    <div class="result clearfix">
      <el-table v-loading="listLoading" class="audited" ref="resultTable" stripe border max-height="620" :data="tableData" style="width: 100%;" highlight-current-row>
        <el-table-column prop="invoiceHead" :label="$t('invoice.invoiceTT')">
          <template slot-scope="scope">
            <span v-if="scope.row.isDefault === 1" class="tips" style="color:#f00">{{ $t('invoice.default') }}</span>
            <span>{{scope.row.invoiceHead}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="headType" :label="$t('invoice.headUpType')">
          <template slot-scope="scope">
            <span v-if="scope.row.headType === 1">{{ $t('invoice.personal') }}</span>
            <span v-if="scope.row.headType === 2">{{ $t('invoice.enterprise') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="invoiceType" :label="$t('invoice.invoiceType')">
          <template slot-scope="scope">
            <span v-if="scope.row.invoiceType === 1">{{ $t('invoice.ordInvoice') }}</span>
            <span v-if="scope.row.invoiceType === 2">{{ $t('invoice.specialInvoice') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="scope">
            <div class="flex-hcvc">
              <el-button size="mini" type="primary" v-if="button.edit" @click="handleDialogOpen(2, scope.row)" plain>{{ $t('button.revise') }}</el-button>
              <el-button size="mini" type="primary" v-if="button.del" @click="handleDialogOpen(3, scope.row)" plain>{{ $t('button.delete') }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增&修改 -->
    <el-dialog :title="form.type === 1 ? $t('invoice.addBillingInfo') : $t('invoice.reviseBillingInfo')" class="addFixDialog" @closed="handleDialogClose" :visible.sync="addOrFixDialogVisible" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-form-item :label="$t('invoice.headUpType')" prop="headType">
          <el-radio-group v-model="form.headType">
            <el-radio :label="1">{{ $t('invoice.personal') }}</el-radio>
            <el-radio :label="2">{{ $t('invoice.enterprise') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('invoice.invoiceType')" prop="invoiceType">
          <el-radio-group v-model="form.invoiceType">
            <el-radio :label="1">{{ $t('invoice.ordInvoice') }}</el-radio>
            <el-radio :label="2" v-if="showPerson">{{ $t('invoice.specialInvoice') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('invoice.invoiceTT')" prop="invoiceHead">
          <el-input :placeholder="$t('placeholder.input')" v-model="form.invoiceHead" maxlength="128"></el-input>
        </el-form-item>
        <el-form-item :label="$t('invoice.taxNumb')" prop="taxNumber" v-if="showPerson">
          <el-input :placeholder="$t('placeholder.input')" v-model="form.taxNumber" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item :label="$t('invoice.bankName')" prop="bankBranch" v-if="showPerson && showEnter">
          <el-select v-model="form.bankBranch" :placeholder="$t('placeholder.select')">
            <el-option v-for="item in bankOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('invoice.accountOpening')" prop="bankAccount" v-if="showPerson && showEnter">
          <el-input :placeholder="$t('placeholder.input')" v-model.trim="form.bankAccount" maxlength="50"></el-input>
        </el-form-item>
        <!-- 地址 -->
        <el-form-item :label="$t('realName.enterLocation')" prop="area" v-if="showPerson && showEnter">
          <el-col :span="7">
            <el-form-item prop="area1" style="width: 100%;min-width:auto">
              <el-select v-model="area1" @change="handleChangeArea($event, 2, 'com2')" :placeholder="$t('common.province')" filterable>
                <el-option v-for="item in area1Options" :key="item.areaId" :label="item.areaName" :value="item.areaName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="text-align:center;width:6%">-</el-col>
          <el-col :span="7">
            <el-form-item prop="area2" style="width: 100%;min-width:auto">
              <el-select v-model="area2" @change="handleChangeArea($event, 3, 'com3')" :placeholder="$t('common.city')" filterable>
                <el-option v-for="item in com2AreaOptions" :key="item.value" :label="item.areaName" :value="item.areaName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="text-align:center;width:6%">-</el-col>
          <el-col :span="7">
            <el-form-item prop="area3" style="width: 100%;min-width:auto">
              <el-select v-model="area3" :placeholder="$t('common.county')" filterable>
                <el-option v-for="item in com3AreaOptions" :key="item.value" :label="item.areaName" :value="item.areaName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('common.address')" prop="coAddress" v-if="showPerson && showEnter">
          <el-input :placeholder="$t('placeholder.realName5')" v-model.trim="form.coAddress" maxlength="128"></el-input>
        </el-form-item>
        <!-- 电话 -->
        <el-form-item :label="$t('common.tel')" prop="coPhoneNumb" v-if="showPerson && showEnter">
          <div class="flex-hbvc">
            <el-select v-model="phonePrefix" filterable :placeholder="$t('placeholder.select')" class="prefix">
              <el-option v-for="(item,index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-input :placeholder="$t('placeholder.input')" v-model.trim="form.coPhoneNumb" class="phone" maxlength="11"></el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.isDefault">{{ $t('invoice.setDefInfo') }}</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrFixDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="addInvoiceInfo">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog :title="$t('button.delete')" :visible.sync="deleteDialogVisible" :close-on-click-modal="false">
      <span>{{ $t('invoice.delTips') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="deleteInvoice">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      listLoading: false,
      tableData: [],
      form: {
        type: 1, // 1新增 2修改
        headType: 1,
        invoiceType: 1,
        invoiceHead: '',
        taxNumber: '',
        bankBranch: '',
        bankAccount: '',
        area: '',
        coAddress: '',
        coPhoneNumb: '',
        isDefault: false
      },
      total: 0,
      bankOptions: [ // 开户银行选择项
        {
          value: '中国银行',
          label: '中国银行'
        }, {
          value: '中国工商银行',
          label: '中国工商银行'
        }, {
          value: '中国农业银行',
          label: '中国农业银行'
        }, {
          value: '交通银行',
          label: '交通银行'
        }, {
          value: '招商银行',
          label: '招商银行'
        }
      ],
      area1: '',
      area2: '',
      area3: '',
      com2AreaOptions: [],
      com3AreaOptions: [],
      phonePrefix: '86',
      prefixOptions: [], // 全球手机号前缀

      addOrFixDialogVisible: false,
      deleteDialogVisible: false,

      showPerson: false,
      showEnter: false,

      ids: ''
    }
  },
  created() {
    this.$store.dispatch('getArea', { level: 1, areaId: '' }) // 获取区域
  },
  mounted() {
    if (this.language == 'cn') {
      this.prefixOptions = this.$utils.formatPrefixCN()
    } else if (this.language == 'en') {
      this.prefixOptions = this.$utils.formatPrefixEN()
    }
    this.getList()
  },
  props: ['button'],
  watch: {
    language(val) {
      if (val == 'cn') {
        this.prefixOptions = this.$utils.formatPrefixCN()
      }
      if (val == 'en') {
        this.prefixOptions = this.$utils.formatPrefixEN()
      }
    },
    'form.headType': {
      handler(newVal) {
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].clearValidate()
        }
        if (newVal === 1) {
          this.showPerson = false
          this.form.invoiceType = 1
        } else {
          this.showPerson = true
        }
      },
      deep: true
    },
    'form.invoiceType': {
      handler(newVal) {
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].clearValidate()
        }
        if (newVal === 1) {
          this.showEnter = false
        } else {
          this.showEnter = true
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['language', 'area1Options', 'area2Options', 'area3Options']),
    rules() {
      const rules = {
        headType: [
          {
            required: true,
            message: this.$t('common.noEmpty')
          }
        ],
        invoiceType: [
          {
            required: true,
            message: this.$t('common.noEmpty')
          }
        ],
        invoiceHead: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('common.noEmpty'),
            pattern: this.$utils.reg.content128,
            validator: this.$utils.validator.common
          }
        ],
        taxNumber: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('common.noEmpty'),
            pattern: this.$utils.reg.content50,
            validator: this.$utils.validator.common
          }
        ],
        bankBranch: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value == '' || value == null) {
                callback(new Error(this.$t('placeholder.select') + this.$t('realName.openBank')))
              }
              callback()
            }
          }
        ],
        bankAccount: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value == '' || value == null) {
                callback(new Error(this.$t('placeholder.input')))
              } else {
                var reg = /\D/g
                if (reg.test(value)) {
                  callback(new Error(this.$t('placeholder.onlyNumber')))
                }
                if (value.length < 16) {
                  callback(new Error(this.$t('placeholder.more16')))
                }
                callback()
              }
            }
          }
        ],
        area: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.area1 == '' || this.area2 == '') {
                callback(new Error(this.$t('placeholder.select') + this.$t('realName.enterLocation')))
              }
              callback()
            }
          }
        ],
        coAddress: [
          { required: true, message: this.$t('placeholder.input') + this.$t('realName.address'), trigger: 'blur' }
        ],
        coPhoneNumb: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value == '') {
                callback(new Error(this.$t('placeholder.input') + this.$t('realName.phone')))
              } else {
                var phoneNORegA = this.$utils.reg.phoneNoA
                var phoneNORegC = this.$utils.reg.phoneNoC1
                var phoneNORegC1 = this.$utils.reg.phoneNoC2
                if (!phoneNORegA.test(value)) {
                  callback(new Error(this.$t('message.inputRight')))
                } else {
                  let reg = (this.phonePrefix === '86' && !phoneNORegC.test(value)) ||
                    (this.phonePrefix === '886' && !phoneNORegC1.test(value))
                  if (reg) {
                    callback(new Error(this.$t('message.inputRight')))
                  } else {
                    callback()
                  }
                }
              }
            }
          }
        ]
      }
      return rules
    }
  },
  methods: {
    // 初始化回显区域
    init() {
      if (this.area2 !== '') {
        let areaId = this.area1Options.find(item => item.areaName === this.area1).areaId
        this.getArea(areaId)
          .then(res => {
            this.com2AreaOptions = res
            if (this.area3 !== '') {
              let areaId2 = this.com2AreaOptions.find(item => item.areaName === this.area2).areaId
              this.getArea(areaId2).then(res => {
                this.com3AreaOptions = res
              })
            }
          })
      }
    },
    // 获取列表
    getList() {
      this.listLoading = true
      this.$http.posts('invoiceInfoList')
        .then(res => {
          let data = res.data
          this.listLoading = false
          this.tableData = data.list || []
          this.total = data.total || 0
        })
        .catch(er => {
          this.listLoading = false
          this.tableData = []
          this.total = 0
        })
    },
    // 选择省市
    handleChangeArea(val, level, sort) {
      var areaId
      if (level === 2) {
        if (sort === 'com2') {
          this.area2 = ''
          this.area3 = ''
          this.com3AreaOptions = []
        }
      }
      if (level === 3) {
        if (sort === 'com3') {
          this.area3 = ''
          areaId = this.com2AreaOptions.find(item => item.areaName === val).areaId
        }
      }
      if (sort !== 'com3') {
        areaId = this[`area${level - 1}Options`].find(item => item.areaName === val).areaId
      }
      this.$store.dispatch('getArea', { level, areaId })
      this.getArea(areaId)
        .then(res => {
          this[`${sort}AreaOptions`] = res || []
        })
    },
    // 获取区域
    async getArea(areaId) {
      let res = await this.$http.posts('getArea', '', { areaId })
      return res.data
    },
    // 新增&修改
    addInvoiceInfo() {
      var data = { ...this.form }
      data.area = this.area1 + '-' + this.area2 + '-' + this.area3
      data.isDefault = data.isDefault ? 1 : 0
      data.coPhoneNumb = this.phonePrefix + '+' + data.coPhoneNumb
      if (data.headType === 1) { // 个人
        data = {
          type: data.type,
          headType: data.headType,
          invoiceType: data.invoiceType,
          invoiceHead: data.invoiceHead,
          isDefault: data.isDefault
        }
      } else {
        if (data.invoiceType === 1) {
          data = {
            type: data.type,
            headType: data.headType,
            invoiceType: data.invoiceType,
            invoiceHead: data.invoiceHead,
            isDefault: data.isDefault,
            taxNumber: data.taxNumber
          }
        }
      }
      // 修改
      if (data.type === 2) {
        data = { ...data, infoId: this.form.infoId }
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$http.posts('saveOrUpdateInfo', data, '', true)
            .then(res => {
              this.addOrFixDialogVisible = false
              this.getList()
            })
        }
      })
    },
    // 删除
    deleteInvoice() {
      this.$http.posts('deleteInvoiceInfo', '', { ids: this.ids }, true)
        .then(res => {
          this.deleteDialogVisible = false
          this.getList()
        })
    },
    // 弹窗打开
    handleDialogOpen(type, data) {
      this.form.type = type
      if (type === 1) { // 新增
      }
      if (type === 2) { // 修改
        // 这里加setTimeout是让resetFields()生效
        setTimeout(() => {
          this.form = { ...data }
          this.form.type = type
          this.form.isDefault = !!this.form.isDefault
          if (this.form.invoiceType === 2 && this.form.headType === 2) {
            let area = this.form.area.split('-')
            this.area1 = area[0]
            this.area2 = area[1]
            this.area3 = area[2]
            let pho = this.form.coPhoneNumb.split('+')
            this.phonePrefix = pho[0]
            this.form.coPhoneNumb = pho[1]
            this.init()
          } else {
            this.area1 = ''
            this.area2 = ''
            this.area3 = ''
          }
        }, 0)
      }
      if (type === 3) { // 删除
        this.ids = data.infoId
        this.deleteDialogVisible = true
        return
      }
      this.addOrFixDialogVisible = true
    },
    // 弹窗关闭
    handleDialogClose() {
      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].clearValidate()
        // this.$refs['form'].resetFields()
        for (let key in this.form) {
          this.form[key] = ''
        }
      }
      this.form.isDefault = false
      this.form.headType = 1
      this.form.invoiceType = 1
      this.form.type = 1
      this.area1 = ''
      this.area2 = ''
      this.area3 = ''
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#billingInfo {
  .addFixDialog {
    .prefix {
      width: 38%;
    }
    .phone {
      width: 60%;
    }
  }
}
</style>
