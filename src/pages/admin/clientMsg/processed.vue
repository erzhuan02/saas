<template>
  <div id="processed">
    <div class="routerView flex1">
      <div id="scrollView" class="flex-d">
        <!-- 查询条件 -->
        <div class="queryForm">
          <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
            <el-form-item :label="$t('customerOrder.processTime')" prop="regisTime">
              <el-date-picker v-model="regisTime" type="daterange" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')" format="yyyy-MM-dd" clearable value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('common.companyName')" prop="userName">
              <el-input v-model="queryForm.userName" clearable :placeholder="$t('placeholder.input')" maxlength="128"></el-input>
            </el-form-item>
            <el-form-item :label="$t('clientMsg.whoDeal')" prop="clerkName">
              <el-input v-model.trim="queryForm.realName" clearable :placeholder="$t('placeholder.input')" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" icon="el-icon-search" @click="handleQuery()">{{ $t('button.query') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 筛选条件 -->
        <div class="conditions flex-hr">
          <el-dropdown class="columnFilters pointer" :hide-on-click="false">
            <span class="el-dropdown-link">
              <i class="el-icon-s-operation"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in options" :key="item.label">
                <el-checkbox v-model="item.checked">{{ $t(item.label) }}</el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 查询结果 -->
        <div class="result clearfix">
          <el-table class="overflowTable" ref="resultTable" stripe border max-height="530" :data="tableData" v-loading="loading" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
            <el-table-column prop="no" width="80" :label="$t('common.no')"></el-table-column>
            <el-table-column v-if="options[0].checked" prop="companyName" :label="$t('common.companyName')"></el-table-column>
            <el-table-column v-if="options[1].checked" prop="userName" :label="$t('common.name')"></el-table-column>
            <el-table-column v-if="options[2].checked" prop="phoneNumb" :label="$t('common.phone')"></el-table-column>
            <el-table-column v-if="options[3].checked" prop="createTime" :label="$t('clientMsg.msgTime')" min-width="100"></el-table-column>
            <el-table-column v-if="options[4].checked" :label="$t('order.mesContent')" min-width="120">
              <div slot-scope="scope" class="moreCell">
                <div class="flex-dvc ql-snow">
                  <pre class="ql-editor" v-html="scope.row.content"></pre>
                </div>
              </div>
            </el-table-column>
            <el-table-column v-if="options[5].checked" prop="realName" :label="$t('clientMsg.whoDeal')"></el-table-column>
            <el-table-column v-if="options[6].checked" prop="account" :label="$t('clientMsg.dealAccount')"></el-table-column>
            <el-table-column v-if="options[7].checked" prop="updateTime" :label="$t('clientMsg.dealDate')" min-width="100"></el-table-column>
            <el-table-column prop="processResult" :label="$t('clientMsg.dealResult')"></el-table-column>
            <el-table-column prop="remark" :label="$t('account.remark')" min-width="100">
              <div slot-scope="scope" class="moreCell">
                <div class="flex-dvc ql-snow">
                  <div class="ql-editor" v-html="scope.row.remark"></div>
                </div>
              </div>
            </el-table-column>
          </el-table>
          <div class="currentTotal">{{ $t('common.currentPage') }} {{tableData.length}} {{ $t('common.unit') }}</div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="activeQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="activeQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
        </div>
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
        type: 1,
        pageNumber: 1,
        pageSize: 10,
        status: 2, // 已处理留言
        startTime: '',
        endTime: '',
        userName: '', // 客户名称
        realName: '' // 处理人
      },
      total: 0, // 分页数据，总条数
      // 查询结果数据
      tableData: [],
      loading: false,
      options: [{
        label: 'common.companyName',
        checked: true
      }, {
        label: 'common.name',
        checked: true
      }, {
        label: 'common.phone',
        checked: true
      }, {
        label: 'clientMsg.msgTime',
        checked: true
      }, {
        label: 'order.mesContent',
        checked: true
      }, {
        label: 'clientMsg.whoDeal',
        checked: true
      }, {
        label: 'clientMsg.dealAccount',
        checked: true
      }, {
        label: 'clientMsg.dealDate',
        checked: true
      }]
    }
  },
  mounted() {
    this.handleQuery()
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
        ],
        clerkName: [
          // {
          //   message: this.$t('common.plzRight') + this.$t('myClients.clerkName'),
          //   trigger: ['blur'],
          //   validator: (rule, value, callback) => {
          //     var reg = /\D/g
          //     if (reg.test(value)) {
          //       callback(new Error(this.$t('placeholder.onlyNumber')))
          //     }
          //     callback()
          //   }
          // }
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
@import '../../../assets/color';
#processed {
  .conditions {
    width: 100%;
    .columnFilters {
      margin-right: 15px;
      i {
        font-size: 30px;
        color: @text2;
      }
    }
  }
}
</style>
