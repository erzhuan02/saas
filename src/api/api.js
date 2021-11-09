import currentUrl from './config'
/**
 * 1- 租户企业用户后台 com
 * 2- 租户业务用户 busi
 * 3- saas/dvo后台 admin
 */
const staticUrl = currentUrl.staticUrl
const api = {
  ...currentUrl,
  AES_KEY: 'Diveo@Ct&#9rootn',
  versionNumber: '2.2.10', // 当前项目版本号
  vailToken: '/platform/vailToken', // 验证token
  // noAuth
  // register
  getCode: '/noAuth/getCode', // 获取手机验证码
  getEmailCode: '/noAuth/getEmailCode', // 获取邮件注册码
  register: '/noAuth/register', // 企业注册
  sumbitBusLicense: '/noAuth/sumbitBusLicense', // 上传营业执照
  // sumbitLicenseSendSms:  '/noAuth/sumbitLicenseSendSms', // 提交营业执照
  addCoLeave: '/noAuth/addCoLeave', // 1-添加企业留言
  getProductData: '/noAuth/getProductData', // 获取产品数据
  verifyData: '/noAuth/verifyData', // 验证(用户名/手机号码)数据是否重复
  // login
  isFirstLogin: '/noAuth/isFirstLogin', // 是否首次登录，登录前调用
  login: '/login', // 登录
  anewRegister: '/login/anewRegister', // 企业再次注册
  logOut: '/login/logOut', //  用户退出
  vailRegData: '/login/vailRegData', // 验证注册数据
  changeLang: '/login/changeLang', // 切换语言
  getModuleHome: '/login/getModuleHome', // 获取首页模块
  getLeftMenuTree: '/login/getLeftMenuTree', // 获取左侧菜单树
  getComInitData: '/login/getComInitData', // 获取企业的初始化数据
  getConfirmCoUser: '/noAuth/getConfirmCoUser', // 确认企业用户
  getCodeByUserName: '/noAuth/getCodeByUserName', // 获取企业用户验证码
  authVail: '/noAuth/authVail', // 身份验证
  upCoUserPwd: '/noAuth/upCoUserPwd', // 更新企业用户密码
  // menu
  getUserMenuButton: '/busi/menu/getUserMenuButton', // 2-获取菜单按钮信息
  // busi-user
  getPersonalInfo: '/busi/user/getPersonalInfo', // 2-获取当前用户的信息
  updatePersonalInfo: '/busi/user/updatePersonalInfo', // 2-修改当前用户的信息
  conPassword: '/busi/user/conPassword', // 2-验证当前用户密码
  updatePassword: '/busi/user/updatePassword', // 2-修改当前用户密码
  userList: '/busi/user/list', // 2-用户列表
  addOrUpdate: '/busi/user/addOrUpdate', // 1-添加或修改用户
  newAddOrUpdate: '/busi/user/newAddOrUpdate', // 2-添加或修改用户
  delUser: '/busi/user/del', // 2-删除用户
  downloadUserTemp: staticUrl + '/static/excel/saas_userStore.xls', // 2-用户模板下载中文
  downloadUserTempEn: staticUrl + '/static/excel/saas_userStore(English).xls', // 2-用户模板下载英文
  importUser: '/busi/user/importUser', // 2-导入用户
  exportUser: '/export/user', // 2-导出用户
  updateUserStatus: '/busi/user/updateUserStatus', // 2-更改角色状态

  uploadPic: '/busi/user/uploadPic', // 2-上传头像
  // getUserByOrg: '/busi/user/getUserByOrg', // 2-根据用户ID获取所属组织架构 没用到
  // getUserRole: '/busi/role/getUserRole', // 2-根据用户ID查询所属角色 没用到
  // queryByUserId: '/busi/user/queryByUserId', // 2-根据用户ID查询用户信息
  busiUserRepeat: '/busi/user/isUserName', // 2-用户名是否重复

  // getUserList:  '/busi/user/queryByCompanyId', // 2-获取直属上级
  // busi-role
  roleList: '/busi/role/list', // 2-角色列表
  // getMenuTree: '/busi/role/getMenuTree', // 2-获取所有菜单信息 没用到
  addOrUpdateRole: '/busi/role/addOrUpdate', // 2-添加或修改用户
  delRole: '/busi/role/del', // 2-删除角色
  selectRole: '/busi/role/select', // 2-角色下拉框数据
  importRole: '/busi/role/importRole', // 2-导入角色
  exportRole: '/export/role', // 2-导出角色权限,
  getRoleMenuTree: '/busi/menu/getRoleMenuTree', // 2-根据一个或多个角色id获取选中的菜单树
  // getPlatTypeMenuTree: '/busi/role/getPlatTypeMenuTree', // 2-获取平台权限树 没有用到
  getBusiMenuTree: '/busi/role/menuTree', // 2-获取平台权限树
  busiRoleRepeat: '/busi/role/isRoleName', // 2-判断角色是否重复
  // busi-shop
  getOrgTreeShop: '/busi/shop/getOrgTree', // 获取门店管理下组织架构
  addOrUpdateShop: '/busi/shop/addOrUpdate', // 2-新增或者修改门店
  shopList: '/busi/shop/shopListPage', // 2-查询获取数据
  updateShopStatus: '/busi/shop/updateShop', // 2-删除门店,暂停,恢复,授权
  exportShop: '/export/shop', // 2-导出门店
  getShopModuleList: '/busi/shop/getShopModuleList', // 2-获取门店权限列表
  busiShopRepeat: '/busi/shop/isShopId', // 2-判断门店编号是否重复
  getArea: '/busi/shop/areaInfoList', // 获取行政区域
  getCameraModuleList: '/busi/shop/cameraInfoAuthPage', // 2-获取相机列表
  updateCameraStatus: '/busi/shop/cameraInfoAuth', // 2-相机授权
  moduleOverAuthList: '/busi/shop/moduleOverAuthList', // 2-查询授权过期的模块
  autoOverAuth: '/busi/shop/autoOverAuth', // 2-自动撤销授权
  // busiUserRepeat: '用户名已存在,请重新输入',
  // busiRoleRepeat: '角色名已存在,请重新输入',
  // busiShopRepeat: '门店号已存在,请重新输入',
  // comUserRepeat: '用户名已存在,请重新输入',
  // comRoleRepeat: '角色名已存在,请重新输入',
  // adUserRepeat: '用户名已存在,请重新输入',
  // adRoleRepeat: '角色名已存在,请重新输入',
  // busi-org
  getOrgTree: '/busi/org/getOrgTree', // 2-获取组织架构
  importOrg: '/busi/org/importOrg', // 2-导入组织架构数据
  getShops: '/busi/org/getShops', // 2-获取所有门店
  releShopList: '/busi/org/shopList', // 2-关联门店列表
  releUserList: '/busi/org/userList', // 2-关联用户列表
  deleteOrgId: '/busi/org/deleteOrgId', // 2-删除组织架构
  addOrUpOrgName: '/busi/org/addOrUpOrgName', // 2-添加或编辑组织架构
  associatedShop: '/busi/org/associatedShop', // 2-关联门店
  associatedUser: '/busi/org/associatedUser', // 2-关联用户
  moveOrgId: '/busi/org/moveOrgId', // 2-组织架构的移动(tree)
  moveToOrgId: '/busi/org/moveToOrgId', // 2-组织架构的移动(list)
  checkOrg: '/busi/org/checkOrg', // 2-检查组织架构
  removeOrgUserData: '/busi/org/removeOrgUserData', // 2-移除组织用户数据
  getDataByOrgId: '/busi/org/getDataByOrgId', // 2-获取组织架构数据
  verifyUserPwd: '/busi/org/verifyUserPwd', // 2-验证用户密码
  exportOrg: '/export/org', // 2-导出组织架构

  // busi-position
  positionList: '/busi/position/list', // 2-职位管理-获取列表数据
  positionLevel: '/busi/position/positionLevel', // 查询职位最小级别
  positionAddOrUpdate: '/busi/position/addOrUpdate', // 添加或者修改职位
  positionDel: '/busi/position/del', // 删除职位
  acPositionList: '/busi/position/positionList', // 查询所有职位

  // com/admim -user
  getBasicInfo: '/com/user/getBasicInfo', // 1-获取基本信息
  certInfo: '/com/user/certInfo', // 1-认证信息
  getCertInfo: '/com/user/getCertInfo', // 1-根据类型认证信息
  comCertFirst: '/com/user/comCertFirst', // 1-企业认证1
  comCertSecond: '/com/user/comCertSecond', // 1-企业认证2
  comCertThird: '/com/user/comCertThird', // 1-企业认证3
  submitPersonCert: '/com/user/submitPersonCert', // 1-提交个人认证
  myCustomer: '/com/user/myCustomer', // 1-我的客户列表
  getAuditInfo: '/com/user/getAuditInfo', // 1-获取审核信息
  submitAudit: '/com/user/submitAudit', // 1-提交数据审核
  delNotAudit: '/com/user/delNotAudit', // 1-删除审核不通过
  getComData: '/com/user/getComData', // 1-获取企业数据
  editComStatus: '/com/user/editComStatus', // 1-启用禁用审核不通过的企业
  getVerifyCode: '/com/user/getVerifyCode', // 获取手机验证码，如果手机传空，会通过token查当前用户手机
  getCodeAuth: '/com/user/getCode', // 获取手机验证码，不会查当前用户
  sendEmail: '/com/user/sendEmail', // 获取邮件验证码，如果邮箱传空，会通过token查当前用户邮箱
  newSendEmail: '/com/user/newSendEmail', // 获取邮件验证码，不会查当前用户
  codeVerify: '/com/user/codeVerify', // 验证码验证，token查当前用户
  newCodeVerify: '/com/user/newCodeVerify', // 用户中修改手机/邮箱验证，不会查当前用户
  editPassword: '/com/user/editPassword', // 修改密码
  editPhoneAndEmail: '/com/user/editPhoneAndEmail', // 修改手机号和邮箱

  getCoUser: '/company/user/list', // 1-用户列表
  addOrUpdateCoUser: '/company/user/addOrUpdate', // 1-添加或者修改用户
  delCoUser: '/company/user/del', // 1-刪除用户
  comAllRoleList: '/company/role/roleList', // 1-获取企业所有的角色
  isHasRole: '/busi/role/roleCount', // 1-判断是否有角色，有了才可以新增用户
  userOrg: '/busi/user/userOrg', // 1-获取用户的组织架构数据
  // comUserRepeat:  '', // 1-用户名是否重复

  // com/admim -role
  getCoRole: '/company/role/list', // 1-角色列表
  addOrUpdateCoRole: '/company/role/addOrUpdate', // 1-添加或者修改角色
  delCoRole: '/company/role/del', // 1-刪除角色
  getCoTree: '/company/role/menuTree', // 1-查询全部菜单树
  comRoleRepeat: '/company/role/isRoleName', // 1-角色名是否重复

  // com/admim -workOrder
  comAddOrUpdateWk: '/order/workOrder/addOrUpdate', // 1-添加或者修改工单
  comProductList: '/order/workOrder/productList', // 1-产品列表
  comGetWorkOrder: '/order/workOrder/list', // 1-工单管理列表
  comUpdateWkStatus: '/order/workOrder/updateWkStatus', // 1-催单/删除工单/撤销
  comReplyWorkOrder: '/order/workOrder/replyWorkOrder', // 1-回复工单
  comWkRecordList: '/order/workOrder/wkRecordList', // 1-获取沟通记录

  // admim -msg
  addOrUpdatePushRules: '/dvo/msg/addOrUpdate', // 3-新增或修改催缴规则
  getPushList: '/dvo/msg/list', // 3-产品服务获取催缴列表
  accountInfoRule: '/dvo/msg/accountInfoRule', // 3-账户信息推送规则
  getPushPeriod: '/dvo/msg/pushTimePeriod', // 3-获取推送时间段
  pushPeriod: '/dvo/msg/addPushTime', // 3-推送时间段
  addAnnouncement: '/dvo/msg/addAnnouncement', // 3-公告发布
  listAnnouncement: '/dvo/msg/listAnnouncement', // 3-发布消息列表
  deleteAnnouncement: '/dvo/msg/deleteAnnouncement', // 3-删除待发布公告
  // com-msg
  comMsgList: '/company/msg/list', // 1-企业获取消息列表
  updateIsRead: '/company/msg/updateIsRead', // 1-是否已读
  coReceiverPage: '/company/msg/coReceiverPage', // 1-企业接收人页面显示
  saveOrUpdate: '/company/msg/saveOrUpdate', // 1-企业接收人新增或修改
  updateStatus: '/company/msg/updateStatus', // 1-企业接收人状态修改
  getMsgSetting: '/company/msg/messageTypeCnf', // 1-获取消息设置列表
  updateMsgSetting: '/company/msg/saveOrUpdateMessageCnf', // 1-修改消息设置
  updateMsgReceiver: '/company/msg/updateCoMessageCnf', // 1-修改消息设置中的接收人
  // com-product
  searchProduct: '/com/product/searchProduct', // 1-搜索产品
  getProName: '/com/product/getProName', // 1-获取产品名称列表
  addCoLeaveAuth: '/com/product/addCoLeave', // 1-添加企业留言
  coLeaveList: '/com/product/coLeaveList', // 1-查询所有留言
  dealCoLeave: '/com/product/dealCoLeave', // 1-处理企业留言
  // com-order
  addOrder: '/com/order/addOrder', // 1-添加订单
  joinRenewOrderId: '/com/order/joinRenewOrderId', // 1-续费订单
  cancelOrder: '/com/order/cancelOrder', // 1-取消订单
  getOrderDetail: '/com/order/getOrderDetail', // 1-订单详情 接口没有用到
  myOrderList: '/com/order/myOrderList', // 1-我的订单列表
  payOrder: '/com/order/payOrder', // 1-支付订单
  joinOrderId: '/com/order/joinOrderId', // 1-拼接订单
  getJoinOrderDetail: '/com/order/getJoinOrderDetail', // 1-拼接订单详情 admin&com公用
  getSysDate: '/com/order/getSysDate', // 1-获取系统时间
  getCoExpenseDetail: '/com/order/getCoExpenseDetail', // 获取企业的消费明细
  getRenewOrder: '/com/order/getRenewOrder', // 获取企业的续费订单列表
  getRenewDetailOrder: '/com/order/getRenewDetailOrder', // 获取企业的续费订单详情
  getRenewDate: '/com/order/getRenewDate', // 获取再次续费时间
  getCustomerOrder: '/com/order/getCustomerOrder', // 获取客户订单列表
  getCustomerOrderDetail: '/com/order/getCustomerOrderDetail', // 获取客户订单详情
  getCusUnregOrder: '/com/order/getCusUnregOrder', // 获取客户退订订单列表
  getUnregResourceDetail: '/com/order/getUnregResourceDetail', // 获取退订订单资源数据
  addOrderUnReg: '/com/order/addOrderUnReg', // 提交退订申请
  getAlreadyUnregOrder: '/com/order/getAlreadyUnregOrder', // 获取已经退订的数据
  voucherPay: '/com/order/voucherPay', // 代金券支付
  deleteBackOrder: '/com/order/deleteBackOrder', // 1-删除过期订单
  promptlyOpenOrder: '/com/order/promptlyOpenOrder', // 立即开通
  serviceManagementList: '/com/order/serviceManagementList', // 查询服务管理列表
  editOrderStatus: '/com/order/editOrderStatus', // 操作服务列表状态
  // admin-customerKanban
  getCompanyList: '/com/order/getCompanyList', // 客户看板-获取企业名称
  customerKanbanList: '/com/order/customerKanbanList', // 客户看板-列表

  // com-statistics
  getUserGeneralData: '/com/statistics/getUserGeneralData', // 获取企业用户总览数据
  getConsumeGeneralData: '/com/statistics/getConsumeGeneralData', // 获取企业消费总览数据
  searchUserLog: '/com/statistics/searchUserLog', // 查询用户日志
  userLogList: '/com/statistics/userLogList', // 查询登录日志
  getConsumerData: '/com/statistics/getConsumerData', // 获取消费统计数据
  getTrafficData: '/com/statistics/getTrafficData', // 获取流量统计数据

  // com-voucher
  addVoucher: '/com/voucher/add', // 添加代金券和抵扣卷
  deleteVoucher: '/com/voucher/delete', // 删除代金券和抵扣卷
  searchPageVoucher: '/com/voucher/searchPage', // 分页查询代金券和抵扣卷
  searchAllVoucher: '/com/voucher/searchAll', // 查询所有代金券和抵扣卷
  detailsVoucher: '/com/voucher/detail', // 查询代金券和抵扣卷详情
  recycle: '/com/voucher/recycle', // 回收代金券
  send: '/com/voucher/send', // 发券
  searchPageOp: '/com/voucher/searchPageOp', // 分页查询代金券操作数据
  getVoucherData: '/com/voucher/data', // 查询企业券数据

  // com-dist
  distList: '/com/dist/list', // 客户分配列表
  getDistComUser: '/com/dist/getDistComUser', // 获取可分配的企业用户
  distributionComUser: '/com/dist/distributionComUser', // 分配企业用户
  editLogo: '/com/dist/editLogo', // 修改企业logo

  // invit-record
  companyAll: '/company/invitRecord/companyAll', // 查询企业列表信息
  addComRecord: '/company/invitRecord/addOrUpdate', // 添加企业备案
  invitRecordList: '/company/invitRecord/InvitRecordList', // 已报备客户列表
  queryCompany: '/company/invitRecord/queryCompany', // 已邀请的客户
  delInvisted: '/company/invitRecord/del', // 删除伙伴
  updateInvitRecordStatus: '/company/invitRecord/updateInvitRecordStatus', // 已报备删除
  myPartnerList: '/company/invitRecord/myPartner', // 我的伙伴
  queryCode: '/company/invitRecord/queryCode', // 线下邀请
  editIsFriendNumb: '/company/invitRecord/editIsFriendNumb', // 解绑
  invitRecordAndCompanyList: '/company/invitRecord/invitRecordAndCompanyList', // 我邀请的伙伴
  invitedCustomers: '/company/invitRecord/invitedCustomers', // 已邀请的客户

  // com-version
  verAdd: '/com/version/add', // 发布一个新版本
  verList: '/com/version/list', // 发布记录列表
  verUploadFile: '/com/version/uploadFile', // 上传app文件
  verUpVerStatus: '/com/version/upVerStatus', // 更新版本状态
  getNewVersion: '/noAuth/getNewVersion', // 获取最新版本

  // com-contract 合同
  contrOrderList: '/com/contract/orderList', // 获取可以签订合同的列表
  contrCompanyinfo: '/com/contract/company', // 获取认证的企业信息
  addOrUpdateContr: '/com/contract/addOrUpdate', // 新增
  exportPDF: '/com/contract/exportPDF', // 下载合同
  previewPDF: '/com/contract/previewPDF', // 预览合同
  // com/admim -contract 合同公用
  contractList: '/com/contract/contractList', // 合同列表
  updateContrStatus: '/com/contract/updateContractStatus', // 修改合同状态

  // com-protocol 协议
  getProTypeAuth: '/com/protocol/getProType', // 获取协议类型列表
  getProType: '/noAuth/getProType', // 获取协议类型列表(无token)
  getProContentAuth: '/com/protocol/getProContent', // 获取协议内容
  getProContent: '/noAuth/getProContent', // 获取协议内容(无token)
  getPreviewContent: '/com/protocol/getPreviewContent', // 获取旧的协议内容
  addProtocol: '/com/protocol/addProtocol', // 添加协议
  getProList: '/com/protocol/getProList', // 查询所有协议记录
  getSignProList: '/com/protocol/getSignProList', // 查询签约协议数据

  // com/busArea 区域
  areaAdd: '/com/busArea/add', // 添加区域
  areaDel: '/com/busArea/del', // 删除区域
  areaList: '/com/busArea/areaList', // 区域列表
  areaShopList: '/com/busArea/areaShopList', // 区域门店列表
  allArea: '/com/busArea/allArea', // 企业所有区域列表
  cameraAreaList: '/com/busArea/cameraAreaList', // 区域像机配置列表
  updateCameraArea: '/com/busArea/updateCameraArea', // 新增或清空区域
  cmrIpChecked: '/com/busArea/cmrIpChecked', // 查询区域id
  getRealTimeVideo: '/com/busArea/getRealTimeVideo', // 获取相机直播流地址
  closeCmrVideo: '/com/busArea/closeCmrVideo', // 关闭相机
  playHeartbeat: '/com/busArea/playHeartbeat', // 心跳
  // com-dingding 钉钉管理
  dingList: '/com/config/list', // 列表
  addOrEditDing: '/com/config/add', // 新增/编辑
  deleteDing: '/com/config/del', // 删除
  domainNameList: '/com/config/domainNameList', // 推流列表
  delPlayDomain: '/com/config/delPlayDomain', // 删除推流url
  // oAuth
  getServerCode: '/oAuth/getServerCode', // 获取服务器授权码

  // /com/busiHours
  addHours: '/com/busiHours/addHours', // 设置时间
  getShopHours: '/com/busiHours/getShopHours', // 查询门店时间

  // com/invoice
  getInvoiceList: '/com/invoice/getInvoiceList', // 查询发票集合
  applyInvoice: '/com/invoice/applyInvoice', // 申请发票
  getInvoiceBalance: '/com/invoice/getInvoiceBalance', // 查询可开发票金额
  invoiceInfoList: '/com/invoice/invoiceInfoList', // 获取开票信息数据
  saveOrUpdateInfo: '/com/invoice/saveOrUpdateInfo', // 开票信息新增或修改
  deleteDeliveryAddr: '/com/invoice/deleteDeliveryAddr', // 删除企业寄送地址
  deleteInvoiceInfo: '/com/invoice/deleteInvoiceInfo', // 删除开票信息
  getDeliveryAddrList: '/com/invoice/getDeliveryAddrList', // 查询企业寄送地址
  saveOrUpdateDeliveryAddr: '/com/invoice/saveOrUpdateDeliveryAddr', // 企业寄送地址新增或修改
  updateStatusInvoice: '/com/invoice/updateStatusInvoice', // 修改发票状态
  getRejectNum: '/com/invoice/getRejectNum', // 获取驳回次数
  getOrderList: '/com/invoice/getOrderList', // 获取15天以上可开票订单
  getDvoInvoiceList: '/com/invoice/getDvoInvoiceList', // DVO申请发票列表
  getDvoRefundInvoiceList: '/com/invoice/getDvoRefundInvoiceList', // DVO退票列表
  getDvoSendOutInvoiceList: '/com/invoice/getDvoSendOutInvoiceList', // DVO已寄出发票列表

  // com/category
  saveOrUpdateIndustry: '/com/category/saveOrUpdate', // 行业分类-新增编辑
  categoryListPage: '/com/category/categoryListPage', // 行业分类-列表
  delCategoryIds: '/com/category/delCategoryIds', // 行业分类-删除
  categoryNameRepeat: '/com/category/uniqueCategoryName', // 分类名称是否重复
  categoryListAll: '/com/category/categoryListAll', // 查询全部行业

  // com/businessType
  saveOrUpdateBussiness: '/com/businessType/saveOrUpdate', // 业态种类-新增编辑
  uniqueBusName: '/com/businessType/uniqueBusName', // 业态名称是否重复
  businessTypeListPage: '/com/businessType/businessTypeListPage', // 业态种类-列表
  delCategoryIdsBusiness: '/com/businessType/delCategoryIds', // 业态种类-删除

  // com&admin/questionBank
  getProductDataAuth: '/com/questionBank/getProductData', // 获取产品名称
  // com/questionBank
  categoryAndBusinessTypeList: '/com/questionBank/categoryAndBusinessTypeList', // 查询所有的行业分类和业态名称
  addQuestionBank: '/com/questionBank/addQuestionBank', // 发布预置题
  questionBankPage: '/com/questionBank/questionBankPage', // 已发布记录列表
  updateQuestionBankId: '/com/questionBank/updateQuestionBankId', // 修改禁用启用状态
  getCategoryAndBusType: '/com/questionBank/getCategoryAndBusType', // 行业分类&业态名称

  // com/category
  updateCategoryConfig: '/com/category/updateCategoryConfig', // 修改企业所属行业
  companyCategoryList: '/com/category/companyCategoryList', // 查询全部行业名称（有状态）

  // admin-emailAndService
  getMessageCnfEmailInfo: '/dvo/msg/getMessageCnfEmailInfo', // 获取邮箱服务器配置
  saveOrUpdateConfigEmail: '/dvo/msg/saveOrUpdateConfigEmail', // 新增或修改邮箱服务器配置

  // admin-dp/user
  dpUserListPage: '/dp/user/dpUserListPage', // 查询审核账号
  auditAccountNumber: '/dp/user/auditAccountNumber', // 审核开发者账号
  dpUserMenuTree: '/dp/user/dpUserMenuTree', // 获取产品和授权菜单
  updateDpUserCoProductAuth: '/dp/user/updateDpUserCoProductAuth', // 开发者产品授权
  updateDpUserMenuAuth: '/dp/user/updateDpUserMenuAuth', // 开发者菜单授权
  unlockDpUser: '/dp/user/unlockUser', // 解锁

  // dp/userCompany 视安心业务平台
  userCompanyListPage: '/dp/userCompany/userCompanyListPage', // 视安心业务平台关联管理
  updateAuditStatus: '/dp/userCompany/updateAuditStatus', // 修改审核状态
  vsGetCode: '/dp/userCompany/getCode', // 关联绑定码
  vsRefreshCode: '/dp/userCompany/refreshCode', // 刷新关联绑定码

  // 下载静态资源模板
  downloadRoleTemp: staticUrl + '/static/excel/saas_roleStore.xls', // 2-角色模板下载
  downloadOrgTemp_cn: staticUrl + '/static/excel/Organization structure and store import.xls', // 2-下载组织架构模板
  downloadOrgTemp_en: staticUrl + '/static/excel/Organization structure and store import(English).xls', // 2-下载组织架构模板(英文)
  downDvoProductAlbum: staticUrl + '/static/pdf/六臂云产品画册.pdf', // 下载六臂云产品画册
  downDvoProductAlbum_EN: staticUrl + '/static/pdf/DVO Product Presentation Ver1.7.pdf', // 下载六臂云产品画册-英文
  downloadurl_DG20: staticUrl + '/static/pdf/六臂云智能数据管理网关安装说明.pdf', // 下载DG-20X
  downloadurl_DG20_EN: staticUrl + '/static/pdf/Installation guides for intelligent data management gateway Ver1.1.pdf', // 下载DG-20X-英文
  downloadurl_NVR: staticUrl + '/static/pdf/六臂云NVR安装说明.pdf', // 下载NVR
  downloadurl_CAMERA: staticUrl + '/static/pdf/六臂云像机安装说明.pdf', // 下载像机
  downloadurl_CAMERA_EN: staticUrl + '/static/pdf/Camera installation instructions Ver1.0.pdf', // 下载像机-英文
  iePlayerUrl: staticUrl + '/static/DvoWebOcxSetup1.0.4.18.exe',
  iePlayerMinVer: '1.0.4.18'
}
export default api
