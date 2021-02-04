/**
 *  合并对象，相同的键名，后面的会覆盖前面的
 *  @param target: 初始化对象
 *  @param source：合并源对象
 */
export function objectMergeHandle (target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  for (const property in source) {
    if (source.hasOwnProperty(property)) {
      const sourceProperty = source[property]
      if (typeof sourceProperty === 'object') {
        target[property] = objectMergeHandle(target[property], sourceProperty)
        continue
      }
      target[property] = sourceProperty
    }
  }
  return target
}

/**
 * 防止抖动或重复触发事件
 * @param func：目标函数
 * @param wait：间隔时间
 * @param immediate：是否立即执行
 */
export function debounceHandle (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

// 获取时间戳
export function getTimeStamp (time) {
  if (time) {
    const newTime = ('' + time).replace(/-/g, '/')
    return ((new Date(newTime)).valueOf() / 1000).toFixed(0)
  } else {
    return ((new Date()).valueOf() / 1000).toFixed(0)
  }
}

// 转化时间戳
export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  return format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return [ '一', '二', '三', '四', '五', '六', '日' ][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
}

// 导出文件
export function exportFile (url) {
  const elink = document.createElement('a')
  elink.style.display = 'none'
  elink.href = url
  elink.target = '_blank'
  document.body.appendChild(elink)
  elink.click()
  document.body.removeChild(elink)
}

// 清除空数组
export function cleanArray (actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

// 生成链接后面的字符串
export function param (json) {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key])
  })).join('&')
}

// 获取时间范围
export function getDefaultDate (dateType) {
  let start, end
  switch (dateType) {
    case 'nowToday':
      end = new Date(new Date().toDateString())
      start = new Date()
      start.setTime(end.getTime())
      break
    case 'threeDays':
      end = new Date(new Date().toDateString())
      start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 2)
      break
    case 'week':
      end = new Date(new Date().toDateString())
      start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 6)
      break
    case 'twoWeeks':
      end = new Date(new Date().toDateString())
      start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 13)
      break
    case 'month':
      end = new Date(new Date().toDateString())
      start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
      break
    case 'along':
      end = new Date(new Date().toDateString())
      start = new Date(new Date('2019/01/01 00:00:00').toDateString())
      break
    default:
      break
  }

  return {
    start: parseTime(start, '{y}-{m}-{d}'),
    end: parseTime(end, '{y}-{m}-{d}')
  }
}

/**
 * 格式化时间
 * @param {string} timestamp
 * @param {string} fmt 默认:`yyyy-MM-dd hh:mm:ss`
 * @returns {string} 格式化的时间
 */
export function dateFormat (timestamp, fmt = 'yyyy-MM-dd hh:mm:ss') {
  timestamp = parseInt(timestamp)

  if (!timestamp || typeof (timestamp) !== 'number') {
    console.warn('时间戳类型错误')
    return timestamp
  }

  const millisecs = timestamp.toString().length === 10 ? (timestamp * 1000) : timestamp
  const timeObj = new Date(millisecs) // 参数是 时间戳转换的毫秒
  const o = {
    'M+': timeObj.getMonth() + 1, // 月份
    'd+': timeObj.getDate(), // 日
    'h+': timeObj.getHours(), // 小时
    'm+': timeObj.getMinutes(), // 分
    's+': timeObj.getSeconds(), // 秒
    'q+': Math.floor((timeObj.getMonth() + 3) / 3), // 季度
    'S': timeObj.getMilliseconds() // 毫秒
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (timeObj.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

// 阿拉伯数字转换为中文数字
export function indexTransUpdate (index) {
  const Utils = {
    // 单位
    units: '个十百千万@#%亿^&~',
    // 字符
    chars: '零一二三四五六七八九',
    /*
        数字转中文
        @number {Integer} 形如123的数字
        @return {String} 返回转换成的形如 一百二十三 的字符串
    */
    numberToChinese (number) {
      const a = (`${number}`).split('')
      const s = []
      const t = this
      if (a.length > 12) {
        throw new Error('too big')
      } else {
        // eslint-disable-next-line
        for (var i = 0, j = a.length - 1; i <= j; i++) {
          if (j === 1 || j === 5 || j === 9) { // 两位数 处理特殊的 1*
            if (i === 0) {
              if (a[i] !== '1') s.push(t.chars.charAt(a[i]))
            } else {
              s.push(t.chars.charAt(a[i]))
            }
          } else {
            s.push(t.chars.charAt(a[i]))
          }
          if (i !== j) {
            s.push(t.units.charAt(j - i))
          }
        }
      }
      return s.join('').replace(
        /零([十百千万亿@#%^&~])/g,
        (m, d, b) => {
          // 优先处理 零百 零千 等
          b = t.units.indexOf(d)
          if (b !== -1) {
            if (d === '亿') return d
            if (d === '万') return d
            if (a[j - b] == '0') return '零' // eslint-disable-line
          }
          return ''
        }
      ).replace(
        /零+/g, '零'
      ).replace(
        /零([万亿])/g,
        (m, b) => b // 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
      )
        .replace(
          /亿[万千百]/g,
          '亿'
        )
        .replace(
          /[零]$/,
          ''
        )
        .replace(
          /[@#%^&~]/g,
          m => ({
            '@': '十', '#': '百', '%': '千', '^': '十', '&': '百', '~': '千'
          }[m])
        )
        .replace(
          /([亿万])([一-九])/g,
          (m, d, b, c) => {
            c = t.units.indexOf(d)
            if (c !== -1) {
              if (a[j - c] === '0') return `${d}零${b}` // eslint-disable-line
            }
            return m
          }
        )
    }
  }
  return Utils.numberToChinese(index)
}

/**
 * 判断是否是大于等于0的小数，保留2位小数
 * @param {any} value
 */
export function isFloat (value) {
  const reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/
  return reg.test(value)
}

export function deepClone (val) {
  try {
    return JSON.parse(JSON.stringify(val))
  } catch (e) {
    return {}
  }
}

export function queryFieldByKnown (goalList = [], knownKey, knownValue, queryFieldName) {
  const resultIndex = goalList.findIndex(item => item[knownKey] === knownValue)
  if (resultIndex > -1) {
    return goalList[resultIndex][queryFieldName]
  } else {
    return ''
  }
}

// 固定长度，位数不够不够就在前面补0
export function prefixInteger (num, length) {
  return (Array(length).join('0') + num).slice(-length)
}

// 判断跳转链接路由
export function configHref (router) {
  location.href = '#/' + router
}

export function get2decimals (initNumber) {
  var result = (Math.round(initNumber * 100) / 100).toFixed(2)
  result = result.replace('.00', '')
  return result
}

// echarts Y轴数据格式化
export function echartsAxisLabelFormatter (value) {
  if (value >= 1000 && value < 1000000) {
    value = get2decimals(value) / 1000 + 'K'
  } else if (value >= 1000000 && value < 1000000000) {
    value = get2decimals(value) / 1000000 + 'M'
  } else if (value >= 1000000000) {
    value = get2decimals(value) / 1000000000 + 'B'
  } else {
    value = get2decimals(value)
  }
  return value
}

export function flatten (arr) {
  return arr.reduce(function (prev, next) {
    return prev.concat(Array.isArray(next) ? flatten(next) : next)
  }, [])
}

export function filterXss (strValue) {
  if (typeof strValue !== 'string') {
    return strValue
  }
  return strValue.replace(/<script>/g, '')
    .replace(/<\/script>/g, '')
    .replace(/alert\(/g, '')
    .replace(/<img/g, '')
}

export function getFourSelectDay (dateType) {
  let start, end
  const today = new Date().toDateString()
  switch (dateType) {
    case 'today':
      start = +getTimeStamp(today)
      end = +getTimeStamp(today) + 3600 * 24 - 1
      break
    case 'yesterday':
      start = +getTimeStamp(today) - 3600 * 24
      end = +getTimeStamp(today) - 1
      break
    case 'week':
      let weekDay = new Date().getDay()
      if (weekDay === 0) {
        weekDay = 7
      }
      start = +getTimeStamp(today) - 3600 * 24 * (weekDay - 1)
      end = +getTimeStamp(today)
      break
    case 'month':
      const monthDay = new Date().getDate()
      start = +getTimeStamp(today) - 3600 * 24 * (monthDay - 1)
      end = +getTimeStamp(today)
      break
    default:
      break
  }

  return {
    start: parseTime(start, '{y}-{m}-{d}'),
    end: parseTime(end, '{y}-{m}-{d}')
  }
}

// 转化货币
export function moneyFilter (num) {
  var moneyNum = +num
  if (!num) {
    moneyNum = 0
    return moneyNum.toFixed(2)
  } else if (isNaN(moneyNum)) {
    return '-'
  } else {
    return moneyNum.toFixed(2)
  }
}

// 金钱格式化（三位分割, ）
export function priceFormat (price) {
  if (!price) {
    return 0
  }
  return Number(price).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
