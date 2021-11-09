<template>
  <div id="operationLog">
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
        <el-form-item prop="logType" :label="$t('log.logType')">
          <el-select v-model="flowQuery.logType" :placeholder="$t('placeholder.select')" clearable>
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
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
        <el-table-column prop="operTime" :label="$t('log.operTime')"></el-table-column>
        <el-table-column prop="logType" :label="$t('log.logType')"></el-table-column>
        <el-table-column prop="operContent" :label="$t('log.operContent')"></el-table-column>
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
        logType: ''
      },
      typeOptions: [
        {
          label: '新增类',
          value: '新增类'
        },
        {
          label: '删除类',
          value: '删除类'
        },
        {
          label: '保存类',
          value: '保存类'
        },
        {
          label: '修改类',
          value: '修改类'
        },
        {
          label: '查询类',
          value: '查询类'
        },
        {
          label: '其他类',
          value: '其他类'
        }
      ], // 日志类型
      tableData: [],
      total: 10
    }
  },
  created() { },
  watch: {
    treeData(val) {
      // console.log(val)
    }
  },
  mounted() {
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
#operationLog {
}
</style>
