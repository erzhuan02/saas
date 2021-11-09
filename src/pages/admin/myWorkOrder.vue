<template>
  <div id="adWorkOrder">
    <!-- 工单信息 -->
    <div v-show="!replyOrDetailsDialogVisible">
      <div class="work">
        <h3 class="comTitle">{{ $t('workOrder.info') }}</h3>
        <div class="state">
          <span>{{ $t('workOrder.adWkStatus0') }}: {{ statusNumber.dispatched }}</span>
          <span>{{ $t('workOrder.adWkStatus1') }}: {{ statusNumber.inHand }}</span>
          <span>{{ $t('workOrder.adWkStatus2') }}:
            {{ statusNumber.toBeConfirmed }}</span>
          <span>{{ $t('workOrder.adWkStatus3') }}: {{ statusNumber.closed }}</span>
          <span>{{ $t('workOrder.adWkStatus4') }}: {{ statusNumber.revoked }}</span>
        </div>
      </div>
      <!-- 查询 -->
      <div class="queryForm">
        <!-- 工单列表 -->
        <div class="work">
          <h3 class="comTitle">{{ $t('workOrder.list') }}</h3>
        </div>
        <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
          <el-form-item prop="createTime" :label="$t('workOrder.submitDate')">
            <el-date-picker v-model="queryForm.createTime" type="daterange" value-format="yyyy-MM-dd" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="wkStatus" :label="$t('workOrder.status')">
            <el-select v-model="queryForm.wkStatus" :placeholder="$t('placeholder.select')" clearable>
              <el-option :label="$t('workOrder.all')" :value="null"></el-option>
              <el-option :label="$t('workOrder.adWkStatus0')" value="0"></el-option>
              <el-option :label="$t('workOrder.adWkStatus1')" value="1"></el-option>
              <el-option :label="$t('workOrder.adWkStatus2')" value="2"></el-option>
              <el-option :label="$t('workOrder.adWkStatus3')" value="3"></el-option>
              <el-option :label="$t('workOrder.adWkStatus4')" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="content" :label="$t('workOrder.problemDesc')">
            <el-input v-model="queryForm.content" :placeholder="$t('placeholder.input')" clearable></el-input>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- <el-rate allow-half v-model="value1"></el-rate> -->
      <!-- 操作 -->
      <!-- <div class="CRUD">
      <el-button v-if="button.add" type="primary" icon="el-icon-plus" @click="handleDialogOpen('add')">{{ $t('button.add') }}</el-button>
      <el-button v-if="button.delete" type="primary" icon="el-icon-delete" @click="deleteDialogVisible = true" :disabled="selection.length === 0">{{ $t('button.delete') }}</el-button>
    </div> -->
      <!-- 查询结果 表格 -->
      <div class="result clearfix" v-loading="listLoading">
        <!-- @selection-change="handleSelectionChange"  @sort-change="handleSortChange"-->
        <el-table class="overflowTable" ref="resultTable" stripe border max-height="565" :data="list" row-key="wkId" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
          <el-table-column prop="no" width="80" :label="$t('common.no')"></el-table-column>
          <el-table-column prop="wkId" :label="$t('workOrder.workNO')" width="150"></el-table-column>
          <el-table-column prop="userName" :label="$t('workOrder.receiver')"></el-table-column>
          <el-table-column prop="content" :label="$t('workOrder.problemDesc')" min-width="150">
            <template slot-scope="scope">
              <pre class="moreCell">{{ scope.row.content }}</pre>
            </template>
          </el-table-column>
          <el-table-column prop="productName" :label="$t('common.productName')"></el-table-column>
          <el-table-column prop="severity" :label="$t('workOrder.severity')">
            <template slot-scope="scope">
              <span>{{ $t('workOrder.severity' + scope.row.severity) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="email" :label="$t('common.email')" min-width="90"></el-table-column>
          <el-table-column prop="wkStatus" :label="$t('workOrder.status')">
            <template slot-scope="scope">
              <span>{{ $t('workOrder.adWkStatus' + scope.row.wkStatus) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="isReminder" :label="$t('workOrder.reminderStatus')">
            <template slot-scope="scope">
              <span>{{ $t('workOrder.remind' + scope.row.isReminder) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" :label="$t('workOrder.createTime')"></el-table-column>
          <el-table-column :label="$t('common.operation')" width="180">
            <template slot-scope="scope">
              <el-button v-if="button.process" size="mini" type="primary" @click="handleDialogOpen('replyOrDetails', scope.row, 'reply')" plain :disabled="scope.row.wkStatus === '3' || scope.row.wkStatus === '4'">{{ $t('button.process') }}</el-button>
              <el-button v-if="button.details" size="mini" type="primary" @click="handleDialogOpen('replyOrDetails', scope.row, 'details')" plain>{{ $t('button.details') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="currentTotal">
          {{ $t('common.currentPage') }} {{ list.length }}
          {{ $t('common.unit') }}
        </div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
      </div>
    </div>
    <!-- 删除对话框 -->
    <!-- <el-dialog :title="$t('button.delete')" :visible.sync="deleteDialogVisible" :close-on-click-modal="false">
      <div class="deleteInfo">
        <i class="el-icon-warning"></i><span>{{ $t('message.isDelete1') }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleDeleteAndStatus(2,currentRow)">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog> -->
    <!-- 撤销工单 -->
    <!-- <el-dialog :title="$t('button.revoke')" :visible.sync="revokeDialogVisible" :close-on-click-modal="false">
      <div class="deleteInfo">
        <i class="el-icon-warning"></i><span>{{ $t('message.isRevokeWk') }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="revokeDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleDeleteAndStatus(4,currentRow)">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog> -->
    <!-- 回复和详情 v-show="replyOrDetailsDialogVisible" -->
    <div class="replyOrDetails" v-if="replyOrDetailsDialogVisible">
      <!-- 导航 -->
      <div class="breadcrumb comTitle">
        <strong @click="handleDialogClose('replyOrDetails')">{{ $t('home.nav66') }}</strong><i class="el-icon-arrow-right"></i>{{ $t('button.' + childModule) }}
      </div>
      <!-- 工单信息 -->
      <div class="info">
        <div class="comTitle">{{ $t('workOrder.info') }}</div>
        <ul>
          <li>{{ $t('workOrder.workNO') }}：{{ replyOrDetailsForm.wkId }}</li>
          <li>{{ $t('workOrder.workOrder') }}{{ $t('workOrder.status') }}：{{ replyOrDetailsForm.wkStatus && $t('workOrder.adWkStatus' + replyOrDetailsForm.wkStatus) }}</li>
          <li>{{ $t('workOrder.submitTime') }}：{{ replyOrDetailsForm.createTime }}</li>
          <li>{{ $t('common.productName') }}：{{ replyOrDetailsForm.productName }}</li>
          <li>{{ $t('workOrder.severity') }}：{{ $t('workOrder.severity' + replyOrDetailsForm.severity) }}</li>
          <li>{{ $t('common.phone') }}：{{ replyOrDetailsForm.phoneNumb }}</li>
          <li>{{ $t('common.email') }}：{{ replyOrDetailsForm.email }}</li>
          <li class="problemDesc flex">{{ $t('workOrder.problemDesc') }}：
            <pre>{{ replyOrDetailsForm.content }}</pre>
          </li>
          <!-- <li style="height:40px">
            <el-rate v-model="replyForm.score" @change="handleChangeScore"></el-rate>
          </li> -->
          <!-- <el-rate v-model="replyForm.score" @change="handleChangeScore"></el-rate> -->
          <li class="flex">
            <span style="min-width:73px">{{ $t('workOrder.problemImg') }}：</span>
            <div>
              <el-image v-for="(item, index) in replyOrDetailsForm.imageUrl" @click="handlePreviewImg(index,replyOrDetailsForm.imageUrl)" :preview-src-list="previewImgList" :key="index" style="width: 100px; height: 100px;margin-right:10px" :src="item" fit="cover"></el-image>
            </div>
          </li>
        </ul>
      </div>
      <div v-loading="recordLoading">
        <!-- 沟通记录 -->
        <div v-show="recordList.length > 0" class="commRecord">
          <div class="comTitle">{{ $t('workOrder.commRecord') }}</div>
          <ul>
            <li v-if="replyOrDetailsForm.score > 0" class="flex">
              <i class="el-icon-user-solid" :style="{color: recordList[0] && recordList[0].replyUserName === userName ? '#fea53d' : '#777'}"></i>
              <div class="record dhc">
                <p class="fwBold">{{ recordList[0] && recordList[0].replyUserName }} {{ recordList[0] && recordList[0].replyTime }}</p>
                <pre class="content">
                  {{ $t('workOrder.serviceScore') }}：<el-rate :value="replyOrDetailsForm.score" disabled></el-rate>
                </pre>
              </div>
            </li>
            <li v-for="recTtem in recordList" :key="recTtem.recId" class="flex" v-if="recTtem.content">
              <i class="el-icon-user-solid" :style="{color: recTtem.replyUserName === userName ? '#fea53d' : '#777'}"></i>
              <div class="record dhc">
                <p class="fwBold">{{ recTtem.replyUserName }} {{ recTtem.replyTime }}</p>
                <!-- <p>
                  <el-rate v-model="replyForm.score" @change="handleChangeScore"></el-rate>
                </p> -->
                <pre class="content">{{ recTtem.content }}</pre>
                <div>
                  <el-image v-for="(item, index) in recTtem.imageUrl" @click="handlePreviewImg(index,recTtem.imageUrl)" :preview-src-list="previewImgList" :key="index" style="width:60px; height: 60px;margin-right:6px" :src="item" fit="cover"></el-image>
                  <!-- <img src="@/assets/images/business/abnormal.png" alt="" class="imgContain"> -->
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 回复 v-if="childModule === 'reply'"-->
        <!-- <div class="reply"> (replyOrDetailsForm.wkStatus==='1' || replyOrDetailsForm.wkStatus==='2')-->
        <el-form v-show="childModule === 'reply' && replyOrDetailsForm.wkStatus !== '3' && replyOrDetailsForm.wkStatus !== '4'" :model="replyForm" label-width="100px" :rules="replyFormRules" ref="replyForm" :validate-on-rule-change="false">
          <el-form-item :label="$t('button.reply')" prop="content" class="textarea">
            <el-input v-model="replyForm.content" :placeholder="$t('placeholder.input')" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" maxlength="500" show-word-limit></el-input>
          </el-form-item>
          <el-form-item :label="$t('workOrder.addImg')" class="uploadImg">
            <div class="flex-wvc1">
              <el-upload ref="uploadImg" action="string" multiple list-type="picture-card" :before-upload="handleBeforeUploadImg" :on-change="handleChangeImg" :http-request="handleHttpRequest" :on-remove="handleRemoveImg" :limit="limitImg" :on-exceed="handleExceedImg" accept="image/bmp, image/jpeg, image/png">
                <i class="el-icon-plus"></i>
              </el-upload>
              <div class="tips">{{ $t('message.uploadImgTips') }}</div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleReply('reply')">{{ $t('button.submit') }}</el-button>
            <el-button type="primary" @click="handleResetReply">{{ $t('button.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </div> <!-- </div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      statusNumber: {
        dispatched: '', // 新建 0
        toBeConfirmed: '', // 待确认 2
        inHand: '', // 处理中 1
        closed: '', // 已关闭3
        revoked: '' // 已撤销4
      },
      // 查询表单数据
      queryForm: {
        createTime: [],
        wkStatus: '', // '0'新建 '1'处理中 '2'待确认 '3'已关闭 '4'已撤销
        content: '',

        startCreateTime: '',
        endCreateTime: ''
      },
      realQuery: {
        sortKey: '',
        sortValue: '',

        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      }, // 当前表格的查询条件
      list: [],
      total: 0,
      // selection: [],
      listLoading: false,
      currentRow: {}, // 当前高亮的行

      // photoFil e: '', // 图片文件
      // roleOptions: [], // 编辑或者新增的角色列表
      // prefixOptions: [], // 号码前缀

      // addDialogVisible: false,

      // addRightsOptions: [],

      // editDialogVisible: false,
      // editForm: {},
      type: '', // 操作类型，如add/edit

      deleteDialogVisible: false, // 删除

      revokeDialogVisible: false, // 撤销

      previewImgList: [], // 轮播预览图片
      limitImg: 5,
      replyOrDetailsDialogVisible: false,
      replyOrDetailsForm: {}, // 回复和详情的基础数据
      recordList: [], // 沟通记录
      recordLoading: false,
      replyForm: {
        isSolve: '', // 1解决 0未解决
        score: 0,
        content: '',
        files: [], // 图片

        wkId: '',
        wkStatus: '' // '1'处理中 '2'待确认 '3'已关闭 '4'已撤销
      },
      childModule: '',
      userName: JSON.parse(sessionStorage.getItem('user')).userName,

      moduleId: 1, // 基础模块
      button: {}
    }
  },
  computed: {
    ...mapGetters(['language', 'busiOrgTree']),
    queryFormRules() {
      return {}
    },
    // 编辑/新增 表单验证
    replyFormRules() {
      return {
        // userPic: [
        //   {
        //     required: true,
        //     trigger: 'change',
        //     message: this.$t('message.choosePhoto')
        //     // pattern: this.$utils.reg.name
        //   }
        // ],
        isSolve: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('message.select')
          }
        ],
        score: [
          {
            trigger: ['change', 'blur'],
            validator: (rule, value, callback) => {
              // console.log('score', value)
              var form = this.replyForm
              if (form.isSolve === 1 && value <= 0) {
                callback(new Error(this.$t('message.select')))
              } else {
                callback()
              }
            }
          }
        ],
        content: [
          {
            required: true,
            trigger: 'blur',
            // message: this.$t('message.inputRight'),
            pattern: this.$utils.reg.content500,
            validator: this.$utils.validator.common
          }
        ]
      }
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
    }
  },
  created() {
    // 从总览跳过来
    // console.log(this.$route.path)
    // this.$router.go(0);
    this.queryForm.wkStatus = this.$route.query.wkStatus || ''
    this.realQuery.wkStatus = this.queryForm.wkStatus
    this.getList()
    this.$utils.getButton(this.$route.path, 1).then(res => {
      // console.log('accutnButton', res)
      this.button = res
    })
  },
  mounted() { },
  methods: {
    // 获取列表数据
    getList() {
      this.listLoading = true
      this.$http.posts('comGetWorkOrder', this.realQuery)
        .then(res => {
          // console.log('getList', res)
          this.listLoading = false
          // if (res.data.resCode === 0) {
          // let data = res.data.data
          let data = res.data
          let list = data.list || []
          this.statusNumber = {
            dispatched: data.dispatched,
            inHand: data.inHand,
            toBeConfirmed: data.toBeConfirmed, // 待处理
            closed: data.closed,
            revoked: data.revoked
          }
          this.total = data.total || 0
          this.list = list.map((item, index) => {
            return {
              no:
                this.realQuery.pageSize *
                (this.realQuery.pageNumber - 1) +
                (index + 1),
              ...item,
              imageUrl: item.imageUrl
                ? item.imageUrl.slice(0, -1).split(',')
                : []
            }
          })
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
        })
    },
    // 获取沟通记录列表(详情和回复中)
    getRecordList(wkId) {
      // type  0详情 1回复
      this.recordLoading = true
      var childType
      if (this.childModule === 'reply') {
        childType = 1
      } else if (this.childModule === 'details') {
        childType = 0
      }
      this.$http.posts('comWkRecordList', '', {
        wkId: wkId || this.replyOrDetailsForm.wkId,
        type: childType
      })
        .then(res => {
          this.recordLoading = false
          if (this.childModule === 'reply') {
            // 解决 企业撤销工单，后台账号不刷新页面选择企业撤销的工单点击“处理”，查看后台“状态”列与企业“状态”列显示
            this.replyOrDetailsDialogVisible = true
          }
          let data = res.data.list
          this.recordList = data.map((item, index) => {
            return {
              ...item,
              imageUrl: item.imageUrl
                ? item.imageUrl.slice(0, -1).split(',')
                : []
            }
          })
          this.replyOrDetailsForm.wkStatus = res.data.wkStatus
        })
        .catch(er => {
          this.recordLoading = false
          if (typeof er === 'object' && this.childModule === 'reply') {
            this.replyOrDetailsDialogVisible = false
            this.getList()
          }
          // this.recordList = []
        })
    },
    // 查询表单提交
    handleQuery() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
          var realQuery = this.realQuery
          // console.log('this.realQuery', realQuery)
          var createTime = realQuery.createTime
          if (createTime && createTime.length > 0) {
            realQuery.startCreateTime = createTime[0]
            realQuery.endCreateTime = createTime[1]
          }
          delete realQuery.createTime
          this.getList()
        } else {
          // console.log('error 验证错误query!!')
          return false
        }
      })
    },
    // // 多选选中
    // handleSelectionChange (val) {
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
    handleDialogOpen(type, row, childM) {
      this.type = type
      if (type === 'add') {
      } else if (type === 'edit') {
      } else if (type === 'delete' || type === 'revoke') {
        this.currentRow = { ...row }
      } else if (type === 'replyOrDetails') {
        this.replyOrDetailsForm = { ...row }
        this.childModule = childM
        this.getRecordList(row.wkId)
      }
      // type !== 'replyOrDetails' &&
      if (this.childModule !== 'reply') {
        // 如果是处理按钮，在getRecordList中判断
        this[`${type}DialogVisible`] = true
      }
    },
    // 轮播预览图片
    handlePreviewImg(index, list) {
      // console.log(index, list)
      var arr1 = list.slice(index)
      var arr2 = list.slice(0, index)
      this.previewImgList = arr1.concat(arr2)
    },
    // 评分分数改变,解决点击验证
    handleChangeScore(val) {
      // console.log(val)
      this.$refs.replyForm.validateField('score')
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChangeImg(file, fileList) {
      // console.log('handleOnChange', file, fileList, fileList.length)
      this.replyForm.files = fileList
    },
    // 所有图片上传之前
    handleBeforeUploadImg(file) {
      // console.log( file)
      const isrightType =
        file.type === 'image/bmp' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/png'
      var size = 5
      const isLtSize = file.size / 1024 / 1024 < size
      var errorArr = []
      if (!isrightType) {
        errorArr.push(this.$t('message.photoTypeWrong'))
      }
      // 两个消息一起弹出，执行太快，重叠，用定时器
      // setTimeout(() => {
      if (!isLtSize) {
        errorArr.push(this.$t('message.morePhotoSize1') + size + 'MB')
      }
      if (errorArr.length > 0) {
        this.$utils.$message({
          type: 'error',
          message: file.name + ',' + errorArr.join()
        })
      }
      // console.log(isrightType && isLt2M)
      return !errorArr.length
    },
    // 自定义上传
    handleHttpRequest(file) {
      // console.log(file)
    },
    // 文件列表移除文件时的钩子
    handleRemoveImg(file, fileList) {
      console.log('handleRemove', file, fileList)
      this.replyForm.files = fileList
    },
    //  文件超出个数限制时的钩子
    handleExceedImg(files, fileList) {
      // this.limitCount = fileList.length + 30
      console.log('handleExceed', files, fileList, fileList.length)
      this.$utils.$message({
        message:
          this.$t('message.uploadImg5') +
          this.limitImg +
          this.$t('message.uploadImg6') +
          (this.limitImg - fileList.length) +
          this.$t('message.uploadImg7') +
          files.length +
          this.$t('message.uploadImg8'),
        type: 'warning',
        duration: 3500
      })
    },
    // 回复
    handleReply(type) {
      // console.log(type)
      this.$refs[`${type}Form`].validate(valid => {
        if (valid) {
          const { wkId, wkStatus } = this.replyOrDetailsForm
          // form.wkId = wkId
          // form.wkStatus = wkStatus
          var form = { ...this[`${type}Form`], wkId, wkStatus }
          let formData = new FormData()
          // if (form.isSolve === '1') {
          //   // 已解决，工单状态为关闭
          //   form.wkStatus = '3'
          // } else {
          //   form.wkStatus = '1'
          // }
          formData.append('content', form.content)
          form.files.forEach((item, index) => {
            formData.append(`file${index}`, item.raw)
            // console.log(formData, formData.get('file0'), form.files)
          })
          delete form.content
          delete form.files
          this.recordLoading = true
          this.$http.posts('comReplyWorkOrder', formData, form, true)
            .then(res => {
              // console.log('res.data)', res.data)
              // if (res.data.resCode === 0) {
              // var data = res.data
              var data = res
              this.replyOrDetailsForm.wkStatus = data.data.wkStatus
              this.replyOrDetailsForm.score = data.data.score
              // this.replyOrDetailsForm.scoreTime =
              // this.recordLoading = false
              // this.recordLoading = true
              // console.log(res)
              this.handleResetReply()
              this.getRecordList(form.wkId)
              // this.$utils.$message({
              //   message: this.$t('message.submitSuccess'),
              //   type: 'success'
              // })
              // } else {
              //   this.recordLoading = false
              //   this.$utils.$message({
              //     message: res.data.resMsg,
              //     type: 'error'
              //   })
              // }
            })
            .catch(er => {
              this.recordLoading = false
              // console.log(er)
            })

          this[`${type}DialogVisible`] = false
        }
      })
    },
    // 重置查询表单
    handleResetReply() {
      this.$refs.replyForm.resetFields()
      this.$refs.uploadImg.clearFiles()
      this.replyForm.files = []
    },
    // 删除和催单
    // handleDeleteAndStatus (status, row) {
    //   // 0 已催单 1催单 2删除 4撤销
    //   var ids = row.wkId
    //   console.log(row)
    //   if (status === 1) {

    //   } else {

    //   }
    //   this.$http.post('comUpdateWkStatus', '', { status, ids })
    //     .then(res => {
    //       if (res.data.resCode === 0) {
    //         this.$utils.$message({
    //           message: this.$t('message.submitSuccess'),
    //           type: 'success'
    //         })
    //         if (status === 2) {
    //           // 判断是不是最后一页全删除了
    //           // 是最后一页的页码 并且是 全选 并且最后的页码不是1
    //           var lastPageNumber = Math.ceil(this.total / this.realQuery.pageSize)
    //           var isLastPageNumber = this.realQuery.pageNumber === lastPageNumber
    //           var isSelectAll = this.selection.length === this.list.length
    //           // console.log(lastPageNumber, isLastPageNumber, isSelectAll)
    //           if (isLastPageNumber && isSelectAll && lastPageNumber !== 1) {
    //             this.realQuery.pageNumber -= 1
    //             // 下面加不加不太影响,为了完善
    //             this.total = this.realQuery.pageNumber * this.realQuery.pageSize
    //           }
    //         }
    //         this.getList()
    //       } else {
    //         this.$utils.$message({
    //           message: res.data.resMsg,
    //           type: 'error'
    //         })
    //       }
    //     })
    //     .catch(er => {
    //       console.log(er)
    //     })
    //   if (status === 2) {
    //     this.deleteDialogVisible = false
    //   } else {
    //     this.revokeDialogVisible = false
    //   }
    // },
    // 点击新增/修改/详情/删除对话框关闭,重置表单
    handleDialogClose(type) {
      if (type === 'add') {
        this.$refs.addForm.resetFields()
        this.addForm.contactName = ''
        this.photoFile = ''
        this.addRightsOptions = []
      } else if (type === 'edit') {
        this.photoFile = ''
        this.editRightsOptions = []
      } else if (type === 'replyOrDetails') {
        this.replyOrDetailsDialogVisible = false
        if (this.childModule === 'reply') {
          this.handleResetReply()
        }
        this.getList()
        // this.childModule = ''
        //  this.$refs.addForm.resetFields()
        // this.photoFile = ''
        // this.editRightsOptions = []
      } else if (type === 'delete' || type === 'revoke') {
        this.currentRow = {}
      }
    }
  }
}
</script>

<style lang="less">
#adWorkOrder {
  padding-top: 8px !important;
  .queryForm {
    padding-top: 0;
  }
  .result {
    padding-top: 5px;
  }
}
</style>
