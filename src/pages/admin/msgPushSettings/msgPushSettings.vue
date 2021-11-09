<template>
  <div id="msgPushSeetings">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('tabs.productService')" name="first">
        <product v-if="activeName === 'first'"></product>
      </el-tab-pane>
      <el-tab-pane :label="$t('tabs.accountInfo')" name="second">
        <account v-if="activeName === 'second'"></account>
      </el-tab-pane>
      <el-tab-pane :label="$t('tabs.pushPeriod')" name="third">
        <period v-if="activeName === 'third'"></period>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Product from '@/pages/admin/msgPushSettings/product'
import Account from '@/pages/admin/msgPushSettings/account'
import Period from '@/pages/admin/msgPushSettings/period'
export default {
  components: {
    Product,
    Account,
    Period
  },
  data() {
    return {
      activeName: 'first' // tab栏高亮
    }
  },
  computed: {},
  watch: {
    // '$route': {
    //   handler: function (to, from) {
    //     this.activeName = to.query.activeName || 'first'
    //   },
    //   immediate: true
    // }
  },
  created() { },
  mounted() { },
  methods: {}

}
</script>

<style lang="less">
#msgPushSeetings {
  .comTitle {
    padding: 0 10px;
  }
  .form {
    display: inline-block;
    & > .el-form-item {
      min-width: 440px;
    }
    .el-form-item {
      height: auto;
      margin-bottom: 0;
      .el-form-item__content {
        font-size: 16px;
      }
      .flex {
        margin: 0 30px 22px 0;
      }
      .el-checkbox {
        vertical-align: top;
        .el-checkbox__label {
          font-size: 16px;
        }
      }
      .el-input {
        width: 80px;
        .el-input__inner {
          height: 35px;
          text-align: center;
        }
      }
      .every {
        margin-right: 15px;
      }
      // .el-form-item__error {
      //   width: 100%;
      //   text-align: center;
      // }
    }
  }
}
</style>
