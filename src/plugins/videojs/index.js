import Vue from 'vue'

import VueVideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import hls from 'videojs-contrib-hls' // 此处用const会报错

import Video from 'video.js'
import 'video.js/dist/video-js.css'

// import 'video.js/dist/lang/zh-CN.js';// vue中直接引用会报错
// import 'video.js/dist/lang/zh-CN.json';// 本文使用的videojs版本中dist无此文件,根据video.js/dist/lang/zh-CN.js新建了下面video-zh-CN.json文件
import zhCN from './video-zh-CN.json'
import 'videojs-flash'

// import SWF_URL from './video-js.swf' // 此处用有可能会报错
// Module parse failed: Unexpected character '' (1:4) You may need an appropriate loader to handle this file type.

// Video.options.flash.swf = SWF_URL // 设置flash路径，Video.js会在不支持html5的浏览中使用flash播放视频文件
Video.addLanguage('zh-CN', zhCN) // 添加中文支持
Vue.use(hls)
Vue.use(VueVideoPlayer)
