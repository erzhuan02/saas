<template>
  <div id="classification">
    <!-- 操作 -->
    <div class="CRUD">
      <el-button type="primary" icon="el-icon-plus" @click="handleDialogOpen('add')">{{ $t('button.add') }}</el-button>
      <el-button type="primary" icon="el-icon-delete" @click="handleDialogOpen('delete')" :disabled="selection.length === 0">{{ $t('button.delete') }}</el-button>
    </div>
    <!-- 表格 -->
    <div class="result clearfix" v-loading="listLoading">
      <el-table class="overflowTable" ref="table" stripe border max-height="565" :data="list" @selection-change="handleSelectionChange" highlight-current-row>
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column prop="no" width="80" :label="$t('common.no')"></el-table-column>
        <el-table-column prop="categoryName" :label="$t('industry.industryName')" min-width="150"></el-table-column>
        <el-table-column prop="createTime" :label="$t('account.createTime')"></el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleDialogOpen('edit', scope.row)" plain>{{ $t('button.edit') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">
        {{ $t('common.currentPage') }} {{ list.length }}
        {{ $t('common.unit') }}
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <!-- 新增&编辑对话框 -->
    <el-dialog :title="type === 'add' ? $t('button.add') : $t('button.edit')" :visible.sync="addDialogVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="150px" :rules="addOrEditFormRules" ref="addForm" :validate-on-rule-change="false">
        <el-form-item :label="$t('industry.industryName')" prop="categoryName">
          <el-input v-model.trim="addForm.categoryName" :placeholder="$t('placeholder.input')" maxlength="20" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAddOrEdit">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog :title="$t('button.delete')" :visible.sync="deleteDialogVisible" :close-on-click-modal="false">
      <span>{{ $t('industry.delIndustry') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleDelete">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询表单数据
      queryForm: {},
      realQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      }, // 当前表格的查询条件
      list: [],
      total: 0,
      selection: [],
      listLoading: false,

      type: '', // 操作类型，如add/edit
      addDialogVisible: false,
      addForm: {
        categoryName: '',
        type: 1 // 1新增 2编辑
      },
      id: '', // 行业id

      editData: {},

      deleteDialogVisible: false,
      deleteForm: {
        roleName: '',
        userName: ''
      },

      button: {}
    }
  },
  computed: {
    addOrEditFormRules() {
      return {
        categoryName: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (this.$utils.reg.searchName2.test(value)) {
                // 验证成功后 发送请求看是否重复
                this.isValueRepeat(value, callback)
              } else {
                callback(new Error(this.$t('message.noSpecial2')))
              }
            }
          }
        ]
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
    this.getList()
    this.$utils.getButton(this.$route.path, 1).then(res => {
      this.button = res
    })
  },
  mounted() { },
  methods: {
    getList() {
      this.listLoading = true
      this.$http.posts('categoryListPage', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          let roleList = data.list || []
          this.total = data.total || 0
          this.list = roleList.map((item, index) => {
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
    isValueRepeat(categoryName, callback) {
      let params = { categoryName }
      if (this.type === 'edit') params.id = this.editData.id
      this.$http.posts('categoryNameRepeat', '', params, { showSuccessMsg: false, showErrorMsg: false })
        .then(res => {
          callback && callback()
        })
        .catch(res => {
          console.log(res)
          if (typeof res === 'object') {
            let errMsg
            if (res.resMsg.startsWith('S')) errMsg = this.$t(`code.${res.resMsg}`)
            else errMsg = res.resMsg
            callback && callback(new Error(errMsg))
          } else {
            callback && callback()
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
      this.type = type
      if (type === 'add' || type === 'edit') {
        this.addDialogVisible = true
      } else {
        this.deleteDialogVisible = true
      }
      if (type === 'add') {
        this.$nextTick(() => {
          this.$refs.addForm.resetFields()
          this.$refs.addForm.clearValidate()
        })
      } else if (type === 'edit') {
        this.$nextTick(() => {
          this.$refs.addForm.clearValidate()
          this.editData = Object.assign({}, row)
          this.addForm.categoryName = this.editData.categoryName
        })
        this.id = row.id
      }
    },
    // 新增/编辑
    handleAddOrEdit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          var params = { ...this.addForm }
          params.type = this.type === 'add' ? 1 : 2
          if (params.type === 2) {
            params.id = this.id
          }
          this.$http.posts('saveOrUpdateIndustry', params, '', true)
            .then(res => {
              this.getList()
              this.addDialogVisible = false
            })
        }
      })
    },
    // 删除角色
    handleDelete() {
      let ids = this.selection.map(item => item.id).join()
      this.$http.posts('delCategoryIds', '', { ids }, true)
        .then(res => {
          this.getList()
        })
      this.deleteDialogVisible = false
    }
  }
}
</script>
