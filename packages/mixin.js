import utils from './utils'

export default {
  props: {
    api: {
      type: Object,
      default() {
        return this.$gl.api
      }
    },
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
    entityDataSource: {
      type: Object,
      required: true,
      default() {
        return {
          entityName: '',
          fieldNames: '',
          withMeta: false,
          resultMapping: {
            // 头像url
            // avatarUrl: 'http://www.xxx.xxx/xx/xx.png',
            // title: 'name',
            // content: 'code',
            // description: 'description'
          }
        }
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
    loadData(params, dataHandler) {
      let entityDataSource = this.entityDataSource
      this.resultSet.resultMapping = {}
      Object.assign(this.resultSet.resultMapping, this.entityDataSource.resultMapping)
      let gql = {}
      gql[entityDataSource.entityName] = {
        '@fs': entityDataSource.fieldNames || '*'
      }
      Object.assign(gql[entityDataSource.entityName], params || {})
      this.api.queryByGql(gql, entityDataSource.withMeta).then(res => {
        // 返回结果预处理
        // 获取返回结果的列名
        let resultNames = {}
        for (let i in res.data.data) {
          let item = res.data.data[i]
          let resultFieldNameAry = Object.keys(item)
          for (let j in resultFieldNameAry) {
            resultNames[resultFieldNameAry[j]] = resultFieldNameAry[j]
          }
          break
        }
        // 先找出需处理的列mapping，e.g. [{avatar:'https://xxxxx/xx/xx.jpg'}]
        let toParseMappingItems = []
        console.log('toParseMappingItems>', toParseMappingItems)
        for (let key in entityDataSource.resultMapping) {
          let field = entityDataSource.resultMapping[key]
          let resultName = resultNames[field]
          if (!resultName) {
            toParseMappingItems.push({key: key, value: field})
            this.resultSet.resultMapping[key] = key
          }
        }
        // 如增加静态的列，列值格式化、列值组合等
        for (let i in res.data.data) {
          let dataItem = res.data.data[i]
          for (let j in toParseMappingItems) {
            let mappingItem = toParseMappingItems[j]
            dataItem[mappingItem.key] = utils.eval(mappingItem.value, dataItem)
          }
        }

        console.log('res>', res)
        dataHandler(res)
      })
    }
  }
}
