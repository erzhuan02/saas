<template>
  <div id="bmRolePrivil">
    <!-- 操作 -->
    <div class="CRUD">
      <el-button v-if="button.addRole" type="primary" icon="el-icon-plus" @click="handleDialogOpen('add')">{{ $t('button.add') }}</el-button>
      <el-button v-if="button.deleteRole" type="primary" icon="el-icon-delete" @click="handleDialogOpen('delete')" :disabled="selection.length === 0">{{ $t('button.delete') }}</el-button>
    </div>
    <!-- 表格 -->
    <div class="result clearfix" v-loading="listLoading">
      <el-table class="overflowTable" ref="resultTable" stripe border max-height="565" :data="list" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange" @sort-change="handleSortChange" highlight-current-row>
        <el-table-column type="selection" :selectable="handleSelectable"></el-table-column>
        <el-table-column prop="no" width="80" :label="$t('common.no')"></el-table-column>
        <el-table-column sortable="custom" prop="roleName" :label="$t('role.roleName')"></el-table-column>
        <el-table-column sortable="custom" :label="$t('role.subordinates')" min-width="150">
          <template slot-scope="scope">
            <div class="moreCell"> {{scope.row.userName}}</div>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" :label="$t('role.juris')" min-width="150">
          <template slot-scope="scope">
            <div class="moreCell"> {{scope.row.menuName}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="roleDesc" :label="$t('role.juris')"></el-table-column> -->
        <el-table-column sortable="custom" prop="createTime" :label="$t('account.createTime')"></el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="scope">
            <el-button v-if="button.editRole" size="mini" type="primary" icon="el-icon-edit" @click="handleDialogOpen('edit', scope.row)" plain>{{ $t('button.edit') }}</el-button>
            <!-- <el-button size="mini" type="primary" @click="handleDialogOpen('details', scope.row)" plain>{{ $t('button.details') }}</el-button> -->
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
      <el-form :model="addForm" label-width="150px" :rules="addOrEditFormRules" ref="addForm" :validate-on-rule-change="false">
        <el-form-item :label="$t('role.roleName')" prop="roleName">
          <el-input v-model.trim="addForm.roleName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item class="create" :label="$t('role.juris')" prop="juris">
          <el-tree v-if="addDialogVisible" ref="addRoleTree" class="roleTree" node-key="id" show-checkbox @check="handleRoleTreeChange" :data="roleTree" :props="defaultProps">
          </el-tree>
          <el-input v-model="addForm.juris" :placeholder="$t('placeholder.input')" type="hidden" style="display:none"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAddOrEdit('add')">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog :title="$t('button.edit')" :visible.sync="editDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('edit')">
      <el-form :model="editForm" label-width="150px" :rules="addOrEditFormRules" ref="editForm" :validate-on-rule-change="false">
        <div class="dialogTitle">{{ $t('role.basic') }}</div>
        <el-form-item :label="$t('role.roleName')" prop="roleName">
          <!-- :disabled="isAdmin" -->
          <el-input v-model.trim="editForm.roleName" :placeholder="$t('placeholder.input')" :disabled="isAdmin"></el-input>
        </el-form-item>
        <div class="dialogTitle">{{ $t('role.rolePermissions') }}</div>
        <el-form-item class="create" :label="$t('role.juris')" prop="juris">
          <el-tree v-if="editDialogVisible" ref="editRoleTree" class="roleTree" node-key="id" show-checkbox :default-expanded-keys="expandedKeys" @check="handleRoleTreeChange" :data="roleTree" :props="defaultProps">
          </el-tree>
          <el-input v-model="editForm.juris" :placeholder="$t('placeholder.input')" type="hidden" style="display:none"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <!-- :disabled="isAdmin" -->
        <el-button type="primary" @click="handleAddOrEdit('edit')">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog :title="$t('button.delete')" :visible.sync="deleteDialogVisible" :close-on-click-modal="false">
      <div class="deleteInfo">
        <i class="el-icon-warning"></i><span>{{ $t('message.isDeleteRole1') }} {{ deleteForm.roleName}} {{ $t('message.isDeleteRole2') }}{{deleteForm.userName}}{{ $t('message.isDeleteRole3') }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleDelete">{{ $t('button.confirm') }}</el-button>
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
      queryForm: {},
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
      // addShowTree: false, // 为了每次都初始化
      addForm: {
        roleName: '',
        juris: JSON.stringify({}), // 用的验证，input得要字符串
        type: 1 // 1新增 2 修改
      },

      expandedKeys: [],
      editDialogVisible: false,
      // editShowTree: false, // 为了每次都初始化
      editForm: {
        // roleName: '',
        // roleId: '',
        // juris: JSON.stringify({}),
        // type: 2
      },
      isAdmin: false, // 是否是超级管理员

      roleTree: [], // 树的数据
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
      deleteForm: {
        roleName: '',
        userName: ''
      },

      importDialogVisible: false,
      importUrl: this.$api.apiBase + this.$api.importRole, // 导入的地址
      importHeaders: { Authorization: sessionStorage.getItem('authorization') }, // 导入的请求头

      loading: false,
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
                  this.$store.dispatch('isValueRepeat', { moduleVal: 'comRole', value, callback })
                }
              } else {
                callback(new Error(this.$t('message.roleName')))
              }
            }
          }
        ],
        juris: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              // console.log('juris', value)
              var trueVal = value && JSON.parse(value)
              // console.log(trueVal)
              if (
                (trueVal && trueVal.authIds) === undefined ||
                (trueVal && trueVal.authIds.length) === 0
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
  created() {
    this.getList()
    this.getTree()
    this.$utils.getButton(this.$route.path, 1).then(res => {
      this.button = res
    })
  },
  mounted() { },
  methods: {
    getList() {
      this.listLoading = true
      this.$http.posts('getCoRole', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          let roleList = data.list || []
          this.total = data.total || 0
          this.list = roleList.map((item, index) => {
            return {
              no: this.realQuery.pageSize * (this.realQuery.pageNumber - 1) + (index + 1),
              ...item,
              juris: JSON.stringify({})
            }
          })
        })
        .catch(er => {
          // console.log(er)
          this.listLoading = false
          this.list = []
          this.total = 0
        })
    },
    // 获取树,打开新增编辑对话框调用
    getTree(roleId) {
      // this.count++
      this.$http.posts('getCoTree', '', { roleId: roleId || '' })
        .then(res => {
          // if (res.data.resCode === 0) {
          // console.log('getTree', res)
          // let data = res.data.data || []
          let data = res.data || []

          this.roleTree = data
          // console.lgo(ert)
          if (this.type === 'edit') {
            var keys
            if (this.isAdmin) {
              keys = this.$utils.recurseJson(data)
            } else {
              keys = this.$utils.recurseJson(data, true, [])
            }

            var tree = this.$refs.editRoleTree
            // console.log('Keys', keys)
            tree.setCheckedKeys(keys)
            this.expandedKeys = keys
            this.$nextTick(() => {
              this.handleRoleTreeChange(
                {},
                {
                  checkedNodes: tree.getCheckedNodes(),
                  halfCheckedNodes: tree.getHalfCheckedNodes()
                }
              )
              setTimeout(() => {
                this.$refs.editForm.clearValidate()
              }, 0)
            })
          }

          // else if (this.type === 'details') {
          //   var getRights = (arr = []) => {
          //     var rightsOptions = this.$utils.rightsLevel(arr, true)
          //     console.log('rightsOptions', rightsOptions)
          //     var detailsRightsOptions = rightsOptions.map((item, index) => {
          //       return {
          //         name: item.label,
          //         roleDesc: item.children.map(citem =>  citem.label).join() || item.label
          //       }
          //     })
          //     return detailsRightsOptions
          //   }
          //   var webRightsOptions = getRights((data && data['1']) || [])
          //   var appRightsOptions = getRights((data && data['2']) || [])
          //   this.detailsTable2 = webRightsOptions.concat(appRightsOptions)
          // }
          // } else {
          //   this.$utils.$message({
          //     message: res.data.resMsg,
          //     type: 'error'
          //   })
          // }
        })
      //       .catch(er => {
      //   // console.log(err)
      //   console.log(er)
      // })
    },
    // // 人脸资源库查询表单提交
    // handleQuery () {
    //   this.$refs.queryForm.validate(valid => {
    //     if (valid) {
    //       this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10}
    //       var realQuery = this.realQuery
    //       console.log(this.realQuery, this.queryForm)
    //       this.getList(this.realQuery)
    //     } else {
    //       // console.log('error 验证错误query!!')
    //       return false
    //     }
    //   })
    // },
    // 控制多选框按钮
    handleSelectable(row, index) {
      return !row.isAdmin
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
      // let sort = {
      //   sortValue: sortValue,
      //   sortKey: sortKey
      // }
      this.getList()
    },
    // 新增/修改/详情/删除对话框打开
    handleDialogOpen(type, row) {
      this.type = type
      this[`${type}DialogVisible`] = true
      if (type === 'add') {
      } else if (type === 'edit') {
        // this.editForm.roleId = row.roleId
        // this.editForm.roleName = row.roleName
        // this.$set(this.editForm, 'juris', JSON.stringify({}))// 动态添加数据
        this.editForm = { ...row }
        this.$nextTick(() => {
          this.$refs.editForm.clearValidate()
        })
        this.editForm.type = 2
        this.isAdmin = !!row.isAdmin
        this.getTree(row.roleId)
      } else if (type === 'details') {
        //   this.detailsForm = { ...row }
        //   this.detailsTable1 = [
        //     {
        //       roleName: row.roleName,
        //       userName: row.userName
        //     }
        //   ]
        //   var getRights = (arr = []) => {
        //     var rightsOptions = this.$utils.rightsLevel(arr)
        //     var detailsRightsOptions = rightsOptions.map((item, index) => {
        //       return {
        //         name: item.label,
        //         roleDesc: item.children.map(citem =>citem.label).join()
        //       }
        //     })
        //     return detailsRightsOptions
        //   }
        //   var webRightsOptions = getRights(row.roleTree['1'])
        //   var appRightsOptions = getRights(row.roleTree['2'])
        //   this.detailsTable2 = webRightsOptions.concat(appRightsOptions)
      } else if (type === 'delete') {
        var roleName = this.selection.map(item => item.roleName).join()
        var userName = []
        this.selection
          .forEach((item, index) => {
            if (item.userName) {
              userName.push(item.userName)
            }
          })

        // console.log(roleName, userName)
        this.deleteForm.roleName = roleName
        if (userName.length > 0) {
          this.deleteForm.userName = ' ' + userName.toString() + ' '
        } else {
          this.deleteForm.userName = ''
        }
      }
    },
    // 新增/编辑
    handleAddOrEdit: $utils.debounce(function (type) {
      this.$refs[`${type}Form`].validate(valid => {
        if (valid) {
          var form = this[`${type}Form`]
          var juris = JSON.parse(form.juris)
          // 发送请求
          var params = {
            roleName: form.roleName,
            authIds: juris.authIds.toString(),
            authNames: juris.authNames.toString(),
            roleId: form.roleId || '',
            type: form.type
          }
          if (type === 'add') {
          } else if (type === 'edit') {
            if (form.isAdmin) {
              this.$utils.$message({
                message: this.$t('message.superRole'),
                type: 'warning'
              })
              return
            }
          }
          this.$http.posts('addOrUpdateCoRole', params, '', type !== 'edit')
            .then(res => {
              if (type === 'edit') {
                this.$utils.$message({
                  message: this.$t('message.editRoleRuccess'),
                  type: 'success',
                  duration: 3000
                })
              }
              this.getList()
              this[`${type}DialogVisible`] = false
            })
        }
      })
    }),
    // 树节点改变时触发 将选中和半选中的组成obj
    handleRoleTreeChange(val, e) {
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
      // console.log(JSON.stringify({
      //   authIds: ids,
      //   authNames: names
      // }), form)
      form.juris = JSON.stringify({
        authIds: ids,
        authNames: names
      })
    },
    // 删除角色
    handleDelete: $utils.debounce(function () {
      let ids = this.selection.map(item => item.roleId).join()
      // console.log(roleIds)
      this.$http.posts('delCoRole', '', { ids }, true)
        .then(res => {
          // if (res.data.resCode === 0) {
          // this.$utils.$message({
          //   message: this.$t('message.submitSuccess'),
          //   type: 'success'
          // })
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
        // this.addShowTree = false
        // this.roleTree = []
      } else if (type === 'edit') {
        this.expandedKeys = []
        // this.editForm.juris = JSON.stringify({})
        // this.$refs.editForm.clearValidate()
        // this.roleTree = []// 为了再点击的时候初始化，下面注释的expandedKeys不起作用
        // default-expanded-keys只是在初始化第一次起作用,dataTree改变重新渲染便起作用，如果dataTree不改变，设置也不起作用
        // setCheckedKeys都起作用
      } else if (type === 'details') {
        this.detailsDialogVisible = false
      }
    }

    // // 模板下载
    // handleDownloadTemp () {
    //   // console.log(this.$api.downloadRoleTemp)
    //   window.location.href = this.$api.downloadRoleTemp
    // },
    // // 文件导入前
    // handleBeforeUpload (file) {
    //   console.log(file)
    //   const isExcel =
    //     file.type === '.csv' ||
    //     file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    //     file.type === 'application/vnd.ms-excel'
    //   // console.log('isExcel',isExcel)
    //   if (!isExcel) {
    //     this.$utils.$message({
    //       message: this.$t('message.excel'),
    //       type: 'error'
    //     })
    //   }
    //   return isExcel
    // },
    // // 文件导入成功
    // handleSuccessUpload (response, file, fileList) {
    //   // console.log(response)
    //   if (response.resCode === 0) {
    //     this.$utils.$message({
    //       message: this.$t('message.successUpload'),
    //       type: 'success'
    //     })
    //     this.getList()
    //   } else {
    //     // console.log(123)
    //     this.$message({
    //       type: 'error',
    //       message: response.resMsg
    //     })
    //   }
    // },
    // handleErrorUpload (er, file, fileList) {
    //   // console.log(err)
    //   this.$message({
    //     type: 'error',
    //     message: this.$t('message.errorUpload')
    //   })
    // },
    // // 导出按钮的处理
    // handleDownload () {
    //   // if (this.selection.length === 0) {
    //   //   this.$utils.$message({
    //   //     message: this.$t('message.selectExport'),
    //   //     type: 'warning'
    //   //   })
    //   //   return
    //   // }
    //   var length = this.selection.length
    //   function getIds (arr) {
    //     var ids = arr.map(item =>  item.roleId).join()
    //     return ids
    //   }
    //   var regisAgain = JSON.parse(sessionStorage.getItem('regisAgain'))
    //   const loadObj = {
    //     ...this.realQuery,
    //     ids: length === 0 ? '' : getIds(this.selection), // 导出的具体数据
    //     companyId: regisAgain.user.companyId
    //   }
    //   window.location.href = this.$api.apiBase + `${this.$api.exportRole}?${this.$utils.obj2qs(
    //     loadObj
    //   )}`
    // }
  }
}
</script>

<style lang="less">
#bmRolePrivil {
}
</style>
