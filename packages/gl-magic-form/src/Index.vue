<template>
  <div>
    <!--<gl-row type="" v-for="(row,rowIndex) in rows" :key="rowIndex">-->
    <!--<gl-cell v-bind="cell" v-for="(cell,cellIndex) in row.cols" :key="cellIndex">-->
    <!--&lt;!&ndash;{{rowIndex}}-{{cellIndex}}-{{cell}}&ndash;&gt;-->
    <!--<gl-label v-if="cell.label" :property="getProperty(cell.field)"></gl-label>-->
    <!--<gl-control v-if="!cell.label" :form="form" :property="getProperty(cell.field)"></gl-control>-->
    <!--</gl-cell>-->
    <!--</gl-row>-->
    <gl-magic-form-item ref="magicFormItem" :rows="layout.rows" :properties="properties" :form="form"
                        :loadedData="loadedData"
                        @propertyUpdate="onPropertyUpdate" @loadRefData="onLoadRefData"></gl-magic-form-item>
  </div>
</template>

<script>
  import GlMagicFormItem from './GlMagicFormItem'
  import mixin from '../../mixin'
  import utils from '../../utils'

  let GEELATO_SCRIPT_PREFIX = 'gs:'
  let REGEXP_FORM = /gs[\s]*:[\s]*\$ctx\.form\.[a-zA-Z]+[a-zA-Z0-9]*/g;
  let REGEXP_CTX = /\$ctx/g
  let REGEXP_DEPEND_PROPERTY = /\$ctx\.[a-zA-Z]+/g
  let CONST_GQL_PARENT = '$parent'

  export default {
    name: "GlMagicForm",
    mixins: [mixin],
    components: {GlMagicFormItem},
    data() {
      return {
        init: false,
        form: {},
        defaultEntity: this.opts.defaultEntity,
        // 指定查询的字段，默认为按id查询，即为['id']
        queryFields: this.opts.queryFields ? this.opts.queryFields : ['id'],
        layout: this.opts.layout,
        properties: this.opts.properties,
        ds: this.opts.ds,
        vars: this.opts.vars,
        // 数据源被依赖，格式为：被依赖的属性:[依赖的属性,依赖的属性...]
        dsBeDependentOn: {},
        loadedData: {
          id: utils.uuid(16),
          payload: undefined
        }
      }
    },
    mounted() {
      // for (let propertyName in this.properties) {
      //   let property = this.properties[propertyName]
      //   // 设置property name
      //   property.name = propertyName
      //   // this.$set(this.form, propertyName)
      // }
      // console.log('this.form>', this.form)
      this.reset(this.opts)
    },
    methods: {
      reset(opts) {
        if (opts) {
          let options = opts
          this.properties = options.properties
          this.layout = options.layout
          // this.rows = options.rows
          this.defaultEntity = options.defaultEntity
          this.ds = options.ds
          this.vars = options.vars
          this.dsBeDependentOn = {}
          this.form = {}
          this.init = false
        }
        this.initConvertData()
        this.loadInitData()
        // this.initUI()
      },
      /**
       * 1、将简化的配置信息转换成完整的配置信息，如只设置了email类型，则将默认增加email验证规则
       * 2、转换并设置一些默认值
       * 3、分析数据源依赖
       *  */
      initConvertData() {
        let that = this
        for (let key in this.properties) {
          // 设置一些默认值，添加默认配置等
          let property = this.properties[key]
          // identifier 是 semantic ui form validate 需用到的属性
          property.identifier = key
          // 未设置实体时，默认为defaultEntity
          property.entity = property.entity || this.defaultEntity
          property.field = property.field || key
          property.name = property.field
          // !!!需采用vm.$set的方式来设置值，确保值变化可被检测 @see https://cn.vuejs.org/v2/guide/reactivity.html#检测变化的注意事项
          // 若query已存在属性值，则以query的值为准
          if (that.query && that.query[key]) {
            this.$set(this.form, key, that.query[key])
          } else {
            this.$set(this.form, key, property.value === undefined ? '' : property.value)
          }
          // this.form[key] = property.value === undefined ? '' : property.value
          // 依据字段类型，自动构建字段验证规则信息，基于semantic ui form validate
          if (property.control === 'email' && (!property.rules)) {
            property.rules = []
            this.properties[key].rules.push({type: 'email'})
          }
        }
        // 3、构建数据源依赖 dsBeDependentOn e.g. {provinceCode: 'gs:$ctx.form.province'}
        for (let propertyName in this.ds) {
          let propertyDs = this.ds[propertyName]
          for (let paramName in propertyDs.params) {
            let paramValue = propertyDs.params[paramName]
            if (REGEXP_FORM.test(paramValue)) {
              paramValue.match(REGEXP_FORM).forEach(function (item) {
                let dependPropertyName = item.substring(item.lastIndexOf('.') + 1)
                that.dsBeDependentOn[dependPropertyName] = that.dsBeDependentOn[dependPropertyName] || []
                that.dsBeDependentOn[dependPropertyName].push(propertyName)
                console.log('dependPropertyName>', dependPropertyName, propertyName, that.dsBeDependentOn)
              })
            }
          }
        }
        this.init = true
      },
      // 加载远程的初始化数据，如字典信息
      loadInitData() {
        // 加载主实体数据
        let that = this
        console.log('gl-magic-form > Index > loadInitData > query:', that.query)
        console.log('gl-magic-form > Index > loadInitData > queryFields:', that.queryFields)
        // 一般地，若未指定queryFields，则condition 为{id: that.form.id}
        let condition = {}
        let isValidCondition = false
        for (let i in this.queryFields) {
          let field = this.queryFields[i]
          condition[field] = that.form[field]
          if (condition[field]) {
            isValidCondition = true
          } else {
            console.error('gl-magic-form > Index > loadInitData > 无效的查询条件信息（field: ', field, '，condition[field]: ', condition[field], '）。')
          }
        }
        if (isValidCondition) {
          let fieldNames = utils.joinProperties(that.form)
          // console.log('res>', that.defaultEntity, condition, fieldNames)
          that.api.query(that.defaultEntity, condition, fieldNames, true).then(function (res) {
            let resForm = res.data.data && res.data.data.length > 0 ? res.data.data[0] : {}
            for (let key in resForm) {
              // form需设置成响应式
              that.$set(that.form, key, resForm[key])
            }
            that.meta = res.meta
          })
        }
        // 加载属性数据，如下拉列表、字典信息等
        for (let propertyName in this.properties) {
          let property = this.properties[propertyName]
          // && this.ds[property.ds].lazy !== true
          if (property.ds) {
            this.loadData(propertyName, property, property.ds)
          }
        }
      },
      /**
       * 加载数据源
       * */
      loadData(propertyName, property, dataSourceName) {
        console.log(propertyName, property, dataSourceName)
        let that = this
        if (!dataSourceName) {
          return
        }
        // =============================
        // ds 示例格式
        // {
        //     entity: 'basedata_city',
        //     lazy: true, // default false
        //     fields: 'name text,id value'
        //     params: {
        //         provinceId: 'gs:$ctx.form.province'
        //     }
        // }
        // =============================
        let dsConfig = this.ds[dataSourceName]
        if (dsConfig) {
          let params = {}
          // 格式如：['name text','id value']
          if (dsConfig.params) {
            for (let key in dsConfig.params) {
              let value = dsConfig.params[key]
              params[key] = this.rungs(value)
            }
          }
          that.api.query(dsConfig.entity, params, dsConfig.fields).then(function (res) {
            // console.log('查询数据源 >', dataSourceName, ' res >', res)
            let property = that.properties[propertyName]
            that.$set(property, 'data', res.data.data)
            // that.$set(property, 'value', res.data.data[property.defal].value : that.properties[propertyName].value)
            // console.log('that.properties>', that.properties)
            // that.$refs.magicFormItem.resetProterty(that.properties[propertyName], 'data', res.data.data)
            // 触发级联加载数据
            that.onLoadRefData({propertyName})
          })
        } else {
          console.error('未配置数据源', dataSourceName)
        }
      },
      /**
       * 级联加载数据
       * */
      onLoadRefData({property, propertyName}) {
        console.log('formIndex > loadRefData', {property, propertyName})
        let that = this
        let propertyNames = that.dsBeDependentOn[propertyName || property.name] || []
        propertyNames.forEach(function (item) {
          let triggerProperty = that.getProperty(item)
          if (triggerProperty) {
            that.loadData(item, triggerProperty, triggerProperty.ds)
          }
        })
      },
      /**
       * gs(geelato script)执行表达式，若非gs表达式则直接返回
       * @param gs gs:$ctx.form.province
       */
      rungs(str) {
        let that = this
        let $ctx = {form: that.getValues(), vars: {}}
        for (let varName in (that.vars || [])) {
          $ctx.vars[varName] = typeof that.vars[varName] === 'object' ? that.vars[varName].value : that.vars[varName]
        }
        if (str.indexOf(GEELATO_SCRIPT_PREFIX) === 0) {
          return utils.eval(str.substring(3), $ctx)
        } else {
          return str
        }
      },
      getProperty(name) {
        if (!name || !this.properties[name]) {
          return {control: 'null', title: ' '}
        }
        return this.properties[name]
      },
      validate() {

      },
      getValues() {
        return this.form
      },
      getGql() {
        return this.form
      },
      initFormValue() {

      },
      onPropertyUpdate({property, val, oval}) {
        this.form[property.name] = val
        console.log(property, val, oval, this.form)
      }
    }
  }
</script>

<style>

</style>
