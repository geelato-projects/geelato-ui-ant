import ProjectCreate from './ProjectCreate'

export default {
  staticPageConfig: {
    title: '创建项目',
    width: '1000px',
    height: '480px',
    okText: '保存',
    cancelText: '取消',
    body: {
      type: 'staticPage',
      component: ProjectCreate,
      opts: {},
      query: {}
    },
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
      params: {info:'$ctx.$form.id'},
      then: {
        fn: 'close',
        ctx: 'modal',
        params: {},
        then: {},
        fail: {}
      }
    }]
  },
  dynamicPageConfig: {
    title: '创建项目',
    width: '1000px',
    height: '480px',
    okText: '保存',
    cancelText: '取消',
    body: {
      type: 'staticPage',
      component: ProjectCreate,
      opts: {},
      query: {}
    },
    actions: [{
      name: 'ok',
      text: '保存'
    }]
  }
}
