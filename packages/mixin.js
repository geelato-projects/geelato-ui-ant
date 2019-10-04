// import utils from './utils'
import EntityDataReader from './EntityDataReader'

export default {
  props: {
    // api: {
    //   type: Object,
    //   default() {
    //     return this.$gl.api
    //   }
    // },
    // 组件渲染配置信息
    opts: {
      type: Object,
      required: false
    },
    // 表单的查询信息，如{id:'1345362334482731423'}，{treeNodeId:'1345362334482731423'}
    query: {
      type: Object,
      required: false,
      default() {
        return {}
      }
    },
    entityDataReader: {
      type: Object,
      required: false,
      default() {
        return new EntityDataReader()
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
        }
      }
    }
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
        // 转换数据
        let convertedData = that.$gl.api.entityDataMappingHandler(data, action.dataMapping)
        console.log('geelato-ui-ant > mixin.js > $_doAction() > action.dataMapping: ', action.dataMapping, 'data: ', data, 'convertedData: ', convertedData)
        // 执行方法
        promise = ctx[action.fn](action.params, convertedData)
      } catch (e) {
        console.error('geelato-ui-ant > mixin.js > $_doAction() > action: ', action, 'data: ', data, 'e: ', e)
      }
      console.log('geelato-ui-ant > mixin.js > $_doAction() > action: ', action, 'return promise: ', promise)
      // let promise = ctx[action.fn](action.params, data, content)
      if (promise && typeof promise.then === 'function') {
        promise.then(function (data) {
          that.$_doAction(action.then, data, callback)
        }).catch(function (data) {
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
