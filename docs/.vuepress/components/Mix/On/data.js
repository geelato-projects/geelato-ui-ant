// 侦听来之content的事件selectItem，并执行打开组件的方法openerFnExampleByContent，最后执行modal的关闭操作。
export default {
  on: [{
    fn: 'selectItem',
    ctx: 'content',
    then: {
      fn: 'openerFnExampleByContent',
      ctx: 'opener',
      then: {
        fn: 'close',
        ctx: 'modal'
      }
    }
  }]
}
