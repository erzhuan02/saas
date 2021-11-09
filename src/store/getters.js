// mutations尽量与getters名一样，只不过一个全大写，一个驼峰AREA1_OPTIONS => area1Options
const getters = {
  language: state => state.app.language, // 语言
  authorization: state => state.app.authorization, // token
  companyId: state => state.app.companyId, // 企业id
  goodsInfo: state => state.app.goodsInfo,
  area1Options: state => state.app.area1Options,
  area2Options: state => state.app.area2Options,
  area3Options: state => state.app.area3Options,
  loginBoxStatus: state => state.app.loginBoxStatus,
  user: state => state.app.user,
  module: state => state.app.module,

  busiOrgTree: state => state.busiOrganization.busiOrgTree, // 业务用户获取组织架构

  busiUserList: state => state.busiUserAccount.list, // 业务用户用户列表
  busiUserTotal: state => state.busiUserAccount.total, // 业务用户用户列表

  comWkConfirmTotal: state => state.comWorkOrder.comWkConfirmTotal, // 企业待确认工单数量

  comMsgUnreadList: state => state.comMessage.comMsgUnreadList, // 企业未读消息列表
  comMsgUnreadTotal: state => state.comMessage.comMsgUnreadTotal, // 企业未读消息数量

  headerText: state => state.mobheader.headerText,
  file: state => state.mobheader.file,
  clientType: state => state.app.clientType, // 客户端类型 pc(电脑)/mob(手机)
  isIe: state => state.app.isIe, // 浏览器
  isCoverVideo: state => state.app.isCoverVideo // IE下object遮挡dom,dom是否覆盖掉
}
export default getters
