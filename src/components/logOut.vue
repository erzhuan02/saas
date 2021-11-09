<template>
  <span clsss='flex'>
    <span>{{ $t('home.user') }}: {{ userName }} &nbsp;</span>
    <img class="pointer" src="../assets/images/signOut.png" @click="dialogVisible = true">
    <div class="logOut">
      <el-dialog :close-on-click-modal="dialogClose" :title="$t('dialog.tips')" :visible.sync="dialogVisible" width="30%">
        <span>{{ $t('dialog.sureToExit') }}</span>
        <span slot="footer">
          <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
          <el-button type="primary" @click="loginOut">{{ $t('button.confirm') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </span>
</template>

<script>
export default {
  data() {
    return {
      dialogClose: false,
      userName: '',
      dialogVisible: false
    }
  },
  mounted() {
    this.userName = JSON.parse(sessionStorage.getItem('user')).userName
  },
  methods: {
    // 退出
    loginOut() {
      if (this.$route.path !== '/protocol') {
        this.$http.posts('logOut')
          .then(res => {
            this.$router.push('/login')
          })
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped lang="less">
img {
  margin-top: 18px;
  float: right;
}
</style>
