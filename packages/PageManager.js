/* eslint-disable no-console */
import utils from './utils'

let TheVue

function loadComponent(component) {
  if (typeof component === 'string' && component.startsWith('/')) {
    // base on url
    let vuePath = component
    let path = component.indexOf('.vue') > 0 ? vuePath : vuePath + '.vue'
    path = path.replace('/@/', '').replace('/', '')
    // path = 'aa/bb/cc.vue'
    console.log('PageManager > loadComponent > path: ', path)
    // fixed :webpack 打包报 Cyclic dependency，
    // 出错的写法： let vueComponent = resolve => require(['.' + path], resolve)
    let vueComponent = (resolve) => (require['./' + path], resolve)
    return vueComponent
  } else if (typeof component === 'string' && !component.startsWith('dy-')) {
    // 基于动态组件名，需从服务端获取组件配置信息
    return {}
  } else if (typeof component === 'object') {
    // base on component
    return component
  } else {
    console.error("PageManger > loadComponent > 不支持的组件格式，component: ", component)
  }
}

// modalConfig.body.component的值是程序包组件地址，或组件对象
function openStaticPage(opener, modalConfig) {
  // // console.log('modalConfig.body.component>', typeof modalConfig.body.component)
  // if (typeof modalConfig.body.component === 'string' && modalConfig.body.component.startsWith('/')) {
  //   // base on url
  //   let vuePath = modalConfig.body.component
  //   let path = modalConfig.body.component.indexOf('.vue') > 0 ? vuePath : vuePath + '.vue'
  //   path = path.replace('/@/', '').substring(1)
  //   // path = './views/aa/bb/cc.vue'
  //   console.log('PageManager > openPage > path: ', path)
  //   // fixed :webpack 打包报 Cyclic dependency，
  //   // 出错的写法： let vueComponent = resolve => require(['.' + path], resolve)
  //   let vueComponent = (resolve) => (require['./' + path], resolve)
  //   return openVue(opener, modalConfig, vueComponent)
  // } else if (typeof modalConfig.body.component === 'object') {
  //   // base on component
  //   return openVue(opener, modalConfig, modalConfig.body.component)
  // }
  return openVue(opener, modalConfig, loadComponent(modalConfig.body.component))
}

// modalConfig.body.component的值是页面编码
function openDynamicPage(opener, modalConfig) {
  return openVue(opener, modalConfig, loadComponent(modalConfig.body.component))
}

/**
 * @param opener
 * @param vueComponent
 * @param vueConfig e.g. {title: '', actions: [], padding: '1.5em'}
 * @param vueData
 */
function openVue(opener, modalConfig, vueComponent) {
  console.log('geelato > openVue > opener >', opener)
  console.log('geelato > openVue > modalBody >', vueComponent)
  console.log('geelato > openVue > modalConfig >', modalConfig)

  let id = utils.uuid(16)
  let el = document.createElement('div')
  el.setAttribute('id', id)
  document.getElementById('app').appendChild(el)
  const GlModal = TheVue.component('gl-modal')
  console.log('PageManger > GlModal>', GlModal)
  let modalView = new GlModal({
    propsData: {
      modalId: id,
      opener: opener,
      body: vueComponent,
      modalConfig: modalConfig,
    }
  })
  modalView.$mount(document.getElementById(id));
  // let $modal = $(modalView.$el).modal({duration: 100, closable: false, allowMultiple: true})
  // $modal.modal('show')
  return modalView
}

export default class PageManager {

  constructor(Vue) {
    TheVue = Vue
  }

  setModal(Vue) {
    TheVue = Vue
  }

  /**
   * 打开modal
   * @param opener 打开页面的源vue
   * @param vuePath src下的绝对路径，可以带.vue的后缀或不带，如'/@/views/xx.vue'、'/@/views/xx'、'/@/components/xx.vue'、'/@/components/xx'
   * @param vueConfig modalOpts的值 e.g. {title: '', actions: [], padding: '1.5em'}
   * @param callbackSet 回调事件集合，如：{onSelected:function(){}}
   */

  // modal: {
  //   title: '编辑用户信息',
  //   width: '1000px',
  //   height: '480px',
  //   okText: '',
  //   cancelText: '',
  //   body: {
  //     type: 'staticPage',
  //     component: '/components/gl-form-simple/Index.vue',
  //     opts: {
  //       ui: {
  //         entityName: 'platform_user',
  //         fields: 'id,name,loginName,description',
  //         layout: [
  //           [{loginName: [4, 8]}, {name: [4, 8]}],
  //           [{description: [4, 20]}]
  //           ],
  //         model: {id: '@.id'}
  //       }
  //     }
  //   }
  // }
  openModal(opener, modalConfig) {
    if (modalConfig.body.type === 'staticPage') {
      return openStaticPage(opener, modalConfig)
    } else {
      // dynamicPage that has a pageCode
      return openDynamicPage(opener, modalConfig)
    }
  }


}
