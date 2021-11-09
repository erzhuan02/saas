<template>
  <div id="published">
    <!-- 查询 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
        <el-form-item prop="dateRange" :label="$t('msgCenter.publishTime')">
          <el-date-picker v-model="queryForm.dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="-" :start-placeholder="$t('placeholder.startDate')" :end-placeholder="$t('placeholder.endDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="content" :label="$t('msgCenter.msgDesc')">
          <el-input v-model="queryForm.searchName" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作 -->
    <!-- <div class="CRUD">
      <el-button type="primary" icon="el-icon-plus" @click="handleDialogOpen('add')">{{ $t('button.add') }}</el-button>
      <el-button type="primary" icon="el-icon-delete" @click="handleDialogOpen('delete')" :disabled="selection.length === 0">{{ $t('button.delete') }}</el-button>
    </div> -->
    <!-- 表格 -->
    <div class="result clearfix" v-loading="listLoading">
      <el-table class="overflowTable" ref="resultTable" stripe border max-height="640" :data="list" style="width: 100%;" highlight-current-row>
        <!-- <el-table-column type="selection" :selectable="handleSelectable" @sort-change="handleSortChange" ></el-table-column> @selection-change="handleSelectionChange"-->
        <el-table-column prop="no" width="150" :label="$t('common.no')"></el-table-column>
        <el-table-column prop="title" :label="$t('msgCenter.title')"></el-table-column>
        <el-table-column :label="$t('msgCenter.msgContent')" min-width="100">
          <div slot-scope="scope" class="moreCell">
            <div class="flex-dvc ql-snow">
              <div class="ql-editor" v-html="scope.row.content"></div>
            </div>
          </div>
        </el-table-column>
        <el-table-column prop="releaseTime" :label="$t('msgCenter.publishTime')"></el-table-column>
      </el-table>
      <div class="currentTotal">{{ $t('common.currentPage') }} {{ list.length }}{{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询表单数据
      queryForm: {
        dateRange: [],
        searchName: '',

        startTime: '',
        endTime: ''
      },
      realQuery: {
        sortKey: '',
        sortValue: '',

        pageNumber: 1, // 当前页
        pageSize: 10, // 一页显示多少条
        releaseStatus: 1
        // moduleId: 1 // 基础模块
      }, // 当前表格的查询条件
      list: [],
      total: 0,
      selection: [],
      listLoading: '',
      // type: '', // 操作类型，如add/edit
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
    }
  },
  watch: {},
  created() {
    this.getList()
    this.$utils.getButton(this.$route.path, 1).then(res => {
      this.button = res
    })
  },
  mounted() { },
  methods: {
    getList() {
      this.listLoading = true
      this.$http.posts('listAnnouncement', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          this.list = list.map((item, index) => {
            return {
              no: this.realQuery.pageSize * (this.realQuery.pageNumber - 1) + (index + 1),
              ...item
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
    // 查询表单提交
    handleQuery() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
          var realQuery = this.realQuery
          // console.log('this.realQuery', realQuery)
          var dateRange = realQuery.dateRange
          if (dateRange && dateRange.length > 0) {
            realQuery.startTime = dateRange[0]
            realQuery.endTime = dateRange[1]
          }
          delete realQuery.dateRange
          this.getList()
        } else {
          // console.log('error 验证错误query!!')
          return false
        }
      })
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
      }
      this[`${type}DialogVisible`] = true
    },
    // 新增/修改/详情/删除对话框关闭,重置表单
    handleDialogClose(type) {
      if (type === 'add') {

      } else if (type === 'edit') {

      } else if (type === 'details') {

      }
    }
  }
}
</script>

<style lang="less">
#published {
}
</style>
