<template>
  <div id="allMsgs">
    <!-- 消息 -->
    <div class="top1 flex-vc">
      <h4 class="comTitle">{{ $t('msgCenter.allMsg') }}</h4>
      <el-checkbox v-model="realQuery.isUnread" @change="handleQuery('isUnread')">{{ $t('msgCenter.unread') }}({{statusNumber.notReadCount}})</el-checkbox>
    </div>
    <!-- 类型 -->
    <div class="type flex-vc">
      <el-radio-group v-model="realQuery.msgType" size="medium" @change="handleQuery('msgType')">
        <el-radio-button :label="''">{{ $t('msgCenter.allType') }}</el-radio-button>
        <el-radio-button :label="1">{{ $t('msgCenter.msgType1') }}({{ statusNumber.noticeCount }})</el-radio-button>
        <el-radio-button :label="2">{{ $t('msgCenter.msgType2') }}({{ statusNumber.productServiceCount }})</el-radio-button>
        <el-radio-button :label="3">{{ $t('msgCenter.msgType3') }}({{ statusNumber.accountInforCount }})</el-radio-button>
      </el-radio-group>
    </div>
    <div class="clearfix">
      <!-- 操作 -->
      <div class="CRUD fl">
        <el-button v-if="button.haveRead" type="primary" @click="handleDeleteAndRead('read',selection)" :disabled="selection.length === 0">{{ $t('button.haveRead') }}</el-button>
        <el-button v-if="button.delete" type="primary" icon="el-icon-delete" @click="handleDialogOpen('delete')" :disabled="selection.length === 0">{{ $t('button.delete') }}</el-button>
      </div>
      <!-- 查询 -->
      <el-form ref="queryForm" class="queryForm fr" :model="queryForm" :rules="queryFormRules" inline>
        <el-form-item prop="content">
          <el-input v-model.trim="queryForm.searchName" maxlength="30" :placeholder="$t('placeholder.msgTitle')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery('query')">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询结果 表格 -->
    <div class="result clearfix" v-loading="listLoading">
      <!--  @sort-change="handleSortChange" border-->
      <el-table ref="resultTable" border stripe max-height="590" :data="list" @selection-change="handleSelectionChange" style="width: 100%;" highlight-current-row>
        <el-table-column type="selection"></el-table-column>
        <el-table-column width="150" :label="$t('common.no')">
          <span slot-scope="scope" :style="{'font-weight':scope.row.isRead?'400':'700'}">{{scope.row.no}}</span>
        </el-table-column>
        <el-table-column :label="$t('msgCenter.title')" min-width="110">
          <span slot-scope="scope" :style="{'font-weight':scope.row.isRead?'400':'700'}">{{scope.row.title}}</span>
        </el-table-column>
        <!-- <el-table-column :label="$t('msgCenter.msgContent')" min-width="120">
          <div slot-scope="scope" class="moreCell" :style="{'font-weight':scope.row.isRead?'400':'700'}">
            <div class="flex-dvc ql-snow ">
              <div class="ql-editor" v-html="scope.row.content"></div>
            </div>
          </div>
        </el-table-column> -->
        <el-table-column prop="msgType" :label="$t('msgCenter.msgType')">
          <!--  -->
          <span slot-scope="scope" :style="{'font-weight':scope.row.isRead?'400':'700'}">{{ $t(`msgCenter.msgType${scope.row.msgType}`) }}</span>
          <!-- <template slot-scope="scope">{{ $t(`msgCenter.msgType${scope.row.msgType}`) }}</template> -->
        </el-table-column>
        <el-table-column prop="receiveTime" :label="$t('msgCenter.receiptTime')">
          <span slot-scope="scope" :style="{'font-weight':scope.row.isRead?'400':'700'}">{{scope.row.receiveTime}}</span>
        </el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="scope">
            <el-button v-if="button.details" size="mini" type="primary" @click="handleDialogOpen('details', scope.row)" plain>{{ $t('button.details') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">
        {{ $t('common.currentPage') }} {{ list.length }}
        {{ $t('common.unit') }}
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>

    <!-- 删除对话框 -->
    <el-dialog :title="$t('button.delete')" :visible.sync="deleteDialogVisible" :close-on-click-modal="false">
      <div class="deleteInfo">
        <i class="el-icon-warning"></i>
        <span>{{ $t('message.isDelete1') }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleDeleteAndRead('delete',selection)">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 预览 -->
    <el-dialog class="details" :title="$t('button.details')" :visible.sync="detailsDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('preview')">
      <div class="previewBox">
        <div class="title">{{detailsForm.title}}</div>
        <!-- 富文本回显 需要外面包裹下 ql-container类可不带,不需要边框-->
        <div class="ql-snow">
          <!-- ql-editor 可解决多个空格的问题,邮件模板不需要这个类，否则上面有大片空白 -->
          <div :class="{'ql-editor':detailsForm.msgType === 1}" v-html="detailsForm.content"></div>
        </div>
        <div class="pt10">{{ $t('company') }} {{detailsForm.receiveTime}}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入富文本的css
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      statusNumber: {
        notReadCount: 0, // 未读
        noticeCount: 0, // 公告
        productServiceCount: 0, // 产品服务
        accountInforCount: 0 // 账户信息
      },
      // 查询表单数据
      queryForm: {
        searchName: ''
      },
      realQuery: {
        isUnread: false,
        msgType: '',
        // sortKey: '',
        // sortValue: '',
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      }, // 当前表格的查询条件
      list: [],
      total: 0,
      selection: [],
      listLoading: false,
      currentRow: {}, // 当前高亮的行

      type: '', // 操作类型，如add/edit

      detailsDialogVisible: false,
      detailsForm: {},

      readDisabled: false,

      deleteDialogVisible: false,

      moduleId: 1, // 基础模块
      button: {}
    }
  },
  computed: {
    ...mapGetters(['language', 'comMsgUnreadList']),
    // 查询验证规则
    queryFormRules() {
      return {}
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
  mounted() {
    this.listLoading = true
  },
  methods: {
    init() {
      this.realQuery.isUnread = this.$route.query.isUnread || false
      this.getList()
      this.getList()
      this.$utils.getButton(this.$route.path, 1).then(res => {
        // console.log('accutnButton', res)
        this.button = res
      })
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      this.$http.posts('comMsgList', this.realQuery)
        .then(res => {
          // console.log('getList', res)
          this.listLoading = false
          // if (res.data.resCode === 0) {
          // let data = res.data.data
          let data = res.data
          let list = data.list.list || []
          this.total = data.list.total || 0
          this.list = list.map((item, index) => {
            return {
              no:
                this.realQuery.pageSize * (this.realQuery.pageNumber - 1) +
                (index + 1),
              ...item
            }
          })
          var statusNumber = { ...data }
          delete statusNumber.list
          this.statusNumber = statusNumber
          this.$store.commit('COM_MSG_UNREAD_TOTAL', statusNumber.notReadCount)
          // } else {
          //   this.$utils.$message({
          //     message: res.data.resMsg,
          //     type: 'error'
          //   })
          //   this.list = []
          //   this.total = 0
          // }
        })
        .catch(er => {
          // console.log(er)
          this.listLoading = false
          this.list = []
          this.total = 0
          this.statusNumber = {
            notReadCount: 0, // 未读
            noticeCount: 0, // 公告
            productServiceCount: 0, // 产品服务
            accountInforCount: 0 // 账户信息
          }
          this.$store.commit('COM_MSG_UNREAD_TOTAL', 0)
        })
    },
    // 查询表单提交
    handleQuery(type) {
      if (type === 'query') {
        this.$refs.queryForm.validate(valid => {
          if (valid) {
            this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
            this.getList()
          } else {
            // console.log('error 验证错误query!!')
            return false
          }
        })
      } else {
        this.realQuery.pageNumber = 1
        this.realQuery.pageSize = 10
        this.getList()
      }
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
    // // 排序
    // handleSortChange (data) {
    //   // let sortValue, sortKey
    //   // console.log(data)
    //   if (data.order === 'ascending') {
    //     this.realQuery.sortValue = 'asc'
    //   } else if (data.order === 'descending') {
    //     this.realQuery.sortValue = 'desc'
    //   } else {
    //     this.realQuery.sortValue = ''
    //     this.realQuery.sortKey = ''
    //     // this.listParams = { ...this.paging, type: 2 }
    //     this.getList()
    //     return false
    //   }
    //   this.realQuery.sortKey = data.prop
    //   if (data.prop === 'type') {
    //     this.realQuery.sortKey = ''
    //   }
    //   this.getList()
    // },
    // 新增/修改/详情/删除对话框打开
    handleDialogOpen(type, row) {
      this.type = type
      if (type === 'add') {
      } else if (type === 'edit') {
      } else if (type === 'details') {
        this.detailsForm = { ...row }
        // 未读的调用已读接口
        if (!this.detailsForm.isRead) {
          this.handleDeleteAndRead('read', [this.detailsForm])
        }
      } else if (type === 'delete') {
      }
      this[`${type}DialogVisible`] = true
    },
    // 删除/已读
    handleDeleteAndRead(type, rowArr) {
      // isRead:1 已读 msgStatus:0 删除
      if (rowArr.length === 0) {
        return
      }
      var params = {}
      var newRowArr = []
      if (type === 'delete') {
        params.msgStatus = 0
        newRowArr = rowArr
      } else {
        // 选中的全是已读的
        // console.log(type)
        var unreadArr = rowArr.filter(item => !item.isRead)
        // console.log(unreadArr)
        if (unreadArr.length === 0) {
          this.$utils.$message({
            message: this.$t('message.submitSuccess'),
            type: 'success'
          })
          this.$refs.resultTable.clearSelection()
          return
        } else {
          newRowArr = unreadArr
        }
        params.isRead = 1
      }
      params.ids = newRowArr.map(item => item.msgId).join()
      // console.log(params)
      this.$http.posts('updateIsRead', '', params)
        .then(res => {
          // if (res.data.resCode === 0) {
          if (type === 'delete') {
            this.$utils.$message({
              message: this.$t('message.submitSuccess'),
              type: 'success'
            })
          }
          this.getList()
          var isFind = false
          // console.log(rowArr)
          if (this.comMsgUnreadList.length === 0) {
            return
          }
          rowArr.forEach((item) => {
            var find = this.comMsgUnreadList.find(unread => unread.msgId === item.msgId)
            if (find) {
              // console.log(find)
              isFind = true
            }
          })
          if (isFind) {
            // console.log(isFind)
            this.$store.dispatch('comGetMsgList', {
              onlySearch: 'unread'
              // msgType: '',
              // pageNumber: 1, // 当前页
              // pageSize: 5// 一页显示多少条
            })
          }
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
      if (type === 'delete') {
        this.deleteDialogVisible = false
      }
    },
    // 点击新增/修改/详情/删除对话框关闭,重置表单
    handleDialogClose(type) {
      if (type === 'add') {
      } else if (type === 'edit') {
      } else if (type === 'details') {
        this.getList()
      }
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#allMsgs {
  .top1 {
    padding: 8px 10px 0 10px;
    min-width: 300px;
    // margin-bottom: 10px;
    .comTitle {
      margin-right: 15px;
    }
    .el-checkbox__label {
      padding-left: 8px;
    }
  }
  .type {
    padding: 10px;
    .el-radio-button__inner {
      border: none;
      border-radius: 4px;
      color: @text3;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #fff;
    }
  }
  .CRUD {
    width: auto;
  }
  .queryForm {
    padding: 10px 10px 0 0;
    .el-form-item:nth-child(1) {
      margin-bottom: 0;
    }
  }
  .result {
    padding-top: 0;
  }
  .details {
    .el-dialog {
      max-width: 740px;
    }
    .el-dialog__body {
      overflow: auto;
      .previewBox {
        min-height: 150px;
        .title {
          margin-bottom: 15px;
          // width: 100%;
          font-size: 18px;
        }
      }
    }
  }
}
</style>
