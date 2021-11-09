<template>
  <div id="receiver">
    <!-- 操作 -->
    <div class="CRUD">
      <el-button v-if="button.add" type="primary" icon="el-icon-plus" @click="handleDialogOpen('add')">{{ $t('button.add') }}</el-button>
    </div>
    <!-- 表格 -->
    <div class="result clearfix" v-loading="listLoading">
      <el-table ref="table" stripe border max-height="680" :data="list" highlight-current-row>
        <!-- <el-table-column type="selection" :selectable="handleSelectable"></el-table-column> @selection-change="handleSelectionChange" @sort-change="handleSortChange" -->
        <el-table-column prop="no" width="80" :label="$t('common.no')"></el-table-column>
        <el-table-column prop="revrName" :label="$t('regis.userName')"></el-table-column>
        <el-table-column prop="remark" :label="$t('account.remark')" min-width="150"></el-table-column>
        <el-table-column prop="phoneNumb" :label="$t('regis.phone')" min-width="150"></el-table-column>
        <el-table-column prop="email" :label="$t('account.email')" min-width="150"></el-table-column>
        <el-table-column prop="createTime" :label="$t('account.createTime')" min-width="150"></el-table-column>
        <el-table-column prop="operation" :label="$t('common.operation')" min-width="150">
          <template slot-scope="scope">
            <el-button v-if="button.edit" size="mini" type="primary" icon="el-icon-edit" @click="handleDialogOpen('edit', scope.row)" plain>{{ $t('button.edit') }}</el-button>
            <el-button v-if="button.delete" size="mini" type="primary" icon="el-icon-delete" @click="handleDialogOpen('delete', scope.row)" plain>{{ $t('button.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">
        {{ $t('common.currentPage') }} {{ list.length }}
        {{ $t('common.unit') }}
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <!-- 新增对话框 -->
    <el-dialog :title="$t('button.add')" :visible.sync="addDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('add')">
      <el-form :model="addForm" ref="addForm" :rules="addOrEditFormRules" label-width="150px">
        <el-form-item :label="$t('regis.userName')" prop="revrName">
          <el-input v-model.trim="addForm.revrName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('account.remark')" prop="remark">
          <el-input v-model.trim="addForm.remark" :placeholder="$t('placeholder.input')" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item :label="$t('msgCenter.receiveCellPhone')" required>
          <el-col :span="9">
            <el-form-item prop="phonePrefix" style="width: 100%;min-width:auto">
              <el-select v-model="addForm.phonePrefix" filterable :placeholder="$t('placeholder.select')" style="width: 100%;">
                <el-option v-for="(item, index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1" style="text-align:center">-</el-col>
          <el-col :span="14">
            <el-form-item prop="phoneNumb" style="width: 100%;min-width:auto">
              <el-input v-model.trim="addForm.phoneNumb" :placeholder="$t('placeholder.input')" type="number" maxlength="30" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('msgCenter.receiveYourEmail')" prop="email">
          <el-input v-model.trim="addForm.email" :placeholder="$t('placeholder.input')" maxlength="50"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAddOrEdit('add')" :disabled="addDisabled">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog :title="$t('button.edit')" :visible.sync="editDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('edit')">
      <el-form :model="editForm" ref="editForm" :rules="addOrEditFormRules" label-width="150px">
        <el-form-item :label="$t('regis.userName')" prop="revrName">
          <el-input v-model.trim="editForm.revrName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('account.remark')">
          <el-input v-model.trim="editForm.remark" :placeholder="$t('placeholder.input')" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item :label="$t('msgCenter.receiveCellPhone')" required>
          <el-col :span="9">
            <el-form-item prop="phonePrefix" style="width: 100%;min-width:auto">
              <el-select v-model="editForm.phonePrefix" filterable :placeholder="$t('placeholder.select')" style="width: 100%;">
                <el-option v-for="(item, index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1" style="text-align:center">-</el-col>
          <el-col :span="14">
            <el-form-item prop="phoneNumb" style="width: 100%;min-width:auto">
              <el-input v-model.trim="editForm.phoneNumb" :placeholder="$t('placeholder.input')" type="number" maxlength="30" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('msgCenter.receiveYourEmail')" prop="email">
          <el-input v-model.trim="editForm.email" :placeholder="$t('placeholder.input')" maxlength="50"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAddOrEdit('edit')" :disabled="editDisabled">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog :title="$t('button.delete')" :visible.sync="deleteDialogVisible" :close-on-click-modal="false">
      <div class="deleteInfo">
        <i class="el-icon-warning"></i>
        <span>{{ $t('message.isDelete1') }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleDelete">{{ $t('button.confirm') }}</el-button>
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
      // 查询表单数据
      // queryForm: {
      // },
      realQuery: {
        // sortKey: '',
        // sortValue: '',

        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      }, // 当前表格的查询条件
      list: [],
      total: 0,
      selection: [],
      listLoading: false,

      type: '', // 操作类型，如add/edit
      prefixOptions: [], // 号码前缀

      addDialogVisible: false,
      addForm: {
        revrName: '',
        remark: '',
        phoneNumb: '',
        email: '',
        phonePrefix: '86',

        type: '1' // '1'新增 '2'编辑
      },
      addDisabled: false,

      editDialogVisible: false,
      editForm: {},
      editDisabled: false,

      deleteDialogVisible: false,
      deleteForm: {},

      button: {}
    }
  },
  computed: {
    ...mapGetters(['language']),
    // 新增/编辑验证规则
    addOrEditFormRules() {
      const rules = {
        revrName: [
          {
            required: true,
            trigger: 'blur',
            pattern: this.$utils.reg.userName,
            message: this.$t('message.userName')
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
        phoneNumb: [
          {
            required: true,
            trigger: 'blur',
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
          }
        ],
        email: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('message.inputRight'),
            pattern: this.$utils.reg.email
          }
        ]
      }
      return rules
    }
  },
  watch: {
    language: {
      handler: function (newLang, oldLang) {
        // console.log(newLang, oldLang, this)
        // 获取button权限
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
    getList() {
      this.listLoading = true
      this.$http.posts('coReceiverPage', this.realQuery)
        .then(res => {
          this.listLoading = false
          // if (res.data.resCode === 0) {
          // let data = res.data.data
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          this.list = list.map((item, index) => {
            // var roleTreeFlat = item.tree && this.$utils.flatObjArr(item.tree)
            // // console.log(roleTreeFlat)
            // var labels = []
            // var ids = []
            // roleTreeFlat && roleTreeFlat.forEach((flatItem) => {
            //   ids.push(flatItem.id)
            //   labels.push(flatItem.label)
            // })
            // var roleLabels = labels.join()
            // // var juris = JSON.stringify({
            // //   authIds: ids,
            // //   authNames: labels
            // // })
            return {
              no:
                this.realQuery.pageSize * (this.realQuery.pageNumber - 1) +
                (index + 1),
              ...item,
              showPhone: item.phoneNumb,
              phoneNumb: item.phoneNumb && this.$utils.exchangePrefix(item.phoneNumb)
            }
          })
          // } else {
          //   this.list = []
          //   this.total = 0
          //   this.$utils.$message({
          //     message: res.data.resMsg,
          //     type: 'error'
          //   })
          // }
        })
        .catch(er => {
          this.listLoading = false
          this.list = []
          this.total = 0
        })
    },
    // // 多选选中
    // handleSelectionChange(val) {
    //   this.selection = val
    // },
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
    // // 排序
    // handleSortChange(data) {
    //   // console.log(data)
    //   if (data.order === 'ascending') {
    //     this.realQuery.sortValue = 'asc'
    //   } else if (data.order === 'descending') {
    //     this.realQuery.sortValue = 'desc'
    //   } else {
    //     this.realQuery.sortValue = null
    //   }
    //   this.realQuery.sortKey = data.prop
    //   this.getList()
    // },
    // 新增/修改/详情/删除对话框打开
    handleDialogOpen(type, row) {
      this.type = type
      if (type === 'add') {
      } else if (type === 'edit') {
        this.editForm = { ...row, phonePrefix: '' }
        var phone = row.showPhone && this.$utils.splitPhone(row.showPhone)
        this.editForm.phoneNumb = phone && phone.phoneNumb
        this.editForm.phonePrefix = phone && phone.phonePrefix
        this.$nextTick(() => {
          this.$refs.editForm.clearValidate()
        })
        this.editForm.type = '2'
      } else if (type === 'delete') {
        this.deleteForm = { ...row }
      }
      this[`${type}DialogVisible`] = true
    },
    // 新增/编辑
    handleAddOrEdit: $utils.debounce(function (type) {
      this.$refs[`${type}Form`].validate(valid => {
        if (valid) {
          var form = { ...this[`${type}Form`] }
          this[`${type}Disabled`] = true
          setTimeout(() => {
            this[`${type}Disabled`] = false
          }, 1000)
          if (form.phoneNumb) {
            form.phoneNumb = form.phonePrefix + '+' + form.phoneNumb
          }
          this.$http.posts('saveOrUpdate', form, '', true)
            .then((res) => {
              this.getList()
            })
          this[`${type}DialogVisible`] = false
        }
      })
    }),
    // 删除
    handleDelete: $utils.debounce(function () {
      var rcvrId = this.deleteForm.rcvrId
      this.$http
        .posts('updateStatus', '', { rcvrId }, true)
        .then(res => {
          // console.log(res)
          // if (res.data.resCode === 0) {
          // this.$message.success(this.$t('message.submitSuccess'))
          this.getList()
          // } else {
          //   this.$utils.$message({
          //     message: res.data.resMsg,
          //     type: 'error'
          //   })
          // }
        })
      // .catch(er => {
      //   // console.log(er.response.data.resMsg)
      //   console.log(er)
      // })
      this.deleteDialogVisible = false
    }),
    // 新增/修改/详情/删除对话框关闭,重置表单
    handleDialogClose(type) {
      if (type === 'add') {
        this.$refs.addForm.resetFields()
      } else if (type === 'edit') {
      } else if (type === 'details') {
      }
    }
  }
}
</script>

<style lang="less">
#receiver {
}
</style>
