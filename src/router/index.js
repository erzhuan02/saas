import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'

// common页
const LoginIndex = () => import('@/pages/common/loginIndex') // 首页
const Regis = () => import('@/pages/common/regis/regis') // 注册-选择注册方式
const RegisForm = () => import('@/pages/common/regis/regisForm') // 注册-提交表单
const RegisLicense = () => import('@/pages/common/regis/regisLicense') // 注册-上传营业执照
const RegisSuccess = () => import('@/pages/common/regis/regisSuccess') // 注册-成功
const RegisAgain = () => import('@/pages/common/regis/regisAgain') // 重新注册
const GenernalAgreement = () => import('@/pages/common/genernalAgreement') // 所有的协议
const Login = () => import('@/pages/common/login') // 登录
const MobLogin = () => import('@/pages/common/mobLogin') // mob-手机登录
const OAuthShow = () => import('@/pages/common/oAuthShow') // mob-手机钉钉登录
const ForgotPsd = () => import('@/pages/common/forgotPsd') // 忘记密码
const MobOnlineMsg = () => import('@/pages/common/mobOnlineMsg') // mob-手机在线留言
const Goods360 = () => import('@/pages/common/goods/360.vue') // 首页产品-360度全景高清球机
const DG201Goods = () => import('@/pages/common/goods/dg201.vue') // 首页产品-DG-201智能数据管理网关
const HighDefinitionGoods = () => import('@/pages/common/goods/highDefinition.vue') // 首页产品-百万高清网络半球
const OverlyingGoods = () => import('@/pages/common/goods/overlying.vue') // 首页产品-叠加网络摄像机
const InfraredGoods = () => import('@/pages/common/goods/infrared.vue') // 首页产品-高清红外一体机
const NVRGoods = () => import('@/pages/common/goods/nvr.vue') // 首页产品-嵌入式NVR
const CameraGoods = () => import('@/pages/common/goods/camera.vue') // 首页产品-智能高清网络摄像机
const Solution = () => import('@/pages/common/solution/solution') // 解决方案
const SuccessfulCase = () => import('@/pages/common/successfulCase/successfulCase') // 成功案例
const CaseSanjiang = () => import('@/pages/common/successfulCase/sanjiang.vue') // 三江
const CaseLvdi = () => import('@/pages/common/successfulCase/lvdi.vue') // 绿地
const CaseRtMart = () => import('@/pages/common/successfulCase/rtMart.vue') // 大润发
const CaseDicos = () => import('@/pages/common/successfulCase/dicos.vue') // 德克士
const CaseDingXin = () => import('@/pages/common/successfulCase/dingxin.vue') // 顶新
const CaseDingShi = () => import('@/pages/common/successfulCase/dingshi.vue') // 顶实
const CaseVisual = () => import('@/pages/common/successfulCase/visual.vue') // 可视化追溯
const CaseSrsFace = () => import('@/pages/common/successfulCase/srsFace.vue') // 人脸识别
const Download = () => import('@/pages/common/download') // 下载
const OpenPlatform = () => import('@/pages/common/openPlatform') // 开放平台
const News = () => import('@/pages/common/news/news') // 新闻资讯
const News1 = () => import('@/pages/common/news/news1.vue') // 公司新闻
const ServiceProcess = () => import('@/pages/common/serviceProcess') // 服务流程
const ApplyExperience = () => import('@/pages/common/applyExperience') // 申请体验
const AboutUs = () => import('@/pages/common/aboutUs') // 企业介绍
const Recruit = () => import('@/pages/common/recruit') // 岗位招聘
const AfterSale = () => import('@/pages/common/afterSale') // 售后服务
const ChannelPartner = () => import('@/pages/common/channelPartner') // 渠道合作伙伴
const NotFound = () => import('@/pages/common/notFound') // 无法访问
const Preview = () => import('@/components/preview') // 预览 企业和dev用户

// admin用户 DVO
const AdOverView = () => import('@/pages/admin/adOverView') // admin账号-总览
const TmMyClients = () => import('@/pages/admin/myClients/tmMyClients') // 租户管理-我的客户
const Review = () => import('@/pages/admin/myClients/review') // 租户管理-我的客户-审核
const AdAccount = () => import('@/pages/admin/account/account') // 租户管理-我的客户
const CustomerOrder = () => import('@/pages/admin/customerOrder/customerOrder') // 租户管理-客户订单
const AdUnsubscribe = () => import('@/pages/admin/adUnsubscribe/adUnsubscribe') // 租户管理-退订管理
const ClientMsg = () => import('@/pages/admin/clientMsg/clientMsg') // 租户管理-客户留言
const Coupon = () => import('@/pages/admin/coupon/coupon') // 租户管理-代金券管理
const Voucher = () => import('@/pages/admin/voucher/voucher') // 租户管理-抵用券管理
const CustomerAllocation = () => import('@/pages/admin/customerAllocation/customerAllocation') // 租户管理-客户分配
const AdCustomerDev = () => import('@/pages/admin/customerDev/adCustomerDev') // 租户管理-客户拓展
const AdFCode = () => import('@/pages/admin/adFCode/adFCode') // 租户管理-F码管理
const DownloadApplication = () => import('@/pages/admin/downloadApplication/downloadApplication') // 租户管理-下载申请
const AdMyWorkOrder = () => import('@/pages/admin/myWorkOrder') // 工单管理-我的工单
const AdPushSettings = () => import('@/pages/admin/msgPushSettings/msgPushSettings') // 消息中心-推送规则
const AdNotice = () => import('@/pages/admin/notice/notice') // 消息中心-推送规则
const VersionRelease = () => import('@/pages/admin/versionRelease/versionRelease') // 版本管理-版本发布
const AdContract = () => import('@/pages/admin/contract/contract') // 合同管理
const AdProtocol = () => import('@/pages/admin/protocol/protocol') // 协议管理-发布管理
const AdSigning = () => import('@/pages/admin/protocol/signing') // 协议管理-签约管理
const AdDingding = () => import('@/pages/admin/adDingding/adDingding') // 钉钉管理
const AdInvoice = () => import('@/pages/admin/invoice/invoice') // 发票管理
const AdEmailServer = () => import('@/pages/admin/emailServer/emailServer') // 邮箱服务器设置
const AdIndustry = () => import('@/pages/admin/adIndustry/industry') // 行业设置
const Question = () => import('@/pages/admin/question/question') // 发布预置题
const AdAssociation = () => import('@/pages/admin/developer/adAssociation') // 开发者管理-关联管理
const AdDevAccount = () => import('@/pages/admin/developer/devAccount/devAccount') // 开发者管理-账号管理
const AdConsumption = () => import('@/pages/admin/adConsumption') // 运营看板-消费看板
const AdCustomerKanban = () => import('@/pages/admin/customerKanban/customerKanban') // 运营看板-客户看板
const AdService = () => import('@/pages/admin/service') // 服务管理
// 企业用户
const Index = () => import('@/pages/company/index') // 首页
const Welcome = () => import('@/pages/company/welcome') // 企业账号-总览
const BmBasicInfo = () => import('@/pages/company/basicInfo/bmBasicInfo') // 企业管理-基本信息
const ChangePsd = () => import('@/pages/company/basicInfo/changePsd') // 企业管理-基本信息-修改密码
const ChangePhone = () => import('@/pages/company/basicInfo/changePhone') // 企业管理-基本信息-修改手机
const VerifyEmail = () => import('@/pages/company/basicInfo/verifyEmail') // 企业管理-基本信息-验证邮箱
const BmAccount = () => import('@/pages/company/account/account') // 企业管理-账号管理
const BmRealNameAuth = () => import('@/pages/company/bmRealNameAuth') // 企业管理-实名认证
const Consumption = () => import('@/pages/company/consumption') // 财务中心-消费看板
const FinOrderMange = () => import('@/pages/company/order/finOrderMange') // 财务中心-订单管理
const FinOrderDetails = () => import('@/pages/company/order/finOrderDetails') // 财务中心-订单详情
const ExpendDetails = () => import('@/pages/company/expendDetails/expendDetails') // 财务中心-消费明细
const ExpendFlowDetails = () => import('@/pages/company/expendDetails/expendFlowDetails') // 财务中心-流水详情
const RenewMange = () => import('@/pages/company/renew/renewMange') // 财务中心-续费管理
const Renew = () => import('@/pages/company/renew/renew') // 财务中心-续费
const UnsubscribeMGT = () => import('@/pages/company/unsubscribe/unsubscribeMGT') // 财务中心-退订管理
const RefundRecordDetails = () => import('@/pages/company/unsubscribe/refundRecordDetails') // 财务中心-退订详情
const ResMarket = () => import('@/pages/company/resMarket/resMarket') // 资源中心-资源市场
const GoodsDetail = () => import('@/pages/company/resMarket/goodsDetail') // 商品详情
const GoodsDetailHard = () => import('@/pages/company/resMarket/goodsDetailHard') // 商品详情(硬件)
const PayInfo = () => import('@/pages/company/pay/payInfo') // 支付商品信息
const ToPay = () => import('@/pages/company/pay/toPay') // 去支付
const PaySuccess = () => import('@/pages/company/pay/paySuccess') // 支付成功
const MyFCode = () => import('@/pages/company/fCode/myFCode') // 伙伴拓展-我的F码
const MyPartner = () => import('@/pages/company/myPartner') // 伙伴拓展-我的伙伴
const MyInvitedPartner = () => import('@/pages/company/myInvitedPartner') // 伙伴拓展-我邀请的伙伴
const ComMyWorkOrder = () => import('@/pages/company/workOrder/myWorkOrder') // 我的工单
const ComAddWorkOrder = () => import('@/pages/company/workOrder/addWorkOrder') // 增加工单
const ComAllMsgs = () => import('@/pages/company/message/allMsgs') // 全部消息
const ComMsgSeetings = () => import('@/pages/company/message/msgSeetings') // 消息接收设置
const ComContract = () => import('@/pages/company/contract/contract') // 合同管理
const ComContractApply = () => import('@/pages/company/contract/contractApply') // 合同申请
const ComInvoice = () => import('@/pages/company/invoice/invoice') // 发票管理
const ComInvoiceApply = () => import('@/pages/company/invoice/invoiceApply') // 发票管理
// 业务用户
const UserLogoIndex = () => import('@/pages/business/userLogoIndex') // 登录后带logo显示大首页
const UserIndex = () => import('@/pages/business/userIndex') // 首页
const IframeIndex = () => import('@/pages/business/iframeIndex') // iframe加载页
const UserWelcome = () => import('@/pages/business/userWelcome') // 欢迎页
const UserRolePrivilege = () => import('@/pages/business/userRolePrivilege') // 角色权限管理
const UserAccount = () => import('@/pages/business/userAccount') // 账号管理
const Organization = () => import('@/pages/business/organization') // 系统设置-组织架构
const UserShop = () => import('@/pages/business/userShop/userShop') // 系统设置-门店管理
const UserLog = () => import('@/pages/business/userLog/userLog') // 系统设置-日志管理
const UserPositionMange = () => import('@/pages/business/userPositionMange') // 职位管理
const UserIndustry = () => import('@/pages/business/userIndustry') // 行业设置
const Area = () => import('@/pages/business/area/area') // 区域管理
const HourSetting = () => import('@/pages/business/hoursSetting/hoursSetting') // 营业时间设置
// 视安心业务用户
const VsIndex = () => import('@/pages/visualSafe/vsIndex') // 首页
const VsWelcome = () => import('@/pages/visualSafe/vsWelcome') // 欢迎页
const VsAssociation = () => import('@/pages/visualSafe/association/association') // 关联管理

Vue.use(Router)
const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/mobLogin', name: 'MobLogin', component: MobLogin },
    { path: '/oAuthShow', name: 'OAuthShow', component: OAuthShow },
    { path: '/userLogoIndex', name: 'UserLogoIndex', component: UserLogoIndex, meta: { roles: [2] } },
    { path: '/iframeIndex/:type', component: IframeIndex, meta: { allowBack: false, roles: [2] } },
    { path: '/preview', component: Preview, name: 'Preview', meta: { roles: [1, 3] } },
    // 业务用户
    {
      path: '/userIndex',
      name: 'UserIndex',
      component: UserIndex,
      children: [
        { path: '/userWelcome', component: UserWelcome, meta: { roles: [2] } },
        { path: '/userRolePrivilege', component: UserRolePrivilege, meta: { roles: [2] } },
        { path: '/userAccount', component: UserAccount, meta: { roles: [2] } },
        { path: '/organization', component: Organization, meta: { roles: [2] } },
        { path: '/userShop', component: UserShop, meta: { roles: [2] } },
        { path: '/userLog', component: UserLog, meta: { roles: [2] } },
        { path: '/userPositionMange', component: UserPositionMange, meta: { roles: [2] } },
        { path: '/userIndustry', component: UserIndustry, meta: { roles: [2] } },
        { path: '/area', component: Area, meta: { roles: [2] } },
        { path: '/hoursSetting', component: HourSetting, meta: { roles: [2] } }
      ]
    },
    // 视安心业务用户
    {
      path: '/vsIndex',
      name: 'VsIndex',
      component: VsIndex,
      children: [
        { path: '/vsWelcome', component: VsWelcome, meta: { roles: [2] } },
        { path: '/vsAssociation', component: VsAssociation, meta: { roles: [2] } }
      ]
    },
    // admin和企业用户
    {
      path: '/index',
      name: 'Index',
      component: Index,
      children: [
        { path: '/welcome', component: Welcome, meta: { roles: [1] } },
        { path: '/adOverView', component: AdOverView, meta: { roles: [3] } },
        { path: '/bmBasicInfo', component: BmBasicInfo, meta: { roles: [1] } },
        { path: '/changePsd', component: ChangePsd, meta: { roles: [1] } },
        { path: '/changePhone', component: ChangePhone, meta: { roles: [1] } },
        { path: '/verifyEmail', component: VerifyEmail, meta: { roles: [1] } },
        { path: '/bmAccount', component: BmAccount, meta: { roles: [1] } },
        { path: '/bmRealNameAuth', component: BmRealNameAuth, meta: { roles: [1] } },
        { path: '/tmMyClients', component: TmMyClients, meta: { roles: [3] } },
        { path: '/adAccount', component: AdAccount, meta: { keepAlive: true, roles: [3] } },
        { path: '/customerOrder', component: CustomerOrder, meta: { roles: [3] } },
        { path: '/adUnsubscribe', component: AdUnsubscribe, meta: { roles: [3] } },
        { path: '/clientMsg', component: ClientMsg, meta: { roles: [3] } },
        { path: '/coupon', component: Coupon, meta: { roles: [3] } },
        { path: '/voucher', component: Voucher, meta: { roles: [3] } },
        { path: '/customerAllocation', component: CustomerAllocation, meta: { roles: [3] } },
        { path: '/adCustomerDev', component: AdCustomerDev, meta: { roles: [3] } },
        { path: '/adFCode', component: AdFCode, meta: { roles: [3] } },
        { path: '/downloadApplication', component: DownloadApplication, meta: { roles: [3] } },
        { path: '/review', component: Review, meta: { roles: [3] } },
        { path: '/emailServer', component: AdEmailServer, meta: { roles: [3] } },
        { path: '/adIndustry', component: AdIndustry, meta: { roles: [3] } },
        { path: '/question', component: Question, meta: { roles: [3] } },
        { path: '/adAssociation', component: AdAssociation, meta: { roles: [3] } },
        { path: '/adDevAccount', component: AdDevAccount, meta: { roles: [3] } },
        { path: '/adConsumption', component: AdConsumption, meta: { roles: [3] } },
        { path: '/customerKanban', component: AdCustomerKanban, meta: { roles: [3] } },
        { path: '/adService', component: AdService, meta: { roles: [3] } },
        { path: '/consumption', name: 'Consumption', component: Consumption, meta: { roles: [1] } },
        { path: '/finOrderMange', name: 'FinOrderMange', component: FinOrderMange, meta: { roles: [1] } },
        { path: '/finOrderDetails', component: FinOrderDetails, meta: { roles: [1] } },
        { path: '/expendDetails', component: ExpendDetails, meta: { roles: [1] } },
        { path: '/expendFlowDetails', component: ExpendFlowDetails, meta: { roles: [1] } },
        { path: '/renewMange', name: 'RenewMange', component: RenewMange, meta: { roles: [1] } },
        { path: '/renew', component: Renew, meta: { roles: [1] } },
        { path: '/unsubscribeMGT', component: UnsubscribeMGT, meta: { roles: [1] } },
        { path: '/refundRecordDetails', component: RefundRecordDetails, meta: { roles: [1] } },
        { path: '/resMarket', component: ResMarket, meta: { roles: [1] } },
        { path: '/goodsDetail', component: GoodsDetail, meta: { roles: [1] } },
        { path: '/goodsDetailHard', component: GoodsDetailHard, meta: { roles: [1] } },
        { path: '/payInfo', component: PayInfo, meta: { roles: [1] } },
        { path: '/toPay', component: ToPay, meta: { roles: [1] } },
        { path: '/paySuccess', component: PaySuccess, meta: { roles: [1] } },
        { path: '/myFCode', component: MyFCode, meta: { roles: [1] } },
        { path: '/myPartner', component: MyPartner, meta: { roles: [1] } },
        { path: '/myInvitedPartner', component: MyInvitedPartner, meta: { roles: [1] } },
        { path: '/comMyWorkOrder', name: 'ComMyWorkOrder', component: ComMyWorkOrder, meta: { roles: [1] } },
        { path: '/comAddWorkOrder', name: 'ComAddWorkOrder', component: ComAddWorkOrder, meta: { roles: [1] } },
        { path: '/comAllMsgs', name: 'ComAllMsgs', component: ComAllMsgs, meta: { roles: [1] } },
        { path: '/comMsgSeetings', name: 'ComMsgSeetings', component: ComMsgSeetings, meta: { roles: [1] } },
        { path: '/adMyWorkOrder', component: AdMyWorkOrder, meta: { roles: [3] } },
        { path: '/adPushSettings', component: AdPushSettings, meta: { roles: [3] } },
        { path: '/adNotice', component: AdNotice, meta: { roles: [3] } },
        { path: '/comContract', component: ComContract, meta: { roles: [1] } },
        { path: '/comContractApply', component: ComContractApply, meta: { roles: [1] } },
        { path: '/comInvoice', component: ComInvoice, meta: { roles: [1] } },
        { path: '/comInvoiceApply', component: ComInvoiceApply, meta: { roles: [1] } },
        { path: '/adInvoice', component: AdInvoice, meta: { roles: [3] } },
        { path: '/versionRelease', component: VersionRelease, meta: { roles: [3] } },
        { path: '/adContract', component: AdContract, meta: { roles: [3] } },
        { path: '/protocol', component: AdProtocol, meta: { roles: [3] } },
        { path: '/signing', component: AdSigning, meta: { roles: [3] } },
        { path: '/dingding', component: AdDingding, meta: { roles: [3] } }
      ]
    },
    // 企业公司页面
    {
      path: '/loginIndex',
      name: 'LoginIndex',
      component: LoginIndex,
      children: [
        { path: '/regis', name: 'Regis', component: Regis },
        { path: '/regisForm', name: 'RegisForm', component: RegisForm },
        { path: '/regisLicense', name: 'RegisLicense', component: RegisLicense },
        { path: '/regisSuccess', name: 'RegisSuccess', component: RegisSuccess },
        { path: '/regisAgain', name: 'RegisAgain', component: RegisAgain },
        { path: '/genernalAgreement/:id', name: 'GenernalAgreement', component: GenernalAgreement },
        { path: '/login', name: 'Login', component: Login },
        { path: '/forgotPsd', name: 'ForgotPsd', component: ForgotPsd },
        { path: '/mobOnlineMsg', name: 'MobOnlineMsg', component: MobOnlineMsg },
        { path: '/goods/360', name: 'Goods360', component: Goods360 },
        { path: '/goods/dg201', name: 'DG201Goods', component: DG201Goods },
        { path: '/goods/highDefinition', name: 'HighDefinitionGoods', component: HighDefinitionGoods },
        { path: '/goods/overlying', name: 'OverlyingGoods', component: OverlyingGoods },
        { path: '/goods/Infrared', name: 'InfraredGoods', component: InfraredGoods },
        { path: '/goods/nvr', name: 'NVRGoods', component: NVRGoods },
        { path: '/goods/camera', name: 'CameraGoods', component: CameraGoods },
        { path: '/solution/:id?', component: Solution },
        { path: '/successfulCase', name: 'SuccessfulCase', component: SuccessfulCase, meta: { keepAlive: true } },
        { path: '/successfulCase/sanjiang', name: 'Sangjiang', component: CaseSanjiang },
        { path: '/successfulCase/lvdi', name: 'Lvdi', component: CaseLvdi },
        { path: '/successfulCase/rtMart', name: 'RtMart', component: CaseRtMart },
        { path: '/successfulCase/dicos', name: 'Dicos', component: CaseDicos },
        { path: '/successfulCase/dingxin', name: 'Dingxin', component: CaseDingXin },
        { path: '/successfulCase/dingshi', name: 'Dingshi', component: CaseDingShi },
        { path: '/successfulCase/visual', name: 'Visual', component: CaseVisual },
        { path: '/successfulCase/srsFace', name: 'SrsFace', component: CaseSrsFace },
        { path: '/download', name: 'Download', component: Download },
        { path: '/openPlatform', name: 'OpenPlatform', component: OpenPlatform },
        { path: '/news', name: 'News', component: News },
        { path: '/news/news1', name: 'News1', component: News1 },
        { path: '/serviceProcess', name: 'ServiceProcess', component: ServiceProcess },
        { path: '/applyExperience', name: 'ApplyExperience', component: ApplyExperience },
        { path: '/aboutUs', name: 'AboutUs', component: AboutUs },
        { path: '/recruit', name: 'Recruit', component: Recruit },
        { path: '/afterSale', name: 'AfterSale', component: AfterSale },
        { path: '/channelPartner', name: 'ChannelPartner', component: ChannelPartner }
      ]
    },
    { path: '*', component: NotFound, meta: { roles: [1, 2, 3] } }
  ]
  // scrollBehavior(to, from, savedPosition) {
  //   // 针对的只是路由的盒子有滚动条，回到盒子顶部
  //   console.log('scrollBehavior', to, savedPosition)
  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     return { x: 0, y: 0 }
  //   }
  // }
})
// 全局导航守卫：任何一个路由的切换，都会经过全局导航守卫
router.beforeEach((to, from, next) => {
  // if (!allowBack) {
  //    history.pushState(null, null, location.href)
  // }
  // 访问的是以下页面,直接 next() 放行
  if (
    to.path === '/regis' ||
    to.path === '/regisForm' ||
    to.path === '/regisLicense' ||
    to.path === '/regisSuccess' ||
    to.path === '/regisAgain' ||
    to.path.startsWith('/genernalAgreement') ||
    to.path === '/login' ||
    to.path === '/mobLogin' ||
    to.path === '/oAuthShow' ||
    to.path === '/forgotPsd' ||
    to.path === '/mobOnlineMsg' ||
    to.path.startsWith('/goods') ||
    to.path.startsWith('/solution') ||
    to.path.startsWith('/successfulCase') ||
    to.path === '/download' ||
    to.path === '/openPlatform' ||
    to.path.startsWith('/news') ||
    to.path === '/serviceProcess' ||
    to.path === '/applyExperience' ||
    to.path === '/aboutUs' ||
    to.path === '/recruit' ||
    to.path === '/afterSale' ||
    to.path === '/channelPartner'
  ) {
    next()
    return
  }
  let auth = store.state.app.authorization
  const token = sessionStorage.getItem('authorization') || auth
  if (token) {
    // 登录
    // 增加页面使用权限 非权限页面则跳转404
    // userType 1企业用户 2业务用户 3dvo
    var user = sessionStorage.getItem('user')
    let userType = (user && JSON.parse(user).userType) || 2
    let roles = to.meta.roles || []
    if (userType) {
      if (roles.includes(userType)) { next() } else { next('*') }
    } else {
      next()
    }
  } else {
    // 没有登录
    next('/login')
  }
})
router.afterEach((to, from) => {
  // console.log('afterEach', to)
  // 针对的指定盒子有滚动条，回到盒子顶部。也可放在beforeEach的导航守卫中
  var routerBox = document.querySelector('#loginIndex .bg') // 公司首页内的页面
  var mainBox = document.querySelector('#main') // 系统内部的
  try {
    routerBox && routerBox.scrollTo(0, 0)
    mainBox && mainBox.scrollTo(0, 0)
  } catch (error) {
    // 兼容ie
    if (routerBox) { routerBox.scrollTop = 0 }
    if (mainBox) { mainBox.scrollTop = 0 }
  }
})
// 解决发布正式环境之后点击页面报错需清除缓存的问题
// 当捕获到Loading chunk {n} failed的错误时我们重新渲染目标页面
router.onError(error => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})
// 禁止全局路由错误处理打印(vue-router ≥ v3.1 返回promise会报错)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  // 这句加上点击同路由菜单时会报错,故先隐藏
  // if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
export default router
