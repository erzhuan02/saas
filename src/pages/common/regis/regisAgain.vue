<template>
  <div id="content">
    <!-- 注册 -->
    <div class="box regis">
      <p class="prevStep btnClrFont hidden-xs-only" @click="back">&lt;{{ $t('button.back') }}</p>
      <p class="title">{{ $t('button.submitAgain') }}</p>
      <div class="reason">
        <p>{{ $t('regis.reason') }}：&nbsp;&nbsp;<span>{{ remark }}</span></p>
        <el-button class="againBtn btnClr" type="primary" @click="submit">{{ $t('button.submitAgain') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      remark: ''
    }
  },
  mounted() {
    let data = JSON.parse(sessionStorage.getItem('user'))
    this.remark = data.remark
  },
  methods: {
    // 点击返回
    back() {
      this.$router.push('/login')
    },
    // 重新提交
    submit() {
      this.$router.push({
        path: '/regisForm',
        query: {
          from: 1
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color';
#content {
  width: 100%;
  height: calc(100vh - 56px);
  background-color: @background;
  .box {
    height: auto;
    min-height: calc(100% - 50px);
    margin: auto;
  }
  .regis {
    .prevStep {
      height: 50px;
      line-height: 50px;
      padding-left: 8%;
      font-size: 16px;
      display: block;
      &:hover {
        cursor: pointer;
      }
    }
    .title {
      text-align: center;
      font-weight: bold;
      font-size: 24px;
    }
    .reason {
      width: 60%;
      margin: 50px auto 0;
      font-size: 16px;
      .againBtn {
        display: table;
        margin: 100px auto 0;
      }
    }
  }
}
@media screen and (max-width: 767px) {
  #content .regis .title {
    padding-top: 24px;
  }
}
</style>
