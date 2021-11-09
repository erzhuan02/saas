<template>
  <div id="myPartner">
    <div class="result clearfix">
      <el-table class="audited" ref="resultTable" stripe border max-height="650" :data="tableData" :empty-text="$t('friend.noPartner')" style="width: 100%;" highlight-current-row>
        <el-table-column prop="no" :label="$t('common.no')"></el-table-column>
        <el-table-column prop="companyName" :label="$t('friend.partnerName')"></el-table-column>
        <el-table-column prop="method" :label="$t('friend.invitedMethod')"></el-table-column>
        <el-table-column prop="isRelated" :label="$t('expend.state')"></el-table-column>
        <el-table-column prop="createTime" :label="$t('friend.correlationTime')"></el-table-column>
        <el-table-column :label="$t('common.operation')">
          --
          <!-- <template slot-scope="scope">
            <div class="flex-hcvc">
              <el-button size="mini" type="primary" @click="examine(scope, 1)" plain v-if="button.cancel">{{ $t('button.cancel') }}</el-button>
              <el-button size="mini" type="primary" @click="examine(scope, 2)" plain v-if="button.details">{{ $t('button.details') }}</el-button>
            </div>
          </template> -->
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http.posts('myPartnerList', '', '', false)
        .then(res => {
          let data = res.data
          let list = data.map((item, index) => {
            if (item.isRelated === 0) {
              item.isRelated = '未关联'
            } else if (item.isRelated === 1) {
              item.isRelated = '已关联'
            } else if (item.isRelated === 2) {
              item.isRelated = '已报备'
            } else if (item.isRelated === 3) {
              item.isRelated = '已失效'
            }
            return {
              no: 1,
              ...item,
              method: item.method === 1 ? '线下' : '线上',
              invitPhoneNumb: item.invitPhoneNumb && this.$utils.exchangePrefix(item.invitPhoneNumb)
            }
          }) || []
          this.tableData = list
        })
    }
  }
}
</script>

<style lang="less" scoped>
#myPartner {
}
</style>
