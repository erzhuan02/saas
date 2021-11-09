import axios from 'axios'
import store from '@/store'
import { MessageBox } from 'element-ui'
import i18n from '../lang'
import api from './api'
import utils from '../utils'
import '../../static/js/md5'

var baseURL = api.apiBase
const defaultTimeout = 30000
axios.defaults.baseURL = baseURL
axios.defaults.timeout = defaultTimeout
axios.defaults.headers = {
  'Content-Type': 'application/json;charset=UTF-8'
}
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 请求头设置token
    // let token =
    // 'eyJhbGciOiJIUzI1NiJ9.eyJjb21wYW55SWQiOiJORERVViIsImNyZWF0ZVRpbWVNaWxsaXMiOiIxNTc3OTUwNjk5NTQ2IiwiY3VycmVudFRpbWVNaWxsaXMiOiIxNTc3OTUwNjk5NTQ2IiwibG9naW5EZXZpY2UiOiJhbmRyb2lkIiwiZXhwIjoxNTc3OTUxODk5LCJ1c2VySWQiOiJkZTJlZjExYWViYzk0NTE5YWRkZjM5MTllZjFhMjc5NyIsImlhdCI6MTU3Nzk1MDY5OSwiYWNjb3VudCI6Ik9QMDAzIiwianRpIjoidG9rZW5JZCJ9.Rm7sfyxN8mmQtUh2mijkkB2g1HMzLpkKGHYEDTM9CS0'
    let auth = store.state.app.authorization
    let token = sessionStorage.getItem('authorization') || auth // 双控
    let user = JSON.parse(sessionStorage.getItem('user'))
    if (token) {
      config.headers['Authorization'] = token
    }
    if (user) {
      config.headers['company_id'] = user.companyId
    }
    // encodeURI() 对整个url进行编码，会避开url中的功能性字符，例如，& ? [ ]
    // encodeURIComponent() 对某个参数进行编码，会编码所有特殊字符
    // axios会对请求的整个url进行encodeURI，导致有些get方法不能传[]，所以在请求拦截器中可对get方法单独处理，避开axios的encodeURI，将特殊字符全部编码
    // 试了encodeURI和encodeURIComponent 都对[]加密，可能axios特殊处理[]不加密，可能为了数组
    var isObj = Object.prototype.toString.call(config.params) === '[object Object]'
    if (isObj) {
      let url = config.url
      // get参数编码
      url += '?'
      let keys = Object.keys(config.params)
      for (let key of keys) {
        // 过滤掉值为null和undefined的字段
        if (config.params[key] !== null && config.params[key] !== undefined) {
          url += `${key}=${encodeURIComponent(config.params[key])}&`
        }
      }
      url = url.substring(0, url.length - 1)
      config.params = {}
      config.url = url
    }
    // url后加随机数，解决ie缓存问题
    if (config.url) {
      if (config.url.indexOf('?') > -1) {
        config.url = config.url + `&n=${Math.floor(Math.random() * 100)}`
      } else {
        config.url = config.url + `?n=${Math.floor(Math.random() * 100)}`
      }
    }
    return config
  },
  function (error) {
    // 对请求错误做点什么
    console.log(error)
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // console.log(response)
    // 每一分钟更换一次token
    let newAuth = response.headers['authorization']
    if (newAuth !== undefined) {
      sessionStorage.setItem('authorization', newAuth)
      store.commit('AUTHORIZATION', newAuth) // 双控
    }
    return response
  },
  function (error) {
    // 对响应错误做点什么
    // console.log('error', error, error.response)
    var response = error.response
    if (response && response.status === 401) {
      // console.log('token过期')
      store.commit('IS_COVER_VIDEO', true)
      var i18nCode = i18n.t(`code.${error.response.data.resMsg}`)
      var sessionBox = document.querySelector('.sessionExp')
      if (!sessionBox) { // 有此弹框，不用再次弹出了
        MessageBox.alert(
          i18nCode.startsWith('code.')
            ? error.response.data.resMsg // 在code中没有找到，就用后台的提示语
            : i18nCode, // 找到了，就用翻译的
          i18n.t('message.sessionExp'),
          {
            confirmButtonText: i18n.t('message.toIndex'),
            showClose: false,
            customClass: 'sessionExp',
            callback: action => {
              // action -> confirm/cancel
              if (action === 'confirm') {
                sessionStorage.clear()
                store.commit('LANGUAGE', i18n.locale)
                const env = process.env.NODE_ENV
                if (env === 'production') {
                  window.location.href = api.staticUrl
                } else if (env === 'development') {
                  window.location.href = '/'
                }
              }
            }
          }
        )
      }
      window.clearInterval(sessionStorage.getItem('tokenTimer'))
    } else {
      store.commit('IS_COVER_VIDEO', false)
      var erMsg
      if (response && response.status === 400) {
        erMsg = i18n.t('code.400')
      } else if (response && response.status === 404) {
        erMsg = i18n.t('code.404')
      } else if (response && response.status === 406) {
        erMsg = i18n.t('code.406')
      } else if (response && response.status === 500) {
        erMsg = i18n.t('code.500')
      } else if (error.message.startsWith('timeout of')) {
        erMsg = i18n.t('code.timeout')
      } else if (error.message.startsWith('Network Error')) {
        erMsg = i18n.t('code.network')
      } else {
        erMsg = i18n.t('code.500')
      }
      utils.$message({
        // message: i18n.t('message.abnormal') + er,
        message: erMsg,
        type: 'error'
      })
    }
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

const get = (url, params) => {
  return axios({ method: 'get', url: api[url], params })
}

const post = (url, data, params, responseType) => {
  var timeout = defaultTimeout
  if (params && (params.timeout || params.timeout === 0)) {
    timeout = params.timeout
    delete params.timeout
  }
  return axios({
    method: 'post',
    url: api[url],
    data,
    params,
    timeout,
    responseType: responseType || 'json'
  })
}

// 项目的封装 gets和posts中调用
const requests = (requestObj) => {
  var { method, url, data, params, options } = requestObj
  // options如果是布尔值，就是是否显示成功的消息，默认false
  // options如果对象，就是其他配置项 判断用户名/店号是否重复用到
  // options = {
  //   showSuccessMsg: false, // 是否显示成功消息,默认是false
  //   showErrorMsg: true // 是否显示错误消息,默认是true
  // }
  // 是否显示成功消息
  var sucjudge1 = typeof options === 'boolean' && options === true
  var sucjudge2 = typeof options === 'object' && options.showSuccessMsg === true
  var isShowSuccessMsg = sucjudge1 || sucjudge2
  // 是否显示错误消息
  var errJudge = typeof options === 'object' && options.showErrorMsg === false
  var isShowErrorMsg = !errJudge
  // 超时时间
  var timeout = defaultTimeout
  if (params && (params.timeout || params.timeout === 0)) {
    timeout = params.timeout
    delete params.timeout
  }
  var responseType = 'json'
  if (params && params.responseType) {
    responseType = params.responseType
    delete params.responseType
  }
  return new Promise((resolve, reject) => {
    axios({ method, url: api[url], data, params, timeout, responseType }).then(response => {
      let res = response.data
      if (res.resCode === 0) {
        if (isShowSuccessMsg) {
          var successMsg
          if (res.resMsg) {
            var i18nCode0 = i18n.t(`code.${res.resMsg}`)
            i18nCode0.startsWith('code.')
              ? (successMsg = res.resMsg) // 在code中没有找到，就用后台的提示语
              : (successMsg = i18nCode0) // 找到了，就用翻译的
          } else {
            successMsg = i18n.t('message.submitSuccess')
          }
          utils.$message({
            message: successMsg,
            type: 'success'
          })
        }
        resolve(res)
      } else {
        if (isShowErrorMsg) {
          // options是个对象，且showErrorMsg为false，不显示错误消息
          var errorMsg
          if (res.resMsg) {
            var i18nCode = i18n.t(`code.${res.resMsg}`)
            i18nCode.startsWith('code.')
              ? (errorMsg = res.resMsg) // 在code中没有找到，就用后台的提示语
              : (errorMsg = i18nCode) // 找到了，就用翻译的
            if (i18nCode.indexOf('sss') !== -1) {
              errorMsg = i18nCode.replace('sss', res.data)
            }
          } else {
            errorMsg = i18n.t('message.submitError')
          }
          utils.$message({
            message: errorMsg,
            type: 'error'
          })
        }
        // 可通过第一个参数的数据类型，来判断是哪种reject情况
        reject(res)
      }
    })
      .catch(er => {
        // console.dir(er)
        console.log(er)
        reject(String(er))
      })
  })
}
const posts = (url, data, params, options = false) => {
  return requests({ method: 'post', url, data, params, options })
}
const gets = (url, params, options = false) => {
  return requests({ method: 'get', url, params, options })
}
// 无token请求的统一封装
// 注：使用时如果data/params都不传数据, data位置传{}
const posts1 = (url, data = {}, params, options, charset = 'utf-8') => {
  let md5_key = 'e9d3d429360c4a8bb4b38f5ba3418373'
  data.timestamp = new Date().getTime()
  data.charset = charset
  data.method = url

  if (Object.prototype.toString.call(data) === '[object Object]') {
    let arr1 = []
    let obj1 = {}
    obj1 = utils.objKeySort(data)
    for (let key in obj1) {
      if (obj1[key] !== '') {
        arr1.push(key + '=' + encodeURIComponent(obj1[key]))
      }
    }
    // console.log('data前:======')
    // console.log(arr1.join('&'))
    data.sign = hex_md5(arr1.join('&') + md5_key)
    // console.log('sign:======')
    // console.log(data.sign)
  }

  if (Object.prototype.toString.call(params) === '[object Object]') {
    let arr2 = []
    let obj2 = {}
    var timeout = defaultTimeout
    if (params && (params.timeout || params.timeout === 0)) {
      timeout = params.timeout
      delete params.timeout
    }
    obj2 = utils.objKeySort(params)
    for (let key in obj2) {
      if (obj2[key] !== '') {
        arr2.push(key + '=' + encodeURIComponent(obj2[key]))
      }
    }
    // console.log('params arr:======')
    // console.log(arr2)
    // console.log('params:======')
    // console.log(arr2.join('&'))
    params.sign = hex_md5(arr2.join('&') + md5_key)
    // console.log('sign:======')
    // console.log(params.sign)
    params.timeout = timeout
  }
  return posts(url, data, params, options)
}

// const deletes = (url, params) => {
//   return axios({
//     method: 'delete',
//     url: api[url],
//     params
//   })
// }

// const patch = (url, data) => {
//   return axios({ method: 'patch', url: api[url], data })
// }

// const put = (url, data) => {
//   return axios({ method: 'put', url: api[url], data })
// }
const http = {
  get,
  post,
  gets,
  posts,
  posts1
}

export default http
