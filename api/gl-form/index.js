export default {
  component: 'GlForm',
  // 组件的接收参数
  props: [
    {name: 'query', description: '输入查询条件数据，如{id:1}'}
  ],
  methods: [
    {
      name: 'save',
      // 当前方法的输入参数
      params: [],
      // 当前方法的返回结果
      return: [],
      description: '保存'
    }
  ],
  data: [
    {
      name: 'form',
      type: 'object',
      description: '当前表单值'
    }
  ]
}
