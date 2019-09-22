import ProjectCreate from './ProjectCreate'
import ProjectList from './ProjectList'

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
      props: {}
    },
    actions: [{
      text: '保存',
      type: 'primary',
      fn: 'save',
      // opener、content、modal，默认为content
      ctx: 'content',
      params: {},
      then: {
        fn: 'onSave',
        ctx: 'opener',
        then: {
          fn: 'close',
          ctx: 'modal'
        }
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
    }],
    on: [{
      fn: 'selectItem',
      ctx: 'content',
      then: {
        fn: 'openerFnExampleByContent',
        ctx: 'opener'
      }
    }]
  }, staticListPageConfig: {
    title: '选择项目',
    width: '1000px',
    height: '480px',
    body: {
      type: 'staticPage',
      component: ProjectList,
      props: {}
    },
    actions: [{
      fn: 'close',
      text: '取消',
      ctx: 'modal'
    }],
    // 侦听来之content的事件selectItem
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
      props: {}
    },
    actions: [{
      name: 'ok',
      text: '保存'
    }]
  }
}
