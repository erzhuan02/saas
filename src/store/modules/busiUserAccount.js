import http from '@/api'
import utils from '@/utils'
import i18n from '@/lang'

const busiUserAccount = {
  state: {
    list: [],
    total: 0
  },
  mutations: {
    BUSI_USER_LIST: (state, list) => {
      state.list = list || []
    },
    BUSI_USER_TOTAL: (state, total) => {
      state.total = total || 0
    }
  },
  actions: {
    busiGetUserList({ commit }, { params }) {
      http
        .posts('userList', params)
        .then(res => {
          // if (data.resCode === 0) {
          // console.log(data.data, [BUSI_GET_USERLIST])

          let data = res.data
          // console.log(data)
          commit('BUSI_USER_LIST', data.list)
          commit('BUSI_USER_TOTAL', data.total)
          // } else {
          //   utils.$message({
          //     message: data.resMsg,
          //     type: 'error'
          //   })
          //   commit('BUSI_USER_LIST', {
          //     list: [],
          //     total: 0
          //   })
          //   // error && error(data.resMsg)
          // }
        })
        .catch(er => {
          // console.log(er)
          commit('BUSI_USER_LIST', [])
          commit('BUSI_USER_TOTAL', 0)
          // error && error(er)
        })
    },
    isHasRole({ commit }, type) {
      return http
        .posts('isHasRole', '', { type }, { showErrorMsg: false })
        .then(res => { return true })
        .catch(er => {
          if (typeof er === 'object') {
            var i18nCode = i18n.t(`code.${er.resMsg}`)
            if (er.resMsg === 'S00061') {
              i18nCode = i18nCode.replace(/xxx/gi, er.extMsg)
            }
            utils.$message({
              message: i18nCode,
              type: 'error',
              duration: 2800
            })
            return false
          } else {
            return false
          }
        })
    }
  }
}

export default busiUserAccount
