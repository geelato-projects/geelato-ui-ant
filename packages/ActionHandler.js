export default class ActionHandler {
  constructor({ui, opener, modal, content}) {
    this.uiManager = ui
    this.opener = opener
    this.modal = modal
    this.that = content
    console.log('geelato-ui-ant > ActionHandler.js > constructor() > this:', this)
  }

  doAction(action, data) {
    let that = this
    if (!action) {
      return
    }
    if (typeof action !== 'object' || !action.fn) {
      console.warn('无效的action: ', action)
      return
    }

    let ctx = undefined
    if (action.ctx === 'opener') {
      ctx = that.opener
    } else if (action.ctx === 'modal') {
      ctx = that.modal
    } else if (action.ctx === 'content') {
      ctx = that.content
    } else {
      ctx = this
    }

    // 默认从指定的上下文中执行该方法，若无指定上下文，则执行本actionHandler的方法
    let fn = typeof ctx[action.fn] === 'function' ? ctx[action.fn] : this[action.fn]
    console.log('geelato-ui-ant > ActionHandler.js > doAction() > ctx:', ctx)
    console.log('geelato-ui-ant > ActionHandler.js > doAction() > fn:', fn)

    let promise = fn(action.params, data, that.content)
    if (promise && typeof promise.then === 'function') {
      promise.then(function (data) {
        that.doAction(action.then, data)
      }).catch(function (data) {
        that.doAction(action.fail, data)
      })
    } else {
      that.doAction(action.then)
      // console.log('geelato-ui-ant > ctx[action.fn](action.params) > promise: ', promise)
      // console.log('geelato-ui-ant > ctx[action.fn](action.params) > action.then: ', action.then)
      // console.log('geelato-ui-ant > ctx[action.fn](action.params) > action.fail: ', action.fail)
    }
  }

  openModal(modalConfig) {
    if (!this.uiManager) {
      console.error('packages > ActionHandler > openModal() > uiManager: 未设置该对象。')
    }
    return this.uiManager.openModal(this.opener, modalConfig)
  }
}
