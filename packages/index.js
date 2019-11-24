// 导入组件
import GlPageLoader from './gl-page-loader'
import GlContextMenu from './gl-context-menu'
import GlLabel from './gl-label'
import GlControl from './gl-control'
import GlHeader from './gl-header'
import GlModal from './gl-modal'
import GlList from './gl-list'
import GlListPlus from './gl-list-plus'
import GlTree from './gl-tree'
import GlForm from './gl-form'
import GlTable from './gl-table'
import GlTabs from './gl-tabs'
import GlCard from './gl-card'
import GlCardLayout from './gl-card-layout'
import STable from './gl-table/src/s-table'
import UIManager from './UIManager'
import Api from './Api'
import utils from './utils'
import mixin from './mixin'
// import GlContextMenu from '@xunlei/vue-context-menu'
import './style.css'
import packageJson from '../package.json'


// 存储组件列表
const components = [
  GlPageLoader,
  GlContextMenu,
  GlLabel,
  GlControl,
  GlHeader,
  GlModal,
  GlList,
  GlListPlus,
  GlTree,
  GlForm,
  GlTable,
  GlCard,
  GlTabs,
  // GlItem,
  GlCardLayout,
  STable
]


console.log('geelato-ui-ant > index.js > version:', packageJson.name + '-' + packageJson.version)
// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function (Vue, options) {
  // 判断是否安装
  if (install.installed) return

  console.log('geelato-ui-ant > index.js > install() > options:', options)
  if (!Vue.prototype.$gl) {
    Vue.prototype.$gl = {}
  }

  Vue.prototype.$gl.api = Vue.prototype.$gl.api || options && options.api ? new Api(options.api) : new Api()
  Vue.prototype.$gl.ui = Vue.prototype.$gl.ui || new UIManager(Vue)
  Vue.prototype.$gl.bus = Vue.prototype.$gl.bus || new Vue()
  Vue.prototype.$gl.utils = Vue.prototype.$gl.utils || utils
  Vue.prototype.$gl.globalVue = Vue

  // window is not defined
  // if (!window.$gl) {
  //   window.$gl = Vue.prototype.$gl
  // } else {
  //   console.error('index.js > install() > window.$gl已存在：', window.$gl)
  // }

  // 遍历注册全局组件
  components.map(component => {
    Vue.component(component.name, component)
  })

  GlForm.install(Vue)
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  // 以下是具体的组件列表
  GlPageLoader,
  GlContextMenu,
  GlLabel,
  GlControl,
  GlModal,
  GlList,
  GlListPlus,
  GlTree,
  GlTable,
  GlCard,
  GlTabs,
  GlCardLayout,
  //
  utils,
  mixin
}
