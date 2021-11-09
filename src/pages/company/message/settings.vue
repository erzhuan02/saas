<template>
  <div id="comSettings">
    <!-- 操作 -->
    <!-- <div class="CRUD">
      <el-button v-if="button.confirm" type="primary" @click="handleUpdateSetting('confirm')">{{ $t('button.confirm') }}</el-button>
      <el-button v-if="button.confirm" type="primary" @click="handleUpdateSetting('cancel')">{{ $t('button.cancel') }}</el-button>
    </div> -->
    <!-- 结果表格 -->
    <div class="result clearfix" v-loading="listLoading" style="max-width:1400px">
      <!-- row-key="id"要加-->
      <el-table ref="table" stripe max-height="680" :data="list" row-key="id" :expand-row-keys="expandRowKeys" @expand-change="handleExpandChange" @row-click="handleRowClick" highlight-current-row :tree-props="{children: ''}">
        <!-- <el-table-column type="selection" :selectable="handleSelectable"></el-table-column> row-key="label"  @selection-change="handleSelectionChange" @sort-change="handleSortChange" @cell-click="handleCellClick" -->
        <el-table-column type="expand" width="80">
          <template slot-scope="props">
            <el-form v-for="(item,index) in props.row.children" :key="item.name" :model="item" label-position="left" class="expandForm" :ref="`expandForm${index}`">
              <el-form-item prop="sendTo" :label="item.label">
                <el-checkbox-group v-model="item.sendTo" @change="handleExpandCheckbox(item)">
                  <el-checkbox :label="1" :disabled="!item.isEnableEmail">{{''}}</el-checkbox>
                  <el-checkbox :label="2" :disabled="!item.isEnableCms">{{''}}</el-checkbox>
                  <el-checkbox :label="3" :disabled="!item.isEnableWeb">{{''}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <!-- <el-table-column width="80">
          <i slot-scope="scope" :class="['expandIcon',scope.row.plusIcon ? 'el-icon-plus' : 'el-icon-minus']" @click="handleExpandIcon(scope.row,scope.$index)"></i>
        </el-table-column> -->
        <!-- <el-table-column prop="no" width="80" :label="$t('common.no')">min-width="120px"</el-table-column> :show-overflow-tooltip="true"-->
        <el-table-column prop="label" :label="$t('msgCenter.msgType')" align="left"></el-table-column>
        <el-table-column prop="receiver" :label="$t('msgCenter.receiver')">
          <!-- <div slot-scope="scope" class="flex-hcvc">
            <div class="one-txt-cut">{{scope.row.receiver}}</div>
            <i class="el-icon-circle-plus receiverIcon" @click="handleDialogOpen('receiver')"></i>
          </div> -->
          <template slot-scope="scope">
            <div class="flex-hcvc receiver">
              <!-- popper-class="msgPopover" -->
              <el-popover trigger="click" popper-class="tablePopover">
                <!-- <div class="popoverContent">{{scope.row.receiverList}}</div> -->
                <ul class="popoverContent clearfix">
                  <li v-for="item in scope.row.receiverList" :key="item.rcvrId">{{item.showPhone}}</li>
                </ul>
                <div slot="reference" class="receiverContent one-txt-cut">{{scope.row.receiver}}</div>
              </el-popover>
              <i v-if="button.editReceiver" class="el-icon-circle-plus receiverIcon" @click="handleDialogOpen('receiver')"></i>
            </div>
          </template>

        </el-table-column>
        <el-table-column :label="$t('common.mail')" width="180"></el-table-column>
        <el-table-column :label="$t('common.shortMessages')" width="180"></el-table-column>
        <el-table-column :label="$t('common.inMail')" width="180"></el-table-column>
      </el-table>
      <!-- <div class="currentTotal">
        {{ $t('common.currentPage') }} {{ list.length }}
        {{ $t('common.unit') }}
      </div> -->
      <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination> -->
    </div>
    <!-- 接收人 -->
    <el-dialog class="innerDialog" :title="$t('msgCenter.changeReceiver')" :visible.sync="receiverDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('receiver')">
      <div class="result dialogResult" v-loading="receiverLoading">
        <el-table ref="receiverTable" max-height="500" :data="receiverList" row-key="coUserId" @selection-change="handleSelectionChange" style="width: 100%;" highlight-current-row>
          <el-table-column type="selection" :reserve-selection="true"></el-table-column>
          <el-table-column prop="no" width="55" :label="$t('common.no')"></el-table-column>
          <el-table-column prop="userName" :label="$t('common.userName')"></el-table-column>
          <el-table-column prop="realName" :label="$t('common.name')"></el-table-column>
          <el-table-column prop="showPhone" :label="$t('common.phone')" min-width="80"></el-table-column>
          <el-table-column prop="emailAddr" :label="$t('common.email')" min-width="130"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="receiverRealQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="receiverRealQuery.pageSize" layout=" prev, pager, next,sizes" :pager-count="5" :total="receiverTotal" background></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="receiverDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleUpdateReceiver('receiver')">{{ $t('button.confirm') }}</el-button>
      </div>
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
      realQuery: {}, // 当前表格的查询条件

      list: [],
      listLoading: false,
      // total: 0,
      // initialList: [], // 保存下原始的数据，取消的时候还原
      expandRowKeys: [], // 展开行的key
      currentRow: {}, // 当前的行
      // selectedReceiverList: [],

      receiverRealQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      receiverDialogVisible: false,
      receiverList: [],
      receiverTotal: 0,
      receiverSelection: [], // 多选选中的
      receiverLoading: false,

      moduleId: 1, // 基础模块
      button: {}
    }
  },
  computed: {},
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
    this.getList(true)
    this.$utils.getButton(this.$route.path, 1).then(res => {
      this.button = res
    })
  },
  mounted() { },
  methods: {
    // 获取列表 isInitial true 为进入页面初始化
    getList(isInitial) {
      this.listLoading = true
      // if (isInitial) {
      //   this.realQuery = {}
      // }
      //  this.realQuery
      this.$http.posts('getMsgSetting')
        .then(res => {
          this.listLoading = false
          // if (res.data.resCode === 0) {
          // let data = res.data.data
          let data = res.data
          let list = data || []
          // this.total = data.total || 0
          this.list = list.map((item, index) => {
            // var expanded = document.querySelector('.el-table__row.expanded')
            // var isFind = this.expandRowKeys.find(rowItem => rowItem === item.id)
            // console.log(expanded, isFind, this.expandRowKeys)
            // 有展开的元素，且能发现展开的row
            // if (expanded && isFind) {
            //   item.plusIcon = false
            // } else {
            //   item.plusIcon = true
            // }
            return {
              ...item,
              receiver: item.receiverList && item.receiverList.map(receiverItem => {
                receiverItem.showPhone = receiverItem.phoneNumb && this.$utils.exchangePrefix(receiverItem.phoneNumb)
                return receiverItem.showPhone
              }).join()
            }
          })
          // 保存取消时用
          // this.initialList = JSON.parse(JSON.stringify(processedList))
          // 进页面初始
          if (isInitial && this.list[0]) {
            this.$nextTick(() => {
              this.$refs.table.toggleRowExpansion(this.list[0], true)
              // this.list[0].plusIcon = false
            })
          }
        })
        .catch(er => {
          this.listLoading = false
          this.list = []
        })
    },
    // 获取接收人列表 isInitial true 打开对话框初始化
    getReceiverList(isInitial) {
      this.receiverLoading = true
      if (isInitial) {
        this.receiverRealQuery = {
          pageNumber: 1,
          pageSize: 10
        }
      }
      this.$http.posts('getCoUser', this.receiverRealQuery)
        // this.$http.posts('coReceiverPage', this.receiverRealQuery)
        .then(res => {
          this.receiverLoading = false
          // if (res.data.resCode === 0) {
          // let data = res.data.data
          let data = res.data
          let list = data.list || []
          this.receiverTotal = data.total || 0
          this.receiverList = list.map((item, index) => {
            return {
              no: this.receiverRealQuery.pageSize * (this.receiverRealQuery.pageNumber - 1) + (index + 1),
              ...item,
              showPhone: item.phoneNumb && this.$utils.exchangePrefix(item.phoneNumb)
            }
          })
          // 设置默认选中项
          if (isInitial && this.receiverList.length > 0) {
            var selectedReceiverList = this.currentRow.receiverList || []
            if (selectedReceiverList.length === 0) {
              return
            }
            selectedReceiverList.forEach((item) => {
              this.$refs.receiverTable.toggleRowSelection(item, true)
            })
          }
          // } else {
          //   this.receiverList = []
          //   this.receiverTotal = 0
          //   this.$utils.$message({
          //     message: res.data.resMsg,
          //     type: 'error'
          //   })
          // }
        })
        .catch(er => {
          this.receiverLoading = false
          this.receiverList = []
          this.receiverTotal = 0
          // console.log(er)
        })
    },
    // // 取消或者获取数据的时候，统一处理调用
    // handleList(arr) {
    //   if (!arr || arr.length === 0) {
    //     return arr
    //   }
    //   // console.log(arr)
    //   let processedList = arr.map((item, index) => {
    //     // var expanded = document.querySelector('.el-table__row.expanded')
    //     // var isFind = this.expandRowKeys.find(rowItem => rowItem === item.id)
    //     // console.log(expanded, isFind, this.expandRowKeys)
    //     // 有展开的元素，且能发现展开的row
    //     // if (expanded && isFind) {
    //     //   item.plusIcon = false
    //     // } else {
    //     //   item.plusIcon = true
    //     // }
    //     return {
    //       ...item,
    //       receiver: item.receiverList && item.receiverList.map((receiverItem) => {
    //         receiverItem.showPhone = receiverItem.phoneNumb && this.$utils.exchangePrefix(receiverItem.phoneNumb)
    //         return receiverItem.showPhone
    //       }).join()
    //     }
    //   })
    //   return processedList
    // },
    // 列表点击
    handleRowClick(row) {
      this.currentRow = { ...row }
    },
    // 某一行展开或者关闭时触发该事件
    handleExpandChange(row, expandedRows) {
      // console.log('expandedRows', expandedRows)
      // console.log('row', row)
      var that = this
      if (expandedRows.length) {
        that.expandRowKeys = []
        if (row) {
          that.expandRowKeys.push(row.id)// 每次push进去的是每行的ID
        }
      } else {
        that.expandRowKeys = []// 默认不展开
      }
    },
    // // 展开行按钮切换
    // handleExpandIcon(row, index) {
    //   let table = this.$refs.table
    //   // var findItem = this.list.find(item => item.id === row.id)
    //   this.list.forEach((item) => {
    //     if (row.id !== item.id) {
    //       // console.log('table.toggleRowExpansion(row, false)', item.id)
    //       table.toggleRowExpansion(item, false)
    //       item.plusIcon = true
    //     }
    //   })
    //   // console.log('table.toggleRowExpansion(row)', row.id)
    //   table.toggleRowExpansion(row)
    //   row.plusIcon = !row.plusIcon
    // },
    // 多选选中-接收人
    handleSelectionChange(val) {
      // console.log('handleSelectionChange', val)
      this.receiverSelection = val
    },
    // 一页显示多少条-接收人
    handleSizeChange(val) {
      this.receiverRealQuery.pageSize = val
      this.getReceiverList()
    },
    // 当前第几页-接收人
    handleCurrentChange(val) {
      this.receiverRealQuery.pageNumber = val
      this.getReceiverList()
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
      } else if (type === 'details') {
      } else if (type === 'delete') {
      } else if (type === 'receiver') {
        this.getReceiverList(true)
      }
      this[`${type}DialogVisible`] = true
    },
    // 展开行中的复选框，只传客户操作的，加个标记
    handleExpandCheckbox(expandItem) {
      // console.log(expandItem)
      // expandItem.checked = true
      // var expandArr = []
      // this.list.forEach((item, index) => {
      //   item.children && item.children.forEach((newsItem) => {
      //     if (newsItem.checked) {
      //       expandArr.push(newsItem)
      //     }
      //   })
      // })
      // if (expandArr.length <= 0) {
      //   this.$utils.$message({
      //     message: this.$t('message.msgSetting'),
      //     type: 'warning'
      //   })
      //   return
      // }
      // console.log(expandArr)
      this.$http.posts('updateMsgSetting', [expandItem], '', true)
        // this.$http.post('updateCoMessageCnf', '', { ids: 19, typeId: 1 })
        .then(res => {
          this.getList()
        })
    },

    // // 确定/取消
    // handleUpdateSetting(operation) {
    //   if (operation === 'confirm') {
    //     var expandArr = []
    //     this.list.forEach((item, index) => {
    //       item.children && item.children.forEach((newsItem) => {
    //         if (newsItem.checked) {
    //           expandArr.push(newsItem)
    //         }
    //       })
    //     })
    //     if (expandArr.length <= 0) {
    //       this.$utils.$message({
    //         message: this.$t('message.msgSetting'),
    //         type: 'warning'
    //       })
    //       return
    //     }
    //     // console.log(expandArr)
    //     this.$http.posts('updateMsgSetting', expandArr, '', true)
    //       // this.$http.post('updateCoMessageCnf', '', { ids: 19, typeId: 1 })
    //       .then(res => {
    //         this.getList()
    //       })
    //   } else if (operation === 'cancel') {
    //     if (this.list.length) {
    //       // 操作处理下，让展开的图标修改下
    //       var processedList = this.handleList(this.initialList)
    //       this.list = JSON.parse(JSON.stringify(processedList))
    //     }
    //   }
    // },
    // 修改消息接收人
    handleUpdateReceiver: $utils.debounce(function () {
      // var ids = this.receiverSelection.map(item => item.rcvrId).join()
      var ids = this.receiverSelection.map(item => item.coUserId).join()
      // 接收人管理的老数据去掉,一定要有接收人
      if (ids.replace(/,/gi, '').trim().length === 0) {
        this.$utils.$message({
          message: this.$t('code.S00082'),
          type: 'error'
        })
        return
      }
      var typeId = this.currentRow.id
      this.$http.posts('updateMsgReceiver', '', { ids, typeId }, true)
        .then(res => {
          // this[`${type}Disabled`] = false
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
      //   console.log(er)
      // })
      this.receiverDialogVisible = false
    }),
    // 新增/修改/详情/删除对话框关闭,重置表单
    handleDialogClose(type) {
      if (type === 'add') {
      } else if (type === 'edit') {
      } else if (type === 'details') {
      } else if (type === 'receiver') {
        // console.log(this.$refs.receiverTable)
        this.$refs.receiverTable.clearSelection()
        this.receiverList = []
        this.receiverSelection = []
      }
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#comSettings {
  .result {
    .el-table {
      border-top: 1px solid @tableBorder;
      .el-table__expanded-cell {
        padding-right: 0;
        padding-left: 90px;
      }
      .expandForm {
        .el-form-item {
          margin-bottom: 10px;
          .el-form-item__content {
            line-height: 25px;
            float: right;
            .el-checkbox-group label {
              margin-right: 0;
              width: 180px;
              .el-checkbox__label {
                padding: 0;
              }
            }
          }
          .el-form-item__label {
            overflow: visible;
            text-align: left;
            // width: calc(50% - 270px) !important;
            padding: 0;
          }
          label {
            line-height: 25px;
            vertical-align: middle;
          }
        }
      }
      // .expandIcon {
      //   font-size: 18px;
      //   color: @main;
      //   font-weight: 700;
      //   padding: 0 10px;
      // }
      .receiver {
        & > span:nth-child(1) {
          max-width: calc(100% - 20px);
        }
      }
      .receiverIcon {
        font-size: 20px;
        color: @main;
      }
      // .el-icon-arrow-right:before {
      //   content: '';
      // }
      i {
        cursor: pointer;
      }
    }
    .el-table th.is-left,
    .el-table td.is-left {
      text-align: left;
    }
  }
  .dialogResult {
    .el-table {
      border-top: none;
    }
  }
  .innerDialog .el-dialog {
    max-width: 800px;
  }
}
</style>
