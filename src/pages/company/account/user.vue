<template>
  <div id="userAccount">
    <!-- 操作 -->
    <div class="CRUD">
      <el-button v-if="button.addBusiUser" type="primary" icon="el-icon-plus" @click="handleDialogOpen('add')" :disabled="list.length >= 1">{{ $t('button.add') }}</el-button>
    </div>
    <!-- 查询结果 -->
    <div class="result clearfix" v-loading="listLoading">
      <el-table ref="resultTable" stripe border max-height="565" :data="list" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange" @sort-change="handleSortChange" highlight-current-row>
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column type="index" :label="$t('common.no')" width="80" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
        <el-table-column sortable="custom" prop="userName" :label="$t('common.userName')"></el-table-column>
        <el-table-column sortable="custom" prop="lastLoginTime" :label="$t('account.lastLoginTime')"></el-table-column>
        <el-table-column sortable="custom" prop="createTime" :label="$t('account.createTime')"></el-table-column>
        <el-table-column sortable="custom" prop="type" :label="$t('account.type')"></el-table-column>
        <el-table-column sortable="custom" prop="roleName" :label="$t('account.role')"></el-table-column>
        <el-table-column prop="realName" :label="$t('common.name')"></el-table-column>
        <el-table-column prop="phoneNumb" :label="$t('common.phone')"></el-table-column>
        <el-table-column prop="emailAddr" :label="$t('common.email')" min-width="100"></el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="scope">
            <el-button v-if="button.editBusiUser" size="mini" type="primary" icon="el-icon-edit" @click="handleDialogOpen('edit', scope.row)" plain>{{ $t('button.edit') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">
        {{ $t('common.currentPage') }} {{ list.length }}
        {{ $t('common.unit') }}
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <!-- 新增对话框 -->
    <el-dialog :title="$t('button.add')" :visible.sync="addDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('add')">
      <el-form :model="addForm" label-width="130px" :rules="addOrEditFormRules" ref="addForm" :validate-on-rule-change="false">
        <el-form-item prop="realName" :label="$t('common.name')">
          <el-input v-model.trim="addForm.realName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item prop="userName" :label="$t('account.userName')">
          <el-input v-model.trim="addForm.userName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item prop="password" :label="$t('account.newPassword')">
          <el-input v-model.trim="addForm.password" :placeholder="$t('placeholder.input')" type="password" autocomplete="new-password"></el-input>
          <!-- autocomplete="new-password" 解决默认记住密码，打开覆盖的问题-->
        </el-form-item>
        <el-form-item prop="passwordAgain" :label="$t('account.newPasswordAgain')">
          <el-input v-model.trim="addForm.passwordAgain" :placeholder="$t('placeholder.input')" type="password" autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item prop="roleId" :label="$t('account.role')">
          <el-select v-model="addForm.roleId" :placeholder="$t('placeholder.select')">
            <el-option label="超级管理员" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('account.phoneNo')" required>
          <div class="flex-hb">
            <el-form-item prop="phonePrefix" style="width: 34%;min-width:auto">
              <el-select v-model="addForm.phonePrefix" filterable :placeholder="$t('placeholder.select')">
                <el-option v-for="(item, index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <span>-</span>
            <el-form-item prop="phoneNumb" style="width: 62%;min-width:auto">
              <el-input v-model.trim="addForm.phoneNumb" :placeholder="$t('placeholder.input')" maxlength="30"></el-input>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item prop="vailCode" :label="$t('common.phoneCode')">
          <div class="flex-hb">
            <el-input v-model.trim="addForm.vailCode" :placeholder="$t('placeholder.input')" style="width: 70%"></el-input>
            <el-button v-show="phoneCodeShow" type="primary" @click="getPhoneCode('add')" style="width: 28%;padding: 12px 0;">{{ $t('common.getVerCode') }}</el-button>
            <el-button v-show="!phoneCodeShow" class="btnNClick" type="info" disabled style="width: 28%;padding: 12px 0;">{{ phoneTime }}s</el-button>
          </div>
        </el-form-item>
        <el-form-item prop="emailAddr" :label="$t('common.email')">
          <el-input v-model.trim="addForm.emailAddr" :placeholder="$t('placeholder.input')" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item prop="emailCode" :label="$t('common.emailCode')">
          <div class="flex-hb">
            <el-input v-model.trim="addForm.emailCode" :placeholder="$t('placeholder.input')" maxlength="6" style="width: 70%"></el-input>
            <el-button v-show="emailCodeShow" type="primary" @click="getEmailCode('add')" style="width: 28%;padding: 12px 0;">{{ $t('common.getVerCode') }}</el-button>
            <el-button v-show="!emailCodeShow" type="info" disabled style="width: 28%;padding: 12px 0;">{{ emailTime }}s</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAddOrEdit('add')">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog :title="$t('button.edit')" :visible.sync="editDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('edit')">
      <el-form :model="editForm" label-width="140px" :rules="addOrEditFormRules" ref="editForm" :validate-on-rule-change="false">
        <el-form-item prop="realName" :label="$t('common.name')">
          <el-input v-model.trim="editForm.realName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item prop="userName" :label="$t('account.userName')">
          <el-input v-model.trim="editForm.userName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item prop="password" :label="$t('account.newPassword')">
          <el-input v-model.trim="editForm.password" :placeholder="$t('placeholder.input')" type="password" autocomplete="new-password"></el-input>
          <!-- autocomplete="new-password" 解决默认记住密码，打开覆盖的问题-->
        </el-form-item>
        <el-form-item prop="passwordAgain" :label="$t('account.newPasswordAgain')">
          <el-input v-model.trim="editForm.passwordAgain" :placeholder="$t('placeholder.input')" type="password" autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item prop="roleId" :label="$t('account.role')">
          <el-select v-model="editForm.roleId" :placeholder="$t('placeholder.select')" disabled>
            <el-option label="超级管理员" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('account.phoneNo')" required>
          <div class="flex-hb">
            <el-form-item prop="phonePrefix" :style="{ width: phoneDisabledEdit ? '29%' : '34%','min-width': 'auto' }">
              <el-select v-model="editForm.phonePrefix" filterable :placeholder="$t('placeholder.select')" :disabled="phoneDisabledEdit">
                <el-option v-for="(item, index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <span>-</span>
            <el-form-item prop="phoneNumb" :style="{ width: phoneDisabledEdit ? '38%' : '62%','min-width': 'auto' }">
              <el-input v-model.trim="editForm.phoneNumb" :placeholder="$t('placeholder.input')" maxlength="30" :disabled="phoneDisabledEdit"></el-input>
            </el-form-item>
            <el-button v-show="phoneDisabledEdit" type="primary" @click="handleDialogOpen('phone')" style="width: 28%;padding: 12px 0;margin-left: 1%;">{{ $t('button.revise') }}</el-button>
          </div>
        </el-form-item>
        <el-form-item prop="vailCode" :label="$t('common.phoneCode')">
          <div class="flex-hb">
            <el-input v-model.trim="editForm.vailCode" :placeholder="$t('placeholder.input')" :disabled="phoneDisabledEdit" style="width: 70%"></el-input>
            <el-button v-show="phoneCodeShow" type="primary" @click="getPhoneCode('edit')" :disabled="phoneDisabledEdit" style="width: 28%;padding: 12px 0;">{{ $t('common.getVerCode') }}</el-button>
            <el-button v-show="!phoneCodeShow" type="info" disabled style="width: 28%;padding: 12px 0;">{{ phoneTime }}s</el-button>
          </div>
        </el-form-item>
        <el-form-item prop="emailAddr" :label="$t('common.email')">
          <!-- 兼容没有邮箱的旧数据 -->
          <div class="flex-hb">
            <el-input v-model.trim="editForm.emailAddr" :placeholder="$t('placeholder.input')" :disabled="emailDisabledEdit" maxlength="50" :style="{ width: emailDisabledEdit ? '70%' : '100%' }"></el-input>
            <el-button v-show="emailDisabledEdit" type="primary" @click="handleDialogOpen('email')" style="width: 28%;padding: 12px 0;margin-left: 1%;">{{ $t('button.revise') }}</el-button>
          </div>
        </el-form-item>
        <el-form-item prop="emailCode" :label="$t('common.emailCode')">
          <div class="flex-hb">
            <el-input v-model.trim="editForm.emailCode" :placeholder="$t('placeholder.input')" :disabled="emailDisabledEdit" maxlength="6" style="width: 70%"></el-input>
            <el-button v-show="emailCodeShow" type="primary" @click="getEmailCode('edit')" :disabled="emailDisabledEdit" style="width: 28%;padding: 12px 0;">{{ $t('common.getVerCode') }}</el-button>
            <el-button v-show="!emailCodeShow" type="info" disabled style="width: 28%;padding: 12px 0;">{{ emailTime }}s</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAddOrEdit('edit')">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 旧手机号码身份验证对话框 -->
    <el-dialog :title="$t('common.identityVer')" :visible.sync="phoneDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('phone')">
      <el-form ref="phoneForm" :model="phoneForm" :rules="phoneFormRules" label-width="140px" :validate-on-rule-change="false">
        <el-form-item :label="$t('common.oldPhone')" required>
          <div class="flex-hb">
            <el-form-item prop="phonePrefix" style="width: 34%;min-width:auto">
              <el-select v-model="phoneForm.phonePrefix" filterable :placeholder="$t('placeholder.select')" disabled>
                <el-option v-for="(item, index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <span>-</span>
            <el-form-item prop="phoneNumb" style="width: 62%;min-width:auto">
              <el-input v-model.trim="phoneForm.phoneNumb" :placeholder="$t('placeholder.input')" maxlength="30" disabled></el-input>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item prop="vailCode" :label="$t('common.phoneCode')">
          <div class="flex-hb">
            <el-input v-model.trim="phoneForm.vailCode" :placeholder="$t('placeholder.input')" style="width: 70%"></el-input>
            <el-button v-show="phoneCodeShowOld" type="primary" @click="getPhoneCode('phone','Old')" style="width: 28%;padding: 12px 0;">{{ $t('common.getVerCode') }}</el-button>
            <el-button v-show="!phoneCodeShowOld" type="info" disabled style="width: 28%;padding: 12px 0;">{{ phoneTime }}s</el-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="phoneDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleVerify('phone')">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 旧邮箱身份验证对话框 -->
    <el-dialog :title="$t('common.identityVer')" :visible.sync="emailDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('email')">
      <el-form ref="emailForm" :model="emailForm" :rules="emailFormRules" label-width="140px" :validate-on-rule-change="false">
        <el-form-item :label="$t('common.oldEmail')" required>
          <el-form-item prop="emailAddr" style="width:100%">
            <el-input v-model.trim="emailForm.emailAddr" :placeholder="$t('placeholder.input')" maxlength="50" disabled></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item prop="emailCode" :label="$t('common.emailCode')">
          <div class="flex-hb">
            <el-input v-model.trim="emailForm.emailCode" :placeholder="$t('placeholder.input')" style="width: 70%"></el-input>
            <el-button v-show="emailCodeShowOld" type="primary" @click="getEmailCode('email','Old')" style="width: 28%;padding: 12px 0;">{{ $t('common.getVerCode') }}</el-button>
            <el-button v-show="!emailCodeShowOld" type="info" disabled style="width: 28%;padding: 12px 0;">{{ emailTime }}s</el-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="emailDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleVerify('email')">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $utils from '@/utils'
import AES from '@/utils/aes'
export default {
  data() {
    return {
      // 查询表单数据
      queryForm: {},
      realQuery: {
        sortKey: '',
        sortValue: '',

        pageNumber: 1, // 当前页
        pageSize: 10, // 一页显示多少条
        type: 1 // 1.企业用户 2.业务用户
      }, // 当前表格的查询条件
      list: [],
      total: 0,
      selection: [],
      listLoading: false,
      currentRow: {}, // 当前高亮的行

      prefixOptions: [], // 号码前缀
      type: '', // 操作类型，如add/edit

      addDialogVisible: false,
      addForm: {
        realName: '',
        userName: '',
        password: '',
        passwordAgain: '',
        roleId: '',
        phonePrefix: '86',
        phoneNumb: '',
        emailCode: '',
        emailAddr: '',
        vailCode: '',

        status: 1 // 1新增 2编辑
      },

      editDialogVisible: false,
      editForm: {},

      phoneCodeShow: true,
      phoneTime: 60,
      phoneTimer: '',
      phoneDisabledEdit: true,
      phoneDialogVisible: false,
      phoneForm: {},
      phoneCodeShowOld: true, // 手机身份验证

      emailCodeShow: true,
      emailTime: 60,
      emailTimer: '',
      emailDisabledEdit: true,
      emailDialogVisible: false,
      emailForm: {},
      emailCodeShowOld: true, // 邮箱身份验证

      deleteDialogVisible: false,

      button: {}
    }
  },
  computed: {
    ...mapGetters(['language']),
    // 编辑/新增 表单验证
    addOrEditFormRules() {
      return {
        // userPic: [
        //   {
        //     required: true,
        //     trigger: 'change',
        //     message: this.$t('message.choosePhoto')
        //     // pattern: this.$utils.reg.name
        //   }
        // ],
        realName: [
          {
            required: true,
            trigger: 'blur',
            pattern: this.$utils.reg.name,
            message: this.$t('message.noEmpty')
          }
        ],
        userName: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              // console.log(this.$utils.reg.userName, value, this.$utils.reg.userName.test(value))
              if (this.$utils.reg.userName.test(value)) {
                // 验证成功后
                // 发送请求看是否重复
                if (this.type === 'edit') {
                  callback()
                } else {
                  this.$store.dispatch('isValueRepeat', { moduleVal: 'busiUser', value, callback })
                  // this.handleIsUserNameRepeat(value, callback)
                }
              } else {
                callback(new Error(this.$t('message.userName')))
              }
            }
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              var form = `${this.type}Form`
              var psdReg = this.$utils.reg.password
              // if (this.type === 'edit') {
              //   if (value === this.detailsForm.password) {
              //     callback()
              //     this.$refs[form].validateField('passwordAgain')
              //   }
              // }
              // console.log(value)
              // console.log(psdReg.test(value))
              if (!psdReg.test(value)) {
                callback(new Error(this.$t('message.inputPassword')))
              } else {
                if (this[form].passwordAgain !== '') {
                  this.$refs[form].validateField('passwordAgain')
                }
                callback()
              }
            }
          }
        ],
        passwordAgain: [
          {
            required: true,
            trigger: 'blur',
            // pattern: this.$utils.reg.password,
            validator: (rule, value, callback) => {
              var form = `${this.type}Form`
              var psdReg = this.$utils.reg.password
              // if (this.type === 'edit') {
              //   if (value === this[form].password && value === this.detailsForm.password) {
              //     callback()
              //   }
              // }
              if (!psdReg.test(value)) {
                callback(new Error(this.$t('message.inputPassword')))
              } else if (value !== this[form].password) {
                callback(new Error(this.$t('message.psdNotSame')))
              } else {
                callback()
              }
            }
          }
        ],
        phonePrefix: [{
          required: true,
          trigger: 'change',
          message: this.$t('message.select'),
          validator: (rule, value, callback) => {
            var form = `${this.type}Form`
            // console.log(form)
            if (value) {
              if (this.$utils.reg.phoneNoA.test(this[form].phoneNumb)) {
                this.$refs[form].validateField('phoneNumb')
              }
              callback()
            } else {
              callback(new Error(this.$t('message.select')))
            }
          }
        }],
        phoneNumb: [{
          required: true,
          trigger: 'blur',
          // pattern: this.$utils.reg.phoneNoA,
          // message: this.$t('message.inputRight'),
          validator: (rule, value, callback) => {
            var form = `${this.type}Form`
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
              let reg = (this[form].phonePrefix === '86' && !phoneNORegC.test(value)) ||
                (this[form].phonePrefix === '886' && !phoneNORegC1.test(value))
              if (reg) {
                callback(new Error(this.$t('message.inputRight')))
              } else {
                callback()
              }
            }
          }
        }],
        vailCode: [{
          required: true,
          trigger: 'blur',
          message: this.$t('message.input'),
          validator: (rule, value, callback) => {
            if ((this.type !== 'edit' || !this.phoneDisabledEdit) && value.trim().length === 0) {
              callback(new Error(this.$t('message.input')))
            } else {
              callback()
            }
          }
        }],
        roleId: [{
          required: true,
          trigger: 'change',
          message: this.$t('message.select')
        }],
        emailAddr: [{
          required: true,
          trigger: 'blur',
          pattern: this.$utils.reg.email,
          message: this.$t('message.inputRight')
        }],
        emailCode: [{
          required: true,
          trigger: 'blur',
          message: this.$t('message.input'),
          validator: (rule, value, callback) => {
            if ((this.type !== 'edit' || !this.emailDisabledEdit) && value.trim().length === 0) {
              callback(new Error(this.$t('message.input')))
            } else {
              callback()
            }
          }
        }]
      }
    },
    phoneFormRules() {
      return {
        vailCode: [{ required: true, trigger: 'blur', message: this.$t('message.input') }]
      }
    },
    emailFormRules() {
      return {
        emailCode: [{ required: true, trigger: 'blur', message: this.$t('message.input') }]
      }
    }
  },
  watch: {
    language: {
      handler: function (newLang, oldLang) {
        if (newLang === 'cn') {
          this.prefixOptions = this.$utils.formatPrefixCN()
        } else if (newLang === 'en') {
          this.prefixOptions = this.$utils.formatPrefixEN()
        }
      },
      immediate: true
    },
    // 修改最后一页删除的bug
    total() {
      if (
        this.total ===
        (this.realQuery.pageNumber - 1) * this.realQuery.pageSize &&
        this.total !== 0
      ) {
        this.realQuery.pageNumber -= 1
        this.getList() // 获取列表数据
      }
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
    // type 1.企业用户 2.业务用户
    getList() {
      this.listLoading = true
      this.$http.posts('userList', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          this.list = list.map((item, index) => {
            return {
              ...item,
              type: '业务账号'
            }
          })
        })
        .catch(er => {
          this.listLoading = false
          this.list = []
          this.total = 0
        })
    },
    // 获取短信验证码
    getPhoneCode(type, showType = '') {
      // type 'add' 'edit' 'phone'
      // showType ''新增/编辑  'Old'身份核验
      this.$refs[`${type}Form`].validateField('phoneNumb', errorMessage => {
        if (!errorMessage) { // 验证通过
          clearInterval(this.phoneTimer)
          this.phoneTime = 60
          this[`phoneCodeShow${showType}`] = false
          this.phoneTimer = setInterval(() => {
            this.phoneTime--
            if (this.phoneTime <= 0) {
              this[`phoneCodeShow${showType}`] = true
              clearInterval(this.phoneTimer)
              // this.phoneTime = 60
            }
          }, 1000)
          this.$http.posts('getCodeAuth', '', { phoneNumb: this[`${type}Form`].phonePrefix + '+' + this[`${type}Form`].phoneNumb })
            .then(res => { })
            .catch(er => {
              this[`phoneCodeShow${showType}`] = true
              clearInterval(this.phoneTimer)
              // this.phoneTime = 60
            })
        }
      })
    },
    // 获取邮箱验证码
    getEmailCode(type, showType = '') {
      // type 'add' 'edit' 'email'
      // showType ''新增/编辑  'Old'身份核验
      this.$refs[`${type}Form`].validateField('emailAddr', errorMessage => {
        if (!errorMessage) { // 验证通过
          clearInterval(this.emailTimer)
          this.emailTime = 60
          this[`emailCodeShow${showType}`] = false
          this.emailTimer = setInterval(() => {
            this.emailTime--
            if (this.emailTime <= 0) {
              this[`emailCodeShow${showType}`] = true
              clearInterval(this.emailTimer)
            }
          }, 1000)
          this.$http.posts('newSendEmail', '', { emailAddr: this[`${type}Form`].emailAddr })
            .then(res => { })
            .catch(er => {
              this[`emailCodeShow${showType}`] = true
              clearInterval(this.emailTimer)
            })
        }
      })
    },
    // 查询表单提交
    // handleQuery (type) {
    //   this.$refs.queryForm.validate(valid => {
    //     if (valid) {
    //       this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
    //       var realQuery = this.realQuery
    //       this.getList(type)
    //     } else {
    //       // console.log('error 验证错误query!!')
    //       return false
    //     }
    //   })
    // },
    // 多选选中
    handleSelectionChange(val) {
      this.selection = val
    },
    // 一页显示多少条
    handleSizeChange(val) {
      this.realQuery.pageSize = val
      this.getList()
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.realQuery.pageNumber = val
      this.getList()
    },
    // 排序
    handleSortChange(data) {
      // let sortValue, sortKey
      // console.log(data)
      if (data.order === 'ascending') {
        this.realQuery.sortValue = 'asc'
      } else if (data.order === 'descending') {
        this.realQuery.sortValue = 'desc'
      } else {
        this.realQuery.sortValue = ''
        this.realQuery.sortKey = ''
        // this.listParams = { ...this.paging, type: 2 }
        this.getList()
        return false
      }
      this.realQuery.sortKey = data.prop
      if (data.prop === 'type') {
        this.realQuery.sortKey = ''
      }
      this.getList()
    },
    // 新增/修改/详情/删除对话框打开
    handleDialogOpen(type, row) {
      if (type !== 'phone' && type !== 'email') {
        this.type = type
      }
      if (type === 'add') {
      } else if (type === 'edit') {
        // console.log(row)
        var password = +new Date() + parseInt(Math.random() * (9999999999 + 1)).toString()
        var phone = this.$utils.splitPhone(row.showPhone)
        let { phonePrefix, phoneNumb } = phone
        this.editForm = {
          ...row,
          password,
          passwordAgain: password,
          isChangePsd: false,
          phonePrefix,
          phoneNumb,
          vailCode: '',
          emailCode: '',
          status: 2
        }
        this.currentRow = { ...this.editForm }
        this.phoneDisabledEdit = !!this.editForm.phoneNumb
        this.emailDisabledEdit = !!this.editForm.emailAddr // 兼容没有邮箱的旧数据不验证，有就验证
        this.$nextTick(() => {
          // 应该放这里，在closed关闭时，上面form值改变，change的会触发验证，blur的不会
          this.$refs.editForm.clearValidate()
        })
      } else if (type === 'phone') {
        let { phonePrefix, phoneNumb } = this.currentRow
        this.phoneForm = { phonePrefix, phoneNumb, vailCode: '' }
      } else if (type === 'email') {
        let { emailAddr } = this.currentRow
        this.emailForm = { emailAddr, emailCode: '' }
      }
      this[`${type}DialogVisible`] = true
    },
    // 新增/编辑
    handleAddOrEdit: $utils.debounce(function (type) {
      this.$refs[`${type}Form`].validate(async valid => {
        if (valid) {
          var form = { ...this[`${type}Form`] }
          if (form.phoneNumb) { form.phoneNumb = form.phonePrefix + '+' + form.phoneNumb }
          delete form.roleList
          delete form.roleName
          delete form.phonePrefix
          // console.log(form)
          if (type !== 'edit' || form.password !== this.currentRow.password) {
            if (type === 'edit') { form.isChangePsd = true }
            form.password = AES.encrypt(form.userName + form.password, this.$api.AES_KEY)
            form.passwordAgain = AES.encrypt(form.userName + form.passwordAgain, this.$api.AES_KEY)
          }
          // 只修改用户名，把原用户名传给后台，用于密码重新加密
          if (type === 'edit' && this.currentRow.userName !== form.userName) {
            form.oldUserName = this.currentRow.userName
          }
          this.$http.posts('addOrUpdate', '', form, true)
            .then(res => {
              this.getList()
              this[`${type}DialogVisible`] = false
            })
            .catch(er => {
              console.log(er)
              this.phoneCodeShow = true
              clearInterval(this.phoneTimer)
              this.emailCodeShow = true
              clearInterval(this.emailTimer)
            })
        }
      })
    }),
    // 旧手机/旧邮箱身份核验
    handleVerify: $utils.debounce(function (type) {
      // type 'phone' 'email'
      this.$refs[`${type}Form`].validate(valid => {
        if (valid) {
          var params
          let { phonePrefix, phoneNumb, vailCode, emailAddr, emailCode } = this[`${type}Form`]
          if (type === 'phone') {
            params = { verifyAddr: [`${phonePrefix}+${phoneNumb}`], verifyCode: vailCode, status: 1 } // status 1手机号 2邮箱
          } else {
            params = { verifyAddr: emailAddr, verifyCode: emailCode, status: 2 }
          }
          // console.log('params', params)
          this.$http.posts('newCodeVerify', '', params).then(res => {
            this[`${type}DialogVisible`] = false
            clearInterval(this[`${type}Timer`]) // 关闭对话框也会清，双控
            this[`${type}DisabledEdit`] = false // 解禁，可修改
          })
        } else {
          // console.log('error 验证错误query!!')
          return false
        }
      })
    }),
    // 点击新增/修改/详情/删除对话框关闭,重置表单
    handleDialogClose(type) {
      if (type === 'add') {
        this.$refs.addForm.resetFields()

        this.phoneCodeShow = true
        clearInterval(this.phoneTimer)
        // this.phoneTime = 60 在显示倒数按钮的时候重置了，可不写
        this.emailCodeShow = true
        clearInterval(this.emailTimer)
      } else if (type === 'edit') {
        this.photoFile = ''
        this.editRightsOptions = []

        this.phoneCodeShow = true
        clearInterval(this.phoneTimer)
        this.phoneDisabledEdit = true
        this.emailCodeShow = true
        clearInterval(this.emailTimer)
        this.emailDisabledEdit = true
      } else if (type === 'phone') {
        this.$refs.phoneForm.resetFields()
        this.phoneCodeShowOld = true
        clearInterval(this.phoneTimer)
      } else if (type === 'email') {
        this.$refs.emailForm.resetFields()
        this.emailCodeShowOld = true
        clearInterval(this.emailTimer)
      }
    }
  }
}
</script>

<style lang="less">
#userAccount {
  .result {
    margin-bottom: 27px;
  }
}
</style>
