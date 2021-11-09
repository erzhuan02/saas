<template>
  <div id="rolePrivil">
    <div v-show="!detailsDialogVisible">
      <!-- 查询 -->
      <div class="queryForm">
        <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
          <el-form-item prop="searchName">
            <el-input v-model="queryForm.searchName" @keydown.enter.native="handleQuery" :placeholder="$t('placeholder.roleName')" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 操作 -->
      <div class="CRUD">
        <el-button v-if="button.add" type="primary" icon="el-icon-plus" @click="handleDialogOpen('add')">{{ $t('button.add') }}</el-button>
        <el-button v-if="button.delete" type="primary" icon="el-icon-delete" @click="deleteDialogVisible = true" :disabled="selection.length === 0">{{ $t('button.delete') }}</el-button>
        <!-- <el-button v-if="button.download" type="primary" icon="el-icon-download" @click="handleDownloadTemp">{{ $t('button.template') }}</el-button> -->
        <!-- <el-button v-if="button.import" type="primary" icon="el-icon-upload2" @click="handleDialogOpen('import')">{{ $t('button.import') }}</el-button> -->
        <!-- <el-upload v-if="button.import" class="uploadExcel" :show-file-list="false" :headers="importHeaders" :before-upload="handleBeforeUpload" :on-success="handleSuccessUpload" :on-error="handleErrorUpload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :action="importUrl">
          <el-button type="primary" icon="el-icon-upload2">{{ $t('button.import') }}</el-button>
        </el-upload> -->
        <!-- <el-upload v-if="button.import" :headers="importHeaders" :before-upload="handleBeforeUpload" :on-success="handleSuccessUpload" :on-error="handleErrorUpload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :action="importUrl">
          <el-button type="primary" icon="el-icon-upload2">{{ $t('button.import') }}</el-button>
        </el-upload> -->
        <el-button v-if="button.export" type="primary" icon="el-icon-download" @click="handleDownload" :disabled="list.length === 0">{{ $t('button.export') }}</el-button>
      </div>
      <!-- 表格 border-->
      <div class="result clearfix" v-loading="listLoading">
        <!-- <div v-show="!listLoading"> -->
        <div class="caption">{{ $t('role.roleList') }}</div>
        <el-table ref="resultTable" stripe border max-height="565" :data="list" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange" @sort-change="handleSortChange" highlight-current-row>
          <el-table-column type="selection" width="60"></el-table-column>
          <el-table-column type="index" :label="$t('common.no')" width="180" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
          <el-table-column sortable="custom" prop="roleName" :label="$t('role.roleName')"></el-table-column>
          <!-- <el-table-column prop="roleDesc" :label="$t('role.juris')"></el-table-column> -->
          <el-table-column sortable="custom" prop="createTime" :label="$t('account.createTime')"></el-table-column>
          <el-table-column :label="$t('common.operation')">
            <template slot-scope="scope">
              <el-button v-if="button.edit" size="mini" type="primary" icon="el-icon-edit" @click="handleDialogOpen('edit', scope.row)" plain>{{ $t('button.edit') }}</el-button>
              <el-button v-if="button.details" size="mini" type="primary" @click="handleDialogOpen('details', scope.row)" plain>{{ $t('button.details') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="currentTotal">
          {{ $t('common.currentPage') }} {{ list.length }}
          {{ $t('common.unit') }}
        </div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
      </div>
      <!-- </div> -->
    </div>
    <!-- 新增对话框 -->
    <el-dialog :title="$t('button.add')" :visible.sync="addDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('add')">
      <el-form :model="addForm" label-width="7.5rem" :rules="addOrEditFormRules" ref="addForm" :validate-on-rule-change="false">
        <div class="dialogTitle">{{ $t('role.basic') }}</div>
        <el-form-item :label="$t('role.roleName')" prop="roleName">
          <el-input v-model.trim="addForm.roleName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <div class="dialogTitle">{{ $t('role.rolePermissions') }}</div>
        <el-form-item class="create" :label="$t('role.web') + $t('role.juris')" prop="webJuris">
          <el-tree v-if="addDialogVisible" ref="addRoleWebTree" class="roleTree" node-key="id" show-checkbox @check="handleWebTreeChange" :data="webTree" :props="defaultProps"></el-tree>
          <el-input v-model="addForm.webJuris" :placeholder="$t('placeholder.input')" type="hidden" style="display:none"></el-input>
        </el-form-item>
        <el-form-item class="create" :label="$t('role.app') + $t('role.juris')" prop="appJuris">
          <el-tree v-if="addDialogVisible" ref="addRoleAppTree" class="roleTree" node-key="id" show-checkbox @check="handleAppTreeChange" :data="appTree" :props="defaultProps"></el-tree>
          <el-input v-model="addForm.appJuris" :placeholder="$t('placeholder.input')" type="hidden" style="display:none"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAddOrEdit('add')">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog :title="$t('button.edit')" :visible.sync="editDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('edit')">
      <el-form :model="editForm" label-width="7.5rem" :rules="addOrEditFormRules" ref="editForm" :validate-on-rule-change="false">
        <div class="dialogTitle">{{ $t('role.basic') }}</div>
        <el-form-item :label="$t('role.roleName')" prop="roleName">
          <el-input v-model.trim="editForm.roleName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <div class="dialogTitle">{{ $t('role.rolePermissions') }}</div>
        <el-form-item class="create" :label="$t('role.web') + $t('role.juris')" prop="webJuris">
          <el-tree v-if="editDialogVisible" ref="editRoleWebTree" class="roleTree" node-key="id" show-checkbox :default-expanded-keys="webExpandedKeys" @check="handleWebTreeChange" :data="webTree" :props="defaultProps"></el-tree>
          <el-input v-model="editForm.webJuris" :placeholder="$t('placeholder.input')" type="hidden" style="display:none"></el-input>
        </el-form-item>
        <el-form-item class="create" :label="$t('role.app') + $t('role.juris')" prop="appJuris">
          <el-tree v-if="editDialogVisible" ref="editRoleAppTree" class="roleTree" node-key="id" show-checkbox :default-expanded-keys="appExpandedKeys" @check="handleAppTreeChange" :data="appTree" :props="defaultProps"></el-tree>
          <el-input v-model="editForm.appJuris" :placeholder="$t('placeholder.input')" type="hidden" style="display:none"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAddOrEdit('edit')">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog :title="$t('button.delete')" :visible.sync="deleteDialogVisible" :close-on-click-modal="false">
      <div class="deleteInfo">
        <i class="el-icon-warning"></i><span>{{ $t('message.isDeleteRole') }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleDelete">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 详情 v-show="detailsDialogVisible" -->
    <div class="details" v-show="detailsDialogVisible">
      <!-- 查询 -->
      <div class="queryForm">
        <el-button type="primary" icon="el-icon-arrow-left" @click="handleDialogClose('details')">{{ $t('button.back') }}</el-button>
      </div>
      <!-- 基本信息 -->
      <div class="result basic" v-if="detailsDialogVisible">
        <div class="title">
          <i class="el-icon-collection-tag"></i>{{ $t('role.basic') }}
        </div>
        <el-table max-height="565">
          <el-table-column width="150">
            <template slot="header">
              <div style="line-height:1"><i class="el-icon-user-solid" style="font-size:80px"></i></div>
              <p style="line-height:1.8">{{ detailsForm.roleName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="ID" width="150">
            <el-table-column :label="$t('role.roleName')" width="150">
              <el-table-column :label="$t('account.createTime')" width="150"></el-table-column>
            </el-table-column>
          </el-table-column>
          <!-- min-width="400" -->
          <el-table-column>
            <template slot="header">{{ detailsForm.roleId }}</template>
            <el-table-column label="">
              <template slot="header" slot-scope="scope">{{ detailsForm.roleName }}</template>
              <el-table-column label="">
                <template slot="header" slot-scope="scope">{{ detailsForm.createTime }}</template>
              </el-table-column>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <!-- 下属用户 -->
      <div class="result clearfix">
        <div class="title">
          <i class="el-icon-collection-tag"></i>{{ $t('role.subordinates') }}
        </div>
        <el-table ref="resultTable" stripe border :data="detailsTable1" tooltip-effect="dark" max-height="565" highlight-current-row>
          <el-table-column prop="roleName" :label="$t('role.roleName')" width="150"></el-table-column>
          <el-table-column prop="userName" :label="$t('role.user')"></el-table-column>
        </el-table>
      </div>
      <!-- 权限列表 -->
      <div class="result clearfix">
        <div class="title">
          <i class="el-icon-collection-tag"></i>{{ $t('role.permissions') }}
        </div>
        <el-table ref="resultTable" stripe border max-height="720" :data="detailsTable2" tooltip-effect="dark" highlight-current-row>
          <el-table-column prop="name" :label="$t('account.name')" width="150"></el-table-column>
          <el-table-column prop="roleDesc" :label="$t('role.juris')"></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 导入 -->
    <el-dialog class="importDialog" :title="$t('button.import') + $t('role.role')" :visible.sync="importDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('import')">
      <div class="flex-hc importBox">
        <span>{{ $t('org.selectFile') }}</span>
        <div class="importFileInfo">
          <a class="el-upload-list__item-name" v-if="this.importFile"><i class="el-icon-document"></i>{{ this.importFile.name }}</a>
        </div>
        <!-- :show-file-list="false" -->
        <el-upload class="importUpload" :show-file-list="false" :before-upload="handleBeforeUpload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" action="string">
          <el-button size="small" type="primary">{{ $t('button.browse') }}</el-button>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- @click="cancelDialog('import')"  @click="checkImport" :disabled="notclick ? false : true"-->
        <el-button>{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleImport">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $utils from '@/utils'
export default {
  data() {
    return {
      // 查询表单数据
      queryForm: {
        searchName: '' // 角色名称
      },
      realQuery: {
        sortKey: '',
        sortValue: '',

        pageNumber: 1, // 当前页
        pageSize: 10, // 一页显示多少条
        moduleId: 1 // 基础模块
      }, // 当前表格的查询条件
      list: [],
      total: 0,
      selection: [],
      listLoading: false,

      type: '', // 操作类型，如add/edit
      addDialogVisible: false,
      addForm: {
        roleName: '',
        // 方法1：解决后面数组用concat方法的默认
        webJuris: JSON.stringify({}), // 用的验证，input得要字符串
        appJuris: JSON.stringify({}) // 用的验证，input得要字符串
      },

      webExpandedKeys: [],
      appExpandedKeys: [],
      editDialogVisible: false,
      editForm: {
        // roleName: '',
        // roleId: '',
        // webJuris: JSON.stringify({}),
        // appJuris: JSON.stringify({})
      },
      // editTreeVisible: false,
      webTree: [], // 树的数据
      appTree: [], // 树的数据
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      detailsForm: {}, // 高亮的数据
      detailsDialogVisible: false,
      detailsTable1: [],
      detailsTable2: [],
      detailsTable3: [],

      deleteDialogVisible: false,

      importDialogVisible: false,
      importFile: '',
      // importDisabled: false,

      moduleId: 1, // 基础模块
      button: {}
    }
  },
  computed: {
    // 查询验证规则
    queryFormRules() {
      return {
        searchName: [
          {
            // trigger: 'blur',
            trigger: 'change',
            message: this.$t('message.noSpecial'),
            pattern: this.$utils.reg.searchName
          }
        ]
      }
    },
    // 编辑/新增 表单验证
    addOrEditFormRules() {
      return {
        roleName: [
          {
            required: true,
            trigger: 'blur',
            // pattern: this.$utils.reg.userName,
            // message: this.$t('message.userName'),
            validator: (rule, value, callback) => {
              if (this.$utils.reg.roleName.test(value)) {
                // 验证成功后
                // 发送请求看是否重复
                if (this.type === 'edit') {
                  callback()
                } else {
                  this.$store.dispatch('isValueRepeat', {
                    moduleVal: 'busiRole',
                    value,
                    callback
                  })
                }
              } else {
                callback(new Error(this.$t('message.roleName')))
              }
            }
          }
        ],
        webJuris: [
          {
            // required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              // console.log('webJuris', value)
              // var trueWebVal = JSON.parse(value)
              this.$refs[`${this.type}Form`].validateField('appJuris')
              callback()
            }
          }
        ],
        appJuris: [
          {
            // required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              // console.log('appjuris', value)
              var trueAppVal = JSON.parse(value)
              var form = this[`${this.type}Form`]
              var trueWebVal = JSON.parse(form.webJuris)
              if (
                (trueAppVal.authIds === undefined ||
                  trueAppVal.authIds.length === 0) &&
                (trueWebVal.authIds === undefined ||
                  trueWebVal.authIds.length === 0)
              ) {
                callback(new Error(this.$t('message.selectPermissions')))
              } else {
                callback()
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
  created() { this.init() },
  mounted() { },
  methods: {
    // 进入页面就发的请求
    init() {
      this.$utils.getButton(this.$route.path, 2).then(res => {
        this.button = res
      })// 按钮权限
      this.getList()// 获取列表数据
      this.getTree()// 获取权限菜单树
    },
    getList() {
      this.listLoading = true
      this.$http.posts('roleList', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          this.list = list.map((item, index) => {
            return {
              ...item,
              webJuris: JSON.stringify({}),
              appJuris: JSON.stringify({})
            }
          })
        })
        .catch(er => {
          this.listLoading = false
          this.list = []
          this.total = 0
        })
    },
    // 获取树,打开新增编辑对话框调用
    getTree(roleId) {
      // this.count++
      this.$http.posts('getBusiMenuTree', '', { roleId: roleId || '' })
        // .GetMenuTree(, roleId)
        .then(res => {
          let data = res.data
          this.webTree = (data && data['1']) || []
          this.appTree = (data && data['2']) || []
          // console.log(data)
          if (this.type === 'edit') {
            // let keys = this.$utils.recurseJson(this.dataTree, [])
            let webKeys = this.$utils.recurseJson(this.webTree, true, [])
            var webTree = this.$refs[`${this.type}RoleWebTree`]
            // console.log('webKeys', webKeys)
            webTree.setCheckedKeys(webKeys)
            this.webExpandedKeys = webKeys

            let appKeys = this.$utils.recurseJson(this.appTree, true, [])
            var appTree = this.$refs[`${this.type}RoleAppTree`]
            appTree.setCheckedKeys(appKeys)
            this.appExpandedKeys = appKeys
            // console.log('keys', keys)
            this.$nextTick(() => {
              this.handleWebTreeChange({}, {
                checkedNodes: webTree.getCheckedNodes(),
                halfCheckedNodes: webTree.getHalfCheckedNodes()
              })
              this.handleAppTreeChange({}, {
                checkedNodes: appTree.getCheckedNodes(),
                halfCheckedNodes: appTree.getHalfCheckedNodes()
              })
              setTimeout(() => {
                this.$refs.editForm.clearValidate()
              }, 0)
            })
          } else if (this.type === 'details') {
            var getRights = (arr = []) => {
              var rightsOptions = this.$utils.rightsLevel(arr, true)
              // console.log('rightsOptions', rightsOptions)
              var detailsRightsOptions = rightsOptions.map(item => {
                return {
                  name: item.label,
                  roleDesc: item.children.map(citem => citem.label).join() || item.label
                }
              })
              return detailsRightsOptions
            }
            var webRightsOptions = getRights((data && data['1']) || [])
            var appRightsOptions = getRights((data && data['2']) || [])
            this.detailsTable2 = webRightsOptions.concat(appRightsOptions)
          }
        })
    },
    // 人脸资源库查询表单提交
    handleQuery() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
          this.getList(this.realQuery)
        } else {
          // console.log('error 验证错误query!!')
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
    // 排序
    handleSortChange(data) {
      // console.log(data)
      if (data.order === 'ascending') {
        this.realQuery.sortValue = 'asc'
      } else if (data.order === 'descending') {
        this.realQuery.sortValue = 'desc'
      } else {
        this.realQuery.sortValue = null
      }
      this.realQuery.sortKey = data.prop
      this.getList()
    },
    // 新增/修改/详情/删除对话框打开
    handleDialogOpen(type, row) {
      this.type = type
      this[`${type}DialogVisible`] = true
      if (type === 'add') {
      } else if (type === 'edit') {
        // this.editForm.roleName = row.roleName
        // this.editForm.roleId = row.roleId
        this.editForm = { ...row }
        this.$nextTick(() => {
          // 应该放这里，在closed关闭时，上面form值改变，change的会触发验证，blur的不会
          this.$refs.editForm.clearValidate()
        })
        this.getTree(row.roleId)
      } else if (type === 'details') {
        this.detailsForm = { ...row }
        this.getTree(row.roleId)
        this.detailsTable1 = [{
          roleName: row.roleName,
          userName: row.userName
        }]
      }
    },
    // 新增/编辑
    handleAddOrEdit: $utils.debounce(function (type) {
      this.$refs[`${type}Form`].validate(valid => {
        if (valid) {
          var form = this[`${type}Form`]
          // this[`${type}Disabled`] = true
          var webJuris = JSON.parse(form.webJuris)
          var appJuris = JSON.parse(form.appJuris)
          // 发送请求
          // console.log(webJuris, appJuris)
          var params = {
            roleName: form.roleName,
            // 方法2：解决数组用concat方法的默认
            authIds: (webJuris.authIds || []).concat(appJuris.authIds || []).toString(),
            // 参数拼接的方式，太长报错
            // authNames: (webJuris.authNames || []).concat(appJuris.authNames || []).toString(),
            authNames: '',
            roleId: form.roleId || ''
          }
          this.listLoading = true
          this.$http.posts('addOrUpdateRole', '', params, type !== 'edit')
            .then(res => {
              if (type === 'edit') {
                this.$utils.$message({
                  message: this.$t('message.editRoleRuccess'),
                  type: 'success',
                  duration: 3000
                })
              }
              this.getList()
            })
            .catch(er => {
              console.log(er)
              this.listLoading = false
            })
          this[`${type}DialogVisible`] = false
        } else {
          return false
        }
      })
    }),
    // 树节点改变时触发 将选中和半选中的组成obj
    handleWebTreeChange(val, e) {
      // console.log('handleTreeChange')
      // console.log(val, e)
      var form = this[`${this.type}Form`]
      let ids = []
      let names = []
      let checkedNodes = e.checkedNodes
      let halfCheckedNodes = e.halfCheckedNodes
      checkedNodes.forEach((e, i) => {
        ids.push(e.id)
        names.push(e.label)
      })
      halfCheckedNodes.forEach((e, i) => {
        ids.push(e.id)
        names.push(e.label)
      })
      // console.log(ids, names)
      form.webJuris = JSON.stringify({
        authIds: ids,
        authNames: names
      })
    },
    // 树节点改变时触发 将选中和半选中的组成obj
    handleAppTreeChange(val, e) {
      // console.log('handleTreeChange')
      // console.log(val, e)
      var form = this[`${this.type}Form`]
      let ids = []
      let names = []
      let checkedNodes = e.checkedNodes
      let halfCheckedNodes = e.halfCheckedNodes
      checkedNodes.forEach((e, i) => {
        ids.push(e.id)
        names.push(e.label)
      })
      halfCheckedNodes.forEach((e, i) => {
        ids.push(e.id)
        names.push(e.label)
      })
      // console.log(ids, names)
      form.appJuris = JSON.stringify({
        authIds: ids,
        authNames: names
      })
    },
    // 删除角色
    handleDelete: $utils.debounce(function () {
      let roleIds = this.selection.map(item => item.roleId).toString()
      // console.log(roleIds)
      this.$http.posts('delRole', '', { roleIds }, true)
        .then(res => {
          this.getList()
        })
      this.deleteDialogVisible = false
    }),
    // 新增/修改/详情/删除对话框关闭,重置表单
    handleDialogClose(type) {
      if (type === 'add') {
        this.$refs.addForm.resetFields()
      } else if (type === 'edit') {
        // this.webTree = []
        // this.appTree = [] // 为了再点击的时候初始化，下面注释的expandedKeys不起作用
        this.webExpandedKeys = []
        this.appExpandedKeys = []
        // this.editDisabled = false
        // default-expanded-keys只是在初始化第一次起作用,dataTree改变重新渲染便起作用，如果dataTree不改变，设置也不起作用
        // setCheckedKeys都起作用

        // this.expandedKeys = []
        // this.$refs.editRoleTree.setCheckedKeys([])
        // this.$refs.editRoleTree.store.defaultExpandAll = false
      } else if (type === 'details') {
        this.detailsDialogVisible = false
        this.detailsTable2 = []
      } else if (type === 'import') {
        this.importFile = ''
      }
    },
    // 模板下载
    handleDownloadTemp() {
      // console.log(this.$api.downloadRoleTemp)
      window.location.href = this.$api.downloadRoleTemp
    },
    // 文件导入前
    handleBeforeUpload(file) {
      // console.log(file)
      const isExcel =
        file.type === '.csv' ||
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      // console.log('isExcel',isExcel)
      if (!isExcel) {
        this.$utils.$message({
          message: this.$t('message.excel'),
          type: 'error'
        })
      }
      if (isExcel) {
        this.importFile = file
      }
      return false
    },
    // 文件导入
    handleImport: $utils.debounce(async function () {
      if (!this.importFile) {
        this.$utils.$message({
          message: this.$t('message.selectImport'),
          type: 'warning'
        })
        return
      }
      // this.importDisabled = true
      var formData = new FormData()
      formData.append('file', this.importFile)
      this.importDialogVisible = false
      try {
        await this.$http.posts('importRole', formData)
        this.$utils.$message({
          message: this.$t('message.successUpload'),
          type: 'success'
        })
        this.getList()
      } catch (e) {
        console.log(e)
      }
    }),
    // 导出按钮的处理
    handleDownload() {
      if (this.selection.length === 0) {
        this.$utils.$message({
          message: this.$t('message.selectExport'),
          type: 'warning'
        })
        return
      }
      var length = this.selection.length
      function getIds(arr) {
        var ids = arr.map(item => item.roleId).toString()
        return ids
      }
      // var user = JSON.parse(sessionStorage.getItem('user'))
      const loadObj = {
        ...this.realQuery,
        ids: length === 0 ? '' : getIds(this.selection) // 导出的具体数据
        // companyId: user.companyId
      }
      this.$utils.excelExport('exportRole', loadObj, '', 'saas_roleStore.xls')
      // window.location.href = this.$api.apiBase + `${this.$api.exportRole}?${this.$utils.obj2qs(
      //   loadObj
      // )}`
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/color';
#rolePrivil {
  .result .caption {
    line-height: 40px;
    text-align: center;
    border: 1px solid @border1;
    border-bottom: none;
  }
  .uploadExcel {
    display: inline-block;
    margin: 0 10px;
  }
  .title {
    // padding: 0 0 15px 0px;
    line-height: 50px;
    i {
      margin-right: 5px;
      font-size: 20px;
      vertical-align: middle;
    }
  }
  .dialogTitle {
    line-height: 35px;
    font-weight: 700;
  }
}
</style>
<style lang="less">
#rolePrivil {
  .details {
    .basic {
      thead.is-group {
        tr:nth-child(1) th:nth-child(3),
        tr:nth-child(2) th:nth-child(2),
        tr:nth-child(3) th:nth-child(2) {
          // width: 800px !important;
          // min-width: 800px !important;
          font-weight: 400;
          background-color: #fff;
        }
      }
    }
  }
}
</style>
