const GEELATO_SCRIPT_PREFIX = 'js:'
// const REGEXP_FORM = /gs[\s]*:[\s]*\$ctx\.form\.[a-zA-Z]+[a-zA-Z0-9]*/g;
// const REGEXP_FORM = /gs[\s]*:[\s]*\$ctx\.[a-zA-Z0-9]*/g;
const REGEXP_FORM = /[\s]*\$ctx\.[a-zA-Z0-9]*/g;
const REGEXP_CTX = /\$ctx/g
// 前后可有空格，如" ${app.appName} "
// const REGEXP_VAR_G = /^[\s]*\$[\s]*\{[\s]*(component|page|platform|app|ctx)\.[a-zA-Z0-9]*[\s]*\}[\s]*$/g
const REGEXP_VAR_G = /ctx\.[a-zA-Z0-9]+\.[a-zA-Z]+/g

const REGEXP_DEPEND_PROPERTY = /\$ctx\.[a-zA-Z]+/g
const CONST_GQL_PARENT = '$parent'

export default class EntityDataReaderHandler {

  /**
   * 如果只是加载一个实体的数据，可以不用传dataMountTarget，实例化之后，调用loadData({property,callback})
   * @param $gl geelato-ui-ant的引用
   * @param ds entityDataReaderInfo Map
   * @param dataMountTarget 加载后的数据，绑定的目标属性properties 对象格式或数组格式，property至少需包括两个字段：{gid:xxx,dsName:yyy}
   * @param ctxLoader 一个函数，用于每次执行时动态加载当前上下文信息值的，该函数返回结果为一个上下文对象{}
   */
  constructor({$gl, ds, dataMountTargetProperties, ctxLoader}) {
    this.$gl = $gl
    this.ds = ds
    this.ctxLoader = ctxLoader || function () {
      return {}
    }
    this.properties = dataMountTargetProperties
    this.dsBeDependentOn = {}
    if (!ds) {
      console.error('geelato-ui-ant > EntityDataReaderHandler.js > constructor() > {ds} 不允许为空！', {ds})
    }
    this.parseDependent()
  }

  /**
   *  解析数据源依赖，以便于级联加载数据
   */
  parseDependent() {
    let that = this
    // 构建数据源依赖 dsBeDependentOn e.g. {provinceCode: 'js:ctx.form.province'}
    // dsName与 propertyName 一致
    for (let dsName in that.ds) {
      let propertyDs = that.ds[dsName]
      for (let paramIndex in propertyDs.params) {
        let param = propertyDs.params[paramIndex]
        console.log('geelato-ui-ant > EntityDataReaderHandler.js > parseDependent() > parsing dependent of dsName "', dsName, '" by param:', param.value)
        // param.value中可能存在多个变量
        if (REGEXP_VAR_G.test(param.value)) {
          param.value.match(REGEXP_VAR_G).forEach(function (item) {
            let dependPropertyName = item.substring(item.lastIndexOf('.') + 1, item.length)
            let beBeDependentProperty = that.getPropertyByDsName(dsName)
            console.log('geelato-ui-ant > EntityDataReaderHandler.js > parseDependent() > parsed dependent of dsName "', dsName, '" beBeDependentProperty:', JSON.parse(JSON.stringify(beBeDependentProperty)), beBeDependentProperty.gid, that.dsBeDependentOn[dependPropertyName])
            that.dsBeDependentOn[dependPropertyName] = that.dsBeDependentOn[dependPropertyName] || []
            that.dsBeDependentOn[dependPropertyName].push(beBeDependentProperty.gid)
            console.log('geelato-ui-ant > EntityDataReaderHandler.js > parseDependent() > dependPropertyName:', dependPropertyName, ', dsName:', dsName)
          })
        }
      }
    }
    console.log('geelato-ui-ant > EntityDataReaderHandler.js > parseDependent() > after parse, dsBeDependentOn:', that.dsBeDependentOn)
  }

  execute() {
    console.log('geelato-ui-ant > EntityDataReaderHandler.js > execute() > ds:', this.ds, 'properties', this.properties)
    // 加载属性数据，如下拉列表、字典信息等
    for (let propertyNameOrIndex in this.properties) {
      let property = this.properties[propertyNameOrIndex]
      console.log('geelato-ui-ant > EntityDataReaderHandler.js > execute() > propertyNameOrIndex', propertyNameOrIndex, property)
      if (property.dsName && this.ds[property.dsName].lazy !== true) {
        this.loadData({property})
      }
    }
  }

  /**
   * 加载数据源
   *  @param property 加载数据之后
   * */
  loadData({property, callback, ctx = this.ctxLoader()}) {
    let that = this
    let dsName = property.dsName
    if (!dsName) {
      if (typeof callback === 'function') {
        callback(property, property.data)
      }
      return
    }
    let entityDataReaderInfo = this.ds[dsName]
    if (entityDataReaderInfo) {
      let kvs = {}
      // 格式如：[{name:'code',cop:'contains',value:'IUEJHD'}]
      // 解析、求解最终参数值
      if (entityDataReaderInfo.params && entityDataReaderInfo.params.length > 0) {
        for (let paramIndex in entityDataReaderInfo.params) {
          let param = entityDataReaderInfo.params[paramIndex]
          // let property = this.getPropertyByName(param.name)
          // console.log('geelato-ui-ant > EntityDataReaderHandler.js > loadData() > property:', property, ', param:', param)
          kvs[param.name + '|' + (param.cop || 'eq')] = this.$gl.utils.runJs(param.value, ctx)
        }
      }
      if (entityDataReaderInfo.order) {
        Object.assign(kvs, {'@order': entityDataReaderInfo.order})
      }
      console.log('geelato-ui-ant > EntityDataReaderHandler.js > loadData() > query params:', kvs)
      that.$gl.api.query(entityDataReaderInfo.entity, entityDataReaderInfo.fields, kvs).then(function (res) {
        // 依据数据源的配置，处理返回的数据结果
        that.$gl.api.resultHandler(res, entityDataReaderInfo.resultMapping)
        that.$gl.globalVue.set(property, 'data', res.data)
        // console.log('geelato-ui-ant > EntityDataReaderHandler.js > loadData() > set property.data=', res.data)
        // 触发级联加载数据
        if (dsName) {
          that.onLoadRefData({property})
        }
        if (typeof callback === 'function') {
          callback(property, res.data)
        }
      })
    } else {
      console.error('geelato-ui-ant > EntityDataReaderHandler.js > loadData() > 未配置数据源', dsName, ',this.ds:', this.ds)
    }
  }

  /**
   * 级联加载数据
   * */
  onLoadRefData({property}) {
    let that = this
    console.log('geelato-ui-ant > EntityDataReaderHandler.js > onLoadRefData() > find triggeringDsNameDsNames by property:', property, ',current dsBeDependentOn:', that.dsBeDependentOn)
    if (!property) {
      return
    }
    let triggeringDsNameDsNames = that.dsBeDependentOn[property.gid] || []
    console.log('geelato-ui-ant > EntityDataReaderHandler.js > onLoadRefData() > found triggeringDsNameDsNames:', triggeringDsNameDsNames, ', and ', triggeringDsNameDsNames.length > 0 ? 'trigger' : 'do not trigger')
    triggeringDsNameDsNames.forEach(function (triggeringDsName) {
      let triggeringProperty = that.getPropertyByName(triggeringDsName)
      console.log('geelato-ui-ant > EntityDataReaderHandler.js > onLoadRefData() > found triggeringDsNameDsNames, try to load data by triggeringProperty:', triggeringProperty)
      if (triggeringProperty) {
        that.loadData({property: triggeringProperty})
      }
    })
  }

  getPropertyByName(name) {
    // console.log('geelato-ui-ant > EntityDataReaderHandler.js > getPropertyByName() > name:', name, ' in properties:', this.properties)
    const defaultProperty = {control: 'null', title: ' '}
    if (!this.properties || typeof  this.properties !== 'object' || !name) {
      return defaultProperty
    }

    if (this.properties.length === undefined) {
      return this.properties[name]
    } else {
      for (let index in this.properties) {
        let property = this.properties[index]
        if (property.gid === name) {
          return property
        }
      }
    }
    return defaultProperty
  }

  getPropertyByDsName(dsName) {
    console.log('geelato-ui-ant > EntityDataReaderHandler.js > getPropertyByDsName() > dsName:', dsName, ' in properties:', this.properties)
    const defaultProperty = {control: 'null', title: ' '}
    if (this.properties && typeof  this.properties === 'object' && dsName) {
      for (let propertyNameOrIndex in this.properties) {
        let property = this.properties[propertyNameOrIndex]
        console.log('geelato-ui-ant > EntityDataReaderHandler.js > getPropertyByDsName() > dsName:', dsName, ', property:', property)
        if (property.dsName === dsName) {
          console.log('geelato-ui-ant > EntityDataReaderHandler.js > getPropertyByDsName() > find by dsName:', dsName, ', the property:', property)
          return property
        }
      }
    }

    console.log('geelato-ui-ant > EntityDataReaderHandler.js > getPropertyByDsName() > not found by dsName, user defaultProperty:', defaultProperty)
    return defaultProperty
  }

}
