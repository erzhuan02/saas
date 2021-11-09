<template>
  <div id="busiModule">
    <div :class="modulePage === 1 ? 'logo flex-hcvc' : ''">
      <ul :class="modulePage === 1 ? 'autoPop flex-whc' : 'headPop flex-w'" v-show="modulePage === 1 ? true : showArrow" @mouseover="showArrow = true" @mouseout="showArrow = false">
        <li class="pointer" v-for="item in payList" :key="item.moduleId" @click="jumpTo(item)">
          <img :src="item.iconUrl" alt />
          <p>{{ $t(item.menuNameEn) }}</p>
        </li>
        <li class="pointer" v-for="item in freeList" :key="item.moduleId" @click="jumpTo(item)">
          <img :src="item.iconUrl" alt />
          <p>{{ $t(item.menuNameEn) }}</p>
        </li>
        <li v-if="isIe" style="width: 0;height: 0;padding: 0;margin: 0;">
          <iframe src="about:blank" frameBorder="0" marginHeight="0" marginWidth="0" style="position:absolute;visibility:inherit;top:0px;left:0px;height:100%;width:100%;z-Index:-1;opacity:0;filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';"></iframe>
        </li>
      </ul>
    </div>
    <el-dialog class="moduleDlg" :title="$t('dialog.tips')" :visible.sync="dialogVisible" :close-on-click-modal="false" :show-close="false" width="30%">
      <p>{{ dialogMes }}</p>
      <span slot="footer">
        <el-button @click="operAuth('cancel')">{{ $t('button.auto') }}</el-button>
        <el-button type="primary" @click="operAuth('confirm')">{{ $t('button.manual') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: ['modulePage'],
  data() {
    return {
      payList: [],
      freeList: [],
      moduleId: '',
      activeName: '', // 跳转门店/相机点位路由携带的query
      showArrow: false, // 控制左上角菜单的显隐
      dialogVisible: false,
      dialogMes: '',
      random: Math.floor(Math.random() * 100),
      isIe: false
    }
  },
  computed: {
    ...mapGetters(['language', 'user', 'module', 'authorization'])
  },
  created() {
    this.isIe = this.$utils.myBrowserIsIE()
    let list = JSON.parse(sessionStorage.getItem('module')) || this.module
    list.paylist.forEach(item => {
      var iconUrl = item.iconUrl.replace('/basicplatform', '')
      item.iconUrl = this.$api.staticUrl + iconUrl
    })
    list.freelist.forEach(item => {
      var iconUrl = item.iconUrl.replace('/basicplatform', '')
      item.iconUrl = this.$api.staticUrl + iconUrl
    })
    this.payList = list.paylist
    this.freeList = list.freelist
  },
  mounted() { },
  methods: {
    operAuth(type) {
      if (type == 'cancel') {
        this.$http.posts('autoOverAuth', '', { moduleId: this.moduleId }, true)
          .then(res => {
            this.dialogVisible = false
          })
      } else {
        // 有的只有门店，如果现在授权的门店数量 > 买的门店总数，要跳到门店授权
        // 其他跳到相机点位授权模块
        this.$router.push({
          path: '/userShop',
          query: {
            activeName: this.activeName
          }
        })
        setTimeout(() => {
          this.dialogVisible = false
        }, 1000)
      }
    },
    // 跳转至
    jumpTo(value) {
      let { menuUrl, isBuy, moduleId, status, moduleName } = value
      // status为0时，不调取接口
      this.moduleId = moduleId
      sessionStorage.setItem('currentUrl', menuUrl)
      /**
       * 1.moduleId为1 跳转sass基础平台，其余情况跳转其他系统
       * 2.点击直接即时调用moduleOverAuthList接口，不用判断isBuy是否购买 ? 1购买 ：0未购买弹出提示
       *   2-1.resCode为0成功跳转, 为-1时情况进catch
       */
      // if (isBuy == 1) {
      this.$http.posts('moduleOverAuthList', '', { moduleId }, { showErrorMsg: false })
        .then(res => {
          this.showArrow = false
          if (moduleId == 1) {
            this.$router.push('/userWelcome')
          } else if (moduleId == 14) {
            this.$router.push('/vsWelcome')
          } else {
            this.$router.push({
              path: '/iframeIndex/' + moduleId
            })
          }
          // 6自检 9督导
          // this.port = this.$utils.getUrlPort(menuUrl)
          // if ((moduleId == 6 && this.port == 9000) || moduleId == 9) {
          // 解决浏览器后退再次点入某个模块因为src未变导致进入失败，给url后面拼接一个随机数
          if (moduleId == 9) {
            this.src = menuUrl + '?a=' + this.random
          } else {
            this.src = menuUrl + '?a=' + Math.floor(Math.random() * 10)
          }
          this.$emit('input', this.src)
        })
        .catch(res => {
          if (typeof res === 'string') { return }
          // resCode为0或者-1两个值
          // 1.resCode为0，成功直接跳各系统
          // 2.resCode为-1的情况,如果是设备管理就弹消息框，其他查看extMsg的值，分如下情况
          // 2.1 extMsg为空''，弹出消息提示
          // 2.2 extMsg为空'2'，弹出对话框。有权限的话，手动取消的话跳到门店授权页面。自动调接口
          // 2.1 extMsg为空'3'，弹出消息提示。有权限的话，手动取消的话跳到相机点位授权页面。自动调接口
          var errMsg = this.$t(`code.${res.resMsg}`)
          var errArr
          if (res.resMsg === 'S00072' || res.resMsg === 'S00073') {
            errArr = res.data.split(',')
            errArr.forEach((item, index) => {
              var reg = new RegExp(`xx${index}`, 'gi')
              errMsg = errMsg.replace(reg, item)
            })
          }
          if (res.resMsg === 'S00210') {
            errMsg = '【' + moduleName + '】' + errMsg
          }
          // console.log(errArr, this.$t(`code.${res.resMsg}`), errMsg, res)
          if (moduleId === 3) { // 设备管理
            this.$utils.$message({
              type: 'warning',
              message: errMsg,
              customClass: 'tipBoxs'
            })
          } else if (res.extMsg === '2') {
            this.$utils.getButton('/userShop', 2).then(res => {
              if (res.deauthorization) {
                this.dialogMes = errMsg
                this.dialogVisible = true
                this.activeName = 'second'
              } else {
                // 没有撤销授权门店的权限
                this.$utils.$message({
                  type: 'warning',
                  message: this.$t('message.authProblem'),
                  customClass: 'tipBoxs'
                })
              }
            })
          } else if (res.extMsg === '3') {
            this.$utils.getButton('/userShop', 2).then(res => {
              if (res.deAuthCamera) {
                this.dialogMes = errMsg
                this.dialogVisible = true
                this.activeName = 'third'
              } else {
                // 没有撤销授权相机点位的权限
                this.$utils.$message({
                  type: 'warning',
                  message: this.$t('message.authProblem1'),
                  customClass: 'tipBoxs'
                })
              }
            })
          } else {
            this.$utils.$message({
              type: 'warning',
              message: errMsg,
              customClass: 'tipBoxs'
            })
          }
        })
      // } else {
      //   this.$utils.$message({
      //     type: 'warning',
      //     message: this.$t('setting.toBuy'),
      //     customClass: 'tipBoxs'
      //   })
      // }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/color.less';
#busiModule {
  .logo {
    height: calc(100vh - 74px);
    ul.autoPop {
      max-width: 880px;
      li {
        width: 6.8rem;
        box-sizing: border-box;
        overflow: hidden;
        padding: 1rem 0.4rem;
        img {
          width: 100%;
          height: auto;
          // height: 6.5rem;
        }
        p {
          text-align: center;
          font-size: 0.8rem;
        }
      }
    }
  }
  ul.headPop {
    width: 800px;
    height: auto;
    background: #fff;
    position: absolute;
    top: 56px;
    left: 0;
    z-index: 9001;
    padding: 13px 10px;
    border-radius: 10px;
    li {
      width: 130px;
      text-align: center;
      padding: 5px 0;
    }
    p {
      color: @text;
      line-height: 20px;
    }
    img {
      width: 120px;
      height: 120px;
      margin-top: 0;
    }
  }
  .moduleDlg {
    z-index: 9002 !important;
  }
}
</style>
<style lang="less">
@import '../assets/color.less';
.el-message.tipBoxs {
  background-color: #464a56;
  border-color: #464a56;
  z-index: 9003 !important;
  i.el-message__icon.el-icon-warning {
    color: @danger;
  }
  p.el-message__content {
    color: #fff;
  }
}
</style>
