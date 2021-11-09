import i18n from '../lang'
const filters = {
  toRung(value, type) {
    // console.log('toRung', value)
    if (!value) {
      return '-'
    } else {
      // type 1为X个 2为X位
      if (type === 1) {
        return value + i18n.t('unit.one')
      } else if (type === 2) {
        return value + i18n.t('unit.digit')
      } else {
        return value
      }
    }
  },
  spec(productType, pointNumb, userNumb) {
    if (productType === 1) {
      if (pointNumb == null || pointNumb == 0) {
        return '-'
      } else {
        return pointNumb + i18n.t('unit.one')
      }
    } else {
      return userNumb + i18n.t('unit.digit')
    }
  },
  // 保留两位小数(解决js中小数相加损失精度的问题)
  decimal2(x) {
    var val = Number(x)
    if (!isNaN(parseFloat(val))) {
      val = val.toFixed(2)
      return val
    }
  }
}
export default filters
