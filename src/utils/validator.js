import utils from './index'
import i18n from '../lang'

// 项目的正则验证
const reg = {
  // age: /^(?:[1-9][0-9]?|1[01][0-9]|120)$/,
  // ageRange: /^(?:[1-9][0-9]?|1[01][0-9]|120)(-(?:[1-9][0-9]?|1[01][0-9]|120))?$/,
  // [`~!#@%$^&*=|{}\':;\'\\[\\]<>/?~！#￥……&*——|{}【】‘；：”“\']‘\'
  // specialKey: /[`!@#￥%……&\*（）\-=\+；：‘’“”【】\{\}、|，。、《》？`~!$\^\(\)\[\]_\|;\':\",.<>?\\/]/,
  specialKey: /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im,
  cnChar: /[\u4E00-\u9FA5]/g, // 汉字
  noCnChar: /^[^\u4e00-\u9fff]{1,30}$/, // 不包含汉字
  onlyNum: /^\d+$/, // 非负整数（正整数 + 0）
  name: /^([\u4e00-\u9fa5]|[a-zA-Z0-9]){1,30}$/, // 没有空格和下划线
  // roleName: /^([\u4e00-\u9fa5]|[a-zA-Z0-9]|[`!@#￥%……&\*（）\-=\+；：‘’“”【】\{\}、|，。、《》？`~!$\^\(\)\[\]_\|;\':\",.<>?\\/]){1,30}$/,
  roleName: /^([\u4e00-\u9fa5]|[\w]|[`!@￥%……\*（）\-\+；：‘’“”【】\{\}、|，。、《》`~!$\^\(\)\[\]_\|;\':\",.<>\\/]){1,30}$/, // 中文、字母、数字、-_、标点、非&#?=和不可见字符
  areaAbbr: /^([\u4e00-\u9fa5]|[a-zA-Z0-9]){1,10}$/, // 行政区域简称
  companyName: /^([\u4e00-\u9fa5]|[\w.()（）,，“”""&.]){1,128}$/, // 中文、字母、数字、下划线、中划线、逗号、点、括号、&号、双引号。
  // [。~!@#$%\^\+\*&\\\/\?\|:\.<>{}()';="]
  // userName: /^\S{1,30}$/,
  userName: /^[^\u4e00-\u9fa5&#?=\s]{1,30}$/, // 非中文/&#?=/不可见字符
  searchName: /^[^&#?=\s]{1,30}$/, // 非&#?=/不可见字符
  searchName1: /^[^&#?=\s]{1,128}$/, // 非&#?=/不可见字符
  searchName2: /^([\u4e00-\u9fa5]|[a-zA-Z0-9.。,，“”""&.-]){1,128}$/, // 非下划线特殊字符
  // searchName: /^[^&#?=]{1,30}$/, // 非&#?=/不可见字符
  number: /^\d{1,10}$/,
  numberDay: /^[1-9]\d*$/, // 非0开头的数字
  password: /^[\S]{6,30}$/,
  phoneNoC: /^1(3|4|5|6|7|8|9)\d{9}$/, // 中国要求严格
  phoneNoC1: /^1\d{10}$/, // 中国要求不太严格的,只要首位位1即可
  phoneNoC2: /^0\d{9}$/, // 台湾,首位为0,10位数
  phoneNo: /^\d{1,11}$/,
  phoneNoA: /^\d{1,30}$/, // 全部的验证
  shopNo: /^\d{1,30}$/,
  // blank: / {2}/g, // 字符串,连续两个空格才替换,一个不替换
  // email: /^([a-zA-Z]|[0-9])(\w|-|\.)+@[a-zA-Z0-9]+(\.([a-zA-Z]{2,4})){1,2}$/
  email: /^[a-z0-9A-Z]+[-|a-z0-9A-Z._]*@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-z]{2,}$/,
  // longitude: /^-?((0|1?[0-7]?[0-9]?)(([.][0-9]{1,6})?)|180(([.][0]{1,6})?))$/,
  longitude: /^[\-\+]?(0?\d{1,2}\.\d{1,6}|1[0-7]?\d{1}\.\d{1,6}|180(([.][0]{1,6})?))$/,
  latitude: /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,6})?)|90(([.][0]{1,6})?))$/,
  orderId: /^[a-zA-Z0-9]{1,50}$/, // 订单号
  contractId: /^[a-zA-Z0-9]{1,50}$/,
  hasVal: /\S+/, // 至少有一个可见字符
  content16: /^[\s\S]{1,16}$/,
  content30: /^[\s\S]{1,30}$/,
  content50: /^[\s\S]{1,50}$/,
  content128: /^[\s\S]{1,128}$/,
  content200: /^[\s\S]{1,200}$/, // trim后中间任意字符200个
  content500: /^[\s\S]{1,500}$/, // trim后中间任意字符500个
  val: /(?=^[a-z0-9A-Z]+(\s+[a-z0-9A-Z]+)*$)^[\s\S]{1,30}$/, // 前后不可有空格，中间可以有空格，并且长度在1-30
  // ip: /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*(\/)?$/,
  ip: /^[-a-zA-Z0-9_/.:#]{1,128}$/,
  // ip1: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
  ip1: /^[-a-zA-Z0-9_.]{1,128}$/,
  port: /^\d{1,5}$/,
  companyId: /^[a-zA-Z0-9]{1,30}$/, // 企业工号
  consumption: /^[1-9]\d{0,7}$/,
  twoDecimal: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, // 最多保留两位小数
  postalCode: /^[0-9]\d{5}(?!\d)$/ // 邮政编码
  // name_: /^([\u4e00-\u9fa5]|\w|\s){1,14}$/, // 可以带下划线
  // idCard: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/
}
// 验证函数
// 用法1: rules直接写
// {
//   pattern: this.$utils.reg.content500,
//   validator: this.$utils.validator.common
// }
// 用法2: validator函数中调用，返回新的value
// {
//   required: true,
//   trigger: 'blur',
//   validator: (rule, value, callback) => {
//     let data = this.$utils.validator.common(rule, value, callback)
//   }
// }
const validator = {
  // 去掉首尾空格再正则验证。文本框可以输入空格/换行
  common(rule, value, callback) {
    // console.log(rule, value, callback)
    var newVal = utils.emoji2Str(value) // 手机表情
    var pattern = rule.pattern
    var required = rule.required || false
    var message = rule.message || i18n.t('message.inputRight')
    if (newVal.trim().length > 0 && pattern && !pattern.test(newVal.trim())) {
      // trim后只要有值，验证
      callback(new Error(message))
    } else if (required && newVal.length === 0) {
      // 必填项，但没值，提示请输入。加上为了预防没写pattern
      callback(new Error(i18n.t('message.input')))
    } else if (required && newVal.length > 0 && newVal.trim().length === 0) {
      // 必填输入了值，但全为空，提示正确输入。加上为了预防没写pattern
      callback(new Error(message))
    } else {
      callback()
    }
    return newVal
  }
}

// // 验证输入框&文本域(必填,不能输入表情/只输空格或换行)
// const validateTextArea = (value, callback) => {
//   // console.log('手机', value, '--')
//   var newVal = utils.emoji2Str(value)
//   // if (newVal !== value) {
//   //   return newVal
//   // }
//   if (newVal.trim().length === 0) {
//     callback(new Error(i18n.t('message.inputRight')))
//   } else {
//     callback()
//   }
//   return newVal
// }

export default {
  reg,
  validator
  // validateTextArea
}
