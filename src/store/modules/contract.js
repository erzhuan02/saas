// BUSI租户业务用户  COM租户企业用户后台  AD自己公司后台
// 创建用户是否有角色
import http from '@/api'
import utils from '@/utils'
import i18n from '@/lang'
import router from '@/router'

const app = {
  state: {},
  mutations: {},
  actions: {
    // 获取文件流
    previewFile({ commit }, data) {
      http.posts('previewPDF', data).then(res => {
        var base64String = res.data
        var fileName = i18n.t('contract.contract') + ' ' + data.contractId + '.pdf'
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          // IE workaround
          var byteCharacters = atob(base64String)
          var byteNumbers = new Array(byteCharacters.length)
          for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          var byteArray = new Uint8Array(byteNumbers)
          var blob = new Blob([byteArray], { type: 'application/pdf' })
          window.navigator.msSaveOrOpenBlob(blob, fileName)
        } else {
          // much easier if not IE
          var header = 'data:application/pdf;base64,'
          var content = header + base64String
          router.push({ name: 'Preview', params: { url: content } })
        }
      })
    }
  }
}

export default app
