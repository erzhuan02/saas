// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import InputTree from '@/components/inputTree'
import VueClipboard from 'vue-clipboard2'
import VPlayer from '@/components/video'
// import '@/plugins/videojs'
// import 'element-ui/lib/theme-chalk/index.css'
import 'babel-polyfill'
import 'element-ui/lib/theme-chalk/display.css'
import '@/assets/element-variables.scss'
import '@/assets/css/base.css'
import '@/assets/css/elementCover.less'
import '@/assets/css/style.css'
import '@/assets/css/common.less'
import '@/assets/css/verify.css'
import '@/assets/fonts/iconfont.css'
// import '@/assets/css/compatibility.less'
import utils from '@/utils'
import '@/utils/rem'
import api from '@/api/api.js'
import filters from '@/filters'

// import echarts from 'echarts'
// 引入基本模板
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/dataset'
// 引入折线图等组件
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
// 引入提示框和title等组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/graphic'
import 'echarts/lib/component/grid'
// import 'font-awesome/css/font-awesome.min.css'
import http from '@/api'
import store from './store'
import i18n from './lang'
// import VConsole from 'vconsole'
// Vue.use(new VConsole())
// // 开发环境和测试环境需要，正式环境不要
// try {
//   // ie10会报错
//   if (
//     process.env.NODE_ENV === 'development' ||
//     api.apiBase === 'http://139.9.121.98:8763'
//   ) {
//     // eslint-disable-next-line
//     new VConsole()
//   }
// } catch (error) {
//   console.log(error)
// }

Vue.use(VueClipboard)
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.component('InputTree', InputTree)
Vue.component('v-player', VPlayer)

Vue.prototype.$eventBus = new Vue()
Vue.prototype.$echarts = echarts
Vue.prototype.$http = http
Vue.prototype.$utils = utils
Vue.prototype.$api = api

// 控制点击特定区域外的操作
Vue.directive('clickoutside', {
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e)
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.__vueClickOutside__ = documentHandler
    document.addEventListener('click', documentHandler)
  },
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener('click', el.__vueClickOutside__)
    delete el.__vueClickOutside__
  }
})

Vue.config.productionTip = false

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: { App },
  template: '<App/>'
})
