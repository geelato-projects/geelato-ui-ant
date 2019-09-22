import UserFormData from "../../Form/Base/UserFormData";

export default {
  staticExample: {
    // 组件的配置信息，在编写代码时就已明确；type 默认为 local。
    type: 'static',
    component: 'GlForm',
    props: {opts: JSON.parse(JSON.stringify(UserFormData))}
  },
  dynamicExample: {
    // 组件的配置信息，通过组件编码，从远程数据服务获取动态获取
    type: 'dynamic',
    component: 'GlForm-DUEHSIUQ',
    props: {}
  }
}
