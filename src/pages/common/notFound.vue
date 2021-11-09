<template>
  <div class="noPage">
    <img src="@/assets/images/notFound.jpg" alt="404" class="notFound">
    <h2>Oops..{{ $t('home.error') }}</h2>
    <p>
      <!-- 将在 {{ time }} 秒后，返回首页！ -->
      <router-link to="/">{{ $t('home.goIndex') }}</router-link>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: 5,
      timerId: null
    }
  },
  created() {
    //   this.timerId = setInterval(() => {
    //     this.time--
    //     if (this.time <= 0) {
    //       this.$router.push('/')
    //       clearInterval(this.timerId)
    //     }
    //   }, 1000)
  }
}
</script>

<style lang="less" scoped>
.noPage {
  background: #fff;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.notFound {
  width: 500px;
  height: 400px;
  display: block;
  margin: 15% auto 0;
}
h2,
p {
  text-align: center;
  line-height: 40px;
}
</style>
