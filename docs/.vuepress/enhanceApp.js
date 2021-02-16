/**
 * 扩展 VuePress 应用
 */
import i18n from '../../packages/locales/index'
// import Storage from 'vue-ls';
import AntDesign from 'ant-design-vue'
// 对于导入antd.less，注意需config.js中less的javascriptEnabled: true才可正常执行
import 'ant-design-vue/dist/antd.less'
// 导入依赖表单验证
import {extend} from 'vee-validate'
import {localize} from 'vee-validate';
// 引入中文包，提示信息可以以中文形式显示
import zhCN from 'vee-validate/dist/locale/zh_CN'
import * as rules from 'vee-validate/dist/rules'
// 导入组件库
import geelatoAui from './../../packages/index'
import ApiSettings from './ApiSettings'

export default ({
                  Vue, // VuePress 正在使用的 Vue 构造函数
                  options, // 附加到根实例的一些选项
                  router, // 当前应用的路由实例
                  siteData, // 站点元数据
                }) => {
  options.i18n = i18n

  let auiOptions = {
    // 修改服务地址，默认为http://localhost:8080/api
    api: new ApiSettings({
      baseURL: 'http://localhost:8080/api',
      // baseURL: 'https://api.geelato.org:8080/api',
    })
  }

  // Install and Activate the zh_CN locale.
  localize('zh_CN', zhCN);
  Object.keys(rules).forEach(rule => {
    extend(rule, rules[rule])
  })

  Vue.use(geelatoAui, auiOptions)
  Vue.use(AntDesign)

  // Vue.use(Storage, {
  //   namespace: 'geelato__', // key键前缀
  //   name: 'ls', // 命名Vue变量.[ls]或this.[$ls],
  //   storage: 'local', // 存储名称: session, local, memory
  // });
}

