import http from '@/api'
import utils from '@/utils'

const busiUserAccount = {
  state: {
    comMsgUnreadList: [],
    comMsgUnreadTotal: 0,
    comMsgStatus: {
      notReadCount: 0, // 未读
      noticeCount: 0, // 公告
      productServiceCount: 0, // 产品服务
      accountInforCount: 0 // 账户信息
    },
    comMsgList: [],
    comMsgTotal: 0
  },
  mutations: {
    COM_MSG_UNREAD_LIST: (state, comMsgUnreadList) => {
      state.comMsgUnreadList = comMsgUnreadList
    },
    COM_MSG_UNREAD_TOTAL: (state, comMsgUnreadTotal) => {
      state.comMsgUnreadTotal = comMsgUnreadTotal
    },
    COM_MSG_STATUS: (state, comMsgStatus) => {
      state.comMsgStatus = comMsgStatus
    },
    COM_MSG_LIST: (state, comMsgList) => {
      state.comMsgList = comMsgList
    },
    COM_MSG_TOTAL: (state, comMsgTotal) => {
      state.comMsgTotal = comMsgTotal
    }
  },
  actions: {
    comGetMsgList({ commit }, params) {
      http.posts('comMsgList', params).then(res => {
        // if (res.data.resCode === 0) {
        // let data = res.data.data
        let data = res.data
        let list, total
        // console.log(params)
        if (params.onlySearch === 'unread') {
          list = data.list || []
          total = data.notReadCount
          commit('COM_MSG_UNREAD_LIST', list)
          commit('COM_MSG_UNREAD_TOTAL', total)
        } else {
          list = data.list.list || []
          total = data.list.total || 0
          commit('COM_MSG_LIST', list)
          commit('COM_MSG_TOTAL', total)
          var statusNumber = { ...data }
          delete statusNumber.list
          commit('COM_MSG_STATUS', statusNumber)
          commit('COM_MSG_UNREAD_TOTAL', statusNumber.notReadCount)
        }
      })
      // .catch(er => {
      //   console.log(er)
      //   // commit('COM_MSG_UNREAD_LIST', [])
      // })
    }
  }
}

export default busiUserAccount
