import http from '@/api'
// import api from '@/api/api.js'
import utils from '@/utils'

const busiOrganization = {
  state: {
    busiOrgTree: []
  },
  mutations: {
    BUSI_ORG_TREE: (state, busiOrgTree) => {
      state.busiOrgTree = busiOrgTree
    }
  },
  actions: {
    busiGetOrgTree({ commit }, { url, orgType }) {
      // console.log('busiGetOrgTree acti')
      // console.log('orgType', orgType)
      url = url || 'getOrgTree'
      orgType = orgType || 2
      return http
        .posts(url, '', { orgType, timeout: 0 })
        .then(res => {
          var data = res.data || []
          commit('BUSI_ORG_TREE', data)
          return data
        })
        .catch(er => {
          commit('BUSI_ORG_TREE', [])
          return []
        })
    }
  }
}

export default busiOrganization
