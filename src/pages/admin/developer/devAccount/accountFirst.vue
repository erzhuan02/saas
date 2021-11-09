<template>
  <div id="assoFirst">
    <!-- 查询 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
        <el-form-item prop="dateRange" :label="$t('account.registrationTime')">
          <el-date-picker v-model="queryForm.dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="companyName" :label="$t('common.companyName1')">
          <el-input v-model="queryForm.companyName" maxlength="128" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item prop="userName" :label="$t('common.accountNo')">
          <el-input v-model="queryForm.userName" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item prop="phoneNumb" :label="$t('common.phone')">
          <el-input v-model.trim="queryForm.phoneNumb" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="result clearfix" v-loading="listLoading">
      <el-table class="overflowTable" ref="table" stripe border max-height="565" :data="list" highlight-current-row>
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column type="index" :label="$t('common.no')" width="80" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
        <el-table-column prop="userName" :label="$t('myClients.accountName')"></el-table-column>
        <el-table-column prop="createTime" :label="$t('account.registrationTime')" min-width="100"></el-table-column>
        <el-table-column prop="companyName" :label="$t('common.companyName1')"></el-table-column>
        <el-table-column prop="emailAddr" :label="$t('common.email')" min-width="120"></el-table-column>
        <el-table-column prop="phoneNumb" :label="$t('common.phone')"></el-table-column>
        <el-table-column prop="prodectName" :label="$t('tabs.productService')"></el-table-column>
        <el-table-column :label="$t('common.operation')" width="130">
          <template slot-scope="scope">
            <el-button v-if="button.review" size="mini" type="primary" @click="handleDialogOpen(scope.row)" plain>{{ $t('button.review') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">
        {{ $t('common.currentPage') }} {{ list.length }}
        {{ $t('common.unit') }}
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <!-- 对话框 -->
    <el-dialog :title="$t('button.review')" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <div class="dpInfo">
        <p class="one-txt-cut" :title="curDpInfo.userName">{{ $t('common.userName') }}： {{ curDpInfo.userName }}</p>
        <p>{{ $t('association.devPhone') }}： {{ curDpInfo.phoneNumb }}</p>
        <p>{{ $t('association.devEmail') }}： {{ curDpInfo.emailAddr }}</p>
        <p class="one-txt-cut" :title="curDpInfo.companyName">{{ $t('association.devCompanyName') }}： {{ curDpInfo.companyName }}</p>
        <p>{{ $t('association.devCompanyPhone') }}： {{ curDpInfo.companyPhone }}</p>
        <p class="one-txt-cut" :title="curDpInfo.companyAddr">{{ $t('association.devCompanyAddr') }}： {{ curDpInfo.companyAddr }}</p>
        <p>
          {{ $t('association.devLicense') }}：
          <!-- <el-image :src="curDpInfo.businessLicensePath" :preview-src-list="previewImg"></el-image> -->
          <span v-if="curDpInfo.businessLicensePath">
            <img :src="curDpInfo.businessLicensePath" @click="enlargeImg">
          </span>
          <span v-else>{{ $t('common.noImg') }}</span>
        </p>
        <!-- 不通过原因 -->
        <el-input class="failureReason flex" type="textarea" :placeholder="$t('placeholder.failureReason')" v-model.trim="refuseReason" maxlength="128" show-word-limit></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOpr(1)" :disabled="buttonDisabled">{{ $t('button.agree') }}</el-button>
        <el-button @click="handleOpr(0)" :disabled="buttonDisabled">{{ $t('button.reject') }}</el-button>
      </span>
    </el-dialog>
    <Dialog :imgUrl="curDpInfo.businessLicensePath" v-if="showLargePic" v-on:closeDialog="closeDia"></Dialog>
  </div>
</template>

<script>
import Dialog from '@/components/dialogImg'
export default {
  data() {
    return {
      // 查询表单数据
      queryForm: {
        dateRange: [],
        companyName: '',
        userName: '',
        phoneNumb: '',

        startTime: '',
        endTime: ''
      },
      realQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10, // 一页显示多少条

        auditStatus: 0 // 0待审核 1审核通过 2拒绝
      },
      total: 0,
      list: [],
      listLoading: false,

      buttonDisabled: false,
      dialogVisible: false,
      curDpInfo: {},
      previewImg: [],
      refuseReason: '',
      button: {},

      showLargePic: false
    }
  },
  computed: {
    // 查询验证规则
    queryFormRules() {
      return {
        companyName: [{
          trigger: 'change',
          pattern: this.$utils.reg.companyName,
          validator: this.$utils.validator.common
        }],
        userName: [{
          trigger: 'change',
          pattern: this.$utils.reg.noCnChar,
          validator: this.$utils.validator.common
        }],
        phoneNumb: [{
          trigger: 'change',
          pattern: this.$utils.reg.phoneNoA,
          message: this.$t('message.inputRight')
        }]
      }
    }
  },
  watch: {
    // 修改最后一页删除的bug
    total() {
      if (this.total === (this.realQuery.pageNumber - 1) * this.realQuery.pageSize && this.total !== 0) {
        this.realQuery.pageNumber -= 1
        this.getList() // 获取列表数据
      }
    }
  },
  created() { this.init() },
  mounted() { },
  methods: {
    init() {
      this.$utils.getButton(this.$route.path, 1).then(res => {
        this.button = res
      })
      this.getList()
    },
    getList() {
      this.listLoading = true
      this.$http.posts('dpUserListPage', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          this.list = list.map((item, index) => {
            return {
              ...item,
              phoneNumb: this.$utils.exchangePrefix(item.phoneNumb)
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
          var realQuery = this.realQuery
          var dateRange = realQuery.dateRange
          if (dateRange && dateRange.length > 0) {
            realQuery.startTime = dateRange[0]
            realQuery.endTime = dateRange[1]
          }
          delete realQuery.dateRange
          this.getList()
        } else {
          return false
        }
      })
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

    handleDialogOpen(row) {
      this.refuseReason = ''
      this.curDpInfo = { ...row }
      this.previewImg.push(this.curDpInfo.businessLicensePath)
      this.dialogVisible = true
    },
    handleOpr(type) {
      if (!type && this.refuseReason === '') {
        this.$utils.$message({
          message: this.$t('placeholder.failureReason'),
          type: 'error'
        })
        return
      }
      let params = {
        dpUserId: this.curDpInfo.dpUserId,
        reviewResponse: this.refuseReason,
        auditStatus: type ? 1 : 2
      }
      this.$utils.disabledButton(this)
      this.$http.posts('auditAccountNumber', params)
        .then(res => {
          this.dialogVisible = false
          this.getList()
        })
    },
    // 点击图片
    enlargeImg() {
      this.showLargePic = true
    },
    // 关闭对话框图片
    closeDia(data) {
      if (!data) {
        this.showLargePic = false
      }
    }
  },
  components: {
    Dialog
  }
}
</script>

<style lang="less">
#assoFirst {
  .dpInfo {
    p {
      line-height: 36px;
    }
    img {
      width: 160px !important;
      height: 120px !important;
    }
    .failureReason {
      width: 90%;
      margin: 30px 0;
      height: 100px;
      font-size: 16px;
      textarea {
        resize: none;
      }
    }
  }
}
</style>
