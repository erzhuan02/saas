<template>
  <div id="video">
    <div>
      <!-- customEventName="customstatechangedeventname"
        @ready="playerReadied"
        @loadeddata="onPlayerLoadeddata"
        @canplaythrough="onPlayerCanplaythrough"
        @play="onPlayerPlay"
        @playing="onPlayerPlaying"
        @timeupdate="onPlayerTimeupdate"
        @pause="onPlayerPause"
        @waiting="onPlayerWaiting"
        @ended="onPlayerEnded"
        @statechanged="playerStateChanged" -->
      <video-player class="vjs-custom-skin video-player" ref="videoPlayer" :options="playerOptions" @loadeddata="onPlayerLoadeddata" :playsinline="true">
      </video-player>
    </div>
  </div>
</template>

<script>
// import 'video.js/dist/video-js.css'
// import 'vue-video-player/src/custom-theme.css'
// import { videoPlayer } from 'vue-video-player'
// import 'videojs-flash'
// import 'videojs-contrib-hls'
import { mapGetters } from 'vuex'
export default {
  // components: {
  //   videoPlayer
  // },
  props: {
    src: {
      type: String,
      default: function () {
        return 'srcString'
      }
    },
    // aspectRatio: {
    //   type: String,
    //   default: function () {
    //     return '1:1'
    //   }
    // }
    fluid: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    height: {
      type: Number,
      default: function () {
        return 500
      }
    }

  },
  data() {
    return {
      playerOptions: {
        // playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-cn',
        aspectRatio: '60:49', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        // aspectRatio: '11:10', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        // fluid: false, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        hls: true, // 启用hls
        techOrder: ['html5', 'flash'], // 兼容顺序,使用flash播放，可以播放flv格式的文件
        flash: {
          hls: { withCredentials: false },
          swf: this.$api.staticUrl + '/static/videojs/video-js.swf'
          // swf: '../../static/videojs/video-js.swf' // 放在static或着public下面文件夹中的videojs文件夹中 当引入js文件中统一定义时此处可省略
        },
        html5: { hls: { withCredentials: false } },
        sources: [{
          type: '',
          src: 'src'
        }],
        // poster: require('@/assets/images/poster.png'), // 你的封面地址
        // width: document.documentElement.clientWidth,
        height: 500, // 设置高度，fluid需要设置成flase
        // notSupportedMessage: '此视频暂无法播放，请稍后再试1111', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        // 配置控制栏
        controlBar: {
          volumePanel: {
            inline: false // 音量调节是否水平
          },
          timeDivider: false, // 时间分割线
          currentTimeDisplay: false, // 当前播放位置
          durationDisplay: false, // 总时间
          progressControl: false, // 进度条
          remainingTimeDisplay: false, // 剩余时间
          fullscreenToggle: true // 全屏按钮
        }
      },
      isIe: false
    }
  },
  computed: {
    ...mapGetters(['language']),
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  watch: {
    src: {
      handler(newVal, oldVal) {
        this.handleChangeSrc(newVal)
      }
    },
    language(newVal, oldVal) {
      this.playerOptions.language = `zh-${newVal}`
    }
  },
  created() {
    this.initVideo(this.src)
  },
  mounted() { },
  methods: {
    initVideo(src) {
      var isIe = this.$utils.myBrowserIsIE()
      if (isIe) {
        this.isIe = true
        this.playerOptions.sources[0].type = 'rtmp/mp4'
        src = src.replace(/http:/g, 'rtmp:').replace('.m3u8', '').replace('.flv', '')
        // console.log('isIe', isIe, this.playerOptions.sources[0])
      } else {
        this.isIe = false
        // this.playerOptions.sources[0].type = 'application/octet-stream' // flv
        if (navigator.userAgent.indexOf('Chrome') > 0) {
          this.playerOptions.sources[0].type = 'video/x-flv' // flv
        } else {
          this.playerOptions.sources[0].type = 'application/x-mpegURL' // m3u8
        }
      }
      this.playerOptions.sources[0].src = src || 'src'
      this.playerOptions.language = `zh-${this.language}`
      this.playerOptions.height = this.height
      this.playerOptions.fluid = this.fluid
    },
    handleChangeSrc(src) {
      var newSrc = src
      if (this.isIe) {
        newSrc = src.replace(/http:/g, 'rtmp:').replace('.m3u8', '').replace('.flv', '')
      }
      // console.log('newSrc:' + newSrc)
      this.player.src(newSrc)
    },
    // 方法
    play() {
      // console.log('play', this.playerOptions.sources[0].src)
      // console.log('播放', this.player)
      // console.log('播放', this.player.aspectRatio)
      this.$nextTick(() => {
        // this.player.reset()
        this.player.load()
        this.player.play() // 播放
        // ie点一下不播放
        setTimeout(() => {
          if (this.isIe) {
            this.player.play()
          }
        }, 400)
      })
      // this.player.play()
    },
    pause() {
      this.player.pause()
    },
    reset() {
      this.player.reset()
    },
    // /* 视频播放 */
    // // 视频准备完毕
    // playerReadied(player) {
    //   console.log('Readied>视频准备完毕!', player)
    // },
    // // 视频加载中
    // onPlayerWaiting(player) {
    //   console.log('Waiting>视频加载中!', player)
    // },
    // // 视频播放
    // onPlayerPlay(player) {
    //   console.log('Play>视频播放!', player)
    // },
    // // 拖动视频条会触发事件-视频暂停>可以播放视频>可以播放视频至拖动位置>视频播放>视频加载中>可以播放视频>视频播放中>视频加载中>可以播放视频>视频播放中>视频加载中>可以播放视频>视频播放中>可以播放视频至拖动位置
    // // 可以播放视频至拖动位置
    // onPlayerCanplaythrough(player) {
    //   console.log('Canplaythrough>可以播放视频至拖动位置!', player)
    // },
    // // 视频加载完成
    onPlayerLoadeddata(player) {
      this.$emit('loaded', true)
      // this.playerOptions.muted = false
      // console.log('Loadeddata>视频加载完成!', player)
    }
    // // 视频播放中
    // onPlayerPlaying(player) {
    //   console.log('Playing>视频播放中!', player)
    // },
    // // 可以播放视频
    // onPlayerCanplay(player) {
    //   console.log('Canplay>可以播放视频!', player)
    //   // this.initPlay(player)
    // },
    // // 视频时间更新中
    // onPlayerTimeupdate(player) {
    //   // console.log('Timeupdate>视频时间更新中!', player);
    // },
    // // 视频暂停
    // onPlayerPause(player) {
    //   console.log('Pause>视频暂停!', player)
    // },

    // // 视频状态改变
    // playerStateChanged(playerCurrentState) {
    //   console.log('StateChanged>视频状态改变', playerCurrentState)
    // },

    // // 视频播放结束
    // onPlayerEnded(player) {
    //   console.log('Ended>视频播放结束!', player)
    // }
    // // 切换视频
    // playVideo (url) {
    //   if (url) {
    //     this.playerOptions.sources = [
    //       {
    //         type: 'video/mp4',
    //         autoplay: true,
    //         src: 'http://172.19.82.59:1234/test' // 本地资源地址，注意：本地资源存放在 static 文件夹中，本文视频资源路径 static/topicMaterial/1.mp4
    //       }
    //     ]
    //   } else {
    //     this.playerOptions.sources = []
    //   }
    // }
  }
}
</script>

<style lang="less">
#video {
  video,
  object {
    object-fit: fill;
  }
  // .video-js .vjs-big-play-button {
  //   width: 50px;
  // }
  // .vjs-custom-skin > .video-js .vjs-big-play-button {
  //   height: 40px !important;
  //   line-height: 40px !important;
  // }
  .vjs-big-play-button {
    display: none;
  }
  .vjs-error .vjs-error-display:before {
    content: '';
  }
}
</style>
