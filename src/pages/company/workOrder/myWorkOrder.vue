<template>
  <div id="comWorkOrder">
    <!-- 工单信息 -->
    <div v-show="!replyOrDetailsDialogVisible">
      <div class="work">
        <h3 class="comTitle">{{ $t('workOrder.info') }}</h3>
        <div class="state">
          <span>{{ $t('workOrder.wkStatus0') }}: {{ statusNumber.dispatched }}</span>
          <span>{{ $t('workOrder.wkStatus1') }}: {{ statusNumber.inHand }}</span>
          <span>{{ $t('workOrder.wkStatus2') }}:
            {{ statusNumber.toBeConfirmed }}</span>
          <span>{{ $t('workOrder.wkStatus3') }}: {{ statusNumber.closed }}</span>
          <span>{{ $t('workOrder.wkStatus4') }}: {{ statusNumber.revoked }}</span>
          <!-- <span>{{ $t('workOrder.dispatched') }}:{{statusNumber.dispatched}}</span> -->
        </div>
      </div>
      <!-- 查询 -->
      <div class="queryForm">
        <!-- 工单列表 -->
        <div class="work">
          <h3 class="comTitle">{{ $t('workOrder.list') }}</h3>
        </div>
        <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
          <!-- submitData: '提交时间',
        status: '状态',
        problemDesc: '问题描述' -->
          <el-form-item prop="createTime" :label="$t('workOrder.submitDate')">
            <el-date-picker v-model="queryForm.createTime" type="daterange" value-format="yyyy-MM-dd" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="wkStatus" :label="$t('workOrder.status')">
            <el-select v-model="queryForm.wkStatus" :placeholder="$t('placeholder.select')" clearable>
              <el-option :label="$t('workOrder.all')" :value="null"></el-option>
              <el-option :label="$t('workOrder.wkStatus0')" value="0"></el-option>
              <el-option :label="$t('workOrder.wkStatus1')" value="1"></el-option>
              <el-option :label="$t('workOrder.wkStatus2')" value="2"></el-option>
              <el-option :label="$t('workOrder.wkStatus3')" value="3"></el-option>
              <el-option :label="$t('workOrder.wkStatus4')" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="content" :label="$t('workOrder.problemDesc')">
            <el-input v-model="queryForm.content" :placeholder="$t('placeholder.input')" maxlength="500" clearable></el-input>
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
        <!-- @selection-change="handleSelectionChange"   @sort-change="handleSortChange"-->
        <el-table class="overflowTable" ref="resultTable" stripe border max-height="600" :data="list" row-key="wkId" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
          <el-table-column prop="no" width="80" :label="$t('common.no')"></el-table-column>
          <el-table-column prop="wkId" :label="$t('workOrder.workNO')"></el-table-column>
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
              <span>{{ $t('workOrder.wkStatus' + scope.row.wkStatus) }}</span>
              <!-- <span v-else-if="scope.row.wkStatus === '2'">{{ $t('workOrder.wkStatus2') }}</span> -->
              <!-- <span v-else-if="scope.row.wkStatus === '3'">{{ $t('workOrder.wkStatus3') }}</span> -->
              <!-- <span v-else-if="scope.row.wkStatus === '4'">{{ $t('workOrder.wkStatus4') }}</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="createTime" :label="$t('workOrder.createTime')"></el-table-column>
          <el-table-column :label="$t('common.operation')" width="430">
            <template slot-scope="scope">
              <!-- scope.row.isReminder -->
              <el-button v-if="button.reminder" size="mini" type="primary" @click="handleDeleteAndStatus(1, scope.row)" plain :disabled="
                  !(scope.row.isReminderButton !== 0 && (scope.row.wkStatus === '1' || scope.row.wkStatus === '0'))" style="width:80px">
                {{scope.row.isReminder? $t('button.reminded'): $t('button.reminder') }}</el-button>
              <el-button v-if="button.reply" size="mini" type="primary" @click="handleDialogOpen('replyOrDetails', scope.row, 'reply')" plain :disabled="
                  scope.row.wkStatus === '3' || scope.row.wkStatus === '4'
                ">{{ $t('button.reply') }}</el-button>
              <el-button v-if="button.delete" size="mini" type="primary" @click="handleDialogOpen('delete', scope.row)" plain>{{ $t('button.delete') }}</el-button>
              <!-- v-if="button.delete" -->
              <el-button size="mini" type="primary" @click="handleDialogOpen('revoke', scope.row)" plain :disabled="
                  scope.row.wkStatus === '3' || scope.row.wkStatus === '4'
                ">{{ $t('button.revoke') }}</el-button>
              <el-button v-if="button.details" size="mini" type="primary" @click="
                  handleDialogOpen('replyOrDetails', scope.row, 'details')
                " plain>{{ $t('button.details') }}</el-button>
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
    <!-- 新增对话框 -->
    <!-- <el-dialog :title="$t('button.add')" :visible.sync="addDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('add')">
      <el-form :model="addForm" label-width="150px" :rules="addOrEditFormRules" ref="addForm" :validate-on-rule-change="false">
        <el-form-item :label="$t('common.name')" prop="realName">
          <el-input v-model="addForm.realName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('account.userName')" prop="userName">
          <el-input v-model="addForm.userName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('account.newPassword')" prop="password">
          <el-input v-model.trim="addForm.password" :placeholder="$t('placeholder.input')" type="password" autocomplete="new-password"></el-input>

        </el-form-item>
        <el-form-item :label="$t('account.newPasswordAgain')" prop="passwordAgain">
          <el-input v-model.trim="addForm.passwordAgain" :placeholder="$t('placeholder.input')" type="password" autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item :label="$t('account.role')" prop="roleId">

          <el-select v-model="addForm.roleId" :placeholder="$t('placeholder.select')">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.roleName" :value="item.roleId"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item :label="$t('account.phoneNo')" required>
          <el-col :span="9">
            <el-form-item prop="phonePrefix" style="width: 100%;min-width:auto">
              <el-select v-model="addForm.phonePrefix" filterable filterable :placeholder="$t('placeholder.select')" style="width: 100%;">
                <el-option v-for="(item, index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1" style="text-align:center;">-</el-col>
          <el-col :span="14">
            <el-form-item prop="phoneNumb" style="width: 100%;min-width:auto">
              <el-input v-model.trim="addForm.phoneNumb" :placeholder="$t('placeholder.input')" maxlength="30" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAddOrEdit('add')">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog> -->
    <!-- 修改对话框 -->
    <!-- <el-dialog :title="$t('button.edit')" :visible.sync="editDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('edit')">
      <el-form :model="editForm" label-width="140px" ref="editForm" :validate-on-rule-change="false">
        <el-form-item :label="$t('common.name')" prop="realName">
          <el-input v-model="editForm.realName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('account.userName')" prop="userName">
          <el-input v-model="editForm.userName" :placeholder="$t('placeholder.input')" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('account.role')" prop="roleId">
          <el-select v-model="editForm.roleId" :placeholder="$t('placeholder.select')">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.roleName" :value="item.roleId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('account.phoneNo')" required>
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
              <el-input v-model.trim="editForm.phoneNumb" :placeholder="$t('placeholder.input')" maxlength="30" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">{{
          $t('button.cancel')
        }}</el-button>
        <el-button type="primary" @click="handleAddOrEdit('edit')">{{
          $t('button.confirm')
        }}</el-button>
      </div>
    </el-dialog> -->
    <!-- 删除对话框 -->
    <el-dialog :title="$t('button.delete')" :visible.sync="deleteDialogVisible" :close-on-click-modal="false">
      <div class="deleteInfo">
        <i class="el-icon-warning"></i><span>{{ $t('message.isDelete1') }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{
          $t('button.cancel')
        }}</el-button>
        <el-button type="primary" @click="handleDeleteAndStatus(2, currentRow, 'sgl')">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 撤销工单 -->
    <el-dialog :title="$t('button.revoke')" :visible.sync="revokeDialogVisible" :close-on-click-modal="false">
      <div class="deleteInfo">
        <i class="el-icon-warning"></i><span>{{ $t('message.isRevokeWk') }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="revokeDialogVisible = false">{{
          $t('button.cancel')
        }}</el-button>
        <el-button type="primary" @click="handleDeleteAndStatus(4, currentRow)">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 回复和详情 v-show="replyOrDetailsDialogVisible" -->
    <div class="replyOrDetails" v-if="replyOrDetailsDialogVisible">
      <!-- 导航 -->
      <div class="breadcrumb comTitle">
        <strong @click="handleDialogClose('replyOrDetails')">{{
          $t('home.nav66')
        }}</strong><i class="el-icon-arrow-right"></i>{{ $t('button.' + childModule) }}
      </div>
      <!-- 工单信息 -->
      <div class="info">
        <div class="comTitle">
          {{ $t('workOrder.info') }}
        </div>
        <ul>
          <li>{{ $t('workOrder.workNO') }}：{{ replyOrDetailsForm.wkId }}</li>
          <li>{{ $t('workOrder.workOrder') }}{{ $t('workOrder.status') }}：{{ replyOrDetailsForm.wkStatus && $t('workOrder.wkStatus' + replyOrDetailsForm.wkStatus) }}</li>
          <li>{{ $t('workOrder.submitTime') }}：{{ replyOrDetailsForm.createTime }}</li>
          <li> {{ $t('common.productName') }}：{{ replyOrDetailsForm.productName }}</li>
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
              <!-- <img style="width:100px;height:100px" src="@/assets/images/business/abnormal.png" alt="" class="imgContain">
              <img style="width:100px;height:100px" src="@/assets/images/ipay.png" alt="" class="imgContain">
              <img style="width:100px;height:100px" src="@/assets/images/business/abnormal.png" alt="" class="imgContain">
              <img style="width:100px;height:100px" src="@/assets/images/ipay.png" alt="" class="imgContain">
              <img style="width:100px;height:100px" src="@/assets/images/business/face.png" alt="" class="imgContain"> -->
            </div>
          </li>
        </ul>
      </div>
      <div v-loading="recordLoading">
        <!-- 沟通记录 -->
        <div v-show="recordList.length > 0" class="commRecord">
          <div class="comTitle">
            {{ $t('workOrder.commRecord') }}
          </div>
          <ul>
            <!-- v-if="childModule === 'details' && replyOrDetailsForm.score > 0" -->
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
                <p class="fwBold">
                  {{ recTtem.replyUserName }} {{ recTtem.replyTime }}
                </p>
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
        <el-form v-show="
            childModule === 'reply' && replyOrDetailsForm.wkStatus !== '3' && replyOrDetailsForm.wkStatus !== '4'
          " :model="replyForm" label-width="100px" :rules="replyFormRules" ref="replyForm" :validate-on-rule-change="false">
          <el-form-item label="" label-width="60px" class="radio">
            <el-form-item label="" prop="isSolve" class="fl">
              <el-radio-group v-model="replyForm.isSolve">
                <el-radio :label="1">{{ $t('workOrder.solved') }}</el-radio>
                <el-radio :label="0">{{ $t('workOrder.notSolved') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('workOrder.score')" prop="score" label-width="40px" class="score fl" v-show="replyForm.isSolve">
              <el-rate v-model="replyForm.score" @change="handleChangeScore"></el-rate>
              <!-- <el-input v-model="replyForm.score" :placeholder="$t('placeholder.input')" hidden></el-input> -->
            </el-form-item>
          </el-form-item>
          <!-- <el-form-item :label="$t('workOrder.score')" prop="score">
          <el-rate v-model="replyForm.score"></el-rate>
        </el-form-item> -->
          <el-form-item :label="$t('button.reply')" prop="content" class="textarea">
            <el-input v-model="replyForm.content" :placeholder="$t('placeholder.input')" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" show-word-limit maxlength="500"></el-input>
          </el-form-item>
          <el-form-item :label="$t('workOrder.addImg')" class="uploadImg">
            <div class="flex-wvc1">
              <el-upload ref="uploadImg" action="string" multiple list-type="picture-card" :before-upload="handleBeforeUploadImg" :on-change="handleChangeImg" :http-request="handleHttpRequest" :on-remove="handleRemoveImg" :limit="limitImg" :on-exceed="handleExceedImg" accept="image/bmp, image/jpeg, image/png">
                <i class="el-icon-plus"></i>
                <!-- <div style="font-size:10px">{{ $t('workOrder.addImg') }}</div> -->
              </el-upload>
              <div class="tips">{{ $t('message.uploadImgTips') }}</div>
            </div>
            <!-- <el-input v-model.trim="addForm.img" :placeholder="$t('placeholder.input')"></el-input> -->
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleReply('reply')">{{
              $t('button.submit')
            }}</el-button>
            <el-button type="primary" @click="handleResetReply">{{
              $t('button.reset')
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// debugger
export default {
  data() {
    return {
      statusNumber: {
        dispatched: '', // 已派发 0
        toBeConfirmed: '', // 待确认 2
        inHand: '', // 处理中 1
        closed: '', // 已关闭3
        revoked: '' // 已撤销4
      },
      // 查询表单数据
      queryForm: {
        createTime: [],
        wkStatus: '', // '0'已派发 '1'处理中 '2'待确认 '3'已关闭 '4'已撤销
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

      // photoFile: '', // 图片文件
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
      button: {
        add: true,
        delete: true
      }
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
          // {
          //   trigger: 'blur',
          //   validator: (rule, value, callback) => {
          //     // console.log('score', value)
          //     var form = this.replyForm
          //     if (form.isSolve === 0 && !value.trim()) {
          //       callback(new Error(this.$t('message.input')))
          //     } else {
          //       callback()
          //     }
          //   }
          // }
          {
            required: this.replyForm.isSolve === 0,
            trigger: 'blur',
            message: this.$t('message.inputRight'),
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
      if (this.total === (this.realQuery.pageNumber - 1) * this.realQuery.pageSize && this.total !== 0) {
        this.realQuery.pageNumber -= 1
        this.getList() // 获取列表数据
      }
    }
    // '$route': {
    //   handler: function (to, from) {
    //     console.log('$route', to)
    //     this.init()
    //   },
    //   immediate: true
    // }
  },
  created() {
    // console.log('进入工单列表')
    this.init()
  },
  mounted() { },
  methods: {
    init() {
      this.queryForm.wkStatus = this.$route.query.wkStatus || ''
      this.realQuery.wkStatus = this.queryForm.wkStatus
      this.getList()
      this.$utils.getButton(this.$route.path, 1).then(res => {
        this.button = res
      })
    },
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
            toBeConfirmed: data.toBeConfirmed, // 待确认
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
          this.$store.commit('COM_WK_CONFIRM_TOTAL', data.toBeConfirmed)
          // } else {
          //   this.$utils.$message({
          //     message: res.data.resMsg,
          //     type: 'error'
          //   })
          //     this.list = []
          //     this.total = 0
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
          // console.log('comWkRecordList', res)
          this.recordLoading = false
          // if (res.data.resCode === 0) {
          // let data = res.data.data
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
          // } else {
          //   this.$utils.$message({
          //     message: res.data.resMsg,
          //     type: 'error'
          //   })
          //   this.recordList = []
          // }
        })
        .catch(er => {
          // console.log(er)
          this.recordLoading = false
          this.recordList = []
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
        // this.childModule = childM
      } else if (type === 'replyOrDetails') {
        this.replyOrDetailsForm = { ...row }
        this.childModule = childM
        this.getRecordList(row.wkId)
      }
      this[`${type}DialogVisible`] = true
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
      // console.log(file)
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
      // console.log('handleRemove', file, fileList)
      this.replyForm.files = fileList
    },
    //  文件超出个数限制时的钩子
    handleExceedImg(files, fileList) {
      // console.log('handleExceed', files, fileList, fileList.length)
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
          // var originalStatus = this.replyOrDetailsForm.wkStatus
          // console.log(originalStatus)
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
              // console.log('res.data', res.data)
              // if (res.data.resCode === 0) {
              // var data = res.data
              var data = res
              this.replyOrDetailsForm.wkStatus = data.data.wkStatus
              this.replyOrDetailsForm.score = data.data.score
              if (wkStatus === '2') {
                // console.log('进来', this.statusNumber.toBeConfirmed--)
                this.$store.commit('COM_WK_CONFIRM_TOTAL', --this.statusNumber.toBeConfirmed)
              }
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
          // this[`${type}DialogVisible`] = false
        }
      })
    },
    // 重置回复表单
    handleResetReply() {
      this.$refs.replyForm.resetFields()
      this.$refs.uploadImg.clearFiles()
      this.replyForm.files = []
    },
    // 催单/删除/撤销
    handleDeleteAndStatus(status, row, delType) {
      // 0 已催单 1催单 2删除 4撤销
      var ids = row.wkId
      this.$http.posts('comUpdateWkStatus', '', { status, ids }, true)
        .then(res => {
          // if (res.data.resCode === 0) {
          // this.$utils.$message({
          //   message: this.$t('message.submitSuccess'),
          //   type: 'success'
          // })
          // if (status === 2) {
          //   // 判断是不是最后一页全删除了
          //   // 是最后一页的页码 并且是 全选 并且最后的页码不是1
          //   var selectLength // 选中的长度
          //   if (delType === 'sgl') {
          //     selectLength = 1 // 单个删的就是1  多选框的话就是this.shopSelection.length
          //   } else {
          //     selectLength = this.selection.length
          //   }
          //   var lastPageNumber = Math.ceil(this.total / this.realQuery.pageSize)
          //   var isLastPageNumber = this.realQuery.pageNumber === lastPageNumber
          //   var isSelectAll = selectLength === this.list.length
          //   // console.log(lastPageNumber, isLastPageNumber, isSelectAll)
          //   if (isLastPageNumber && isSelectAll && lastPageNumber !== 1) {
          //     this.realQuery.pageNumber -= 1
          //     // 下面加不加不太影响,为了完善
          //     this.total = this.realQuery.pageNumber * this.realQuery.pageSize
          //   }
          // }
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
      if (status === 2) {
        this.deleteDialogVisible = false
      } else {
        this.revokeDialogVisible = false
      }
    },
    // 点击新增/修改/详情/删除对话框关闭,重置表单
    handleDialogClose(type) {
      if (type === 'add') {
      } else if (type === 'edit') {
      } else if (type === 'replyOrDetails') {
        this.replyOrDetailsDialogVisible = false
        if (this.childModule === 'reply') {
          this.handleResetReply()
        }
        this.getList()
      } else if (type === 'delete' || type === 'revoke') {
        this.currentRow = {}
      }
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#comWorkOrder {
  padding-top: 8px !important;
  .queryForm {
    padding-top: 0;
  }
  .result {
    padding-top: 5px;
  }
  // .textarea,
  // .uploadImg {
  //   display: none;
  // }
}
</style>
