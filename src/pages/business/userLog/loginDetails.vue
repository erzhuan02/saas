<template>
  <div id="loginDetails">
    <!-- 查询条件 -->
    <div class="queryForm">
      <el-form ref="flowQuery" :model="flowQuery" inline label-width="auto">
        <el-form-item :label="$t('log.timeSlot')" prop="regisTime">
          <el-date-picker v-model="timeSlot" type="daterange" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')" format="yyyy-MM-dd" clearable value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="organ" :label="$t('account.organization')">
          <!-- <el-input clearable v-model="flowQuery.organ" maxlength="20" :placeholder="$t('placeholder.input') + $t('order.orderNum')"></el-input> -->
          <input-tree :treeNode="treeData"></input-tree>
        </el-form-item>
        <el-form-item prop="userName" :label="$t('account.userName')">
          <el-input clearable v-model="flowQuery.userName" maxlength="20" :placeholder="$t('placeholder.input') + $t('account.userName')"></el-input>
        </el-form-item>
        <el-form-item prop="loginTime" :label="$t('log.loginTime')">
          <el-select v-model="flowQuery.loginTime" :placeholder="$t('placeholder.select')" clearable>
            <el-option v-for="item in timeOptions" :key="item.value" :label="item.value + $t('time.minutes')" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="search">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询结果 -->
    <div class="result clearfix">
      <el-table class="audited" ref="resultTable" stripe border max-height="595" :data="tableData" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
        <el-table-column type="index" :label="$t('common.no')" width="150" :index="paging.pageSize * (paging.pageNumber - 1) + 1"></el-table-column>
        <el-table-column prop="userName" :label="$t('account.userName')"></el-table-column>
        <el-table-column prop="loginHour" :label="$t('log.loginHour')"></el-table-column>
        <el-table-column prop="loginTime" :label="$t('log.loginTime')"></el-table-column>
        <el-table-column prop="device" :label="$t('log.device')"></el-table-column>
        <el-table-column prop="loginIp" :label="$t('login.login') + 'IP'"></el-table-column>
        <el-table-column prop="location" :label="$t('log.location')"></el-table-column>
      </el-table>
      <div class="currentTotal">{{ $t('common.currentPage') }} {{0}} {{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="paging.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="paging.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background>
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeSlot: ['', ''],
      paging: {
        pageNumber: 1,
        pageSize: 10
      },
      flowQuery: {
        startTime: '',
        endTime: '',
        organ: '',
        userName: '',
        loginTime: ''
      },
      timeOptions: [
        {
          value: '1'
        },
        {
          value: '5'
        },
        {
          value: '10'
        },
        {
          value: '30'
        },
        {
          value: '60'
        }
      ], // 登录时长
      tableData: [],
      total: 10
    }
  },
  created() { },
  mounted() {
  },
  watch: {
    treeData(val) {
      // console.log(val)
    }
  },
  methods: {
    search() {

    },
    // 分页事件
    handleSizeChange(val) {
      this.paging.pageSize = val
      // this.params = { ...this.paging, auditStatus: this.auditStatus }
      // this.getList(this.params)
    },
    handleCurrentChange(val) {
      this.paging.pageNumber = val
      // this.params = { ...this.paging, auditStatus: this.auditStatus }
      // this.getList(this.params)
    }
  }
}
</script>

<style lang="less" scoped>
#loginDetails {
}
</style>
