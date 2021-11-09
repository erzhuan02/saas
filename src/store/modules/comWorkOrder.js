import http from '@/api'
import utils from '@/utils'

const busiUserAccount = {
  state: {
    comWkConfirmTotal: 0
  },
  mutations: {
    COM_WK_CONFIRM_TOTAL: (state, comWkConfirmTotal) => {
      state.comWkConfirmTotal = comWkConfirmTotal
    }
  },
  actions: {}
}

export default busiUserAccount
