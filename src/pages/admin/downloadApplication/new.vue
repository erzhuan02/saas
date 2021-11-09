<template>
  <div id="new">
    <div class="routerView flex1">
      <div id="scrollView" class="flex-d">
        <!-- 查询条件 -->
        <div class="queryForm">
          <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
            <el-form-item :label="$t('downloadApply.applyTime')" prop="regisTime">
              <el-date-picker v-model="regisTime" type="daterange" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')" format="yyyy-MM-dd" clearable value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('common.companyName')" prop="userName">
              <el-input v-model="queryForm.userName" :placeholder="$t('placeholder.input')" maxlength="128" clearable></el-input>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 查询结果 -->
        <div class="result clearfix">
          <el-table class="overflowTable" ref="resultTable" stripe border max-height="560" :data="tableData" v-loading="loading" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
            <el-table-column prop="no" width="80" :label="$t('common.no')"></el-table-column>
            <el-table-column prop="companyName" :label="$t('common.companyName')"></el-table-column>
            <el-table-column prop="userName" :label="$t('common.name')"></el-table-column>
            <el-table-column prop="email" :label="$t('openPlatform.apply2')"></el-table-column>
            <el-table-column prop="phoneNumb" :label="$t('common.phone')"></el-table-column>
            <el-table-column prop="createTime" :label="$t('downloadApply.applyTime')"></el-table-column>
            <el-table-column :label="$t('openPlatform.apply1')" width="240">
              <div slot-scope="scope" class="moreCell">
                <div class="flex-dvc ql-snow">
                  <div class="ql-editor" v-html="scope.row.content"></div>
                </div>
              </div>
            </el-table-column>
            <el-table-column :label="$t('common.operation')">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="toDeal(scope.row)" plain>{{ $t('button.process') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="currentTotal">{{ $t('common.currentPage') }} {{tableData.length}} {{ $t('common.unit') }}</div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="activeQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="activeQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
        </div>
        <!-- 对话框 -->
        <el-dialog :title="$t('button.process')" :visible.sync="dialogVisible" :close-on-click-modal="false">
          <el-form ref="dialogForm" :model="deal" label-width="135px" class="clearfix" :rules="dialogRules">
            <el-form-item :label="$t('clientMsg.dealPersonAccount')" prop="account">
              <el-input v-model.trim="deal.account" :placeholder="$t('placeholder.input')" maxlength="30" disabled clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('clientMsg.dealPersonName')" prop="realName">
              <el-input v-model.trim="deal.realName" :placeholder="$t('placeholder.input')" maxlength="30" disabled clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('clientMsg.dealResult')" prop="processResult">
              <el-select v-model="deal.processResult" :placeholder="$t('placeholder.select')">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('account.remark')" prop="remark">
              <el-input v-model.trim="deal.remark" type="textarea" :placeholder="$t('placeholder.input')" maxlength="200" rows='4' show-word-limit></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="dealWith()">{{ $t('button.confirm') }}</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeQuery: {}, // 当前表格的查询条件
      // 查询表单数据
      regisTime: ['', ''],
      queryForm: {
        type: 2,
        pageNumber: 1,
        pageSize: 10,
        startTime: '',
        endTime: '',
        userName: '', // 客户名称
        status: 1 // 新留言
      },
      total: 0, // 分页数据，总条数
      // 查询结果数据
      tableData: [],
      loading: false,
      dialogVisible: false,
      deal: {
        id: '', // 消息id
        account: '', // 处理人账号
        realName: '', // 处理人姓名
        processResult: '', // 处理结果
        remark: '' // 备注
      },
      options: [{
        value: '申请通过，已发送',
        label: '申请通过，已发送'
      }, {
        value: '申请不通过',
        label: '申请不通过'
      }],
      userInfo: {},
      open: true
    }
  },
  mounted() {
    this.handleQuery()
    this.userInfo = JSON.parse(sessionStorage.getItem('user'))
  },
  computed: {
    queryFormRules() {
      return {
        userName: [
          {
            // required: true,
            trigger: 'change',
            pattern: this.$utils.reg.companyName,
            validator: this.$utils.validator.common
          }
        ]
      }
    },
    dialogRules() {
      return {
        // account: [
        //   {
        //     required: true,
        //     message: '处理人账号不能为空',
        //     trigger: ['blur']
        //   }
        // ],
        // realName: [
        //   {
        //     required: true,
        //     message: '处理人姓名不能为空',
        //     trigger: ['blur']
        //   }
        // ],
        processResult: [
          {
            required: true,
            message: '处理结果不能为空',
            trigger: ['blur']
          }
        ],
        remark: [
          {
            required: true,
            message: '备注不能为空',
            trigger: ['blur']
          }
        ]
      }
    }
  },
  methods: {
    // 查询表单提交
    handleQuery() {
      this.activeQuery = { ...this.queryForm }
      this.activeQuery.pageNumber = 1
      this.activeQuery.pageSize = 10

      var regisTime = this.regisTime
      if (regisTime && regisTime.length > 0) {
        this.activeQuery.startTime = regisTime[0]
        this.activeQuery.endTime = regisTime[1]
      }
      this.getList()
    },
    getList() {
      this.loading = true
      this.$refs.queryForm.validate(valid => {
        // 1.普通留言 2.协议申请留言
        if (valid) {
          this.$http.posts('coLeaveList', this.activeQuery)
            .then(res => {
              this.loading = false
              let data = res.data
              this.total = data.total
              if (data.list === null) {
                this.tableData = []
              } else {
                data.list.forEach((item, index) => {
                  item.no = this.activeQuery.pageSize * (this.activeQuery.pageNumber - 1) + (index + 1)
                  item.content = this.$utils.escapeHtml(item.content)
                })
                this.tableData = data.list
              }
            })
            .catch(er => {
              this.loading = false
            })
        } else {
          this.loading = false
          return false
        }
      })
    },
    // 点击处理
    toDeal(data) {
      if (this.$refs['dialogForm'] !== undefined) {
        this.$refs['dialogForm'].resetFields()
        this.$refs['dialogForm'].clearValidate()
      }
      this.deal.account = this.userInfo.userName
      this.deal.realName = this.userInfo.realName
      // this.deal.processResult = ''
      // this.deal.remark = ''
      this.dialogVisible = true
      this.deal.id = data.id
    },
    // 处理
    dealWith() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.$http.posts('dealCoLeave', this.deal, '', true)
            .then(res => {
              this.getList()
              this.dialogVisible = false
            })
        }
      })
    },
    // 分页事件
    handleSizeChange(val) {
      this.activeQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.activeQuery.pageNumber = val
      this.getList()
    }
  }
}
</script>

<style lang="less">
#new {
}
</style>
