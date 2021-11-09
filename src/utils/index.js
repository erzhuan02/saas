import { Message } from 'element-ui'
import http from '../api'
import i18n from '../lang'
// import Router from '../router'
import validator from './validator'

var chinese = [
  '中国',
  '阿富汗',
  '阿尔巴尼亚',
  '阿尔格拉',
  '安道尔',
  '安哥拉',
  '安圭拉',
  '阿森松岛',
  '安提瓜和巴布达',
  '阿根廷',
  '亚美尼亚',
  '阿鲁巴',
  '澳大利亚',
  '奥地利',
  '阿塞拜疆',
  '巴哈马',
  '巴林',
  '孟加拉国',
  '巴巴多斯',
  '白俄罗斯',
  '比利时',
  '伯利兹',
  '贝宁',
  '百慕大',
  '不丹',
  '玻利维亚',
  '波斯尼亚和黑塞哥维那',
  '博茨瓦纳',
  '巴西',
  '文莱',
  '保加利亚',
  '布基纳法索',
  '布隆迪',
  '柬埔寨',
  '喀麦隆',
  '加拿大',
  '佛得角',
  '开曼群岛',
  '中非共和国',
  '乍得',
  '智利',
  '哥伦比亚',
  '科摩罗',
  '刚果共和国',
  '刚果民主共和国',
  '库克群岛',
  '哥斯达黎加',
  '科特迪沃',
  '克罗地亚',
  '古巴',
  '塞浦路斯',
  '捷克共和国',
  '丹麦',
  '吉布提',
  '多米尼加',
  '多米尼加共和国',
  '厄瓜多尔',
  '埃及',
  '艾萨尔瓦多',
  '爱沙尼亚',
  '埃塞俄比亚',
  '法罗群岛',
  '斐济',
  '芬兰',
  '法国',
  '法属圭亚那',
  '法属波利尼西亚',
  '加蓬',
  '冈比亚',
  '格鲁吉亚',
  '德国',
  '加纳',
  '直布罗陀',
  '希腊',
  '格陵兰',
  '格林纳达',
  '瓜德罗普',
  '关岛',
  '危地马拉',
  '几内亚',
  '根西',
  '几内亚',
  '圭亚那',
  '海地',
  '洪都拉斯',
  '香港',
  '缅甸',
  '匈牙利',
  '冰岛',
  '印度',
  '印度尼西亚',
  '伊朗',
  '伊拉克',
  '爱尔兰',
  '马恩岛',
  '以色列',
  '意大利',
  '牙买加',
  '日本',
  '泽西岛',
  '约旦',
  '哈萨克斯坦',
  '肯尼亚',
  '科索沃',
  '科威特',
  '吉尔吉斯斯坦',
  '老挝',
  '拉脱维亚',
  '黎巴嫩',
  '莱索托',
  '利比里亚',
  '利比亚',
  '列支敦士登',
  '立陶宛',
  '卢森堡',
  '澳门',
  '马其顿',
  '马达加斯加',
  '马拉维',
  '马来西亚',
  '马尔代夫',
  '马里',
  '马耳他',
  '马提尼克',
  '毛里塔尼亚',
  '毛里求斯',
  '马约特',
  '墨西哥',
  '摩尔多瓦',
  '摩纳哥',
  '蒙古',
  '黑山',
  '蒙特塞拉特',
  '摩洛哥',
  '莫桑比克',
  '纳米比亚',
  '尼泊尔',
  '荷兰',
  '荷属安的列斯',
  '新喀里多尼亚',
  '新西兰',
  '尼加拉瓜',
  '尼日尔',
  '尼日利亚',
  '挪威',
  '阿曼',
  '巴基斯坦',
  '巴勒斯坦',
  '巴拿马',
  '巴布亚新几内亚',
  '巴拉圭',
  '秘鲁',
  '菲律宾',
  '波兰',
  '葡萄牙',
  '波多黎各',
  '库塔',
  '留尼汪',
  '罗马尼亚',
  '俄罗斯',
  '卢旺达',
  '萨摩亚东部',
  '萨摩亚西部',
  '圣马力诺',
  '圣多美和普林西比',
  '沙特阿拉伯',
  '塞内加尔',
  '塞尔维亚',
  '塞舌尔',
  '塞拉利昂',
  '新加坡',
  '斯洛伐克',
  '斯洛文尼亚',
  '南非',
  '韩国',
  '西班牙',
  '斯里兰卡',
  '圣基茨和尼维斯',
  '圣卢西亚',
  '圣文森特',
  '苏丹',
  '苏里南',
  '斯威士兰',
  '瑞典',
  '瑞士',
  '叙利亚',
  '台湾',
  '塔吉克斯坦',
  '坦桑尼亚',
  '泰国',
  '东帝汶',
  '多哥',
  '汤加',
  '特立尼达和多巴哥',
  '突尼斯',
  '土耳其',
  '土库曼斯坦',
  '特克斯和凯科斯群岛',
  '乌干达',
  '乌克兰',
  '阿拉伯联合酋长国',
  '英国',
  '美国',
  '乌拉圭',
  '乌兹别克斯坦',
  '瓦努阿图',
  '委内瑞拉',
  '越南',
  '维尔京群岛',
  '也门',
  '赞比亚',
  '津巴布韦'
]
var eng = [
  'China',
  'Afghanistan',
  'Albania',
  'Algera',
  'Andorra',
  'Angola',
  'Anguilla',
  'Ascension',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botwana',
  'Brazill',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Cayman Islands',
  'Central African Republic',
  'Chad',
  'Chile',
  'Colombia',
  'Comoros',
  'Republic of the Congo',
  'Democratic Republic of the Congo',
  'Cook Islands',
  'Costa Rica',
  'Cote divoire',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'EISalvador',
  'Estonia',
  'Ethiopia',
  'Faroe Islands',
  'Fiji',
  'Finland',
  'France',
  'French Guiana',
  'French Polynesia',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Gibraltar',
  'Greece',
  'Greenland',
  'Grenada',
  'Guadeloupe',
  'Guam',
  'Guatemala',
  'Guinea',
  'Guernsey',
  'Guinea',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hong Kong',
  'Myanmar',
  'Hungary',
  'Iceland',
  'Indea',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Isle of Man',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jersey',
  'Jordan',
  'Kazeakhstan',
  'Kenya',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macao',
  'Macedonia',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Martinique',
  'Mauritania',
  'Mauritius',
  'Mayotte',
  'Mexico',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Montserrat',
  'Morocco',
  'Mozambique',
  'Namibia',
  'Nepal',
  'Netherlands',
  'Netherlands Antillse',
  'New Caledonia',
  'NewZealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Norway',
  'Oman',
  'Pakistan',
  'Palestinian',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'PuertoRico',
  'Qotar',
  'Reunion',
  'Romania',
  'Russia',
  'Rwanda',
  'Samoa Eastern',
  'Samoa Western',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'South Africa',
  'Korea',
  'Spain',
  'SriLanka',
  'St Kitts and Nevis',
  'St.Lucia',
  'St.Vincent',
  'Sudan',
  'Suriname',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Turks and Caicos Islands',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'USA',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela',
  'Vietnam',
  'Virgin Islands',
  'Yemen',
  'Zambia',
  'Zimbabwe'
]
var prefix = [
  '86',
  '93',
  '355',
  '213',
  '376',
  '244',
  '1264',
  '247',
  '1268',
  '54',
  '374',
  '297',
  '61',
  '43',
  '994',
  '1242',
  '973',
  '880',
  '1246',
  '375',
  '32',
  '501',
  '229',
  '1441',
  '975',
  '591',
  '387',
  '267',
  '55',
  '673',
  '359',
  '226',
  '257',
  '855',
  '237',
  '1',
  '238',
  '1345',
  '236',
  '235',
  '56',
  '57',
  '269',
  '242',
  '243',
  '682',
  '506',
  '225',
  '385',
  '53',
  '357',
  '420',
  '45',
  '253',
  '1767',
  '1809',
  '593',
  '20',
  '503',
  '372',
  '251',
  '298',
  '679',
  '358',
  '33',
  '594',
  '689',
  '241',
  '220',
  '995',
  '94',
  '233',
  '350',
  '30',
  '299',
  '1473',
  '590',
  '1671',
  '502',
  '240',
  '44',
  '224',
  '592',
  '509',
  '504',
  '852',
  '95',
  '36',
  '354',
  '91',
  '62',
  '98',
  '964',
  '353',
  '44',
  '972',
  '39',
  '1876',
  '81',
  '44',
  '962',
  '7',
  '254',
  '383',
  '965',
  '996',
  '856',
  '371',
  '961',
  '266',
  '231',
  '218',
  '423',
  '370',
  '352',
  '853',
  '389',
  '261',
  '265',
  '60',
  '960',
  '223',
  '356',
  '596',
  '222',
  '230',
  '262',
  '52',
  '373',
  '377',
  '976',
  '382',
  '1664',
  '212',
  '258',
  '264',
  '977',
  '31',
  '599',
  '687',
  '64',
  '505',
  '227',
  '234',
  '47',
  '968',
  '92',
  '970',
  '507',
  '675',
  '595',
  '51',
  '63',
  '48',
  '351',
  '1',
  '974',
  '262',
  '40',
  '7',
  '250',
  '684',
  '685',
  '378',
  '239',
  '966',
  '221',
  '381',
  '248',
  '232',
  '65',
  '421',
  '386',
  '27',
  '82',
  '34',
  '94',
  '1869',
  '1758',
  '1784',
  '249',
  '597',
  '268',
  '46',
  '41',
  '963',
  '886',
  '992',
  '255',
  '66',
  '670',
  '228',
  '676',
  '1868',
  '216',
  '90',
  '993',
  '1649',
  '256',
  '380',
  '971',
  '44',
  '1',
  '598',
  '998',
  '678',
  '58',
  '84',
  '1340',
  '967',
  '260',
  '263'
]

// 增加前缘触发功能
var debounce = (fn, wait = 400, immediate = false) => {
  let timer = ''
  let startTimeStamp = 0
  let context, args
  let run = timerInterval => {
    timer = setTimeout(() => {
      let now = new Date().getTime()
      let interval = now - startTimeStamp
      if (interval < timerInterval) {
        // the timer start time has been reset，so the interval is less than timerInterval
        // console.log('debounce reset', timerInterval - interval)
        startTimeStamp = now
        run(timerInterval - interval) // reset timer for left time
      } else {
        if (!immediate) {
          fn.apply(context, args)
        }
        clearTimeout(timer)
        timer = null
      }
    }, timerInterval)
  }

  return function () {
    context = this
    args = arguments
    let now = new Date().getTime()
    startTimeStamp = now // set timer start time

    if (!timer) {
      // console.log('debounce set', wait)
      if (immediate) {
        fn.apply(context, args)
      }
      run(wait) // last timer alreay executed, set a new timer
    }
  }
}

// 节流增加前缘
var throttling = (fn, wait = 350, immediate = true) => {
  let timer = ''
  let timeStamp = 0
  let context, args

  let run = () => {
    timer = setTimeout(() => {
      if (!immediate) {
        fn.apply(context, args)
      }
      clearTimeout(timer)
      timer = null
    }, wait)
  }

  return function () {
    context = this
    args = arguments
    if (!timer) {
      // console.log('throttle, set')
      if (immediate) {
        fn.apply(context, args)
      }
      run()
    } else {
      // console.log('throttle, ignore')
    }
  }
}

// 有相同的提示框
const $message = obj => {
  var messageNode = document.querySelectorAll('.el-message .el-message__content')
  if (messageNode && messageNode.length) {
    for (var i = 0; i < messageNode.length; i++) {
      var messageText = messageNode[i].innerText
      if (messageText === obj.message.toString()) {
        return
      }
    }
  }
  Message({
    type: obj.type || 'info',
    message: obj.message,
    duration: obj.duration || 1500,
    customClass: obj.customClass || ''
  })
}

/**
 * recurseJson递归遍历树节点,只获取最末级的数据的id
 * @jsonObj 传入数据源json数组
 * @arr 传入空 得到已勾选的最末级的id
 * @checked 传true,要checked为true才可以，false的话不用checked属性
 */
const recurseJson = (tree = [], checked = false, arr = []) => {
  // console.log('recurseJson', tree)
  tree.forEach((item, index) => {
    var children = item.children
    if (children.length === 0) {
      if (checked) {
        if (item.checked) {
          arr.push(item.id)
        }
      } else {
        arr.push(item.id)
      }
    } else if (children.length > 0) {
      recurseJson(children, checked, arr)
    }
  })
  // for (var key in tree) {
  //   // var item = jsonObj[key]
  //   //   var element = jsonObj[key].children
  //   //   for (var i in element) {
  //   //     if (element[i].checked) {
  //   //       arr.push(element[i].id)
  //   //     }
  //   //   }
  //   //   if (element.length > 0) {
  //   //     recurseJson(element, arr)
  //   //   } else {
  //   //     if (item.checked) {
  //   //       arr.push(element[i].id)
  //   //     }
  //   //   }
  // }
  return arr
}

/**
 * @getLastlevel 递归遍历树节点,只获取最末级的数据
 * @jsonObj 传入数据源json数组
 * @arr 传入空 得到已勾选的最末级的id
 * @checked 传true,要checked为true才可以，false的话不用checked属性
 */
const getLastlevel = (tree = [], checked = false, arr = []) => {
  tree.forEach((item, index) => {
    var children = item.children
    if (Object.prototype.toString.call(children) === '[object Array]') {
      if (children.length === 0) {
        if (checked) {
          if (item.checked) {
            arr.push(item)
          }
        } else {
          arr.push(item)
        }
      } else if (children.length > 0) {
        getLastlevel(children, checked, arr)
      }
    }
  })
  return arr
}

/**
 * @isArray 是否是数组
 * @array 传入参数 数组
 */
const isArray = array => {
  return Object.prototype.toString.call(array) === '[object Array]'
}

/**
 * 递归遍历树节点获取父id
 * @json tree data
 * @dragId dragId
 * @fatherId 父id 传入[]
 */
const getFatherId = (json, dragId, fatherId) => {
  for (var i = 0; i < json.length; i++) {
    var element = json[i].children
    for (var j = 0; j < element.length; j++) {
      if (dragId === element[j].id) {
        fatherId.push(json[i].id)
      }
    }
    if (element.length >= 0) {
      getFatherId(element, dragId, fatherId)
    }
  }
  return fatherId
}

/**
 * 递归遍历json获取该节点所有上级id
 * 返回以逗号分割的字符串
 * @json node json data
 * @allFatherId 父id 传入Array
 */
const getAllFatherId = (json, allFatherId) => {
  var ele = json.parent
  if (ele.parent !== null) {
    allFatherId.push({
      orgId: ele.data.id,
      isShop: ele.data.isShop
    })
    getAllFatherId(ele, allFatherId)
  }
  return allFatherId
}

// 格式化国家前缀需要的json格式-中文
const formatPrefixCN = () => {
  var arr = []
  chinese.forEach((ch, i) => {
    arr.push({
      label: ch,
      value: ''
    })
  })
  prefix.forEach((pre, i) => {
    arr[i] = {
      label: '(+' + pre + ')' + arr[i].label,
      value: pre
    }
  })
  return arr
}

// 格式化国家前缀需要的json格式-英文
const formatPrefixEN = () => {
  var arr = []
  eng.forEach((en, i) => {
    arr.push({
      label: en,
      value: ''
    })
  })
  prefix.forEach((pre, i) => {
    arr[i] = {
      label: '(+' + pre + ')' + arr[i].label,
      value: pre
    }
  })
  return arr
}

// 按钮or菜单权限
const getButton = (router, type, menuAuth = false, menuType = 'basicLeftTree') => {
  let id = -1 // 获取本页面的menuId
  let data = JSON.parse(sessionStorage.getItem(menuType)) || []
  // if (data.length === 0) {
  //   Router.push('/')
  // }
  data.forEach((ele, idx) => {
    if (router === ele.menuUrl) {
      id = ele.id
    } else {
      ele.children.forEach(e => {
        if (router === e.menuUrl) {
          id = e.id
        }
      })
    }
  })
  if (menuAuth) {
    return id
  } else {
    let button = buttonPower(id, type)
    return button
  }
  // if (id) {
  //   let button = buttonPower(id, type)
  //   return button
  // } else {
  //   $message({
  //     message: i18n.t('message.noModuleAuth'),
  //     type: 'error'
  //   })
  //   return false
  // }
}

// 根据menuId发起请求获取页面按钮权限
const buttonPower = (menuId, type) => {
  // 暂时添加console排查错误
  // console.log('menuId:' + menuId)
  // type： 1企业用户 2业务用户
  return new Promise((resolve, reject) => {
    if (menuId) {
      http
        .posts('getUserMenuButton', '', { menuId, type })
        .then(res => {
          let button = {}
          var data = res.data
          // var buttonArr = getLastlevel(data)
          data.forEach(item => {
            var prop = item.menuNameEn.replace('button.', '')
            button[prop] = true
          })
          resolve(button)
        })
        .catch(er => {
          reject(er)
        })
    }
  })
}

// +分割手机号码，86+变+86
const exchangePrefix = str => {
  if (typeof str !== 'string') {
    return str
  }
  let n = str.split('+')
  str = '+' + n[0] + (n[1] || '')
  return str
}

// 86+手机号码，处理成对象
const splitPhone = (str = '') => {
  str = str || ''
  if (typeof str !== 'string') {
    return str
  }
  if (!str.includes('+')) {
    return {
      phonePrefix: '',
      phoneNumb: str
    }
  }
  let n = str.split('+')
  return {
    phonePrefix: n[0],
    phoneNumb: n[1]
  }
}

// 判断时间是否过期 yy-mm-dd hh-mm-ss
const dateIsExpired = date => {
  let flag = true
  let now = new Date()
  let day = new Date(date.replace(/-/g, '/'))
  if (day > now) {
    flag = false
  }
  return flag
}

const obj2qs = function obj2qs(obj) {
  if (!obj && !Object.keys(obj).length) {
    return ''
  } else {
    var arr = []
    for (var key in obj) {
      arr.push(key + '=' + obj[key])
    }
    return arr.join('&')
  }
}
// 去除掉组织架构中children为空的属性
const delateChildren = arr => {
  if (arr.length) {
    for (let i in arr) {
      if (arr[i].children.length) {
        delateChildren(arr[i].children)
      } else {
        delete arr[i].children
      }
    }
  }
  return arr
}
/**
 * 树节点对象数组扁平化
 * @arr 传入数据源树的数组数据
 * @checked 传true,要checked为true才可以，false的话不用checked属性
 * @newArr 传入空 新的数组
 * @prop 是哪个属性，一般是children
 */
// arr 传入数组, newArr 一般写[], prop 属性
const flatObjArr = (arr, checked = false, newArr = [], prop = 'children') => {
  arr.forEach((item, index) => {
    if (checked) {
      if (item.checked) {
        newArr.push(item)
      } else {
        // arr.splice(index, 1)
      }
    } else {
      newArr.push(item)
    }
    if (item[prop] && item[prop].length) {
      flatObjArr(item[prop], checked, newArr, prop)
    } else {
    }
  })
  return newArr
}
// 将选中的权限列表，分成两级
const rightsLevel = (arr, checked = false, newArr = [], prop = 'children') => {
  var arrCopy = JSON.parse(JSON.stringify(arr))
  arrCopy.forEach((item, index) => {
    if (checked) {
      if (item.checked) {
        item[prop] = flatObjArr(item[prop], checked, [], prop)
        newArr.push(item)
      } else {
      }
    } else {
      newArr.push(item)
      item[prop] = flatObjArr(item[prop], checked, [], prop)
    }
    // item[prop] = flatObjArr(item[prop], [], prop)
  })
  return newArr
}

// 传入的参数变成首字母大写
const firstUpper = string => {
  if (!string) {
    return ''
  }
  string = String(string)
  var newString =
    string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase()
  return newString
}

// 遍历对象数组，返回满足条件的一项
const needItem = (arr, idVal, name = 'id') => {
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    var item = arr.find(function (item, index, array) {
      return item[name] === idVal
    })
    return {
      ...item
    }
  }
}

// 比较两个时间大小，至少传一个参数，另一个默认当前时间
// 返回值1 第一个参数大 2第二个参数大 0一样大
const contrastTime = (date1, date2) => {
  if (!(date1 || date2)) {
    console.error('Function contrastTime,please send at least one parameter')
    return
  }
  // ie不支持用-连接的时间格式
  var time1 = date1 ? new Date(date1.replace(/-/g, '/')) : new Date() // 时间1
  var time2 = date2 ? new Date(date2) : new Date() // 时间2
  // console.log(new Date(date1.replace(/-/g, '/')), time2.valueOf())
  if (time1.valueOf() > time2.valueOf()) {
    // console.log(1)
    return 1
  } else if (time1.valueOf() === time2.valueOf()) {
    // console.log(0)
    return 0
  } else {
    // console.log(2)
    return 2
  }
}

/**
 * 以时间戳转化成格式化日期，默认：YYYY-MM-DD HH:mm:ss
 * 默认格式如下：（如有更多，再新增）
 * '1': 'YYYY',
 * '2': 'YYYY-MM',
 * '3': 'YYYY-MM-DD',
 * '4': 'MM-DD',
 * '5': 'YYYY-MM-DD HH:mm',
 * '6': 'YYYY-MM-DD HH:mm:ss',
 * '7': 'MM-DD HH:mm',
 * '8': 'MM-DD HH:mm:ss',
 * '9': 'YYYYMMDD'
 * '10': 'YYYYMMDDHHmmss'
 * @param {number | string | Date} timeData 必须的
 * @param {string} dateFormat
 * @return {string}
 */
const formatDate = (timeData, dateFormat = 'YYYY-MM-DD HH:mm:ss') => {
  if (!timeData) {
    console.error('Function formatDate,please send parameter')
    return
  } else if (String(new Date(timeData)) === 'Invalid Date') {
    console.error('Function formatDate,please send right formate parameter')
    return
  }
  let now = new Date(timeData)
  // console.log('timeData:', timeData, 'dateFormat:' + dateFormat, 'nowDate:', now);
  let year = now.getFullYear()
  let month = now.getMonth() + 1
  let date = now.getDate()
  let hour = now.getHours()
  let minute = now.getMinutes()
  let second = now.getSeconds()
  switch (dateFormat) {
    case 'YYYY': {
      return year.toString()
    }
    case 'YYYY-MM': {
      return year + '-' + (month < 10 ? '0' + month : month)
    }
    case 'YYYY-MM-DD': {
      return (
        year +
        '-' +
        (month < 10 ? '0' + month : month) +
        '-' +
        (date < 10 ? '0' + date : date)
      )
    }
    case 'MM-DD': {
      return (
        (month < 10 ? '0' + month : month) +
        '-' +
        (date < 10 ? '0' + date : date)
      )
    }
    case 'YYYY-MM-DD HH:mm': {
      return (
        year +
        '-' +
        (month < 10 ? '0' + month : month) +
        '-' +
        (date < 10 ? '0' + date : date) +
        ' ' +
        (hour < 10 ? '0' + hour : hour) +
        ':' +
        (minute < 10 ? '0' + minute : minute)
      )
    }
    case 'YYYY-MM-DD HH:mm:ss': {
      return (
        year +
        '-' +
        (month < 10 ? '0' + month : month) +
        '-' +
        (date < 10 ? '0' + date : date) +
        ' ' +
        (hour < 10 ? '0' + hour : hour) +
        ':' +
        (minute < 10 ? '0' + minute : minute) +
        ':' +
        (second < 10 ? '0' + second : second)
      )
    }
    case 'MM-DD HH:mm': {
      return (
        (date < 10 ? '0' + date : date) +
        ' ' +
        (hour < 10 ? '0' + hour : hour) +
        ':' +
        (minute < 10 ? '0' + minute : minute)
      )
    }
    case 'MM-DD HH:mm:ss': {
      return (
        (date < 10 ? '0' + date : date) +
        ' ' +
        (hour < 10 ? '0' + hour : hour) +
        ':' +
        (minute < 10 ? '0' + minute : minute) +
        ':' +
        (second < 10 ? '0' + second : second)
      )
    }
    case 'YYYYMMDD': {
      return (
        year +
        '' +
        (month < 10 ? '0' + month : month) +
        '' +
        (date < 10 ? '0' + date : date)
      )
    }
    case 'YYYYMMDDHHmmss': {
      return (
        year +
        '' +
        (month < 10 ? '0' + month : month) +
        '' +
        (date < 10 ? '0' + date : date) +
        '' +
        (hour < 10 ? '0' + hour : hour) +
        '' +
        (minute < 10 ? '0' + minute : minute) +
        '' +
        (second < 10 ? '0' + second : second)
      )
    }
  }
  return (
    year +
    '-' +
    (month < 10 ? '0' + month : month) +
    '-' +
    (date < 10 ? '0' + date : date) +
    ' ' +
    (hour < 10 ? '0' + hour : hour) +
    ':' +
    (minute < 10 ? '0' + minute : minute) +
    ':' +
    (second < 10 ? '0' + second : second)
  )
}

// 保留两位小数
const decimal2 = x => {
  var val = Number(x)
  if (!isNaN(parseFloat(val))) {
    val = val.toFixed(2)
    return val
  }
}

// 获取src的端口号
const getUrlPort = url => {
  let head = url.startsWith('http://') || url.startsWith('https://')
  let urlAnay = url.split(':')
  if (head && urlAnay.length === 3) {
    // 有端口号
    return url.split(':')[2].split('/')[0]
  }
  return 0
}

// excel导出
const excelExport = (url, data, params, fileName) => {
  return new Promise((resolve, reject) => {
    http
      .post(url, data, params, 'blob')
      .then(res => {
        const content = res.data // 文件流 content-type:application/octet-stream
        const blob = new Blob([content])
        if (!myBrowserIsIE()) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob) // 创建一个参数中给出的对象的URL
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL对象
          document.body.removeChild(elink)
        } else {
          // IE10+及Edge下载
          navigator.msSaveBlob(blob, fileName)
        }
        resolve(res)
      })
      .catch(er => {
        // $message({
        //   message: i18n.t('message.submitError'),
        //   type: 'error'
        // })
        reject(er)
      })
  })
}

// 判断是否IE浏览器
const myBrowserIsIE = () => {
  let isIE = false
  if (
    navigator.userAgent.indexOf('Trident') > -1 ||
    navigator.userAgent.indexOf('MSIE') > -1
  ) {
    // ie10+浏览器
    isIE = true
  }
  if (navigator.userAgent.indexOf('Edge') > -1) {
    // edge 浏览器
    isIE = true
  }
  return isIE
}

// 压缩图片
const compress = (fileObj, callback) => {
  try {
    const image = new Image()
    image.src = URL.createObjectURL(fileObj)
    image.onload = function () {
      const that = this
      // 默认按比例压缩
      let w = that.width
      let h = that.height
      const scale = w / h
      w = fileObj.width || w
      h = fileObj.height || w / scale
      let quality = 0.7 // 默认图片质量为0.7
      // 生成canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      // 创建属性节点
      const anw = document.createAttribute('width')
      anw.nodeValue = w
      const anh = document.createAttribute('height')
      anh.nodeValue = h
      canvas.setAttributeNode(anw)
      canvas.setAttributeNode(anh)
      ctx.drawImage(that, 0, 0, w, h)
      // 图像质量
      if (fileObj.quality && fileObj.quality <= 1 && fileObj.quality > 0) {
        quality = fileObj.quality
      }
      // quality值越小，所绘制出的图像越模糊
      const data = canvas.toDataURL('image/jpeg', quality)
      // 压缩完成执行回调
      const newFile = convertBase64UrlToBlob(data)
      callback(newFile)
    }
  } catch (e) {
    console.log('压缩失败!')
  }
}

const convertBase64UrlToBlob = urlData => {
  const bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte
  // 处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  return new Blob([ab], { type: 'image/png' })
}

// 过滤表情
const emoji2Str = str => {
  return unescape(escape(str).replace(/\%uD.{3}/g, ''))
}

// 去除首尾空格
const trim = str => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}
// 连续点击按钮，1秒后解禁
const disabledButton = (vue, key = 'buttonDisabled', timeout = 1000) => {
  vue[key] = true
  setTimeout(() => {
    vue[key] = false
  }, timeout)
}

// 获取url参数,传入参数的key返回value
// 参数中有?需传istrue为true
const getQueryValue = (queryName, istrue) => {
  var query = decodeURI(window.location.href.substring(1))
  var vars = query.split('?')[1]
  var varList = query.split('?')[2]
  var params = vars.split('&')
  for (var i = 0; i < params.length; i++) {
    var pair = params[i].split('=')
    if (istrue) {
      if (pair[0] === queryName) {
        return pair[1] + '?' + varList
      }
    } else {
      if (pair[0] === queryName) {
        return pair[1]
      }
    }
  }
  return null
}

// 转义特殊字符
const escapeHtml = str => {
  str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return str
}

// 对象根据key排序
const objKeySort = arys => {
  var newkey = Object.keys(arys).sort()
  var newObj = {}
  for (var i = 0; i < newkey.length; i++) {
    newObj[newkey[i]] = arys[newkey[i]]
  }
  return newObj
}

// 重写sessionStorage 解决ie10存储失败
const setSession = (name, value) => {
  if (window.opener && Object.getOwnPropertyNames(window.opener).length > 0) {
    window.opener.sessionStorage.setItem(name, value)
  } else {
    sessionStorage.setItem(name, value)
  }
}

const getSession = (name, value) => {
  if (window.opener && Object.getOwnPropertyNames(window.opener).length > 0) {
    return window.opener.sessionStorage.getItem(name)
  } else {
    return sessionStorage.getItem(name)
  }
}

const setCookie = (key, value, days = 7) => {
  var exdate = new Date()
  exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * days) // 保存的天数
  document.cookie = key + '=' + value + ';expires=' + exdate.toGMTString()
}

const getCookie = key => {
  let cookie = document.cookie.split(';') || []
  let value = ''
  if (cookie.length > 0) {
    cookie.forEach(item => {
      item = item.replace(/(^\s*)|(\s*$)/g, '') // 删除空格
      var active = item.split('=')
      if (active[0] == key) {
        value = active[1]
      }
    })
    return value
  }
}

const clearCookie = key => { setCookie(key, '', -1) }

const clearAllCookie = () => {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (var i = keys.length; i--;) { document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() }
  }
}
// 打开新窗口跳转路径
const openWindow = (path) => {
  // 不能用window.open 因为新开的页面session存储有问题 原因未知
  // window.open(path, '_blank')
  const elink = document.createElement('a')
  elink.style.display = 'none'
  elink.target = '_blank'
  elink.href = path
  document.body.appendChild(elink)
  elink.click()
  URL.revokeObjectURL(elink.href) // 释放URL对象
  document.body.removeChild(elink)
}

export default {
  ...validator,
  debounce,
  throttling,
  $message,
  recurseJson,
  getLastlevel,
  isArray,
  getFatherId,
  getAllFatherId,
  formatPrefixCN,
  formatPrefixEN,
  getButton,
  buttonPower,
  exchangePrefix,
  splitPhone,
  dateIsExpired,
  obj2qs,
  delateChildren,
  flatObjArr,
  rightsLevel,
  firstUpper,
  needItem,
  // busiGetOrgTree,
  contrastTime,
  formatDate,
  decimal2,
  getUrlPort,
  excelExport,
  myBrowserIsIE,
  compress,
  convertBase64UrlToBlob,
  emoji2Str,
  trim,
  disabledButton,
  getQueryValue,
  escapeHtml,
  objKeySort,
  setSession,
  getSession,
  setCookie,
  getCookie,
  clearCookie,
  clearAllCookie,
  openWindow
}
