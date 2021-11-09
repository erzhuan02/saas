<template>
  <div id="positionMange">
    <!-- function button -->
    <div class="CRUD">
      <el-button type="primary" icon="el-icon-plus" @click="showDialog('add', 1)">{{ $t('positionMange.newPosition') }}</el-button>
      <el-button type="primary" icon="el-icon-delete" @click="showDialog('delete')" :disabled="canDelete">{{ $t('positionMange.deletePosition') }}</el-button>
    </div>
    <!-- 查询结果 -->
    <div class="result clearfix" v-loading="listLoading">
      <el-table ref="table" stripe border max-height="595" :data="list" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column type="index" :label="$t('common.no')" width="180" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
        <el-table-column prop="positionName" :label="$t('positionMange.positionName')"></el-table-column>
        <el-table-column :label="$t('positionMange.orgLevel')">
          <template slot-scope="scope">
            <span>{{ scope.row.positionLevel + $t('common.level') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('positionMange.addTime')"></el-table-column>
        <el-table-column :label="$t('common.operation')" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="showDialog('add', 0, scope.row)">{{ $t('button.edit') }}</el-button>
            <!-- <el-button size="mini" type="primary" plain @click="showDialog('details')">{{ $t('button.details') }}</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">{{ $t('common.currentPage') }} {{list.length}} {{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background>
      </el-pagination>
    </div>
    <!-- 新增、编辑对话框 -->
    <el-dialog :title="type === 'add' ? $t('button.add') : $t('button.edit')" :visible.sync="addDialogVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="150px" :rules="addOrEditFormRules" ref="addForm" :validate-on-rule-change="false">
        <el-form-item :label="$t('positionMange.positionName')" prop="positionName">
          <el-input v-model="addForm.positionName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('positionMange.orgLevel')" prop="positionLevel">
          <el-select v-model="addForm.positionLevel" :placeholder="$t('placeholder.select')">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="addSure('addForm')">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog :title="$t('button.delete')" :visible.sync="deleteDialogVisible" :close-on-click-modal="false" @close="closeDelete">
      {{ isUser ? $t('positionMange.deleteDialog') : $t('positionMange.deleteDialog1') }}
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleDialogClose('delete')">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $utils from '@/utils'
export default {
  data() {
    return {
      params: {},
      // 实际查询数据
      realQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      list: [],
      total: 0,
      listLoading: false,
      addForm: {
        positionName: '', // 门店名称
        positionLevel: ''
        // orgId: [] // 组织架构层级
      },
      addDialogVisible: false,
      deleteDialogVisible: false,
      multSelection: [],
      canDelete: true,
      options: [],
      type: '',
      isUser: false // 职位下是否有用户
    }
  },
  computed: {
    ...mapGetters(['busiOrgTree']),
    addOrEditFormRules() {
      return {
        positionName: [{
          required: true,
          trigger: 'blur',
          pattern: this.$utils.reg.name,
          message: this.$t('message.noEmpty')
        }],
        positionLevel: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error(this.$t('common.noEmpty')))
            }
            callback()
          }
        }]
      }
    }
  },
  watch: {
    multSelection(val) {
      if (val.length > 0) {
        this.canDelete = false
      } else {
        this.canDelete = true
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取数据列表
    getList() {
      this.listLoading = true
      this.$http.posts('positionList', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          this.list = list
        })
        .catch(er => {
          this.listLoading = false
          this.list = []
          this.total = 0
        })
    },
    // 新增/编辑/详情/删除 打开对话框
    showDialog(type, isAdd, row) {
      if (type === 'add') {
        this.$http.posts('positionLevel')
          .then(res => {
            let data = res.data
            this.options = []
            for (var i = 0; i < data; i++) {
              this.options.push({
                label: i + 1 + this.$t('common.level'),
                value: i + 1
              })
            }
          })
        if (isAdd) { // 新增
          this.type = 'add'
          this.addForm.positionName = ''
          this.addForm.positionLevel = ''
          this.$nextTick((item) => {
            this.$refs.addForm.clearValidate()
          })
        } else { // 编辑
          this.type = 'edit'
          var { positionName, positionLevel, positionId } = row
          this.addForm = {
            positionName,
            positionLevel,
            positionId
          }
        }
      } else if (type === 'delete') {

      }
      this[`${type}DialogVisible`] = true
    },
    // 确认删除
    handleDialogClose: $utils.debounce(function (type) {
      let ids = this.multSelection.map(item => item.positionId).join()
      this.$http.posts('positionDel', '', { ids }, true)
        .then(res => {
          this.getList()
          this[`${type}DialogVisible`] = false
        }).catch(er => {
          this[`${type}DialogVisible`] = false
        })
    }, 500),
    // 确认type：1新增、2编辑
    addSure: $utils.debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let type = this.type === 'add' ? 1 : 2
          this.params = { ...this.realQuery, ...this.addForm, type: type }
          this.$http.posts('positionAddOrUpdate', this.params, '', true)
            .then(res => {
              this.addDialogVisible = false
              this.getList()
            }).catch(er => {
              this.addDialogVisible = false
            })
        } else {
          return false
        }
      })
    }, 500),
    // 删除对话框关闭时
    closeDelete() {
      this.isUser = false
    },
    // 多选选中
    handleSelectionChange(val) {
      this.multSelection = val
      for (var i = 0; i < this.multSelection.length; i++) {
        if (this.multSelection[i].isUser) {
          this.isUser = true
          return
        }
      }
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
    }
  }
}
</script>

<style lang="less">
#positionMange {
  .CRUD {
    padding-top: 10px;
  }
}
</style>
