/**
 * 扩展 VuePress 应用
 */
import AntDesign from 'ant-design-vue'
// 对于导入antd.less，注意需config.js中less的javascriptEnabled: true才可正常执行
import 'ant-design-vue/dist/antd.less'
// 导入依赖表单验证
import VeeValidate from 'vee-validate'
//引入中文包，提示信息可以以中文形式显示
import zh_CN from 'vee-validate/dist/locale/zh_CN'
import VueI18n from 'vue-i18n'
// 导入组件库
import geelatoAui from './../../packages/index'

import ApiSettings from './ApiSettings'

export default ({
                  Vue, // VuePress 正在使用的 Vue 构造函数
                  options, // 附加到根实例的一些选项
                  router, // 当前应用的路由实例
                  siteData, // 站点元数据
                }) => {

  let auiOptions = {
    // 修改服务地址，默认为http://localhost:8080/api
    api: new ApiSettings({
      // baseURL: 'http://localhost:8080/api',
      baseURL: 'https://api.geelato.org:8080/api',
    }).options
  }

  // 注册组件库
  Vue.use(VueI18n)
  Vue.use(VeeValidate, {
    i18n: new VueI18n({
      locale: 'zh_CN',
    }),
    i18nRootKey: 'validations',
    dictionary: {
      zh_CN
    },
    // fixed：The computed property "fields" is already defined in data.
    errorBagName: 'errorBags',
    fieldsBagName: 'fieldBags'
  })
  Vue.use(geelatoAui, auiOptions)
  Vue.use(AntDesign)
}

