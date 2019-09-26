// 对应一个按钮或链接
export default {
  actions: [{
    text: '保存',
    icon: 'plus',
    show: false,
    type: 'primary',
    fn: 'save',
    // opener、content、modal，默认为content
    ctx: 'content',
    // 传递给save方法的参数
    params: {},
    then: {
      fn: 'close',
      ctx: 'modal',
      params: {},
      then: {}
    }
  }, {
    fn: 'close',
    text: '取消',
    ctx: 'modal'
  }, {
    fn: 'openerFnExample',
    text: '回调',
    ctx: 'opener',
    params: {info: '$ctx.$form.id'},
    then: {
      fn: 'close',
      ctx: 'modal',
      params: {},
      then: {},
      // fail: {}
    }
  }]
}
