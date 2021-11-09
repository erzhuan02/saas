<template>
  <div id="dingding">
    <!-- 查询 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
        <el-form-item prop="companyId" :label="$t('common.companyId')">
          <el-input v-model.trim="queryForm.companyId" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item prop="companyName" :label="$t('common.customerName')">
          <el-input v-model="queryForm.companyName" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作 -->
    <div class="CRUD">
      <el-button v-if="button.addDing" type="primary" icon="el-icon-plus" @click="handleDialogOpen('add')">{{ $t('button.add') }}</el-button>
      <el-button v-if="button.deleteDing" type="primary" icon="el-icon-delete" @click="handleDialogOpen('delete')" :disabled="selection.length === 0">{{ $t('button.delete') }}</el-button>
    </div>
    <!-- 表格 -->
    <div class="result clearfix" v-loading="listLoading">
      <div class="caption">{{ $t('dingding.list1') }}</div>
      <el-table ref="table" stripe border max-height="565" :data="list" @selection-change="handleSelectionChange" highlight-current-row>
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column prop="no" width="120" :label="$t('common.no')"></el-table-column>
        <el-table-column prop="companyId" :label="$t('common.companyId')"></el-table-column>
        <el-table-column prop="companyName" :label="$t('common.customerName')" min-width="100"></el-table-column>
        <el-table-column prop="dingdingServer" :label="$t('dingding.serverAddress')" min-width="100"></el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="scope">
            <el-button v-if="button.editDing" size="mini" type="primary" icon="el-icon-edit" @click="handleDialogOpen('edit', scope.row)" plain>{{ $t('button.edit') }}</el-button>
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
      <el-form :model="addForm" ref="addForm" label-width="150px" :rules="addOrEditFormRules" :validate-on-rule-change="false">
        <el-form-item :label="$t('common.companyId')" prop="companyId">
          <el-input v-model.trim="addForm.companyId" :placeholder="$t('placeholder.input')" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item :label="$t('dingding.serverURL')" prop="dingdingServer">
          <el-input v-model.trim="addForm.dingdingServer" :placeholder="$t('placeholder.input')" maxlength="128"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAddOrEdit('add')" :disabled="buttonDisabled">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog :title="$t('button.edit')" :visible.sync="editDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('edit')">
      <el-form :model="editForm" ref="editForm" label-width="150px" :rules="addOrEditFormRules" :validate-on-rule-change="false">
        <el-form-item :label="$t('common.companyId')" prop="companyId">
          <el-input v-model.trim="editForm.companyId" :placeholder="$t('placeholder.input')" maxlength="30" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.companyName1')" prop="companyId">
          <el-input v-model="editForm.companyName" :placeholder="$t('placeholder.input')" maxlength="128" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('dingding.serverURL')" prop="dingdingServer">
          <el-input v-model.trim="editForm.dingdingServer" :placeholder="$t('placeholder.input')" maxlength="128"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAddOrEdit('edit')" :disabled="buttonDisabled">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog :title="$t('button.delete')" :visible.sync="deleteDialogVisible" :close-on-click-modal="false">
      <div class="deleteInfo"><i class="el-icon-warning"></i><span>{{ $t('message.isDelete1') }}</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleDelete" :disabled="buttonDisabled">{{ $t('button.confirm') }}</el-button>
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
      queryForm: {
        companyId: '',
        companyName: ''
      },
      realQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      }, // 实际的查询条件
      list: [],
      total: 0,
      selection: [],
      listLoading: false,

      type: '', // 操作类型，如add/edit
      buttonDisabled: false, // 新增/删除/编辑 确定按钮

      addDialogVisible: false,
      addForm: {
        companyId: '',
        dingdingServer: '',
        type: 1,
        opType: 1
      },

      editDialogVisible: false,
      editForm: {},

      deleteDialogVisible: false,
      deleteForm: {},

      button: {}
    }
  },
  computed: {
    ...mapGetters(['language']),
    // 查询验证规则
    queryFormRules() {
      return {
        companyId: [{
          trigger: 'change',
          pattern: this.$utils.reg.companyId,
          message: this.$t('message.inputRight')
        }],
        companyName: [
          {
            // required: true,
            trigger: 'change',
            pattern: this.$utils.reg.companyName,
            validator: this.$utils.validator.common
          }
        ]
      }
    },
    // 编辑/新增 表单验证
    addOrEditFormRules() {
      return {
        companyId: [{
          required: true,
          trigger: 'blur',
          pattern: this.$utils.reg.companyId,
          message: this.$t('message.inputRight')
        }],
        dingdingServer: [{
          required: true,
          trigger: 'blur',
          pattern: this.$utils.reg.ip,
          message: this.$t('message.inputRight')
        }]
      }
    }
  },
  watch: {
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
    this.init()
  },
  mounted() { },
  methods: {
    // 进页面就发的请求
    init() {
      this.$utils.getButton(this.$route.path, 1).then(res => {
        this.button = res
      })// 获取按钮权限
      this.getList()// 获取数据列表
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      this.$http.posts('dingList', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          this.list = list.map((item, index) => {
            return {
              no: this.realQuery.pageSize * (this.realQuery.pageNumber - 1) + (index + 1),
              ...item
            }
          })
        })
        .catch(er => {
          this.listLoading = false
          this.list = []
          this.total = 0
        })
    },
    // 查询表单提交
    handleQuery() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
          this.getList()
        } else {
          return false
        }
      })
    },
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
    // 新增/修改/详情/删除对话框打开
    handleDialogOpen(type, row) {
      if (type === 'add') {
      } else if (type === 'edit') {
        this.editForm = { ...row, type: 1, opType: 2 }
        this.$nextTick(() => {
          // 应该放这里，在closed关闭时，上面form值改变，change的会触发验证，blur的不会
          this.$refs.editForm.clearValidate()
        })
      } else if (type === 'details') {
      } else if (type === 'delete') {
      }
      this[`${type}DialogVisible`] = true
    },
    // 新增/编辑
    handleAddOrEdit(type) {
      this.$refs[`${type}Form`].validate(async valid => {
        if (valid) {
          var form = { ...this[`${type}Form`] }
          if (type === 'add') {
          } else if (type === 'edit') {
            // 修改
          }
          this.$utils.disabledButton(this)
          this.$http.posts('addOrEditDing', form, '', true)
            .then(res => {
              this[`${type}DialogVisible`] = false
              this.getList()
            })
        }
      })
    },
    // 删除
    // handleDelete: $utils.debounce(function () {
    //   let ids = this.selection.map(item => item.shopUuid).join()
    //   this.$http.posts('deleteDing', { companyId: ids }, '', true)
    //     .then(res => {
    //       this.getList()
    //     })
    //   this.deleteDialogVisible = false
    // }),
    handleDelete() {
      let ids = this.selection.map(item => item.companyId).join()
      this.$utils.disabledButton(this)
      this.$http.posts('deleteDing', '', { companyId: ids }, true)
        .then(res => {
          this.getList()
        })
      this.deleteDialogVisible = false
    },
    // 新增/修改/详情/删除对话框关闭,重置表单
    handleDialogClose(type) {
      this.buttonDisabled = false // 双控
      if (type === 'add') {
        this.$refs.addForm.resetFields()
      } else if (type === 'edit') {
      }
    }
  }
}
</script>
