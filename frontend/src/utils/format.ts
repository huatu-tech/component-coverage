// 示例方法，没有实际意义
export function trim(str: string) {
  return str.trim();
}


/**
 * des:        日期操作
 * @proStr:    格式化参数
 * @return:    Date
 * e.g.         proDate(date, '{%y+1}-{%M+2}-{%d+1}-{%H+1}-{%m+1}-{%s+1}') //年月日时分秒全部加1
 */
export function proDate(dateObj, proStr = '{%y}-{%M}-{%d}-{%H}-{%m}-{%s}') {
  let dealWith = function(str, date) {
      let t = str.substr(0, 1)
      let num = 0
      if (str.indexOf('+') > -1) {
          num = str.substr(str.indexOf('+'))
      } else if (str.indexOf('-') > -1) {
          num = str.substr(str.indexOf('-'))
      }
      switch (t) {
          case 'y':
              date.setFullYear(date.getFullYear() + Number(num))
              break
          case 'M':
              date.setMonth(date.getMonth() + Number(num))
              break
          case 'd':
              date.setDate(date.getDate() + Number(num))
              break
          case 'H':
              date.setHours(date.getHours() + Number(num))
              break
          case 'm':
              date.setMinutes(date.getMinutes() + Number(num))
              break
          case 's':
              date.setSeconds(date.getSeconds() + Number(num))
              break
      }
      return date
  }

  let arr = []
  let date
  arr = proStr.split('{%')
  for (let i = 1; i < arr.length; i++) {
      arr[i] = arr[i].replace('}-', '')
      arr[i] = arr[i].replace('}', '')
      date = dealWith(arr[i], dateObj)
  }
  return date
}

export function formatDate(date:Date, fmt:string) {
    if (typeof date === 'string') {
      return date;
    }
  
    if (!fmt) fmt = "yyyy-MM-dd hh:mm:ss";
  
    if (!date || date === null) return null;
    let o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
  }
