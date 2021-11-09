<template>
  <div id="iframeIndex">
    <busi-module ref="modules" :modulePage="3" v-model="src"></busi-module>
    <iframe id="loadBox" width="100%" height="100%" :src="src" allowfullscreen allowtransparency></iframe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BusiModule from '@/components/busiModule'
let vm
window.addEventListener('message', function (event) {
  let data = event.data
  console.log('post message:')
  console.log(data)
  // showMenu控制左上角箭头菜单的显隐
  if (Object.prototype.toString.call(data.showMenu) === '[object Boolean]') {
    console.log(vm.$refs)
    vm.$refs.modules.showArrow = data.showMenu
  }
  // 控制语言切换
  if (data.language) {
    vm.$store.commit('LANGUAGE', data.language)
  }
  // 若传入openUrl，则打开一个新页面
  if (data.openUrl) {
    window.open(data.openUrl, '_blank')
  }
  // 关闭当前窗口
  if (data.close) {
    window.open('', '_top').close()
  }
  // 是否已超时,超时时 清空调用token定时器
  if (data.isTimeOut) {
    window.clearInterval(sessionStorage.getItem('tokenTimer'))
  }
})
window.onunload = function () {
  const iframe = document.querySelector('#loadBox')
  iframe.postMessage({ windowClose: true }, vm.src)
}
window.addEventListener('popstate', function (e) {
  vm.loading.close()
}, false)
export default {
  components: { BusiModule },
  data() {
    vm = this
    return {
      src: '',
      showArrow: false, // 控制左上角菜单的显隐
      userInfo: {},
      random: Math.floor(Math.random() * 100)
    }
  },
  computed: {
    ...mapGetters(['language', 'user', 'module', 'authorization'])
  },
  created() { },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem('user')) || this.user
    this.init()
  },
  methods: {
    init() {
      let that = this
      that.loading = this.$loading({
        lock: true,
        text: this.$t('message.loading'),
        spinner: 'el-icon-loading'
      })
      let type = that.$route.params.type
      // 9督导
      let url = sessionStorage.getItem('currentUrl')
      // let url = "http://192.168.2.214:8087/#/home"
      if (type == 9) {
        that.src = url + '?a=' + this.random
      } else {
        that.src = url
      }
      // 监听iframe是否加载完成
      this.$nextTick(() => {
        const iframe = document.querySelector('#loadBox')
        if (iframe.attachEvent) {
          // IE
          iframe.attachEvent('onload', function () {
            // ie兼容写法 解决报错 无法获取未定义或 null 引用的属性"contentWindow"
            // const iframe = document.getElementById('loadBox').contentWindow
            const iframe = document.getElementById(top.$('#loadBox:visible').attr('id')).contentWindow
            // const iframe = iframe.contentWindow.document || iframe.contentDocument
            const token = sessionStorage.getItem('authorization') || that.authorization
            iframe.postMessage(
              {
                authorization: token,
                regisAgain: JSON.stringify({ user: that.userInfo }),
                language: that.language,
                companyId: that.userInfo.companyId
              },
              that.src
            )
            that.loading.close()
          })
        } else {
          // 非IE
          iframe.onload = function () {
            const iframe = document.getElementById('loadBox').contentWindow
            const token = sessionStorage.getItem('authorization') || that.authorization
            iframe.postMessage(
              {
                authorization: token,
                regisAgain: JSON.stringify({ user: that.userInfo }),
                language: that.language,
                companyId: that.userInfo.companyId
              },
              that.src
            )
            that.loading.close()
          }
        }
      })
      // document.domain = 'six-armscloud.com'
    }
  }
}
</script>

<style lang="less" scoped>
#iframeIndex {
  height: 100%;
}
</style>
