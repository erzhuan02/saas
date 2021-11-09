<template>
  <div id="video">
    <div v-if="isIe">
      <div id="iePlayer" style="width:100%;height:520px;background:#000"></div>
    </div>
    <div v-else>
      <video id="player" controls width="100%" height="490" style="object-fit: fill;background:#000"></video>
    </div>
  </div>
</template>

<script>
// 使用方法
// <v-player ref="player" @loaded="isLoaded" @error="isLoaded"></v-player>
// this.$refs.player.create(res) this.$refs.player.destroy()

// import flvjs from 'flv.js/dist/flv.min.js'
import flvjs from '../../static/js/flv.js' // npm引用的有的播放不了，不知道什么原因，引用了本地的
// import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      iePlayer: null,
      player: null,
      res: {
        src: '', // 播放源
        taskId: '', // 心跳用
        heartBeat: 0 // 心跳用
      },
      taskId: '', // 用于标识关闭流
      isIe: false,
      loadCount: 0, // 循环加载，flv.js控制不要无限加载
      heartBeatTimer: null, // 心跳的定时
      rememberTitle: ''
    }
  },
  // computed: {
  //   ...mapGetters(['language'])
  // },
  watch: {},
  created() { this.init() },
  mounted() {
    // 解决ckplayer ie10 flash在IE下包含锚点和Flash元素title也被追加锚点的问题解决 ie11以上不行，没有这个事件
    this.rememberTitle = document.title // 记住原有的窗口标题
    try { // try-catch 用于兼容不支持attachEvent方法的浏览器
      document.attachEvent('onpropertychange', this.restoreTitle)
    } catch (er) {
    }
  },
  methods: {
    init() {
      var isIe = this.$utils.myBrowserIsIE()
      isIe ? this.isIe = true : this.isIe = false
      // isIe ? this.isIe = false : this.isIe = true
    },
    restoreTitle() {
      var that = this
      setTimeout(function () {
        if (document.title != that.rememberTitle) { // 此判断一定要加上，否则会导致递归调用堆栈溢出
          document.title = that.rememberTitle
        }
      }, 1)
    },
    // 创建并播放视频
    create(res, loadCount) {
      // console.log(res)
      if (!(res && res.flvUrl)) return
      // flv.js 设置了错误loadCount后连续调用10次
      if (!loadCount) { // 初始时
        this.destroy() // 清除视频和心跳和关闭流
        this.taskId = res.taskId// 重复调用的没必要保存
      }
      // this.destroy() // 清除视频和心跳
      this.res = { ...res, src: res.flvUrl }
      var { src, taskId, heartBeat } = this.res
      if (this.isIe) {
        // var newSrc = src.replace(/http:|https:/g, 'rtmp:').replace('.m3u8', '').replace('.flv', '')
        src = res.rtmpUrl
        this.res.src = src
        var videoObject = {
          container: '#iePlayer', // “#”代表容器的ID，“.”或“”代表容器的class
          variable: 'iePlayer', // 该属性必需设置，值等于下面的new chplayer()的对象
          autoplay: true, // 自动播放
          live: true, // 直播视频形式
          loaded: 'loadedHandler', // 当播放器加载后执行的函数
          video: src // 视频地址
        }
        // eslint-disable-next-line
        window.iePlayer = new ckplayer(videoObject)
        this.iePlayer = window.iePlayer // 变量名要与variable一致
        var ieThat = this
        // 本地可以监听到，但是到了测试就不能监听到了
        // ckplayer.js中addListener/removeListener函数中，调用了getParameterNames方法，获取函数名，然后全局找
        // 但是npm run build后function loadedMetaDataHandler() {window.loadedMetaDataHandler()}
        // 变成了function(){window.loadedMetaDataHandler()},获取的函数名是function，所以执行不到
        // 解决，改ckplayer.js源码，如果传的是字符串，函数名直接为传的字符串
        window.loadedHandler = () => {
          // 函数要写写函数名，且注册为全局的
          // 视频加载完成
          function loadedMetaDataHandler() {
            // console.log('视频加载完成')
            // 解决ie11以上title修改
            document.title = ieThat.rememberTitle
          }
          window.loadedMetaDataHandler = loadedMetaDataHandler
          // 视频加载出错
          function errorHandler(err) {
            ieThat.destroy() // 清除视频和心跳
            console.log('视频加载出错' + err)
            ieThat.$emit('error', err)
          }
          window.errorHandler = errorHandler

          function fullHandler(b) {
            // 解决ie11以上title修改
            document.title = ieThat.rememberTitle
          }
          window.fullHandler = fullHandler
          ieThat.iePlayer.addListener('loadedmetadata', 'loadedMetaDataHandler')// 视频加载完成
          ieThat.iePlayer.addListener('error', 'errorHandler')// 视频加载出错
          ieThat.iePlayer.addListener('full', 'fullHandler')// 监听全屏/退出全屏
        }
        setTimeout(() => {
          ieThat.heartBeat(taskId, heartBeat)// 调用心跳
          ieThat.$emit('loaded', ieThat.res)
        }, 0)
        // 解决ie11以上title的问题,title会追加#/router,setTimeout要加上
        setTimeout(() => {
          document.title = ieThat.rememberTitle
        }, 200)
      } else {
        // flv.js用的
        if (loadCount === undefined) {
          this.loadCount = 0
        }
        this.loadCount++
        // console.log('this.loadCount', this.loadCount)
        var element = document.querySelector('#player')
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
          // enableWorker: false,
          enableStashBuffer: false,
          stashInitialSize: 128
          // lazyLoadMaxDuration: 3 * 60,
          // seekType: 'range'
        })
        this.player.attachMediaElement(element)
        this.player.load()
        this.player.play()
        var that = this
        this.player.on('error', err => {
          if (that.res.src && that.loadCount < 10) {
            // that.player.pause()
            // that.player.unload()
            // that.player.detachMediaElement()
            that.player.destroy()
            that.player = null // 设置后that.destroy就不执行，上面也判断that.loadCount，双控，可不写
            that.create(that.res, that.loadCount)// 重新加载下
          } else {
            that.destroy() // 清除视频和心跳
            console.log('视频加载出错' + err)
            that.$emit('error', err)
          }
        })
        // 3：因为loading_complete有的加载不到，便用这个scriptdata_arrived代替
        // this.player.on('scriptdata_arrived', res => {
        //   // console.log('flv-scriptdata_arrived', res)
        //   that.heartBeat(taskId, heartBeat)// 调用心跳
        //   that.$emit('loaded', that.res)
        // })
        setTimeout(() => {
          that.heartBeat(taskId, heartBeat)// 调用心跳
          that.$emit('loaded', that.res)
        }, 0)
        // 1 出现频率很高
        // this.player.on('statistics_info', err => {
        //   console.log('flv-statistics_info', err)
        // })
        // this.player.on('recommend_seekpoint', err => {
        //   console.log('flv-recommend_seekpoint', err)
        // })
        // IO_ERROR: 'io_error',
        // DEMUX_ERROR: 'demux_error',
        // INIT_SEGMENT: 'init_segment',
        // MEDIA_SEGMENT: 'media_segment',
        // LOADING_COMPLETE: 'loading_complete', 5 输入MediaDataSource已完全缓冲到结束
        // RECOVERED_EARLY_EOF: 'recovered_early_eof', 缓冲期间发生意外的网络EOF，但已自动恢复
        // MEDIA_INFO: 'media_info',4 提供媒体的技术信息，例如视频/音频编解码器，比特率等。
        // METADATA_ARRIVED: 'metadata_arrived',2 用“ onMetaData”标记提供FLV文件（流）可以包含的元数据。
        // SCRIPTDATA_ARRIVED: 'scriptdata_arrived',3 提供FLV文件（流）可以包含的脚本数据（OnCuePoint / OnTextData）。
        // STATISTICS_INFO: 'statistics_info', 1 出现频率很高
        // RECOMMEND_SEEKPOINT: 'recommend_seekpoint'

        // eslint-disable-next-line error 写法2
        // flvjs.LoggingControl.addLogListener(function (type, str) {
        //   console.log(type + '---' + str)
        //   if (type === 'error') {
        //     if (that1.res.src) that1.create(that1.res.src)
        //   }
        // })
      }
    },
    // 播放视频
    play() {
      if (this.isIe && this.iePlayer) {
        this.iePlayer.videoPlay()
      } else if (this.player) {
        this.player.play()
      }
    },
    // 暂停视频
    pause() {
      if (this.isIe && this.iePlayer) {
        this.iePlayer.videoPause()
      } else if (this.player) {
        this.player.pause()
      }
    },
    // 销毁视频和心跳
    destroy() {
      // 销毁对象
      if (this.isIe && this.iePlayer) {
        // console.log(this.iePlayer.videoPause)
        // try catch 报错不要阻碍下面代码的执行
        try {
          this.iePlayer.videoPause()
          this.iePlayer.videoClear()
        } catch (error) {
          console.log('video-destroy-error:' + error)
        }
        // this.iePlayer.removeListener('loadedmetadata', 'loadedMetaDataHandler')
        this.iePlayer = null
        window.iePlayer = null
        document.querySelector('#iePlayer').innerHTML = ''
        this.res = {}
        this.clearHeartBeat()// 清除心跳
        this.closeVideo()
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
        this.clearHeartBeat()// 清除心跳
        this.closeVideo()
      }
      // 获取全屏dom,非全屏为null
      var fullscreenEle = document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement
      if (fullscreenEle) {
        document.exitFullscreen() // 退出全屏
        document.title = ieThat.rememberTitle
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
    }
  },
  beforeDestroy() {
    // 路由直接跳转的时候
    this.destroy()
    try { // try-catch 用于兼容不支持attachEvent方法的浏览器
      document.detachEvent('onpropertychange', this.restoreTitle)
    } catch (er) {
    }
  }
}
</script>

<style lang="less">
#video {
}
</style>
