// 开发环境网址
const devUrl = {
  openPlatform: 'http://139.9.121.98/openapi-basic/#/login', // 开放平台测试地址
  staticUrl: 'http://139.9.121.98/basicplatform', // 静态文件测试地址
  apiBase: 'http://139.9.121.98:8763' // api测试地址
  // apiBase: 'https://www.six-armscloud.com:9080'
  // apiBase: 'http://192.168.2.218:8763' // sy本地
  // apiBase: 'http://192.168.2.241:8763' // zjf本地
  // apiBase: 'http://192.168.2.198:8763' // yl本地
}

// 生产环境网址
const proUrl = {
  // 测试环境
  openPlatform: 'http://139.9.121.98/openapi-basic/#/login', // 开放平台测试地址
  staticUrl: 'http://139.9.121.98/basicplatform', // 静态文件测试地址
  apiBase: 'http://139.9.121.98:8763' // api测试地址
  // docker测试地址
  // apiBase: 'https://www.six-armscloud.com:1999',
  // // 正式环境
  // openPlatform: 'https://www.six-armscloud.com/openapi-basic/#/login', // 开放平台正式地址
  // staticUrl: 'https://www.six-armscloud.com/basicplatform', // 静态文件正式地址
  // apiBase: 'https://www.six-armscloud.com:9080' // api正式地址
  // apiBase: 'http://www.six-armscloud.com:9084/' // api准线上正式地址
}

let currentUrl = null // 当前的网址
// 通用的网址
const commonUrl = {}
const env = process.env.NODE_ENV
if (env === 'production') {
  currentUrl = Object.assign(commonUrl, proUrl)
} else if (env === 'development') {
  currentUrl = Object.assign(commonUrl, devUrl)
}

export default currentUrl
