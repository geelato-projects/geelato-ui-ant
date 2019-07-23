<template>
  <div>
    <a-alert :showIcon="true" message="验证出错" type="error" v-if="Object.keys(errorItems).length>0">
      <p slot="description">
        <span v-for="errorItem in errorItems">{{errorItem}}</span>
      </p>
    </a-alert>
    <gl-magic-form-item v-if="refresh" ref="magicFormItem" :rows="layout.rows" :properties="properties" :form="form"
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
        },
        // 表单验证出错的信息
        errorItems: {},
        refresh: true
      }
    },
    created() {

    },
    mounted() {
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
          // this.form = {}
          this.init = false
        }
        this.initConvertData()
        this.loadInitData()
        // this.initUI()

        // 强行触发重置表单
        this.refresh = false
        this.$nextTick(() => {
          this.refresh = true
        })
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
          // identifier 在form对象中的唯一标识
          property.identifier = key
          // 未设置实体时，默认为defaultEntity
          property.entity = property.entity || this.defaultEntity
          property.field = property.field || key
          // property.name = property.field
          // !!!需采用vm.$set的方式来设置值，确保值变化可被检测 @see https://cn.vuejs.org/v2/guide/reactivity.html#检测变化的注意事项
          // 若query已存在属性值，则以query的值为准
          if (that.query && that.query[key]) {
            that.$set(that.form, key, that.query[key])
          } else {
            that.$set(that.form, key, property.value === undefined ? '' : property.value)
          }
          // this.form[key] = property.value === undefined ? '' : property.value
          // 依据字段类型，自动构建字段验证规则信息，基于semantic ui form validate
          if (property.control === 'email' && (!property.rules)) {
            that.properties[key].rules['email'] = true
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
                // console.log('dependPropertyName>', dependPropertyName, propertyName, that.dsBeDependentOn)
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
        // console.log('gl-magic-form > Index > loadInitData > query:', that.query)
        // console.log('gl-magic-form > Index > loadInitData > queryFields:', that.queryFields)
        // 一般地，若未指定queryFields，则condition 为{id: that.form.id}
        let condition = {}
        let isValidCondition = false
        for (let i in this.queryFields) {
          let field = this.queryFields[i]
          condition[field] = that.form[field]
          if (condition[field]) {
            isValidCondition = true
          } else {
            console.error('gl-magic-form > Index > loadInitData > 无效的查询参数信息，字段field:\'' + field + '\'，查询条件condition[field]:', condition[field] || '空', '。')
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
        let that = this
        if (!dataSourceName) {
          return
        }
        // =============================
        // ds 示例格式 为entityDataSource
        // {
        //     entity: 'base_data_city',
        //     lazy: true, // default false
        //     fields: 'name,id',
        //     resultMapping: {},
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
            let property = that.properties[propertyName]
            // 依据数据源的配置，处理返回的数据结果
            that.api.resultHandler(res, dsConfig.resultMapping)
            that.$set(property, 'data', res.data.data)
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
        console.log('gl-magic-form > loadRefData', {property, propertyName})
        let that = this
        let propertyNames = that.dsBeDependentOn[propertyName || property.field] || []
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

        let that = this
        // 清空错误信息
        for (let key in that.errorItems) {
          delete that.errorItems[key]
        }
        for (let key in that.form) {
          let value = that.form[key]
          let property = that.properties[key]
          if (property) {
            if (property.rules) {
              that.$validator.verify(value, property.rules).then(function (result) {
                if (result.valid === false) {
                  // 转换errorItems的内容，replace '{field}'为字段名
                  for (let i in result.errors) {
                    let errorItem = result.errors[i]
                    result.errors[i] = errorItem.replace('{field}', property.title)
                  }
                  that.$set(that.errorItems, key, result.errors)
                }
              })
            }
          } else {
            console.error('找不到配置property:', key, that.properties)
          }
        }
      },
      getValues(withEmpty = false) {
        let newForm = {}
        if (withEmpty) {
          Object.assign(newForm, this.form)
        } else {
          // 去掉空值
          for (let key in this.form) {
            let value = this.form[key]
            if (value) {
              newForm[key] = value
            }
          }
        }
        return newForm
      },
      getGql() {
        // 找出顶层的实体信息
        let that = this
        let theForm = that.getValues()
        console.log('gl-magic-form > Index > getGql > form: ', theForm)
        let gql = {}
        genGql(gql, this.defaultEntity, this.properties)

        function genGql(parent, entityName, properties, confirmedEntityProperties) {
          // console.log('genGql>', parent, entityName, properties)
          parent[entityName] = parent[entityName] || {}
          let toAnalyseProperties = {}
          // 已确认归属实体的属性
          let confirmedProperties = confirmedEntityProperties || {}
          let subEntityNames = []
          for (let propertyName in properties) {
            let property = properties[propertyName]
            // 转到实体保存时,需取实体的字段名fieldName,而不是配置properties中propertyName
            let fieldName = property.field
            let field = theForm[propertyName]
            console.log(property.entity, entityName, property, field)
            if (property.entity === entityName) {
              // 该实体的直属属性，直接添加
              // 获取表单中填写的值
              // boolean类型的值可以转换成数值的方式表示
              if (typeof field === 'boolean') {
                if (property.convert === 'number') {
                  parent[entityName][fieldName] = field ? 1 : 0
                } else {
                  parent[entityName][fieldName] = field
                }
              } else {
                parent[entityName][fieldName] = typeof field !== 'string' ? field : field.replace(REGEXP_CTX, CONST_GQL_PARENT)
              }
              // parent[entityName][propertyName] = typeof property.value !== 'string' ? property.value : property.value.replace(REGEXP_CTX, CONST_GQL_PARENT)
              confirmedProperties[propertyName] = true
            } else {
              toAnalyseProperties[propertyName] = property
              if (!confirmedProperties[propertyName]) {
                // 构建子entityName，便于发起下一次的分析
                let parseSubEntityNames = parseSubEntity(entityName, property)
                if (parseSubEntityNames === undefined) {
                  // 表示简单的字段，不需要解析
                  // confirmedProperties[propertyName] = true
                } else if (parseSubEntityNames.length > 0) {
                  subEntityNames.push(...parseSubEntityNames)
                  confirmedProperties[propertyName] = true
                } else {
                  // 深层级的依赖，当前层级未能解析出来，不能记录到confirmedProperties中。
                }
                // console.log('分析**entityName>', entityName, '**property>', property, '之后，**subEntityNames>', subEntityNames)
              }
            }
          }
          let dynamicAnalyseProperties = toAnalyseProperties
          subEntityNames.forEach((subEntityName) => {
            console.log('subEntityNames', subEntityName, subEntityNames, dynamicAnalyseProperties)
            dynamicAnalyseProperties = genGql(parent[entityName], subEntityName, dynamicAnalyseProperties, confirmedProperties)
          })
          return toAnalyseProperties
        }

        /**
         * TODO 深层依赖的属性，未分析出来时，返回特殊的信息，以便进行一步处理
         * @param entityName
         * @param subEntityProperty
         * @returns {Array}
         */
        function parseSubEntity(entityName, subEntityProperty) {
          // console.log('parseSubEntity >entityName:', entityName, ',subEntityProperty', subEntityProperty.field)
          if (typeof subEntityProperty.value !== 'string') {
            return undefined
          }
          let dependingPropertyNames = subEntityProperty.value.match(REGEXP_DEPEND_PROPERTY)
          let dependEntities = []
          if (dependingPropertyNames) {
            dependingPropertyNames.forEach((item) => {
              let dependProperty = that.properties[item.substring(5)]
              if (!dependProperty) {
                console.error('properties内未配置属性：' + item.substring(5), '，解析依赖：', item, '出错，当前property为：', subEntityProperty)
              } else {
                // 检查依赖的这个实体dependProperty.entity是否是entityName直属子级实体，是的话才加入
                let canBeAdd = true
                // if (typeof dependProperty.value === 'string') {
                //     let parentDependingPropertyNames = dependProperty.value.match(REGEXP_DEPEND_PROPERTY)
                //     if (parentDependingPropertyNames) {
                //         // dependProperty还存在依赖信息，需进一步分析
                //         for (let parentIndex in parentDependingPropertyNames) {
                //             let parentItem = parentDependingPropertyNames[parentIndex]
                //             let parentDependProperty = that.properties[parentItem.substring(5)]
                //             if (!parentDependProperty) {
                //                 console.error('properties内未配置属性：' + parentItem.substring(5), '，解析依赖：', parentItem, '出错，当前property为：', subEntityProperty)
                //             } else {
                //                 // 只要有一个依赖不等于entityName，则不能加入
                //                 if (parentDependProperty.entity !== entityName) {
                //                     canBeAdd = false
                //                     break
                //                 }
                //             }
                //         }
                //     }
                // }
                if (dependProperty.entity != entityName) {
                  canBeAdd = false
                }
                if (canBeAdd) {
                  // console.log('dependProperty.entity >', subEntityProperty.entity)
                  dependEntities.push(subEntityProperty.entity)
                }
              }
            })
          }
          return dependEntities
        }

        return gql
      },
      initFormValue() {

      },
      onPropertyUpdate({property, val, oval}) {
        this.$set(this.form, property.identifier, val)
        // console.log('gl-magic-form > onPropertyUpdate: ', property.identifier, val, oval)
      }
    }
  }
</script>

<style>

</style>
