export default {
  props: {
    api: {
      type: Object,
      default() {
        return this.$gl.api
      }
    },
    // 组件渲染配置信息
    opts: {
      type: Object,
      required: false
    },
    // 表单的查询信息，如{id:'1345362334482731423'}，{treeNodeId:'1345362334482731423'}
    query: {
      type: Object,
      required: false,
      default() {
        return {}
      }
    }
  }
}
