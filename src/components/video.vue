<template>
  <div id="video">
    <div v-if="isIe">
      <a v-if="!hasIePlayer || updateIePlayer" :href="iePlayerUrl" style="color: #f00;font-size:16px;">{{!hasIePlayer ? $t('common.noIePlayer') : $t('common.updateIePlayer') }}</a>
      <div class="playerBox" v-show="!(!hasIePlayer || updateIePlayer)">
        <object v-show="!isCoverVideo" ref="iePlayer" id="iePlayer" width="100%" height="520px" classid="CLSID:D8FCD348-2F18-4ad6-8615-1C99D2142689"></object>
        <div v-show="isCoverVideo" class="coverVideo"></div>
        <div class="flex-hcvc controls">
          <el-button class="iconButton" :title="iePlay ? $t('common.pause') : $t('common.play')" @click="changePlay(!iePlay)" type="primary" :icon="iePlay ? 'iconfont icon-pause' : 'iconfont icon-play'" :disabled="controlsDisabled"></el-button>
          <el-button class="iconButton" :title="ieMute ? $t('common.unmute') : $t('common.mute')" @click="changeVolumn(!ieMute)" type="primary" :icon="ieMute ? 'iconfont icon-volumn-off' : 'iconfont icon-volumn-on'" :disabled="controlsDisabled"></el-button>
          <!-- <el-button class="iconButton" :title="$t('common.fullScreen')" @click="fullScreen()" type="primary" :icon="'iconfont icon-quanping'" :disabled="controlsDisabled"></el-button> -->
          <el-button :type="cameraData.subStream === 1 ? 'primary' : '' " @click="changeDefinition(1)" :disabled="buttonDisabled">{{ $t('button.SD') }}</el-button>
          <el-button :type="cameraData.subStream === 1 ? '' : 'primary' " @click="changeDefinition(0)" :disabled="buttonDisabled">{{ $t('button.HD') }}</el-button>
        </div>
      </div>
    </div>
    <div v-else class="playerBox">
      <video ref="player" id="player" controls width="100%" height="490" style="object-fit: fill;background:#000"></video>
      <div class="flex-hcvc controls">
        <el-button :type="cameraData.subStream === 1 ? 'primary' : '' " @click="changeDefinition(1)" :disabled="buttonDisabled">{{ $t('button.SD') }}</el-button>
        <el-button :type="cameraData.subStream === 1 ? '' : 'primary' " @click="changeDefinition(0)" :disabled="buttonDisabled">{{ $t('button.HD') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// 使用方法
// <v-player ref="player" @loaded="handleVideoLoaded" @error="handleVideoError" @duration-ended=""></v-player>
// this.$refs.player.create(res) this.$refs.player.destroy()

// import flvjs from 'flv.js/dist/flv.min.js'
import flvjs from '../../static/js/flv.js' // npm引用的有的播放不了，不知道什么原因，引用了本地的
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      iePlayer: null,
      hasIePlayer: false,
      updateIePlayer: false,
      iePlayerUrl: this.$api.iePlayerUrl,
      iePlay: true, // 是否播放
      ieMute: true, // 是否静音

      player: null,
      loadCount: 0, // 循环加载，flv.js控制不要无限加载

      isIe: false,
      controlsDisabled: true, // 是否禁用控制视频按钮，播放失败禁用掉
      buttonDisabled: false, // 是否禁用标高清切换按钮，不管播放成功或失败都解禁，可以重新发请求
      cameraData: {// 相机的数据
        cmrIp: '',
        cmrUuid: '',
        subStream: 1 // 1标清 0高清
      },
      res: {
        src: '', // 播放源
        taskId: '', // 心跳用
        heartBeat: 0 // 心跳用
      },
      playDuration: 1, // 默认播放时长，单位分钟.播放结束后断流
      playDurationId: null, // 播放时长的定时器
      taskId: '', // 用于标识关闭流
      heartBeatTimer: null // 心跳的定时
    }
  },
  computed: {
    ...mapGetters(['isCoverVideo'])
  },
  watch: {},
  created() { this.isIe = !!this.$utils.myBrowserIsIE() },
  mounted() { this.init() },
  methods: {
    // 初始化视频
    init() {
      // ie播放视频时直接关网页还有一会声音，beforeunload中销毁。在销毁钩子函数中移除事件
      window.addEventListener('beforeunload', this.destroy)
      this.$nextTick(() => {
        if (this.isIe) {
          //  for event 注册事件 只能用attachEvent 注册，兼容到ie10，所以改用这种方法
          // var script = document.getElementById('iePlayerScript')
          // if (script) {
          //   // 本地试了可只建一次不销毁，但保险点删了再重建。在销毁钩子函数中已写，此处可不写，双控
          //   script.parentNode.removeChild(script)
          // }
          var scriptDom = document.createElement('script')
          scriptDom.setAttribute('id', 'iePlayerScript')
          scriptDom.setAttribute('for', 'iePlayer')
          scriptDom.event = 'EventMsg(strMsg)'
          scriptDom.appendChild(document.createTextNode('iePlayerListener.playHandler(strMsg)'))
          document.body.appendChild(scriptDom)
          window.iePlayerListener = this
        } else {
          // flv监听成功事件，直接给dom注册，注册一次即可。播放成功，有的会执行多次
          this.$refs.player.addEventListener('canplaythrough', this.playHandler)
        }
      })
    },
    // ie 是否显示播放器插件下载路径
    isShowIePlayerUrl() {
      if (this.iePlayer === null) {
        this.iePlayer = this.$refs.iePlayer
      }
      // 是否有插件
      if (this.iePlayer && this.iePlayer.object) {
        // 有插件
        this.hasIePlayer = true
        // 有插件是否需要更新
        var currentVer = +this.iePlayer.GetPropertyEx('CtrlVersion').replace(/[^0-9]/ig, '')
        var minVer = +this.$api.iePlayerMinVer.replace(/[^0-9]/ig, '')
        // console.log(`currentVer-${currentVer}`, `minVer-${minVer}`)
        if (currentVer < minVer) {
          // 当前版本小于需要的最小版本，需要更新
          this.updateIePlayer = true
          return true
        } else {
          // 不需要更新
          this.updateIePlayer = false
          return false
        }
      } else {
        // 没有有插件
        this.hasIePlayer = false
        this.updateIePlayer = false
        return true
      }
    },
    // 创建并播放视频
    create(res, loadCount) {
      this.$nextTick(() => {
        // loadCount 传对象时，是相机的数据。传数字是flv再次加载
        if (!(res && res.flvUrl)) return
        // flv.js 设置了错误loadCount后连续调用10次
        if (typeof loadCount !== 'number') {
          if (typeof loadCount === 'object') {
            this.cameraData = loadCount // 打开对话框初次时，传了相机的数据，为了请求标高清
          }
          this.destroy() // 清除视频和心跳和关闭流
          this.taskId = res.taskId// 重复调用的没必要保
        }
        this.buttonDisabled = true
        this.res = { ...res, src: res.flvUrl }
        this.taskId = res.taskId// 重复调用的没必要保存
        var { src, taskId, heartBeat } = this.res
        console.log('rtmpVideoSrc:', res.rtmpUrl)
        console.log('flvVideoSrc:', res.flvUrl)
        if (this.isIe) {
          src = res.rtmpUrl
          this.res.src = src
          this.iePlayer = this.$refs.iePlayer
          if (this.iePlayer === null) {
            this.$utils.$message({
              message: `DvoRTSPNetOCX ${this.$t('common.loadingFailed')}`,
              type: 'error'
            })
            return
          }
          if (this.isShowIePlayerUrl()) {
            return
          }
          var ieThat = this
          setTimeout(() => {
            this.iePlayer.SetProperty('RtmpURL', src)
            this.iePlayer.Play()
          }, 500)
          ieThat.heartBeat(taskId, heartBeat)// 怕播放器长时间播不出断流，也先调用心跳
          // setTimeout(() => { // 监听成功后调用
          //   ieThat.heartBeat(taskId, heartBeat)// 调用心跳
          //   ieThat.$emit('loaded', ieThat.res)
          // }, 0)
        } else {
          // flv.js用的
          if (loadCount === undefined) {
            this.loadCount = 0
          }
          this.loadCount++
          // console.log('this.loadCount', this.loadCount)
          var element = this.$refs.player
          // 去掉谷歌的画中画功能
          // console.log(element, element.pictureInPictureElement, element.requestPictureInPicture,element.exitPictureInPicture)
          // console.log(element.pictureInPictureEnabled, element.disablePictureInPicture)
          if (element) element['disablePictureInPicture'] = true
          var mediaDataSource = {
            type: 'flv',
            isLive: true,
            hasAudio: true,
            hasVideo: true,
            url: src
          }
          this.player = flvjs.createPlayer(mediaDataSource, {
            enableWorker: true, // 多线程工作
            enableStashBuffer: false, // 启用缓存
            stashInitialSize: 128, // 缓存大小
            isLive: true, // 是否直播，会覆盖上面的配置
            lazyLoad: false, // 懒加载，如果缓存到足够的秒数，则停止下载
            lazyLoadMaxDuration: 3 * 60, // 懒加载最多的秒数
            lazyLoadRecoverDuration: 30, // 缓存剩余秒数时继续下载
            deferLoadAfterSourceOpen: false, // 在媒体源打开事件触发后进行加
            autoCleanupSourceBuffer: true, // 自动清理缓存
            autoCleanupMaxBackwardDuration: 3 * 60, // 当向后缓冲区持续时间超过此值（以秒为单位）时，对源缓冲区进行自动清理
            autoCleanupMinBackwardDuration: 2 * 60, // 指示以秒为单位保留向后缓冲区的持续时间
            statisticsInfoReportInterval: 600, //
            fixAudioTimestampGap: false // 音视频不同步
            // reuseRedirectedURL: true,//重用301/302重定向url，用于随后的请求，如查找、重新连接等。
            // enableStashBuffer: false,
            // lazyLoadMaxDuration: 3 * 60,
            // seekType:'range'
          })
          this.player.attachMediaElement(element)
          this.player.load()
          this.player.play()
          var that = this
          this.player.on('error', err => {
            if (that.res.src && that.loadCount < 10) {
              that.player.destroy()
              that.player = null // 设置后that.destroy就不执行，上面也判断that.loadCount，双控，可不写
              that.create(that.res, that.loadCount)// 重新加载下
            } else {
              that.destroy() // 清除视频和心跳
              console.log('视频加载出错' + err)
              this.$utils.$message({
                message: this.$t('common.playFailed'),
                type: 'error'
              })
              that.$emit('error', err)
            }
          })
          that.heartBeat(taskId, heartBeat)// 怕播放器长时间播不出断流，也先调用心跳
          // setTimeout(() => {// 监听成功后调用
          //   that.heartBeat(taskId, heartBeat)// 调用心跳
          //   that.$emit('loaded', that.res)
          // }, 0)
          // 3：因为loading_complete有的加载不到，直接在init中给video标签注册canplaythrough事件代替播放成功
          // this.player.on('scriptdata_arrived', res => {
          //   // console.log('flv-scriptdata_arrived', res)
          //   that.heartBeat(taskId, heartBeat)// 调用心跳
          //   that.$emit('loaded', that.res)
          // })
        }
      })
    },
    // 监听播放的状态事件
    playHandler(status) {
      if (this.isIe) {
        // 增加超时消息： “3”（目前“1”是连接断开，“2”连接成功，“3”超时）
        console.log('iePlayHandler', status)
        if (status === '1') {
          // 有时此监听函数会刚开始状态1，很快会再次执行状态2.但这种情况很少，宋姐那边会自动重新连，暂时先不销毁
          this.controlsDisabled = true
        } else if (status === '2') {
          // 播放的时候
          if (this.ieMute) {
            this.stopSound()
          } else {
            this.startSound()
          }
          // 播放成功
          this.iePlay = true
          this.controlsDisabled = false
          this.buttonDisabled = false
          this.$emit('loaded', this.res)
          // 开启播放定时
          this.startPlayDuration()
        } else {
          this.destroy() // 清除视频和心跳
          console.log('视频加载出错' + status)
          this.$utils.$message({
            message: this.$t('common.playFailed'),
            type: 'error'
          })
          this.$emit('error', status)
        }
      } else {
        // flv播放成功
        this.controlsDisabled = false
        this.buttonDisabled = false
        this.$emit('loaded', this.res)
        // 开启播放定时
        this.startPlayDuration()
      }
    },
    // ie 切换播放状态
    changePlay(status) {
      if (status) {
        this.play() // 播放
      } else {
        this.pause() // 暂停
      }
    },
    // ie 切换声音音状态
    changeVolumn(status) {
      if (status) {
        this.stopSound()// 静音
      } else {
        this.startSound()// 取消静音
      }
    },
    // 暂停后再播放视频
    play() {
      if (this.isIe && this.iePlayer && this.hasIePlayer) {
        // ie属于是再次播放
        this.iePlayer.SetProperty('PlayMode', 'pause0')
        this.iePlay = true
      } else if (this.player) {
        this.player.play()
      }
    },
    // 暂停视频
    pause() {
      if (this.isIe && this.iePlayer && this.hasIePlayer) {
        this.iePlayer.SetProperty('PlayMode', 'pause1')
        this.iePlay = false
      } else if (this.player) {
        this.player.pause()
      }
    },
    // ie开启声音
    startSound() {
      if (this.isIe && this.iePlayer && this.hasIePlayer) {
        this.iePlayer.StartSound()
        this.ieMute = false
      }
    },
    // ie关闭声音
    stopSound() {
      if (this.isIe && this.iePlayer && this.hasIePlayer) {
        this.iePlayer.StopSound()
        this.ieMute = true
      }
    },
    // 全屏
    fullScreen() {
      if (this.isIe && this.iePlayer && this.hasIePlayer) {
        this.iePlayer.SetProperty('PlayerScale', 'FullScreen')
      }
    },
    // 销毁视频和心跳
    destroy(isInit) {
      // isInit 用来对话框关闭切换相机时，恢复静音和播放按钮，清空相机数据
      // 销毁对象
      if (this.isIe && this.iePlayer && this.hasIePlayer) {
        // try catch 报错不要阻碍下面代码的执行
        try {
          this.iePlayer.Stop()
          // this.iePlayer.StopSound()//stop()就已经停止声音,写不写都可，双控吧
        } catch (error) {
          console.log('video-destroy-error:' + error)
        }
        // this.iePlayer = null
        this.res = {}
        this.iePlayer.SetProperty('PlayerScale', '')
        if (isInit) {
          this.ieMute = true
          this.iePlay = true
        }
      } else if (this.player) {
        try {
          this.player.pause()
          this.player.unload()
          this.player.detachMediaElement()
          this.player.destroy()
        } catch (error) {
          console.log('video-destroy-error:' + error)
        }
        this.player = null
        this.res = {}
      }
      if (isInit) { this.cameraData = {} }
      this.controlsDisabled = true// 禁用控制视频按钮
      this.buttonDisabled = false// 禁用标高清按钮
      this.clearPlayDuration()// 清除播放时长的定时器
      this.clearHeartBeat()// 清除心跳
      this.closeVideo()// 关闭流

      // 获取全屏dom,非全屏为null
      var fullscreenEle = document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement
      if (fullscreenEle) {
        document.exitFullscreen() // 退出全屏
      }
    },
    // 开启播放时长的定时器
    startPlayDuration() {
      this.clearPlayDuration()
      this.playDurationId = window.setTimeout(() => {
        // console.log('对话框关闭')
        this.$emit('duration-ended')
        // this.previewDialogVisible = false
        this.$utils.$message({
          message: this.$t('message.endOfPlay'),
          type: 'info',
          duration: 4000
        })
      }, this.playDuration * 60000)
    },
    // 清除播放时长的定时器
    clearPlayDuration() {
      if (this.playDurationId) {
        window.clearTimeout(this.playDurationId)
        this.playDurationId = null
      }
    },
    // 心跳
    heartBeat(taskId = this.taskId, heartBeat = this.res.heartBeat, susFun) {
      // console.log('this.heartBeatTimer', this.heartBeatTimer)
      this.clearHeartBeat()
      this.heartBeatTimer = window.setInterval(() => {
        if (taskId !== '' && taskId !== undefined && taskId !== null) {
          this.$http.posts('playHeartbeat', '', { taskId }, { showErrorMsg: false })
            .then(res => {
              susFun && susFun(res)
              // throw Error
            })
        }
      }, (heartBeat || 10) * 1000)
    },
    // 关闭心跳
    clearHeartBeat() {
      // console.log('clearHeartBeat', this.heartBeatTimer)
      if (this.heartBeatTimer) {
        window.clearInterval(this.heartBeatTimer)
        this.heartBeatTimer = null
      }
    },
    // 关闭流,在切换高/标清，还有就是对话框关闭
    closeVideo() {
      // console.log('closeVideo-taskId', this.taskId)
      var taskId = this.taskId
      if (taskId !== '' && taskId !== undefined && taskId !== null) {
        this.$http.posts('closeCmrVideo', '', { taskId }).then((res) => { })
        this.taskId = ''
      }
    },
    // 请求接口获取到播放地址
    getSrc(cameraData) {
      // console.log(cameraData)
      if (!(cameraData && cameraData.cmrUuid)) return
      this.buttonDisabled = true
      this.$http.posts('getRealTimeVideo', cameraData).then((res) => {
        this.create(res.data)
      }).catch(er => {
        console.log(er)
        this.buttonDisabled = false
      })
    },
    // 切换标高清
    changeDefinition(definition = 1) {
      // definition 0高清 1标清
      this.destroy()
      this.cameraData.subStream = definition
      this.getSrc(this.cameraData)
    }
  },
  beforeDestroy() {
    // 路由直接跳转的时候
    this.destroy()
    window.removeEventListener('beforeunload', this.destroy)
    var script = document.getElementById('iePlayerScript')
    if (script) {
      // 本地试了可只建一次不销毁，但保险点删了再重建
      script.parentNode.removeChild(script)
    }
    this.$store.commit('IS_COVER_VIDEO', false)
  }
}
</script>

<style lang="less">
@import '../assets/color';
#video {
  min-height: 40px;
  .playerBox {
    .controls {
      margin-top: 20px;
      .iconButton {
        height: 40px;
        line-height: 40px;
        padding: 0 16px;
        .iconfont {
          font-size: 24px;
        }
      }
    }
  }
  .coverVideo {
    width: 100%;
    height: 524px;
    background-color: #000;
  }
}
</style>
<style lang="less">
// 谷歌播不出来样式改了
video::-webkit-media-controls-enclosure {
  border-radius: 0;
}
</style>
