import selectItems from './base/selectItems.js'

const GEELATO_SCRIPT_PREFIX = 'gs:'
// const REGEXP_FORM = /gs[\s]*:[\s]*\$ctx\.form\.[a-zA-Z]+[a-zA-Z0-9]*/g;
const REGEXP_FORM = /gs[\s]*:[\s]*\$ctx\.[a-zA-Z0-9]*/g;
const REGEXP_CTX = /\$ctx/g
const REGEXP_DEPEND_PROPERTY = /\$ctx\.[a-zA-Z]+/g
const CONST_GQL_PARENT = '$parent'

export default class EntityDataReaderHandler {

  /**
   * @param $gl geelato-ui-ant的引用
   * @param ds entityDataReaderInfo Map
   * @param dataMountTarget 加载后的数据，绑定的目标属性properties 对象格式或数组格式
   * @param ctxLoader 一个函数，用于每次执行时动态加载当前上下文信息值的，返回结果为一个对象{}
   */
  constructor({$gl, ds, dataMountTargetProperties, ctxLoader}) {
    this.$gl = $gl
    this.ds = ds
    this.ctxLoader = ctxLoader || function () {
      return {}
    }
    this.properties = dataMountTargetProperties
    this.dsBeDependentOn = {}
    if (!ds || !dataMountTargetProperties) {
      console.error('geelato-ui-ant > EntityDataReaderHandler.js > constructor() > {ds, dataMountTargetProperties} 不允许为空！', {
        ds,
        dataMountTargetProperties
      })
    }
    this.parseDependent()
  }

  /**
   *  解析数据源依赖，以便于级联加载数据
   */
  parseDependent() {
    let that = this
    // 构建数据源依赖 dsBeDependentOn e.g. {provinceCode: 'gs:$ctx.form.province'}
    // dsName与 propertyName 一致
    for (let dsName in that.ds) {
      let propertyDs = that.ds[dsName]
      for (let paramIndex in propertyDs.params) {
        let param = propertyDs.params[paramIndex]
        console.log('geelato-ui-ant > EntityDataReaderHandler.js > parseDependent() > parsing dependent of dsName "', dsName, '" by param:', param.value)
        if (REGEXP_FORM.test(param.value)) {
          param.value.match(REGEXP_FORM).forEach(function (item) {
            let dependPropertyName = item.substring(item.lastIndexOf('.') + 1)
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
  loadData({property}) {
    let that = this
    let dsName = property.dsName
    if (!dsName) {
      return
    }
    let entityDataReaderInfo = this.ds[dsName]
    if (entityDataReaderInfo) {
      let params = {}
      // 格式如：[{name:'code',cop:'contains',value:'IUEJHD'}]
      // 解析、求解最终参数值
      if (entityDataReaderInfo.params && entityDataReaderInfo.params.length > 0) {
        for (let paramIndex in entityDataReaderInfo.params) {
          let param = entityDataReaderInfo.params[paramIndex]
          // let property = this.getPropertyByName(param.name)
          // console.log('geelato-ui-ant > EntityDataReaderHandler.js > loadData() > property:', property, ', param:', param)
          params[param.name + '|' + param.cop || 'eq'] = this.rungs(param.value)
        }
      }
      that.$gl.api.query(entityDataReaderInfo.entity, entityDataReaderInfo.fields, params).then(function (res) {
        // 依据数据源的配置，处理返回的数据结果
        that.$gl.api.resultHandler(res, entityDataReaderInfo.resultMapping)
        that.$gl.globalVue.set(property, 'data', res.data)
        console.log('geelato-ui-ant > EntityDataReaderHandler.js > loadData() > set property.data=', res.data)
        // 触发级联加载数据
        if (dsName) {
          that.onLoadRefData({property})
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
    console.log('geelato-ui-ant > EntityDataReaderHandler.js > onLoadRefData() > parsing triggeringDsNameDsNames of property:', property)
    if (!property) {
      return
    }
    let that = this
    let triggeringDsNameDsNames = that.dsBeDependentOn[property.gid] || []
    console.log('geelato-ui-ant > EntityDataReaderHandler.js > onLoadRefData() > parsed triggeringDsNameDsNames:', triggeringDsNameDsNames)
    triggeringDsNameDsNames.forEach(function (triggeringDsName) {
      let triggeringProperty = that.getPropertyByName(triggeringDsName)
      console.log('geelato-ui-ant > EntityDataReaderHandler.js > onLoadRefData() > after parse, try to load data by triggeringProperty:', triggeringProperty)
      if (triggeringProperty) {
        that.loadData({property: triggeringProperty})
      }
    })
  }

  /**
   * gs(geelato script)执行表达式，若非gs表达式则直接返回
   * @param gs gs:$ctx.form.province
   * @param $ctx e.g. {form: that.getValues(), vars: {}}
   */
  rungs(str) {
    if (str.indexOf(GEELATO_SCRIPT_PREFIX) === 0) {
      let ctx = this.ctxLoader()
      console.log('geelato-ui-ant > EntityDataReaderHandler.js > rungs() > ctx:', ctx)
      return this.$gl.utils.eval(str.substring(3), ctx)
    } else {
      return str
    }
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
