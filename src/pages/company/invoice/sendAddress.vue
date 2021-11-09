<template>
  <div id="sendAddress">
    <p class="remain fs14">
      <i class="el-icon-warning-outline"></i>
      {{ $t('invoice.saveAddr1') }} {{ total }}
      {{ $t('invoice.saveAddr2') }} {{ 10 - total }}
      {{ $t('invoice.saveAddr3') }}
    </p>
    <div class="flex-w content">
      <div :class="item.isDefault === 0 ? 'selectAddr bgNor' : 'selectAddr bgblue'" v-for="(item, index) in addrInfo" :key="index">
        <div class="flex-hb">
          <p class="fs14 one-txt-cut" :title="item.area">{{item.area}}</p>
          <p class="fs12 def" v-if="item.isDefault === 1">[{{ $t('invoice.default') }}]</p>
        </div>
        <p class="fs12 one-txt-cut addr" :title="item.address + $t('invoice.receive')">{{item.address}} {{ $t('invoice.receive') }}</p>
        <hr>
        <div class="flex-hb">
          <p class="fs12 one-txt-cut" style="width: 100%;" :title="item.receiver + ' ' + item.tel">{{item.receiver}} {{item.tel}}</p>
          <div class="flex flex-hrvc btnBox">
            <p class="pointer fs12" v-if="button.edit" @click="handleOpenDialog(2, item)">{{ $t('button.revise') }}</p>
            <p class="pointer fs12 delete" v-if="button.del" @click="handleOpenDialog(3, item)">{{ $t('button.delete') }}</p>
          </div>
        </div>
      </div>
      <div class="selectInfo pointer" v-if="button.add" @click="handleOpenDialog(1)" v-show="total < 10">
        <i class="el-icon-plus"></i>
        <p>{{ $t('invoice.addAddrInfo') }}</p>
      </div>
    </div>
    <!-- 新增地址信息 -->
    <el-dialog :title="form.type === 1 ? $t('invoice.addAddrInfo') : $t('invoice.reviseAddrInfo')" class="addDialog" @close="handleDialogClose" :visible.sync="addAddrDialogVisible" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('invoice.reciName')" prop="receiver">
          <el-input :placeholder="$t('placeholder.input')" v-model="form.receiver" maxlength="30"></el-input>
        </el-form-item>
        <!-- 地址 -->
        <el-form-item :label="$t('realName.area')" prop="area">
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
        <el-form-item :label="$t('realName.address')" prop="address">
          <el-input :placeholder="$t('placeholder.input')" v-model.trim="form.address" maxlength="128"></el-input>
        </el-form-item>
        <el-form-item :label="$t('invoice.postalCode')" prop="postalCode">
          <el-input :placeholder="$t('placeholder.input')" v-model="form.postalCode" maxlength="6"></el-input>
        </el-form-item>
        <!-- 电话 -->
        <el-form-item :label="$t('common.tel')" prop="tel">
          <div class="flex-hbvc">
            <el-select v-model="phonePrefix" filterable :placeholder="$t('placeholder.select')" class="prefix">
              <el-option v-for="(item,index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-input :placeholder="$t('placeholder.input')" v-model.trim="form.tel" class="phone" maxlength="11"></el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.isDefault">{{ $t('invoice.setDefAddr') }}</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAddrDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="addAddr">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog :title="$t('button.delete')" :visible.sync="deleteDialogVisible" :close-on-click-modal="false">
      <span>{{ $t('invoice.delAddr') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="deleteAddr">{{ $t('button.confirm') }}</el-button>
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
      addrInfo: [],
      form: {
        type: 1, // 1.新增 2.修改
        receiver: '',
        area: '',
        address: '',
        postalCode: '',
        phoneNumb: '',
        tel: '',
        isDefault: false
      },
      total: 0,
      area1: '',
      area2: '',
      area3: '',
      com2AreaOptions: [],
      com3AreaOptions: [],
      phonePrefix: '86',
      prefixOptions: [], // 全球手机号前缀
      addAddrDialogVisible: false,
      deleteDialogVisible: false,
      addrId: ''
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
    }
  },
  computed: {
    ...mapGetters(['language', 'area1Options', 'area2Options', 'area3Options']),
    rules() {
      const rules = {
        receiver: [
          {
            required: true,
            message: this.$t('common.noEmpty')
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
        address: [
          { required: true, message: this.$t('placeholder.input') + this.$t('realName.address'), trigger: 'blur' }
        ],
        postalCode: [
          {
            trigger: 'blur',
            pattern: this.$utils.reg.postalCode,
            message: this.$t('message.inputRight')
          }
        ],
        tel: [
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
    getList() {
      this.listLoading = true
      this.$http.posts('getDeliveryAddrList')
        .then(res => {
          let data = res.data
          if (data.length > 0) {
            this.addrInfo = data
            this.total = this.addrInfo.length
            this.addrInfo.forEach(item => {
              let pho = item.phoneNumb.split('+')
              this.phonePrefix = pho[0]
              item.tel = pho[1]
            })
          } else {
            this.addrInfo = []
          }
        })
        .catch(er => {
          this.form = []
        })
    },
    // 新增地址
    addAddr() {
      var data = { ...this.form }
      data.area = this.area1 + '-' + this.area2 + '-' + this.area3
      data.isDefault = data.isDefault ? 1 : 0
      data.phoneNumb = this.phonePrefix + '+' + data.tel
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$http.posts('saveOrUpdateDeliveryAddr', data, '', true)
            .then(res => {
              this.addAddrDialogVisible = false
              this.getList()
            })
        }
      })
    },
    // 删除
    deleteAddr() {
      this.$http.posts('deleteDeliveryAddr', '', { ids: this.addrId }, true)
        .then(res => {
          this.deleteDialogVisible = false
          this.getList()
        })
    },
    // 对话框打开
    handleOpenDialog(type, data) {
      this.form.type = type
      if (type === 1) { // 新增
        this.area1 = ''
        this.area2 = ''
        this.area3 = ''
      }
      if (type === 2) { // 修改
        // 这里加setTimeout是让resetFields()生效
        setTimeout(() => {
          this.form = { ...data }
          this.form.type = type
          this.form.isDefault = !!this.form.isDefault
          let area = this.form.area.split('-')
          this.area1 = area[0]
          this.area2 = area[1]
          this.area3 = area[2]
          let pho = this.form.phoneNumb.split('+')
          this.phonePrefix = pho[0]
          this.form.tel = pho[1]
          this.init()
        }, 0)
      }
      if (type === 3) { // 删除
        this.addrId = data.addrId
        this.deleteDialogVisible = true
        return
      }
      this.addAddrDialogVisible = true
    },
    // 弹窗关闭
    handleDialogClose() {
      if (this.$refs['form'] !== undefined) {
        this.$refs['form'].clearValidate()
        this.$refs['form'].resetFields()
      }
      this.form.isDefault = false
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
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#sendAddress {
  padding: 20px;
  .remain {
    display: inline-block;
    padding: 5px 10px;
    color: @text2;
    background: #fcf7f1;
  }
  .content {
    .bgblue {
      background: @background1;
      color: #fff;
      border: none !important;
    }
    .bgNor {
      background: #fff;
    }
    .selectAddr {
      width: 200px;
      height: 100px;
      padding: 10px 5px;
      border: solid 1px @border;
      margin: 20px 15px 0 0;
      .def {
        width: 44px;
        text-align: right;
      }
      .addr {
        padding-top: 8px;
      }
      .btnBox {
        width: 77px;
        .delete {
          padding-left: 5px;
        }
      }
    }
    .selectInfo {
      width: 200px;
      height: 100px;
      background: @background;
      color: @text5;
      text-align: center;
      margin-top: 20px;
      i {
        font-size: 30px;
        padding-top: 20px;
      }
    }
  }
  .addDialog {
    .prefix {
      width: 38%;
    }
    .phone {
      width: 60%;
    }
  }
}
</style>
