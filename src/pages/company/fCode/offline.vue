<template>
  <div id="offline">
    <div class="box">
      <p>{{ $t('friend.invWay1') }}</p>
      <p class="sub">{{ $t('friend.invWay1_1') }}</p>
      <div class="flex">
        <p class="sub">{{ $t('home.nav61') }} {{fCode}}</p>
        <el-button type="primary" size="small" v-clipboard:copy="fCode" v-clipboard:success="onCopy" v-clipboard:error="onError">{{ $t('button.copy') }}</el-button>
      </div>
    </div>
    <div class="box">
      <p>{{ $t('friend.invWay2') }}</p>
      <p class="sub">{{ $t('friend.invWay2_1') }}</p>
      <div class="flex">
        <p class="sub">{{ $t('friend.spoLinks') }} {{link}}</p>
        <el-button type="primary" size="small" v-clipboard:copy="link" v-clipboard:success="onCopy" v-clipboard:error="onError">{{ $t('button.copy') }}</el-button>
      </div>
    </div>
    <div class="box">
      <p>{{ $t('friend.invWay3') }}</p>
      <p class="sub">{{ $t('friend.invWay3_1') }}</p>
      <div class="qrCode">
        <img :src="qRCode" />
        <el-button type="primary" size="small" @click.stop.prevent="handleDownloadQrImg">{{ $t('button.downloadQrCode') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fCode: '',
      link: '',
      qRCode: '',
      prefixBase64: 'data:image/jpeg;base64,',
      qRName: ''
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http.posts('queryCode', '', '', false)
        .then(res => {
          let data = res.data
          this.fCode = data.friendNumb
          this.link = data.content
          this.qRCode = this.prefixBase64 + data.qRCode
          this.qRName = data.qRName
        })
    },
    // 点击下载图片
    handleDownloadQrImg() {
      // 这里是获取到的图片base64编码
      const imgUrl = this.qRCode
      // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片
      if (window.navigator.msSaveOrOpenBlob) {
        let bstr = atob(imgUrl.split(',')[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        let blob = new Blob([u8arr])
        window.navigator.msSaveOrOpenBlob(blob, this.qRName + '.' + 'jpg')
      } else {
        // 这里就按照chrome等新版浏览器来处理
        let a = document.createElement('a')
        a.href = imgUrl
        a.setAttribute('download', this.qRName)
        a.click()
      }
    },
    onCopy() {
      this.$utils.$message({
        message: this.$t('message.copySuccess'),
        type: 'success'
      })
    },
    onError() {
      this.$utils.$message({
        message: this.$t('message.copyError'),
        type: 'error'
      })
    }
  }
}
</script>

<style lang="less" scoped>
#offline {
  padding: 2% 3%;
  .box {
    margin-bottom: 30px;
    p {
      line-height: 32px;
    }
    .sub {
      padding-left: 20px;
    }
    .flex {
      .el-button--small {
        margin-left: 20px;
      }
    }
    .qrCode {
      width: 500px;
      img {
        display: block;
        margin: 20px auto;
        width: 200px;
        height: 200px;
      }
      .el-button--small {
        display: block;
        margin: 20px auto;
      }
    }
  }
}
</style>
