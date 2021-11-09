<template>
  <div class="paging">
    <div class="result clearfix">
      <div class="currentTotal">{{ $t('common.currentPage') }} {{ pageLength }} {{ $t('common.unit') }}</div>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :current-page.sync="pageNumber" layout="prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageLength: 0,
      pageNumber: 1, // 当前页
      pageSize: 10, // 一页显示多少条
      total: 0,
      pageData: []
    }
  },
  props: ['data', 'initPage'],
  mounted() {
    this.init()
  },
  watch: {
    pageData(val) {
      this.$emit('pageData', val)
    },
    data(val) {
      this.total = this.data.length
      this.pageData = this.calcuData(this.pageNumber, this.pageSize)
      this.$emit('pageData', this.pageData)
      this.pageLength = this.pageData.length
    },
    initPage(val) {
      if (val) this.init()
    }
  },
  methods: {
    init() {
      this.pageNumber = 1
      this.pageSize = 10
      this.total = this.data.length
      this.pageData = this.calcuData(this.pageNumber, this.pageSize)
      this.pageLength = this.pageData.length
    },
    /**
     * 计算分页数据 传入 pageNumber pageSize
     * 返回分页后的数组
     */
    calcuData(pageNumber, pageSize) {
      var start = (this.pageNumber - 1) * this.pageSize
      var end = start + this.pageSize
      return this.data.slice(start, end)
    },
    // 一页显示多少条
    sizeChange(val) {
      this.pageNumber = 1
      this.pageSize = val
      this.pageData = this.calcuData(this.pageNumber, this.pageSize)
      this.pageLength = this.pageData.length
    },
    // 当前多少页
    currentChange(val) {
      this.pageNumber = val
      this.pageData = this.calcuData(this.pageNumber, this.pageSize)
      this.pageLength = this.pageData.length
    }
  }
}
</script>

<style lang="less" scoped>
.paging {
  background: #fff;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
