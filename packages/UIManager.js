/* eslint-disable no-console */
import utils from './utils'

let globalVue

function loadComponent(component) {
  if (typeof component === 'string') {
    const theComponent = globalVue.component(component)
    console.log('packages > UIManager.js > loadComponent() > theComponent: ', theComponent, 'by componentName:', component)
    if (theComponent) {
      return theComponent
    } else {
      // 基于动态组件名，需从服务端获取组件配置信息
      let pageCode = component
      // $gl.api.queryPageByCode(pageCode).then(function (res) {
      //
      // })
      // TODO
      return pageCode
    }
  } else if (typeof component === 'object') {
    // base on local static component
    return component
  } else {
    console.error("packages > UIManager.js > loadComponent() > 不支持的组件格式，component: ", component)
  }
}

/**
 * @param opener
 * @param modalConfig  modalConfig.body.component的值是程序包已注册全局组件名，或组件对象
 * @returns {*}
 */
function openStaticPage(opener, modalConfig) {
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
  console.log('packages > UIManager.js > openVue() > opener >', opener)
  console.log('packages > UIManager.js > openVue() > modalConfig >', modalConfig)
  console.log('packages > UIManager.js > openVue() > modalBodyComponent >', vueComponent)
  let id = utils.uuid(16)
  let el = document.createElement('div')
  el.setAttribute('id', id)
  document.getElementById('app').appendChild(el)
  const GlModal = globalVue.component('GlModal')
  // console.log('PageManger > GlModal>', GlModal)
  let modalView = new GlModal({
    propsData: {
      modalId: id,
      opener: opener,
      // body: vueComponent,
      modalConfig: modalConfig,
    }
  })
  modalView.$mount(document.getElementById(id));
  // let $modal = $(modalView.$el).modal({duration: 100, closable: false, allowMultiple: true})
  // $modal.modal('show')
  return modalView
}

export default class UIManager {

  constructor(Vue) {
    globalVue = Vue
  }

  setGlobalVue(Vue) {
    globalVue = Vue
  }

  /**
   * 打开modal
   * @param opener 打开页面的源vue
   * @param modalConfig
   */
  // modalConfig: {
  //   title: '编辑用户信息',
  //   width: '1000px',
  //   height: '480px',
  //   okText: '',
  //   cancelText: '',
  //   body: {
  //     type: 'staticPage',
  //     component: 'gl-form',
  //     opts: {
  //         entityName: 'platform_user',
  //         fields: 'id,name,loginName,description',
  //         layout: [
  //           [{loginName: [4, 8]}, {name: [4, 8]}],
  //           [{description: [4, 20]}]
  //           ],
  //         model: {id: '@.id'}
  //     }
  //   }
  // }
  openModal(opener, modalConfig) {
    // staticPage is local page
    if (modalConfig.body.type === 'staticPage' || modalConfig.body.type === 'localPage') {
      return openStaticPage(opener, modalConfig)
    } else {
      // dynamicPage that has a pageCode
      return openDynamicPage(opener, modalConfig)
    }
  }

  loadComponent(component) {
    return loadComponent(component)
  }
}
