// 导入组件
import GlPageLoader from './gl-page-loader'
import GlContextMenu from './gl-context-menu'
import GlModal from './gl-modal'
import GlTree from './gl-tree'
import GlForm from './gl-form'
import GlTable from './gl-table'
// import GlItem from './gl-card-layout/src/Item'
import GlCard from './gl-card'
import GlCardLayout from './gl-card-layout'
import STable from './gl-table/src/s-table'
import PageManager from './PageManager'
import Api from './Api'
// import GlContextMenu from '@xunlei/vue-context-menu'


// 存储组件列表
const components = [
  GlPageLoader,
  GlContextMenu,
  GlModal,
  GlTree,
  GlForm,
  GlTable,
  GlCard,
  // GlItem,
  GlCardLayout,
  STable
]

let uiApi = new Api()
// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function (Vue, options) {
  // 判断是否安装
  if (install.installed) return
  //
  console.log(' aui options > ', options)
  Vue.prototype.$pageManager = new PageManager(Vue)
  Vue.prototype.$api = Vue.prototype.$api || (options && options.api ? new Api(options.api) : uiApi)

  // 遍历注册全局组件
  components.map(component => {
    Vue.component(component.name, component)
  })
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

function setApi(api) {
  uiApi = api || new Api()
}

export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  // 服务端访问api
  setApi,
  api: uiApi,
  // 以下是具体的组件列表
  GlPageLoader,
  GlContextMenu,
  GlModal,
  GlForm,
  GlTable,
  GlCard,
  GlCardLayout
}
