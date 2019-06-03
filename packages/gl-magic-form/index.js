// 导入组件，组件必须声明 name
import component from './src/Index'
import GlRow from './src/GlRow'
import GlCell from './src/GlCell'
import GlControl from './src/GlControl'
import GlLabel from './src/GlLabel'
import './src/style.css'

// 为组件提供 install 安装方法，供按需引入
component.install = function (Vue) {
  Vue.component(GlRow.name, GlRow)
  Vue.component(GlCell.name, GlCell)
  Vue.component(GlControl.name, GlControl)
  Vue.component(GlLabel.name, GlLabel)
  Vue.component(component.name, component)
}

// 默认导出组件
export default component
