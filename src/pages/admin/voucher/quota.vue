<template>
  <div id="quota">
    <div class="routerView flex1">
      <div id="scrollView" class="flex-d">
        <div class="btnAdd">
          <el-button type="primary" v-if="button.add" @click="dialogVisible = true" :disabled="tableData.length == 1">{{ $t('button.add') }}</el-button>
        </div>
        <!-- 表单 -->
        <div class="result clearfix">
          <el-table ref="resultTable" stripe border max-height="560" :data="tableData" v-loading="loading" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
            <!-- <el-table-column type="selection"></el-table-column> -->
            <el-table-column prop="faceValueId" :label="$t('coupon.tab1_1')"></el-table-column>
            <el-table-column prop="createTime" :label="$t('coupon.tab1_2')"></el-table-column>
            <el-table-column prop="faceValue" :label="$t('voucher.tab1_1')"></el-table-column>
            <el-table-column prop="userName" :label="$t('coupon.tab1_4')"></el-table-column>
            <el-table-column :label="$t('common.operation')">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" v-if="button.delete" icon="el-icon-edit" @click="handleDelete(scope.row)" plain>{{ $t('button.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 新增对话框 -->
        <el-dialog :title="$t('button.add')" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="closeDialog">
          <el-form ref="dialogForm" :model="deal" label-width="100px" class="clearfix" :rules="dialogRules">
            <el-form-item :label="$t('voucher.tab1_1')" prop="faceValue">
              <el-input v-model.trim="deal.faceValue" :placeholder="$t('placeholder.input')" maxlength="3" clearable></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="addCoupon">{{ $t('button.confirm') }}</el-button>
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
    </div>
  </div>
</template>

<script>
import $utils from '@/utils'
export default {
  data() {
    return {
      tableData: [],
      loading: false,
      dialogVisible: false,
      dialogVisibleDel: false,
      deal: {
        faceValue: '' // 抵用券面值
      },
      deleteData: '',
      activeQuery: {}
    }
  },
  mounted() {
    this.getList()
  },
  props: ['button'],
  computed: {
    dialogRules() {
      return {
        faceValue: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              var errMsgNotEmpty = this.$t('placeholder.input') + this.$t('voucher.tab1_1')
              var errMsg = this.$t('voucher.msg1')
              if (value === '') {
                callback(new Error(errMsgNotEmpty))
              } else {
                var onlyNum = this.$utils.reg.numberDay
                if (!onlyNum.test(value)) {
                  callback(new Error(errMsg))
                } else {
                  if (value < 10 || value > 500) {
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
  methods: {
    // 查询表单
    getList() {
      this.loading = true
      this.activeQuery = { ...this.paging, cardType: 2 }
      this.$http.posts('searchPageVoucher', this.activeQuery)
        .then(res => {
          // 卡类型 1.代金券 2.抵用券
          this.loading = false
          let data = res.data
          this.total = data.total
          this.tableData = data.list || []
        })
        .catch(er => {
          this.loading = false
        })
    },
    // 点击删除
    handleDelete(data) {
      this.deleteData = data
      this.dialogVisibleDel = true
    },
    // 删除
    toDelete: $utils.debounce(function () {
      this.$http.posts('deleteVoucher', '', { id: this.deleteData.faceValueId, cardType: 2 }, true)
        .then(res => {
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
          this.$http.posts('addVoucher', { faceValue: this.deal.faceValue, cardType: 2 }, '', true)
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
