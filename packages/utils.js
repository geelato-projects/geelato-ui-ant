// import CryptoJS from 'crypto-js'

let utils = {}
/**
 * param({k1: {k2: {k3: 'value'}}}), output: k1.k2.k3=value
 * param({k1: 'value'}, 'p')), output:p.k1=value
 * param({k1: [{kk1: 'vv1'}, {kk2: 'vv2'}]}, 'p')), output:p.k1[0].kk1=vv1&p.k1[1].kk2=vv2
 * @param param
 * @param prefix
 * @returns {string}
 */
utils.param = function (param, prefix) {
  let str = ''
  if (param instanceof Array || param instanceof Object) {
    for (let k in param) {
      let subPrefix = prefix ? (prefix + (param instanceof Array ? '[' + k + ']' : '.' + k)) : k
      str += '&' + utils.param(param[k], subPrefix)
    }
  } else {
    if ('string|number|boolean'.indexOf(typeof param) !== -1) {
      str += '&' + prefix + '=' + encodeURIComponent(param)
    } else {
      // undefined  RegExp func
    }
  }
  return str.substr(1)
}

/**
 * 为path增加参数，存已存在同名的参数则覆盖
 * @param path
 * @param param {key:value,key2,value2}
 */
utils.addParamToPath = function (url, params) {
  if (!params || typeof params !== 'object' || Array.isArray(params)) {
    return url
  }
  let route = utils.parseUrl(url)
  for (let key in params) {
    route.query[key] = params[key]
  }
  return route.path + '?' + utils.param(route.query)
}

/**
 * 解析url，提取path及query
 * @param url
 * @returns {{path: string, query}}
 */
utils.parseUrl = function (url) {
  let qIndex = url.indexOf('\\?')
  let path = qIndex !== -1 ? url.substring(0, qIndex) : url
  let mixQuery = {}
  if (qIndex > 0) {
    let paramAry = url.substring(qIndex + 1).split("\\&")
    for (let index in paramAry) {
      let param = paramAry[index]
      let segment = utils.trim(param)
      if (segment.length > 0) {
        let keyValues = segment.split('=')
        if (keyValues.length === 2) {
          mixQuery[keyValues[0]] = keyValues[1]
        }
      }
    }
  }
  return {
    path: path,
    query: mixQuery
  }
}
utils.trim = function (str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

utils.toBoolean = function (v) {
  if (typeof v === 'string' && 'false|0'.indexOf(utils.trim(v.toLowerCase())) !== -1) {
    return false
  } else {
    return !!v
  }
}

/**
 *
 * @param obj {id:1,name:'z3',description:''}
 * @param separator ','
 * @returns {string} e.g. id,name,description
 */
utils.joinProperties = function (obj, separator = ',') {
  let ary = []
  for (let key in obj) {
    ary.push(key)
  }
  return ary.join(separator)
}

utils.join = function (objectAry, propertyName, separator) {
  let stringAry = new Array(objectAry.length)
  for (let i in objectAry) {
    stringAry[i] = objectAry[i][propertyName]
  }
  return stringAry.join(separator)
}
/**
 * 'false' -> false ,'0' -> false
 * @param v
 * @returns {boolean}
 */
utils.toBoolean = function (v) {
  if (typeof v === 'string' && 'false|0'.indexOf(utils.trim(v.toLowerCase())) !== -1) {
    return false
  } else {
    return !!v
  }
}

utils.uuid = function (len, radix) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = []
  let i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

/**
 * 替换对象中的变量，若字符串以“js:”开头，则还需执行(eval)
 * @param obj e.g. js:@.id > 0，变量标识：“@.”
 * @param keyValues 基本数据类型键值对
 * @returns {*} 如上示例，当id=1jf ,结果为执行1>0即true
 */
utils.invoke = function (obj, keyValues) {
  let keyword = '@.'
  let jsFlag = 'js:'
  // let objCopy
  if (typeof obj === 'string') {
    let expression = obj
    if (expression.startsWith(jsFlag)) {
      return utils.eval(expression.replace(jsFlag, '').replace(/@\./g, '$ctx.'), keyValues)
    } else {
      if (expression.indexOf(keyword) !== -1) {
        return utils.eval(expression.replace(/@\./g, '$ctx.'), keyValues)
        // return utils.compileString(expression, keyValues)
      } else {
        return expression
      }
    }
  } else if (Array.isArray(obj)) {
    let arrayCopy = []
    for (let index in obj) {
      arrayCopy[index] = utils.invoke(obj[index], keyValues)
    }
    return arrayCopy
  } else if (typeof obj === 'object') {
    let objCopy = {}
    Object.assign(objCopy, obj)
    for (let i in objCopy) {
      // console.log('解析替换' + i, objCopy[i], keyValues, utils.invoke(objCopy[i], keyValues))
      objCopy[i] = utils.invoke(objCopy[i], keyValues)
    }
    return objCopy
  }
  return obj
}

/**
 * 依据上下文信息，编译字符串
 * @param expression
 * @returns {*}
 */
utils.compileString = function (expression, $ctx) {
  let Fn = Function
  // console.log(new Fn('$ctx', 'return "' + expression + '"'))
  return new Fn('$ctx', 'return "' + expression + '"')($ctx)
}

/**
 * 直接执行eval，代码检查工具eslintrc，提示有误，改该此方法
 * @param expression
 * @param $ctx 用于expression的上下文参数
 * @param ctxName 指定上下文的参数名，默认为$ctx
 * @returns {*}
 */
utils.eval = function (expression, $ctx, ctxName = '$ctx') {
  // console.log('utils > expression: ', expression)
  // console.log('utils > $ctx: ', $ctx)
  let Fn = Function
  let str = utils.trim(expression)
  let index = str.indexOf(';')
  if (index === -1 || index === str.length - 1) {
    // 单语句
    return new Fn(ctxName, 'return ' + expression)($ctx)
  } else {
    // 多语句
    let strAry = str.split(';')
    let lastStr = strAry.pop();
    let preStr = strAry.join(';')
    return new Fn(ctxName, preStr + '; return ' + lastStr)($ctx)
  }
}

utils.isEmpty = function (str) {
  return str === undefined || str === null || str.replace(/\s/g, '') === ''
}

/**
 * 基于sessionStorage存储
 * @param key
 * @param json 默认返回{}
 */
utils.session = function (key, json) {
  if (arguments.length === 2) {
    if (json) {
      sessionStorage.setItem(key, JSON.stringify(json))
    } else {
      sessionStorage.removeItem(key)
    }
  } else if (arguments.length === 1) {
    let value = sessionStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    } else {
      return {}
    }
  } else {
    console.error('参数不正确。')
  }
}

/**
 *
 * @param hex 16进制
 * @param alpha 透明度，默认为1，即不透明
 * @returns {string}
 */
utils.hex2Rgb = function (hex, alpha) {
  let alphaLocal = alpha || 1
  let sColor = hex.toLowerCase()
  // 十六进制颜色值的正则表达式
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    // 处理六位的颜色值
    let sColorChange = []
    for (let j = 1; j < 7; j += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(j, j + 2)))
    }
    return 'RGBA(' + sColorChange.join(',') + ',' + alphaLocal + ')'
  }
  return sColor
}

/**
 *函数定义
 * @param data 需转换的数组
 * @param id
 * @param pid
 */
// utils.array2tree = function treeUtil (data, id, pid) {
//   let data = data
//   let id = id
//   let pid = pid
//   let tree = {}
//
//   function f () {
//
//   }
// }

/**
 * 数组指定列去重，返回去重后的列对象
 * @param arr 数组
 * @param col
 */
utils.distinct = function (arr, col) {
  let resultArray = arr.reduce(function (result, item) {
    if (!(item[col] in result)) {
      result[item[col]] = item[col]
    }
    return result
  }, {})
  return resultArray
}

utils.stopPropagationAndPreventDefault = function (e) {
  if (e && e.stopPropagation) {
    e.stopPropagation()
  } else {
    // IE
    window.event.cancelBubble = true
  }
  // stopDefault 默认事件,比如点击a标签以后会跳转至href链接的页面
  if (e && e.preventDefault) {
    e.preventDefault()
  } else {
    window.event.returnValue = false
  }
}

/**
 * 数组元素上移
 * @param items 数组
 * @param index 移动项索引
 */
utils.moveup = function (items, index) {
  let item = items[index]
  items.splice(index, 1)
  items.splice(index - 1, 0, item)
}

/**
 * 数组元素下移
 * @param items 数组
 * @param index 移动项索引
 */
utils.movedown = function (items, index) {
  let item = items[index]
  items.splice(index, 1)
  items.splice(index + 1, 0, item)
}
/**
 * 数组元素删除
 * @param items
 * @param index
 * @param confirmMsg 删除的确认信息，若有则提示，若无则直接删除
 */
utils.remove = function (items, index, confirmMsg) {
  if (!confirmMsg || confirm(confirmMsg)) {
    items.splice(index, 1)
  }
}

/**
 *
 * @param data 列表数据
 * @param pid  根id
 * @returns {Array}
 */
utils.listToTree = function (data, pid) {
  let tree = [];
  let temp;
  for (let i = 0; i < data.length; i++) {
    if (data[i].pid == pid) {
      let obj = data[i];
      temp = utils.listToTree(data, data[i].id);
      if (temp.length > 0) {
        obj.children = temp;
      }
      tree.push(obj);
    }
  }
  return tree;
}

utils.sleep = function (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
// utils.CryptoJS = CryptoJS
// window.utils = utils
// let content = utils.CryptoJS.enc.Utf8.parse(str)
// let b64content = utils.CryptoJS.enc.Base64.stringify(content)
// utils.CryptoJS.enc.Base64.parse(b64content).toString(utils.CryptoJS.enc.Utf8)
export default utils
