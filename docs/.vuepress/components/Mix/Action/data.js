// 对应一个按钮或链接
export default {
  actions: [{
    text: '保存',
    type: 'primary',
    fn: 'save',
    // opener、content、modal，默认为content
    ctx: 'content',
    params: {},
    then: {
      fn: 'close',
      ctx: 'modal',
      params: {},
      then: {},
      fail: {}
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
      fail: {}
    }
  }]
}
