<!--
  TODO 指定字段创建之后，则不允许修改；checkbox必填，checkbox未设置时报错
-->
<template>
  <div>
    <a-alert :showIcon="true" message="验证出错" type="error" v-if="Object.keys(errorItems).length>0">
      <p slot="description">
        <span v-for="errorItem in errorItems">{{errorItem}}</span>
      </p>
    </a-alert>
    <gl-form-item v-if="refresh" ref="magicFormItem" :rows="layout.rows" :properties="properties" :form="form"
                  :loadedData="loadedData"
                  @propertyUpdate="onPropertyUpdate" @loadRefData="onLoadRefData"></gl-form-item>
  </div>
</template>

<script>
  import GlFormItem from './GlFormItem'
  import mixin from '../../mixin'
  import utils from '../../utils'

  let GEELATO_SCRIPT_PREFIX = 'gs:'
  let REGEXP_FORM = /gs[\s]*:[\s]*\$ctx\.form\.[a-zA-Z]+[a-zA-Z0-9]*/g;
  let REGEXP_CTX = /\$ctx/g
  let REGEXP_DEPEND_PROPERTY = /\$ctx\.[a-zA-Z]+/g
  let CONST_GQL_PARENT = '$parent'

  export default {
    name: "GlForm",
    mixins: [mixin],
    components: {GlFormItem},
    data() {
      return {
        init: false,
        // 最终获取的表单数据取，单向，从控件中获取，key为propertyName的名或从query中传入的key（默认为propertyName）
        form: {},
        defaultEntity: this.opts.defaultEntity,
        // 指定查询的字段，默认为按id查询，即为['id']
        queryFields: this.opts.queryFields || ['id'],
        layout: this.opts.layout,
        properties: this.opts.properties,
        // key为field，value为propertyName，包括了field与propertyName一致、不一致的情况
        fieldPropertyNameMap: {},
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
        refresh: true,
        validatingCount: 0
      }
    },
    created() {

    },
    mounted() {
      console.log('geelato-ui-ant > gl-form > mounted() > opts:', this.opts)
      console.log('geelato-ui-ant > gl-form > mounted() > query:', this.query)
      this.reset(this.opts)
    },
    methods: {
      reset(opts, query) {
        if (opts) {
          let options = opts
          this.properties = options.properties
          this.layout = options.layout
          this.defaultEntity = options.defaultEntity
          this.queryFields = options.queryFields || ['id']
          this.ds = options.ds
          this.vars = options.vars
          this.dsBeDependentOn = {}
          this.init = false
        }
        this.initConvertData(query || this.query)
        this.loadInitData(query || this.query)
        this.forceRefresh()
      },
      /**
       * 1、将简化的配置信息转换成完整的配置信息，如只设置了email类型，则将默认增加email验证规则
       * 2、转换并设置一些默认值
       * 3、分析数据源依赖
       *  */
      initConvertData(query) {
        let that = this
        for (let propertyName in this.properties) {
          // 设置一些默认值，添加默认配置等
          let property = this.properties[propertyName]
          // identifier 在form对象中的唯一标识
          property.identifier = propertyName
          // init props
          property.props = property.props || {}
          // 未设置实体时，默认为defaultEntity
          property.entity = property.entity || this.defaultEntity
          property.field = property.field || propertyName
          that.fieldPropertyNameMap[property.field] = propertyName
          // property.name = property.field
          // !!!需采用vm.$set的方式来设置值，确保值变化可被检测 @see https://cn.vuejs.org/v2/guide/reactivity.html#检测变化的注意事项
          // 若query已存在属性值，则以query的值为准
          if (query && propertyName in query) {
            that.$set(that.form, propertyName, query[propertyName])
            // 更新属性中的值
            property.value = query[propertyName]
            // that.$set(property, 'value', query[propertyName])
          } else {
            that.$set(that.form, propertyName, property.value = property.value || property.props.defaultValue || '')
            // 如果值还为空，则试着以defaultIndex指定的值来进行设置，如select控件
            if (!that.form[propertyName] && property.data && property.data.length > 0) {
              let dataIndex = property.props.defaultActiveIndex || 0
              that.$set(that.form, propertyName, property.data[dataIndex].value)
            }
          }
          // this.form[key] = property.value === undefined ? '' : property.value
          // 依据字段类型，自动构建字段验证规则信息，兼容semantic ui form validate
          if (property.control === 'email') {
            if (property.rules) {
              property.rules['email'] = true
            } else {
              property.rules = {email: true}
            }
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
                // console.log('geelato-ui-ant > dependPropertyName>', dependPropertyName, propertyName, that.dsBeDependentOn)
              })
            }
          }
        }
        this.init = true
        console.log('geelato-ui-ant > gl-form > initConvertData() > that.form: ', JSON.stringify(that.form))
      },
      // 加载远程的初始化数据，如字典信息
      loadInitData(query) {
        // 加载主实体数据
        let that = this
        // console.log('geelato-ui-ant > gl-form > Index.vue >loadInitData() > query:', query)
        // console.log('geelato-ui-ant > gl-form > Index.vue >loadInitData() > queryFields:', that.queryFields)
        // 一般地，若未指定queryFields，则condition 为{id: that.form.id}
        let condition = {}
        let isValidCondition = false
        for (let i in this.queryFields) {
          let field = this.queryFields[i]
          condition[field] = that.form[field]
          if (condition[field]) {
            isValidCondition = true
          } else {
            console.log('geelato-ui-ant > gl-form > Index.vue > loadInitData() > 无效的查询参数信息，字段field:\'' + field + '\'，查询条件condition[field]:', condition[field] || '空', '。')
          }
        }
        if (isValidCondition) {
          let fieldNameAry = []
          for (let propertyName in that.properties) {
            let property = that.properties[propertyName]
            // 过滤不需要保存到服务端的属性
            if (property.isServerSaveIgnore === true) {
              continue
            }
            fieldNameAry.push(property.field || propertyName)
          }
          let fieldNames = fieldNameAry.join(',')
          // console.log('geelato-ui-ant > loadInitData() > res>', that.defaultEntity, condition, fieldNames)
          that.$gl.api.query(that.defaultEntity, fieldNames, condition, true).then(function (res) {
            let resForm = res.data && res.data.length > 0 ? res.data[0] : {}
            for (let field in resForm) {
              let propertyName = that.fieldPropertyNameMap[field]
              // 更新表单结果值
              that.$set(that.form, propertyName, resForm[field])
              // 更新属性中的值
              let property = that.properties[that.fieldPropertyNameMap[field]]
              if (property) {
                that.$set(property, 'value', resForm[field])
              }
            }
            that.meta = res.meta
            that.forceRefresh()
          })
        }
        // 加载属性数据，如下拉列表、字典信息等
        for (let propertyName in this.properties) {
          let property = this.properties[propertyName]
          if (property.ds && this.ds[property.ds].lazy !== true) {
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
        // dsConfig 示例格式 为entityDataSource
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
          that.$gl.api.query(dsConfig.entity, dsConfig.fields, params).then(function (res) {
            let property = that.properties[propertyName]
            // 依据数据源的配置，处理返回的数据结果
            that.$gl.api.resultHandler(res, dsConfig.resultMapping)
            that.$set(property, 'data', res.data)
            // 触发级联加载数据
            if (propertyName) {
              that.onLoadRefData({propertyName})
            }
          })
        } else {
          console.error('gl-form > loadData() > 未配置数据源', dataSourceName)
        }
      },
      /**
       * 级联加载数据
       * */
      onLoadRefData({property, propertyName}) {
        let that = this
        // console.log('geelato-ui-ant > gl-form > Index.vue > loadRefData() >', {property, propertyName})
        let propertyNames = that.dsBeDependentOn[propertyName || (property && property.identifier)] || []
        propertyNames.forEach(function (item) {
          let triggerProperty = that.getProperty(item)
          if (triggerProperty) {
            that.loadData(item, triggerProperty, triggerProperty.ds)
          }
        })
      },
      /**
       * 更新状态，强行触发重置表单
       * */
      forceRefresh() {
        this.refresh = false
        this.$nextTick(() => {
          this.refresh = true
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
        // for (let key in that.errorItems) {
        //   delete that.errorItems[key]
        // }
        that.errorItems = {}
        let resultPromiseAry = []
        let verifyPropertyAry = []
        for (let key in that.form) {
          let value = that.form[key]
          let property = that.properties[key]
          if (property) {
            if (property.rules) {
              let rules = {}
              Object.assign(rules, property.rules)

              let verifyOptions = {
                bails: true,
                name: property.title,
                values: {}
              }

              if (property.rules.confirmed) {
                let confirmedName = property.rules.confirmed
                let confirmedProperty = that.properties[confirmedName]
                rules.confirmed = confirmedProperty.title
                verifyOptions.values = confirmedName ? {
                  [confirmedProperty.title]: that.form[confirmedName]
                } : {}
              }
              resultPromiseAry.push(that.$validator.verify(value, rules, verifyOptions))
              verifyPropertyAry.push(property)
            }
          } else {
            console.error('gl-form > validate() > 找不到配置property:', key, that.properties)
          }
        }

        let validateInfoPromise = new Promise((resolve, reject) => {
          Promise.all(resultPromiseAry).then(function (results) {
            let isFail = false
            for (let i = 0; i < results.length; i++) {
              let result = results[i]
              let property = verifyPropertyAry[i]
              if (result.valid === false) {
                that.$set(that.errorItems, property.identifier, result.errors)
                isFail = true
              }
            }
            if (!isFail) {
              resolve({isFail})
            } else {
              reject({isFail})
            }
          })
        })
        return validateInfoPromise
      },
      save() {
        let that = this
        return new Promise((resolve, reject) => {
          that.validate().then(function () {
            let gql = that.getGql()
            console.log('geelato-ui-ant > gl-form > save() > gql:', gql)
            that.$gl.api.saveByGql('', that.getGql()).then(function (res) {
              console.log('geelato-ui-ant > gl-form > save() > res:', res)
              that.$set(that.form, 'id', res.result)
              let result = that.getValues()
              resolve(result)
            })
          }).catch(function (e) {
            // 验证不通过
            console.log('geelato-ui-ant > gl-form > save() > validate fail.')
            console.error('geelato-ui-ant > gl-form > save() > e: ', e)
            reject(e)
          })
        })
      },
      getValue(propertyName) {
        let values = this.getValues()
        return values ? values[propertyName] : ''
      },
      getValues(withEmpty = false) {
        let newForm = {}
        if (withEmpty) {
          Object.assign(newForm, this.form)
        } else {
          // 去掉空值(undefined)
          for (let key in this.form) {
            let value = this.form[key]
            if (value !== undefined) {
              newForm[key] = value
            }
          }
        }
        return newForm
      },
      setValues() {
      },
      getGql() {
        // 找出顶层的实体信息
        let that = this
        let theForm = that.getValues()
        console.log('geelato-ui-ant > gl-form > Index.vue >getGql > form: ', theForm)
        let gql = {}
        genGql(gql, this.defaultEntity, this.properties)

        function genGql(parent, entityName, properties, confirmedEntityProperties) {
          // console.log('geelato-ui-ant > genGql>', parent, entityName, properties)
          parent[entityName] = parent[entityName] || {}
          let toAnalyseProperties = {}
          // 已确认归属实体的属性
          let confirmedProperties = confirmedEntityProperties || {}
          let subEntityNames = []
          for (let propertyName in properties) {
            let property = properties[propertyName]
            // 过滤不需要保存到服务端的属性
            if (property.isServerSaveIgnore === true) {
              continue
            }
            // 转到实体保存时,需取实体的字段名fieldName,而不是配置properties中propertyName
            let fieldName = property.field
            let fieldValue = theForm[propertyName]
            console.log('geelato-ui-ant > gl-form > getGql() > ', property.entity, entityName, property, fieldValue)
            if (property.entity === entityName) {
              // 该实体的直属属性，直接添加
              // 获取表单中填写的值
              // boolean类型的值可以转换成数值的方式表示
              if (typeof fieldValue === 'boolean') {
                if (property.saveAsBoolean) {
                  parent[entityName][fieldName] = fieldValue
                } else {
                  parent[entityName][fieldName] = fieldValue ? 1 : 0
                }
              } else {
                parent[entityName][fieldName] = typeof fieldValue !== 'string' ? fieldValue : fieldValue.replace(REGEXP_CTX, CONST_GQL_PARENT)
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
                // console.log('geelato-ui-ant > 分析**entityName>', entityName, '**property>', property, '之后，**subEntityNames>', subEntityNames)
              }
            }
          }
          let dynamicAnalyseProperties = toAnalyseProperties
          subEntityNames.forEach((subEntityName) => {
            console.log('geelato-ui-ant > gl-form > validate() > getGql() > subEntityNames', subEntityName, subEntityNames, dynamicAnalyseProperties)
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
          // console.log('geelato-ui-ant > parseSubEntity >entityName:', entityName, ',subEntityProperty', subEntityProperty.field)
          if (typeof subEntityProperty.value !== 'string') {
            return undefined
          }
          let dependingPropertyNames = subEntityProperty.value.match(REGEXP_DEPEND_PROPERTY)
          let dependEntities = []
          if (dependingPropertyNames) {
            dependingPropertyNames.forEach((item) => {
              let dependProperty = that.properties[item.substring(5)]
              if (!dependProperty) {
                console.error('geelato-ui-ant > gl-form > getGql() > properties内未配置属性：' + item.substring(5), '，解析依赖：', item, '出错，当前property为：', subEntityProperty)
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
                  // console.log('geelato-ui-ant > dependProperty.entity >', subEntityProperty.entity)
                  dependEntities.push(subEntityProperty.entity)
                }
              }
            })
          }
          return dependEntities
        }

        return gql
      }
      ,

      initFormValue() {

      }
      ,
      onPropertyUpdate({property, val, oval}) {
        this.$set(this.form, property.identifier, val)
        this.$emit('propertyUpdate', {property, val, oval})
      }
    }
  }
</script>

<style>

</style>
