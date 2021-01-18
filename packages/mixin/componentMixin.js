import EntityDataReaderInfo from '../EntityDataReaderInfo'
import ActionResult from '../ActionResult.js'

export default {
  props: {
    gid: {
      type: String
    },
    // 组件渲染配置信息
    opts: {
      type: Object
    },
    // 参数，如{id:'1345362334482731423'}，{treeNodeId:'1345362334482731423'}
    params: {
      type: Object,
      default() {
        return {}
      }
    },
    // 变量
    vars: {
      type: Object,
      default() {
        return {}
      }
    },
    entityDataReader: {
      type: Object,
      default() {
        return new EntityDataReaderInfo()
      }
    }
  },
  data() {
    return {
      resultSet: {
        data: [],
        // 解析之后的resultMapping，值为data中对应的列名
        resultMapping: {
          // 头像url
          // avatarUrl: 'avatarUrl',
          // title: 'name',
          // content: 'code',
          // description: 'description'
        },
        _isShow: true,
      },
      // 用于绑定事件的控件
      glRefControls: {},
      // 用于定义组件变量
      glVars: {},
      glType: 'component'
    }
  },
  destroyed() {
    this.$_clearRefControl()
  },
  methods: {
    $_doAction(action, data, callback) {
      let that = this
      if (!action) {
        if (typeof callback === 'function') {
          console.log('geelato-ui-ant > mixin.js > $_doAction() > End callback of $_doAction.')
          callback(action, data)
        }
        console.log('geelato-ui-ant > mixin.js > $_doAction() > End $_doAction.')
        return
      }
      if (typeof action !== 'object' || !action.fn) {
        console.warn('geelato-ui-ant > mixin.js > $_doAction() > 无效的action: ', action)
        return
      }
      // let content = Object.values(that.$refs.$content.$refs)[0]
      let ctx = undefined
      if (action.ctx === 'opener') {
        ctx = that.opener
      } else if (action.ctx === 'modal') {
        ctx = that.modal
      } else if (action.ctx === 'content') {
        console.log('geelato-ui-ant > mixin.js > $_doAction() > that.$refs for content >', that.$refs)
        ctx = that.$refs.$content
      } else if (action.ctx === 'self' || action.ctx === 'this') {
        ctx = that
      } else {
        ctx = that.$gl.utils.eval(action.ctx)
      }

      if (typeof ctx[action.fn] !== 'function') {
        console.error('geelato-ui-ant > mixin.js > $_doAction() > fail, no fn "' + action.fn + '" in ctx:', ctx)
        return
      }
      let promise = undefined
      try {
        console.log('geelato-ui-ant > mixin.js > $_doAction() > fn:', action.fn, 'start >>>>>>>>>>>>>>>>>>>>>>>>')
        let convertedData = data
        if (!action.dataMapping) {
          console.log('geelato-ui-ant > mixin.js > $_doAction() > fn:', action.fn + ' for action.dataMapping is "' + action.dataMapping + '",set data as convertedData(the second parameter of fn):', data)
        } else {
          // 转换数据
          convertedData = that.$gl.api.entityDataMappingHandler(data, action.dataMapping)
          console.log('geelato-ui-ant > mixin.js > $_doAction() > fn:', action.fn, 'by action.dataMapping:', action.dataMapping, 'and data: ', data, 'convertedData:', convertedData)
        }
        console.log('geelato-ui-ant > mixin.js > $_doAction() > fn:', action.fn + '(params,convertedData):', action.params, convertedData)
        // 执行方法
        promise = ctx[action.fn](action.params, convertedData)
        console.log('geelato-ui-ant > mixin.js > $_doAction() > fn:', action.fn, 'return promise: ', promise)
        console.log('geelato-ui-ant > mixin.js > $_doAction() > fn:', action.fn, "end <<<<<<<<<<<<<<<<<<<<<<<<")
      } catch (e) {
        console.error('geelato-ui-ant > mixin.js > $_doAction() > fn:', action.fn, '.e: ', e)
      }
      // let promise = ctx[action.fn](action.params, data, content)
      if (promise && typeof promise.then === 'function') {
        promise.then(function (data) {
          that.$emit('doAction', new ActionResult({fn: action.fn, code: '0', message: '操作成功', data: data}))
          console.log('geelato-ui-ant > mixin.js > $_doAction() > fn:', action.fn, 'invoke promise then() ', promise.then, data)
          that.$_doAction(action.then, data, callback)
        }).catch(function (data) {
          that.$emit('doAction', new ActionResult({fn: action.fn, code: '-1', message: '操作失败', data: data}))
          that.$_doAction(action.fail, data, callback)
        })
      } else {
        that.$_doAction(action.then, data, callback)
      }
    },
    $_delete(params, data) {
      let that = this
      return new Promise((resolve, reject) => {
        if (typeof data.preDelete === "object") {
          that.$gl.api.delete(data.preDelete.entity, data.preDelete.query, data.biz).then(function (res) {
            that.$gl.api.delete(data.entity, data.query, data.biz).then(function (res2) {
              if (typeof that.$_onDeleted === "function") {
                that.$_onDeleted(params, data)
              }
            })
          })
        } else {
          that.$gl.api.delete(data.entity, data.query, data.biz).then(function (res) {
            if (typeof that.$_onDeleted === "function") {
              that.$_onDeleted(params, data)
            }
          })
        }
      })
    },
    $_openModal(params, data) {
      if (!params.body.props) {
        params.body.props = {}
      }
      Object.assign(params.body.props, data)
      this.$gl.ui.openModal(this, params)
    },

    $_generateRefControl(componentName) {
      for (let i in this.$refs) {
        this.glRefControls[i] = this.$refs[i].length !== undefined ? this.$refs[i][0] : this.$refs[i]
        // 子组件中存在mounted时，未生成refs情况，尝试获取
        if (this.glRefControls[i] && typeof this.glRefControls[i].$_generateRefControl === 'function') {
          this.glRefControls[i].$_generateRefControl('子组件初始化refs')
        }
      }
      console.log(`geelato-ui-ant > mixin > $_generateRefControl() > [${componentName}] $refs: `, this.$refs)
      console.log(`geelato-ui-ant > mixin > $_generateRefControl() > [${componentName}] glRefControls: `, this.glRefControls)
      return this.glRefControls
    },
    $_clearRefControl() {
      for (let i in this.$refs) {
        delete this.glRefControls[i]
      }
      console.log('geelato-ui-ant > mixin > $_clearRefControl() > after clear, $refs: ', this.$refs)
      console.log('geelato-ui-ant > mixin > $_clearRefControl() > after clear, glRefControls: ', this.glRefControls)
    },
    $_getRefControlByGid(gid) {
      if (!this.glRefControls[gid]) {
        // 未初始化，则先进行初始化
        this.$_generateRefControl('获取不到，先进行初始化refs')
      }
      // if (!this.glRefControls && Object.keys(this.glRefControls).length === 0) {
      //   // 未初始化，则先进行初始化
      //   this.$_generateRefControl('获取不到，先进行初始化refs')
      // }
      return this.glRefControls[gid]
    },
    $_showRefControlByGid(gid) {
      const control = this.$_getRefControlByGid(gid)
      if (control) {
        if (!('_defaultStyleDisplay' in control.$data)) {
          control.$data['_defaultStyleDisplay'] = control.$el.style.display
        }
        control.$el.style.display = control.$data['_defaultStyleDisplay']
      } else {
        console.warn(`geelato-ui-ant > mixin > $_showRefControlByGid() > control not found by Gid:`, gid)
      }
    },
    $_hideRefControlByGid(gid) {
      const control = this.$_getRefControlByGid(gid)
      if (control) {
        if (!('_defaultStyleDisplay' in control.$data)) {
          control.$data['_defaultStyleDisplay'] = control.$el.style.display
        }
        control.$el.style.display = 'none'
      } else {
        console.warn(`geelato-ui-ant > mixin > $_hideRefControlByGid() > control not found by Gid:`, gid)
      }
    },
    // $_getControlRef(gid) {
    //   if (this.glRefControls && Object.keys(this.glRefControls).length === 0) {
    //     // 未初始化，则先进行初始化
    //     this.$_generateRefControl()
    //   }
    //   return this.glRefControls[gid]
    // },
    /**
     * 触发显示组件事件
     */
    $_show() {
      this._isShow = true
      this.$emit('display', {action: 'show', isShow: this._isShow})
    },
    /**
     * 触发隐藏组件事件
     */
    $_hide() {
      this._isShow = false
      this.$emit('display', {action: 'hide', isShow: this._isShow})
    },
    /**
     * 触发切换显示、隐藏组件事件
     */
    $_toggle() {
      this._isShow = !this._isShow
      this.$emit('display', {action: 'toggle', isShow: this._isShow})
    },
    $_sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },
    /**
     *  执行脚本
     *  主要用于做字段值的动态计算，如将1、0转成是、否，字段内容合并形成新字段等
     */
    $_runJs(jsExpression) {
      this.$gl.utils.findCru
      return this.$gl.utils.runJs(jsExpression, this.$_ctxLoader())
    },
    $_ctxLoader() {
      let vars = {}
      Object.assign(vars, this.glVars, this.vars)
      return {vars: vars, params: this.params}
    }
  }
}
