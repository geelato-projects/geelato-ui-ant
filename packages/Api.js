import axios from 'axios'
import utils from "./utils";

let url = {
  metaList: '/meta/list',
  metaMultiList: '/meta/multiList',
  apiMetaSave: '/meta/save',
  apiMetaDelete: '/meta/delete',
  apiMetaEntityNames: '/meta/entityNames',
  apiMetaDefined: '/meta/defined',
  api: '/api'
}

let service

/**
 * 基于gql对象进行查询
 * @param gql Object or gqlArray
 * @param withMeta 是否需同时查询出各列表字段的元数据信息
 * @returns {*}
 */
function queryByGql(gql, withMeta) {
  // console.log('api > queryByGql > gql: ', gql)
  let path = Array.isArray(gql) ? url.metaMultiList : url.metaList
  return service({
    url: path + '?withMeta=' + !!withMeta,
    method: 'POST',
    data: gql,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  })
}

/**
 * 基于实体数据源查询
 * @param entityDataReader
 * @returns {*}
 */
function queryByEntityDataReader(entityDataReader) {
  let gql = {}
  gql[entityDataReader.entity] = {'@fs': entityDataReader.fields || '*'}
  if (entityDataReader.order) {
    gql[entityDataReader.entity] [entityDataReader.order] = entityDataReader.order
  }
  if (entityDataReader.pageNo) {
    gql[entityDataReader.entity] [entityDataReader.pageNo] = entityDataReader.pageNo
  }
  if (entityDataReader.pageSize) {
    gql[entityDataReader.entity] [entityDataReader.pageSize] = entityDataReader.pageSize
  }
  Object.assign(gql[entityDataReader.entity], entityDataReader.params || {})
  return queryByGql(gql, entityDataReader.withMeta)
}

/**
 * 实体查询，内部依据参数构建gql对象进行查询
 * 更复杂、高级的查询@see queryByGql
 * @param entityName e.g. platform_dev_project
 * @param keyValues 查询要件键值对 e.g. {id:123456,name:'张三'}
 * @param fieldNames 查询的列字段 e.g. id,name
 */
function query(entityName, keyValues, fieldNames, withMeta) {
  if (!fieldNames) {
    throw '查询列（fieldNames）不能为空。'
  }
  // gql查询语句
  let gql = {}
  gql[entityName] = {
    '@fs': fieldNames || '*'
  }
  Object.assign(gql[entityName], keyValues)
  return queryByGql(gql, withMeta)
}


/**
 * 批量查询
 * @param queryParamArray [{entityName:String,keyValues:{key1:value1,key2:value2,...},fieldNames:'id,name,...'},...]
 *        @see query
 */
function queryBatch(queryParamArray, withMeta) {
  let gqlAry = []
  for (let i in queryParamArray) {
    let queryParam = queryParamArray[i]
    let gql = {}
    gql[queryParam.entityName] = {
      '@fs': queryParam.fieldNames || '*'
    }
    Object.assign(gql[queryParam.entityName], queryParam.keyValues)
    gqlAry.push(gql)
  }
  return queryByGql(gqlAry, withMeta)
}


function update(url, entityName, keyValues, biz) {
  let bizCode = biz || '0'
  let data = {
    '@biz': bizCode
  }
  data[entityName] = keyValues || {}
  return service({
    url: url + '/' + bizCode,
    method: 'POST',
    data: data
  })
}

/**
 * @param entityName 实体名称
 * @param keyValues Object类型
 * @returns {*}
 */
function save(entityName, keyValues, biz, successMsg, errorMsg) {
  return update(url.apiMetaSave, entityName, keyValues, biz, successMsg || '保存成功', errorMsg || '保存失败')
}

/**
 * 基于gql对象进行查询
 * @param gqlObject or gqlArray
 * @param biz 业务代码
 * @returns {*}
 */
function saveByGql(biz, gql) {
  let path = Array.isArray(gql) ? url.apiMetaSave : url.apiMetaSave
  let bizCode = biz || '0'
  return service({
    url: path + '/' + bizCode,
    method: 'POST',
    data: gql
  })
}

function doDelete(entityName, keyValues, biz, successMsg, errorMsg) {
  return update(url.apiMetaDelete, entityName, keyValues, biz, successMsg || '删除成功', errorMsg || '删除失败')
}


/**
 * 通过页面编码获取页面配置信息
 * @param pageCode
 * @returns {*}
 */
function queryPageByCode(pageCode) {
  // gql查询语句
  let gql = {
    'platform_page_config': {
      '@p': '1,1',
      '@fs': 'id,code,content',
      'code': pageCode
    }
  }
  return service({
    url: url.metaList,
    method: 'POST',
    data: gql
  })
}

/**
 * 返回数据处理
 * @param res 请求响应（response）
 * @param resultMapping res中的数据返回结果转换定义
 * @returns {{data: Array, resultMapping: {}}}
 */
function entityDataReaderResultHandler(res, resultMapping = {}) {

  let resultSet = {
    //  依据传入参数resultMapping的定义处理后的数据
    data: [],
    // 经转换之后的列映射，key为组件中用到的变量名，value为data中的列名。
    resultMapping: {}
  }

  // 返回结果预处理
  // 获取返回结果的列名
  let resColumns = {}
  if (res.data.data && res.data.data.length > 0) {
    let item = res.data.data[0]
    let resultFieldNameAry = Object.keys(item)
    for (let i in resultFieldNameAry) {
      resColumns[resultFieldNameAry[i]] = resultFieldNameAry[i]
    }
  }
  // 先找出需处理的列：resultMapping的key和value不相同，mapping，e.g. [{avatar:'https://xxxxx/xx/xx.jpg'}]
  let toStatMappingItems = []
  // console.log('toStatMappingItems>', toStatMappingItems)
  for (let key in resultMapping) {
    let field = resultMapping[key]
    // let resultName = resColumns[field]
    if (key !== field) {
      let isRename = resColumns[field] !== undefined && !!resColumns[field]
      toStatMappingItems.push({key: key, value: field, isRename: isRename})
      resultSet.resultMapping[key] = key
    }
  }
  console.log('packages > Api.js > entityDataReaderResultHandler() > resColumns: ', resColumns)
  console.log('packages > Api.js > entityDataReaderResultHandler() > resultMapping: ', resultMapping)
  console.log('packages > Api.js > entityDataReaderResultHandler() > toStatMappingItems: ', toStatMappingItems)

  // 如增加静态的列，列值格式化、列值组合;重命名列(在原有列的基础上增加重命名的列)等
  for (let i in res.data.data) {
    let dataItem = res.data.data[i]
    for (let j in toStatMappingItems) {
      let mappingItem = toStatMappingItems[j]
      if (mappingItem.isRename) {
        dataItem[mappingItem.key] = dataItem[mappingItem.value]
      } else {
        dataItem[mappingItem.key] = utils.eval(mappingItem.value, dataItem)
      }
    }
  }
  resultSet.data = res.data.data
  console.log('packages > Api.js > entityDataReaderResultHandler() > data: ', res.data.data)
  return resultSet
}

/**
 * 查询数据定义信息，即元数据信息
 * @param gqlObject or gqlArray
 * @param withMeta 是否需同时查询出各列表字段的元数据信息
 * @returns {*}
 */
function queryMeta(entityName) {
  return service({
    url: url.apiMetaDefined + '/' + entityName,
    method: 'POST',
    data: ''
  })
}

function queryEntityNames() {
  return service({
    url: url.apiMetaEntityNames + '/',
    method: 'POST',
    data: ''
  })
}

/**
 *
 * @param path e.g. url:/api/cache/，path:/cache/
 * @returns {*}
 */
function queryList(path, data) {
  return service({
    url: url.api + path,
    method: 'POST',
    data: data
  })
}


// config.headers['Access-Control-Allow-Origin'] = '*'
// config.headers['Access-Control-Allow-Methods'] = 'PUT,POST,GET,DELETE,OPTIONS'
// config.headers['Access-Control-Allow-Headers'] = 'X-Requested-With,Content-Type'
// config.headers['Access-Control-Max-Age'] = '86400'
function ApiHelper(options) {
  // axios.all('*', function (req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*")
  //   res.header("Access-Control-Allow-Headers", "Authorization,Origin, X-Requested-With, Content-Type, Accept")
  //   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  //   next()
  // })

  service = axios.create({
    baseURL: (options && options.baseURL) || 'http://localhost:8080/api', // api base_url
    timeout: (options && options.timeout) || 6000, // 请求超时时间
    headers: (options && options.headers) || {
      //   'Request-Method': 'PUT,POST,GET,DELETE,OPTIONS',
      //   'Request-Headers': 'Authorization,Origin, X-Requested-With, Content-Type, Accept',
      'Access-Control-Allow-Origin': '*',
      //   'Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
      //   'Allow-Headers': 'Authorization,Origin, X-Requested-With, Content-Type, Accept'
    }
    ,
    withCredentials: true,
    crossDomain: true
  })

  service.defaults.headers['Access-Control-Allow-Origin'] = '*';
  // service.defaults.headers['Accept'] = 'application/json, text/javascript';
  // service.defaults.headers['Content-Type'] = 'application/json';

  if (options && options.url) {
    url = options.url
  }
  if (options && typeof options.interceptors === 'function') {
    options.interceptors(service)
  }

  return {
    getService: function () {
      return service
    },
    query: query,
    queryBatch: queryBatch,
    queryByGql: queryByGql,
    queryByEntityDataReader: queryByEntityDataReader,
    resultHandler: entityDataReaderResultHandler,
    save: save,
    saveByGql: saveByGql,
    update: update,
    delete: doDelete,
    queryMeta: queryMeta,
    queryEntityNames: queryEntityNames,
    queryList: queryList,
    queryPageByCode: queryPageByCode
  }
}

export default ApiHelper
