// import utils from './utils'
import EntityDataReaderInfo from '../EntityDataReaderInfo'

export default {
  methods: {
    gl_$_doAction(action, data) {
      let that = this
      if (!action) {
        return
      }
      if (typeof action !== 'object' || !action.fn) {
        console.warn('无效的action: ', action)
        return
      }
      let content = Object.values(that.$refs.$content.$refs)[0]
      let ctx = undefined
      if (action.ctx === 'opener') {
        ctx = that.opener
      } else if (action.ctx === 'modal') {
        ctx = that
      } else {
        ctx = content
      }

      let promise = ctx[action.fn](action.params, data, content)
      if (promise && typeof promise.then === 'function') {
        promise.then(function (data) {
          that.gl_$_doAction(action.then, data)
        }).catch(function (data) {
          that.gl_$_doAction(action.fail, data)
        })
      } else {
        that.gl_$_doAction(action.then)
        // console.log('geelato-ui-ant > ctx[action.fn](action.params) > promise: ', promise)
        // console.log('geelato-ui-ant > ctx[action.fn](action.params) > action.then: ', action.then)
        // console.log('geelato-ui-ant > ctx[action.fn](action.params) > action.fail: ', action.fail)
      }
    },
    gl_openModal(modalConfig) {
      this.$gl.ui.openModal(this, modalConfig)
    }
  }
}
