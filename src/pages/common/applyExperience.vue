<template>
  <div id="applyExperience">
    <div class="banner flex-hcvc">
      <p>{{ $t('loginFooter.experience') }}</p>
    </div>
    <div class="body">
      <div class="bodyContent">
        <OnlineMsg></OnlineMsg>
      </div>
    </div>
  </div>
</template>

<script>
import OnlineMsg from '@/components/onlineMsg'
export default {
  components: {
    OnlineMsg
  }
}
</script>

<style lang="less">
@import '../../assets/color';
@import '../../assets/css/compatibility.less';
#applyExperience {
  .banner {
    background: url(../../assets/images/common/applyExperience_1.png) no-repeat
      center/cover;
  }
  .body {
    .bodyContent {
      max-width: 900px;
    }
    .msgContent {
      padding: 0;
    }
    .el-dialog__footer {
      border: none;
      .flex();
      .justify-content(center);
    }
    .cancel {
      display: none;
    }
    .sendBtn {
      margin-left: 0;
      width: auto;
    }
  }
}
@media only screen and (max-width: 767px) {
  div#applyExperience {
    .body {
      .bodyContent {
        width: 100%;
      }
      .el-form-item .el-form-item__label {
        display: block;
      }
      .el-form {
        margin-top: 0;
      }
    }
  }
}
</style>
