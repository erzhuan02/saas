// busi租户业务用户  com租户企业用户后台  ad自己公司后台
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import busiUserAccount from './modules/busiUserAccount'
import busiOrganization from './modules/busiOrganization'
import comWorkOrder from './modules/comWorkOrder'
import comMessage from './modules/comMessage'
import mobheader from './modules/mobheader'
import contract from './modules/contract'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    busiUserAccount,
    busiOrganization,
    comWorkOrder,
    comMessage,
    mobheader,
    contract
  },
  getters
})

export default store
