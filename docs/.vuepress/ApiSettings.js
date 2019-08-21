import Vue from 'vue'
import notification from 'ant-design-vue/es/notification'

export default class ApiSettings {

  constructor(options) {
    this.options = {}
    Object.assign(this.options, options)
  }

  interceptors(axios) {
    const service = axios

    const err = (error) => {
      if (error.response) {
        console.log('.vuepress > apiHelper.js > interceptors() > error.response: ', error.response)
        error.response.data = builder('', error.response.data, error.response.status)
        const data = error.response.data
        const token = Vue.ls.get(ACCESS_TOKEN)
        if (error.response.status === 403) {
          notification.error({
            message: 'Forbidden',
            description: data.message
          })
        }
        if (error.response.status === 401 && !(data.result && isLoginRes(error.response))) {
          notification.error({
            message: 'Unauthorized',
            description: 'Authorization verification failed'
          })
          if (token) {
            store.dispatch('Logout').then(() => {
              setTimeout(() => {
                window.location.reload()
              }, 1500)
            })
          }
        }
      }
      return Promise.reject(error)
    }

    console.log('.vuepress > apiHelper.js > interceptors() > service.defaults: ', service.defaults)

// request interceptor
    service.interceptors.request.use(config => {
      // const token = Vue.ls.get(ACCESS_TOKEN)
      // if (token) {
      //   config.headers['Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
      // }
      // config.headers['Access-Control-Allow-Origin'] = '*'
      // config.headers['Access-Control-Allow-Methods'] = 'PUT,POST,GET,DELETE,OPTIONS'
      // config.headers['Access-Control-Allow-Headers'] = 'X-Requested-With,Content-Type'
      // config.headers['Access-Control-Max-Age'] = '86400'

      // service.defaults.headers.post['xsrfCookieName'] = 'CSRFToken';
      // service.defaults.headers.post['xsrfHeaderName'] = 'X-CSRFToken';
      // service.defaults.headers.post['responseType'] = 'json';
      // service.defaults.headers.post['Origin'] = '*';
      // service.defaults.headers.post['Accept'] = 'application/json, text/javascript';
      // service.defaults.headers.post['Content-Type'] = 'application/json';
      // service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

      console.log('.vuepress > apiHelper.js > interceptors() > config: ', config)
      return config
    }, err)

    // response interceptor
    service.interceptors.response.use((response) => {
      console.log('.vuepress > apiHelper.js > interceptors() > response: ', response)
      // 处理response.data，若该格式为ApiResult，则转换格式
      if (response.data) {
        if (isApiResult(response)) {
          if (isLoginRes(response)) {
            const user = response.data.data
            return builder({
              'id': user.id,
              'name': user.name,
              'username': user.loginName,
              'password': user.password,
              'avatar': user.avatar || 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
              'status': 1,
              'telephone': user.telephone,
              'lastLoginIp': '27.154.74.117',
              'lastLoginTime': 1534837621348,
              'creatorId': user.creator,
              'createTime': user.createAt, // 1497160610259
              'deleted': 0,
              'roleId': 'admin',
              'lang': 'zh-CN',
              'token': '4291d7da9005377ec9aec4a71ea837f'
            }, response.data.msg, parseInt(response.data.code))
          } else if (isPageResult(response)) {
            const res = {}
            res.data = response.data.data
            res.pageSize = parseInt(response.data.size)
            res.pageNo = parseInt(response.data.page)
            res.totalPage = parseInt(response.data.total)
            res.totalCount = parseInt(response.data.dataSize)
            console.log('.vuepress > apiHelper.js > interceptors() > res: ', res)
            return res
          } else {
            return builder(response.data.data, response.data.msg, parseInt(response.data.code))
          }
        }
        if (isLogoutRes(response)) {
          return builder({}, '注销成功')
        }
      }
      return response.data
    }, err)

    const isLoginRes = function (response) {
      return response.request.responseURL.indexOf('sys/auth/loginSecurity') !== -1
    }
    const isLogoutRes = function (response) {
      return response.request.responseURL.indexOf('sys/auth/logout') !== -1
    }
    // 是否为ApiResult格式
    const isApiResult = function (response) {
      // response.data 的格式：{
      //   msg:'',
      //   code: '',
      //   data:{},
      //   meta:{} // 可选
      // }
      return 'msg' in response.data && 'code' in response.data && 'data' in response.data
    }
    // 是否为分页列表数据
    const isPageResult = function (response) {
      return 'page' in response.data && 'size' in response.data && 'total' in response.data
    }

    const builder = (data, message, code = 0, headers = {}) => {
      const responseBody = {
        message: '',
        timestamp: 0,
        result: null,
        code: 0
      }
      responseBody.result = data
      if (message !== undefined && message !== null) {
        responseBody.message = message
      }
      if (code !== undefined && code !== 0) {
        responseBody.code = code
        responseBody._status = code
      }
      if (headers !== null && typeof headers === 'object' && Object.keys(headers).length > 0) {
        responseBody._headers = headers
      }
      responseBody.timestamp = new Date().getTime()
      return responseBody
    }
    return service
  }
}
