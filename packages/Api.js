import axios from 'axios'

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
  console.log('queryByGql >', gql)
  return service({
    url: Array.isArray(gql) ? url.metaMultiList : url.metaList,
    method: 'POST',
    data: gql,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  })
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
function saveByGql(biz, gql, successMsg, errorMsg) {
  return service({
    url: Array.isArray(gql) ? url.apiMetaSave : url.apiMetaSave,
    method: 'POST',
    data: gql
  })
}

function doDelete(entityName, keyValues, biz, successMsg, errorMsg) {
  return update(url.apiMetaDelete, entityName, keyValues, biz, successMsg || '删除成功', errorMsg || '删除失败')
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


function getPageByCode(pageCode) {
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

  return {
    getService: function () {
      return service
    },

    queryByGql: queryByGql,
    save: save,
    saveByGql: saveByGql,
    update: update,
    delete: doDelete,
    query: query,
    queryBatch: queryBatch,
    /**
     * 查询数据定义信息，即元数据信息
     * @param gqlObject or gqlArray
     * @param withMeta 是否需同时查询出各列表字段的元数据信息
     * @returns {*}
     */
    queryMeta: function (entityName) {
      return service({
        url: url.apiMetaDefined + '/' + entityName,
        method: 'POST',
        data: ''
      })
    },
    queryEntityNames: function () {
      return service({
        url: url.apiMetaEntityNames + '/',
        method: 'POST',
        data: ''
      })
    },
    /**
     *
     * @param path e.g. url:/api/cache/，path:/cache/
     * @returns {*}
     */
    queryList: function (path, data) {
      return service({
        url: url.api + path,
        method: 'POST',
        data: data
      })
    }
  }
}

export default ApiHelper
