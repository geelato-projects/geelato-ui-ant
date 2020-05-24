// import utils from './utils'
import EntityDataReaderInfo from './EntityDataReaderInfo'
import ActionResult from './ActionResult.js'
// import utils from './utils.js'

export default {
  props: {
    gid: {
      type: String
    },
    // 组件渲染配置信息
    opts: {
      type: Object
    },
    // 表单的查询信息，如{id:'1345362334482731423'}，{treeNodeId:'1345362334482731423'}
    // query: {
    //   type: Object,
    //   required: false,
    //   default() {
    //     return {}
    //   }
    // },
    // 参数，如{id:'1345362334482731423'}，{treeNodeId:'1345362334482731423'}
    params: {
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
        // 用于绑定事件的控件
        controlRefs: {}
      }
    }
  },
  destroyed() {
    this.clearControlRef()
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
    openModal(params, data) {
      if (!params.body.props) {
        params.body.props = {}
      }
      Object.assign(params.body.props, data)
      this.$gl.ui.openModal(this, params)
    },
    generateControlRef() {
      for (let i in this.$refs) {
        this.controlRefs[i] = this.$refs[i].length !== undefined ? this.$refs[i][0] : this.$refs[i]
      }
      console.log('geelato-ui-ant > mixin > generateControlRef() > $refs,controlRefs: ', this.$refs, this.controlRefs)
    },
    clearControlRef() {
      for (let i in this.$refs) {
        delete this.controlRefs[i]
      }
      console.log('geelato-ui-ant > mixin > clearControlRef() > $refs,controlRefs: ', this.$refs, this.controlRefs)
    },
    $_getRefByGid(gid) {
      return this.controlRefs[gid]
    }
    // loadData(params, dataHandler) {
    //   let entityDataReader = this.entityDataReader
    //   this.resultSet.resultMapping = {}
    //   Object.assign(this.resultSet.resultMapping, this.entityDataReader.resultMapping)
    //   let gql = {}
    //   gql[entityDataReader.entity] = {
    //     '@fs': entityDataReader.fields || '*'
    //   }
    //   Object.assign(gql[entityDataReader.entity], params || {})
    //   this.$gl.api.queryByGql(gql, entityDataReader.withMeta).then(res => {
    //     // 返回结果预处理
    //     // 获取返回结果的列名
    //     let resultNames = {}
    //     for (let i in res.data.data) {
    //       let item = res.data.data[i]
    //       let resultFieldNameAry = Object.keys(item)
    //       for (let j in resultFieldNameAry) {
    //         resultNames[resultFieldNameAry[j]] = resultFieldNameAry[j]
    //       }
    //       break
    //     }
    //     // 先找出需处理的列mapping，e.g. [{avatar:'https://xxxxx/xx/xx.jpg'}]
    //     let toParseMappingItems = []
    //     // console.log('geelato-ui-ant > toParseMappingItems>', toParseMappingItems)
    //     for (let key in entityDataReader.resultMapping) {
    //       let field = entityDataReader.resultMapping[key]
    //       let resultName = resultNames[field]
    //       if (!resultName) {
    //         toParseMappingItems.push({key: key, value: field})
    //         this.resultSet.resultMapping[key] = key
    //       }
    //     }
    //     // 如增加静态的列，列值格式化、列值组合等
    //     for (let i in res.data.data) {
    //       let dataItem = res.data.data[i]
    //       for (let j in toParseMappingItems) {
    //         let mappingItem = toParseMappingItems[j]
    //         dataItem[mappingItem.key] = utils.eval(mappingItem.value, dataItem)
    //       }
    //     }
    //     // console.log('geelato-ui-ant > res>', res)
    //     if (typeof dataHandler === 'function') {
    //       dataHandler(res)
    //     }
    //
    //   })
    // }
  }
}
