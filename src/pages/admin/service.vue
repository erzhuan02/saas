<template>
  <div id="flowSheet">
    <!-- 查询条件 -->
    <div class="queryForm">
      <el-form ref="flowQuery" :model="flowQuery" inline label-width="auto">
        <el-form-item :label="$t('common.companyName1')" prop="companyName">
          <el-input v-model="flowQuery.companyName" maxlength="128" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.companyId')">
          <el-input v-model="flowQuery.companyId" maxlength="5" :placeholder="$t('placeholder.input')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.productName')" prop="productId">
          <el-select v-model="flowQuery.productId" :placeholder="$t('placeholder.select')" clearable>
            <el-option v-for="(item, index) in productData" :key="index" :label="item.productName" :value="item.productId">
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
      <el-table class="audited" ref="resultTable" stripe border max-height="560" v-loading="loading" :data="tableData" style="width: 100%;" highlight-current-row>
        <el-table-column prop="no" :label="$t('common.no')"></el-table-column>
        <el-table-column prop="companyName" :label="$t('common.companyName1')"></el-table-column>
        <el-table-column prop="companyId" :label="$t('common.companyId')"></el-table-column>
        <el-table-column prop="productName" :label="$t('order.productName')"></el-table-column>
        <el-table-column prop="status" :label="$t('service.serviceStatus')">
          <template slot-scope="scope">{{ $t(`service.serviceStatus${scope.row.status}`) }}</template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="scope">
            <div class="flex-hcvc">
              <el-button size="mini" v-if="scope.row.status === 6" type="primary" @click="examine(scope.row)" plain>{{ $t('button.enable') }}</el-button>
              <el-button size="mini" v-if="scope.row.status === 2" type="primary" @click="examine(scope.row)" plain>{{ $t('button.disable') }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">{{ $t('common.currentPage') }} {{tableData.length}} {{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="paging.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="paging.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <el-dialog :close-on-click-modal="false" :show-close="false" :title="$t('dialog.tips')" :visible.sync="dialogVisible" width="30%">
      <p v-if="serviceList.status === 2">{{ $t('service.isDisable') }}</p>
      <p v-if="serviceList.status === 6">{{ $t('service.isEnable') }}</p>
      <span slot="footer">
        <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      // button: {},
      flowQuery: {
        companyName: '',
        companyId: '',
        productId: ''
      },
      productData: [],
      paging: {
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      total: 10, // 总条数
      tableData: [],
      dialogVisible: false,
      serviceList: {}
    }
  },
  // created() {
  //   this.$utils.getButton(this.$route.path, 1).then(res => {
  //     this.button = res
  //   })
  // },
  mounted() {
    this.getProduct()
    this.getList()
  },
  methods: {
    // 获取产品名称
    getProduct() {
      this.$http.posts('getProductDataAuth', '', { type: 4 })
        .then(res => {
          this.productData = res.data
        })
    },
    // 获取列表
    getList() {
      this.loading = true
      this.$http.posts('serviceManagementList', this.paging, '', false)
        .then(res => {
          let data = res.data
          this.total = data.total || 0
          let list = data.list || []
          this.tableData = list.map((item, index) => {
            return {
              no: 10 * (this.paging.pageNumber - 1) + (index + 1),
              ...item
            }
          })
          this.loading = false
        }).catch((er) => {
          this.loading = false
        })
    },
    // 点击查询
    search() {
      this.paging = { ...this.paging, ...this.flowQuery }
      this.paging.pageNumber = 1
      this.paging.pageSize = 10
      this.getList()
    },
    // 一页显示多少条
    handleSizeChange(val) {
      this.paging.pageSize = val
      this.getList()
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.paging.pageNumber = val
      this.getList()
    },
    // 禁用启用
    examine(row) {
      this.serviceList = row
      this.dialogVisible = true
    },
    handleConfirm() {
      let { orderId, status } = this.serviceList
      status = status === 2 ? 6 : 2
      this.$http.posts('editOrderStatus', '', { orderId, status }, false)
        .then(res => {
          this.dialogVisible = false
          this.getList()
        })
    }
  }
}
</script>

<style lang="less">
#flowSheet {
  position: relative;
  min-height: calc(100vh - 186px);
}
</style>
