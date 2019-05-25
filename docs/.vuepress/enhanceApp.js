/**
 * 扩展 VuePress 应用
 */
import AntDesign from 'ant-design-vue'
// 对于导入antd.less，注意需config.js中less的javascriptEnabled: true才可正常执行
import 'ant-design-vue/dist/antd.less'

// 导入组件库
import geelatoAui from './../../packages/index'

import apiHelper from './apiHelper'

export default ({
                  Vue, // VuePress 正在使用的 Vue 构造函数
                  options, // 附加到根实例的一些选项
                  router, // 当前应用的路由实例
                  siteData, // 站点元数据
                }) => {

  // 可以自行实现api，再调用geelatoAui.setApi(api)
  // 这里采用geelatoAui默认的api的方式。只进行请求拦截，不重置原有的api。
  // 以下service是Axios实例
  const service = geelatoAui.api.getService()
  apiHelper.interceptors(service)
  Vue.prototype.$gl ? Vue.prototype.$gl.api = geelatoAui.api : Vue.prototype.$gl = {api: geelatoAui.api}

  // 修改服务地址，默认为http://localhost:8080/api
  // let apiOptions = {api: {baseURL: 'http://localhost:8080/api'}}
  let apiOptions = {api: {baseURL: 'http://api.geelato.org:8080/api'}}
  // 注册组件库
  Vue.use(geelatoAui, apiOptions)
  Vue.use(AntDesign)
}

