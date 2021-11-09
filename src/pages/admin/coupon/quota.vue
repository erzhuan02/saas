<template>
  <div id="quota">
    <div class="btnAdd">
      <el-button type="primary" v-if="button.add" @click="dialogVisible = true">{{ $t('button.add') }}</el-button>
    </div>
    <!-- 表格 -->
    <div class="result clearfix">
      <el-table ref="resultTable" stripe border max-height="560" :data="list" v-loading="listLoading" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
        <!-- <el-table-column type="selection"></el-table-column> -->
        <el-table-column prop="faceValueId" :label="$t('coupon.tab1_1')" min-width="100"></el-table-column>
        <el-table-column prop="createTime" :label="$t('coupon.tab1_2')"></el-table-column>
        <el-table-column prop="faceValue" :label="$t('coupon.tab1_3')"></el-table-column>
        <el-table-column prop="userName" :label="$t('coupon.tab1_4')"></el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" v-if="button.delete" icon="el-icon-edit" @click="handleDelete(scope.row)" plain>{{ $t('button.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">{{ $t('common.currentPage') }} {{list.length}} {{ $t('common.unit') }}</div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <!-- 新增对话框 -->
    <el-dialog :title="$t('button.add')" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="closeDialog">
      <el-form ref="dialogForm" :model="deal" label-width="150px" class="clearfix" :rules="dialogRules">
        <el-form-item :label="$t('coupon.tab1_3')" prop="faceValue">
          <el-input v-model.trim="deal.faceValue" :placeholder="$t('placeholder.input')" maxlength="5" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="addCoupon()">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog :title="$t('button.delete')" :visible.sync="dialogVisibleDel" :close-on-click-modal="false">
      <span>{{ $t('coupon.msg2') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleDel = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="toDelete">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $utils from '@/utils'
export default {
  props: ['button'],
  data() {
    return {
      realQuery: {
        pageNumber: 1,
        pageSize: 10,
        cardType: 1
      },
      // 查询结果数据
      list: [],
      total: 0, // 分页数据，总条数
      listLoading: false,
      dialogVisible: false,
      dialogVisibleDel: false,
      deal: {
        faceValue: '' // 代金券面值
      },
      deleteData: ''
    }
  },
  computed: {
    dialogRules() {
      return {
        faceValue: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              var errMsgNotEmpty = this.$t('placeholder.input') + this.$t('coupon.tab1_3')
              var errMsg = this.$t('coupon.msg1')
              if (value === '') {
                callback(new Error(errMsgNotEmpty))
              } else {
                var onlyNum = this.$utils.reg.numberDay
                if (!onlyNum.test(value)) {
                  callback(new Error(errMsg))
                } else {
                  if (value < 10 || value > 50000) {
                    callback(new Error(errMsg))
                  }
                  callback()
                }
              }
            }
          }
        ]
      }
    }
  },
  created() { this.getList() },
  mounted() { },
  methods: {
    // 查询表单
    getList() {
      this.listLoading = true
      // this.realQuery = { ...this.paging }
      this.$http.posts('searchPageVoucher', this.realQuery)
        .then(res => {
          // 卡类型 1.代金券 2.抵用券
          this.listLoading = false
          let data = res.data
          this.total = data.total || 0
          this.list = data.list || []
        })
        .catch(er => {
          this.listLoading = false
        })
    },
    // 分页事件
    handleSizeChange(val) {
      this.realQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.realQuery.pageNumber = val
      this.getList()
    },
    // 点击删除
    handleDelete(data) {
      this.deleteData = data
      this.dialogVisibleDel = true
    },
    // 删除
    toDelete: $utils.debounce(function () {
      this.$http.posts('deleteVoucher', '', { id: this.deleteData.faceValueId, cardType: 1 }, true)
        .then(res => {
          if (this.list.length === 1) {
            this.realQuery.pageNumber = 1
          }
          this.getList()
          this.dialogVisibleDel = false
        })
    }),
    // 关闭对话框时
    closeDialog() {
      this.deal.faceValue = ''
      if (this.$refs['dialogForm'] !== undefined) {
        this.$refs['dialogForm'].clearValidate()
      }
    },
    // 添加
    addCoupon: $utils.debounce(function () {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.$http.posts('addVoucher', { faceValue: this.deal.faceValue, cardType: 1 }, '', true)
            .then(res => {
              this.getList()
              this.dialogVisible = false
            })
        }
      })
    })

  }
}
</script>

<style lang="less">
#quota {
  .btnAdd {
    // width: 150px;
    padding-left: 10px;
  }
}
</style>
