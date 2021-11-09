// BUSI租户业务用户  COM租户企业用户后台  AD自己公司后台
// 创建用户是否有角色
import http from '@/api'
import utils from '@/utils'
import i18n from '@/lang'

const app = {
  state: {
    language: i18n.locale,
    authorization: '',
    companyId: '',
    goodsInfo: [],
    area1Options: [],
    area2Options: [],
    area3Options: [],
    loginBoxStatus: false,
    clientType: 'pc', // 客户端类型
    user: {}, // 用户数据
    module: {}, // 模块数据
    isCoverVideo: false // IE下object遮挡dom,dom是否覆盖掉
  },
  mutations: {
    LANGUAGE: (state, language) => {
      i18n.locale = language
      state.language = language
      sessionStorage.setItem('language', language)
    },
    AUTHORIZATION: (state, authorization) => {
      state.authorization = authorization
    },
    COMPANY_ID: (state, companyId) => {
      state.companyId = companyId
      sessionStorage.setItem('companyId', companyId)
    },
    GOODS_INFO: (state, goodsInfo) => {
      state.goodsInfo = goodsInfo
    },
    AREA1_OPTIONS: (state, area1Options) => {
      state.area1Options = area1Options
    },
    AREA2_OPTIONS: (state, area2Options) => {
      state.area2Options = area2Options
    },
    AREA3_OPTIONS: (state, area3Options) => {
      state.area3Options = area3Options
    },
    LOGIN_BOX_STATUS: (state, loginBoxStatus) => {
      state.loginBoxStatus = loginBoxStatus
    },
    CLIENT_TYPE: (state, clientType) => {
      state.clientType = clientType
    },
    USER: (state, user) => {
      state.user = user
    },
    MODULE: (state, module) => {
      state.module = module
    },
    IS_COVER_VIDEO: (state, isCoverVideo) => {
      state.isCoverVideo = isCoverVideo
    }
  },
  actions: {
    // 判断用户名/角色名/门店号是否重复
    isValueRepeat({ commit }, { moduleVal, value, callback }) {
      // moduleVal 模块 必传, value 传递重复的值数据必传, callback 验证的回调必传, success 成功后, error 失败后
      // moduleVal: busiUser, busiRole,busiShop,(busiUser代替comUser),comRole,(busiUser代替adUser),(comRole代替adRole)
      if (!moduleVal) {
        return
      }
      http
        .posts(
          moduleVal + 'Repeat',
          { value: value || '' },
          '',
          { showErrorMsg: false }
        )
        .then(res => {
          callback && callback()
        })
        .catch(res => {
          // console.log(res, typeof res)
          if (typeof res === 'object') {
            callback &&
              callback(
                new Error(
                  moduleVal === 'busiRole' || moduleVal === 'comRole'
                    ? i18n.t(`message.${moduleVal}Repeat`)
                    : i18n.t('message.repeatAndTry') + res.data
                )
              )
          } else {
            callback && callback()
          }
          // console.log(er)
        })
    },
    getArea({ commit }, { areaId, level }) {
      // console.log('getArea')
      http
        .posts('getArea', '', { areaId: areaId || '' })
        .then(res => {
          // console.log('getArea_res')
          // if (res.data.resCode === 0) {
          var data = res.data || []
          commit(`AREA${level || 1}_OPTIONS`, data)
          if (level === 2) {
            commit('AREA3_OPTIONS', [])
          }
          // } else {
          //   commit(`AREA${level || 1}_OPTIONS`, [])
          // }
        })
        .catch(er => {
          commit(`AREA${level || 1}_OPTIONS`, [])
          // console.log(er)
        })
    }
  }
}

export default app
