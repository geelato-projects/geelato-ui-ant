<!--
  提供基础的功能及api接口，不提供保存操作
  动态表单页面，结合配置的字段（包括字段布局信息）进行渲染
-->
<template>
  <div class="ui small compact form">
    <table v-show="layout.type==='table'||!layout.type"
           class="gl-form gl-col-24" style="display:table;table-layout: fixed">
      <thead>
      <tr>
        <th colspan="24">
          <div class="ui error message segment"></div>
        </th>
      </tr>
      </thead>
      <tbody v-if="init">
      <tr v-for="(row,index) in layout.data" :key="index">
        <!--行数据为分组标题，[{'': [24],  $title: '',$style:''}]-->
        <template v-if="row.length===1&&row[0].$title!==undefined">
          <td colspan="24" class="gl-form-group-title" :style="row[0].$style" v-html="row[0].$title">
          </td>
        </template>
        <!--行数据非分组标题-->
        <template v-else>
          <!-- e.g. 行数据 [{name: [4, 8]}, {avatar: [4, 8, 4]}]-->
          <template v-for="(cell) in row" v-if="property=getPropertyByCell(cell)">
            <template v-if="!isHidden(getFieldNameByCell(cell))">
              <!--通过autoRun，执行property.js，以实现设置值、只计状态等-->
              <!--e.g. cell为：{name: [4, 8]}-->
              <td :colspan="Object.values(cell)[0][0]" :rowspan="Object.values(cell)[0][2]" v-show="autoRun(property)">
                <span v-if="property.tips" :title="getPropertyByCell(cell).tips">
                  <a-icon type="info-circle" @click="copyTips(property.tips)"/>
                </span>
                <span class="gl-form-required">{{isRequired(property)?'*':''}}</span>
                {{property.title||getFieldNameByCell(cell)}}&nbsp;
              </td>
              <!--v-if="Object.values(cell)[0][1]" 分组时-- Object.values(cell)[0]的值为[24] -->
              <td :colspan="Object.values(cell)[0][1]" :rowspan="Object.values(cell)[0][2]">
                <template v-if="property.control==='input'">
                  <a-input type="text" :placeholder="property.placeholder" :name="getFieldNameByCell(cell)"
                           v-model="form[getFieldNameByCell(cell)]" :readOnly="isReadonly(property)"
                           :disabled="property.disabled===true"/>
                </template>
                <template v-else-if="property.control==='date'">
                  <a-date-picker @change="onChange" :placeholder="property.placeholder" :name="getFieldNameByCell(cell)"
                                 v-model="form[getFieldNameByCell(cell)]" :readOnly="isReadonly(property)"
                                 :disabled="property.disabled===true"/>
                </template>
                <template v-else-if="property.control==='time'">
                  <a-time-picker use12Hours format="h:mm:ss A" :placeholder="property.placeholder"
                                 :name="getFieldNameByCell(cell)"
                                 v-model="form[getFieldNameByCell(cell)]" :readOnly="isReadonly(property)"
                                 :disabled="property.disabled===true"/>
                </template>
                <template v-else-if="property.control==='textarea'">
                        <textarea rows="5" :placeholder="property.placeholder" :name="getFieldNameByCell(cell)"
                                  v-model="form[getFieldNameByCell(cell)]" :readOnly="isReadonly(property)"
                                  :disabled="property.disabled===true"></textarea>
                </template>
                <template v-else-if="property.control==='checkbox'">
                  <a-checkbox :name="getFieldNameByCell(cell)" v-model="form[getFieldNameByCell(cell)]"
                              :readOnly="isReadonly(property)"
                              :disabled="property.disabled===true">{{property.placeholder}}
                  </a-checkbox>
                </template>
                <template v-else-if="property.control==='radio'">
                  <a-radio-group :defaultValue="property.value" v-model="form[getFieldNameByCell(cell)]">
                    <a-radio v-for="(radioItem,radioItemKey) in property.data" :key="radioItemKey"
                             :value="radioItem.value">{{radioItem.text}}
                    </a-radio>
                  </a-radio-group>
                  {{property.placeholder}}
                  <!--<template v-for="radioItem in property.data">-->
                  <!--<sui-checkbox radio :label="radioItem.text" :name="getFieldNameByCell(cell)"-->
                  <!--v-model="form[getFieldNameByCell(cell)]"-->
                  <!--:value="radioItem.value"-->
                  <!--:readOnly="isReadonly(property)"-->
                  <!--:disabled="property.disabled===true"></sui-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;-->
                  <!--</template>-->

                </template>
                <template v-else-if="property.control==='select'">
                  <a-select :defaultValue="property.value" v-model="form[getFieldNameByCell(cell)]"
                            @change='$set(form,getFieldNameByCell(cell),$event);loadRefData(getFieldNameByCell(cell), "")'
                            :ref="getFieldNameByCell(cell)"
                            :readOnly="isReadonly(property)" :disabled="property.disabled===true">
                    <a-select-option v-for="(selectOption,selectOptionKey) in property.data" :key="selectOptionKey"
                                     :value="selectOption.value">{{selectOption.text}}
                    </a-select-option>
                  </a-select>
                </template>
                <template v-else-if="property.control==='image'">
                  <div class="ui fluid  image">
                    <a class="ui red right corner label" @click="uploadImage">
                      <i class="upload icon"></i>
                    </a>
                    <!--<img class="ui small rounded image" style=""-->
                    <!--src="../../assets/images/avatar/large/jenny.jpg">-->
                  </div>
                  <!--<div class="ui placeholder">-->
                  <!--<a class="ui red right corner label" @click="uploadImage">-->
                  <!--<i class="upload icon"></i>-->
                  <!--</a>-->
                  <!--<div class="rectangular image"></div>-->
                  <!--</div>-->
                </template>
                <template v-else-if="property.control==='email'">
                  <input type="email" :placeholder="property.placeholder" :name="getFieldNameByCell(cell)"
                         v-model="form[getFieldNameByCell(cell)]" :readOnly="isReadonly(property)"
                         :disabled="property.disabled===true">
                </template>
                <template v-else-if="property.control==='password'">
                  <a-input :placeholder="property.placeholder" :name="getFieldNameByCell(cell)"
                           v-model="form[getFieldNameByCell(cell)]" :readOnly="isReadonly(property)"
                           :disabled="property.disabled===true">
                    <a-icon slot="prefix" type="lock"/>
                    <!--<a-icon v-if="userName" slot="suffix" type="close-circle" @click="emitEmpty" />-->
                  </a-input>

                  <!--<input type="password" :placeholder="property.placeholder" :name="getFieldNameByCell(cell)"-->
                  <!--v-model="form[getFieldNameByCell(cell)]" :readOnly="isReadonly(property)"-->
                  <!--:disabled="property.disabled===true">-->
                </template>
                <template v-else>
                  {{form[getFieldNameByCell(cell)]}}
                </template>
              </td>
            </template>
          </template>
        </template>
      </tr>
      </tbody>
      <tfoot>
      </tfoot>
    </table>
  </div>

</template>
<script>
  import mixin from '../../mixin'
  import utils from '../../utils'

  let GEELATO_SCRIPT_PREFIX = 'gs:'
  let REGEXP_FORM = /gs[\s]*:[\s]*\$ctx\.form\.[a-zA-Z]+[a-zA-Z0-9]*/g;
  let REGEXP_CTX = /\$ctx/g
  let REGEXP_DEPEND_PROPERTY = /\$ctx\.[a-zA-Z]+/g
  let CONST_GQL_PARENT = '$parent'

  export default {
    name: "gl-form",
    mixins: [mixin],
    props: {
      // 指定查询的字段，默认为按id查询
      // queryFields: {
      //   type: Array,
      //   default() {
      //     return ['id']
      //   }
      // }
    },
    data() {
      return {
        // 是否已初始化
        init: false,
        //
        form: {},
        defaultEntity: this.opts.defaultEntity,
        // 指定查询的字段，默认为按id查询，即为['id']
        queryFields: this.opts.queryFields ? this.opts.queryFields : ['id'],
        layout: this.opts.layout,
        properties: this.opts.properties,
        ds: this.opts.ds,
        vars: this.opts.vars,
        // 数据源被依赖，格式为：被依赖的属性:[依赖的属性,依赖的属性...]
        dsBeDependentOn: {}
      }
    },
    created: function () {

    },
    mounted: function () {
      console.log('packages > gl-form > Index.vue > opts:', this.opts)
      console.log('packages > gl-form > Index.vue > query:', this.query)
      this.reset(this.opts)
    },
    watch: {
      'query.treeNodeId': function (val, oval) {
        console.log('packages > gl-form > Index.vue > query > treeNodeId > oval : ', oval, ', val: ', val)
        this.reset(this.opts)
      }
    },
    methods: {
      reset(opts = this.opts) {
        if (opts) {
          let options = opts
          this.properties = options.properties
          this.layout = options.layout
          this.defaultEntity = options.defaultEntity
          this.ds = options.ds
          this.vars = options.vars
          this.dsBeDependentOn = {}
          this.form = {}
          this.init = false
        }
        this.initConvertData()
        this.loadInitData()
        this.initUI()
      },
      /**
       * 1、将简化的配置信息转换成完整的配置信息，如只设置了email类型，则将默认增加email验证规则
       * 2、转换并设置一些默认值
       * 3、分析数据源依赖
       *  */
      initConvertData() {
        let thisVue = this
        for (let key in this.properties) {
          // 设置一些默认值，添加默认配置等
          let property = this.properties[key]
          // identifier 是 semantic ui form validate 需用到的属性
          property.identifier = key
          // 未设置实体时，默认为defaultEntity
          property.entity = property.entity || this.defaultEntity
          property.field = property.field || key
          // !!!需采用vm.$set的方式来设置值，确保值变化可被检测 @see https://cn.vuejs.org/v2/guide/reactivity.html#检测变化的注意事项
          // 若query已存在属性值，则以query的值为准
          if (thisVue.query && thisVue.query[key]) {
            this.$set(this.form, key, thisVue.query[key])
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
                thisVue.dsBeDependentOn[dependPropertyName] = thisVue.dsBeDependentOn[dependPropertyName] || []
                thisVue.dsBeDependentOn[dependPropertyName].push(propertyName)
                console.log('packages > gl-form > Index.vue > dependPropertyName: ', dependPropertyName, propertyName, thisVue.dsBeDependentOn)
              })
            }
          }
        }
        this.init = true
      },
      // 加载远程的初始化数据，如字典信息
      loadInitData() {
        // 加载主实体数据
        let theVue = this
        console.log('packages > gl-form > Index.vue > loadInitData > query:', theVue.query)
        console.log('packages > gl-form > Index.vue > loadInitData > queryFields:', theVue.queryFields)
        // 一般地，若未指定queryFields，则condition 为{id: theVue.form.id}
        let condition = {}
        let isValidCondition = false
        for (let i in this.queryFields) {
          let field = this.queryFields[i]
          condition[field] = theVue.form[field]
          if (condition[field]) {
            isValidCondition = true
          } else {
            console.debug('packages > gl-form > Index.vue > loadInitData > 缺少参数值，无效的查询条件信息（field: ', field, '，condition[field]: ', condition[field], '）。')
          }
        }
        if (isValidCondition && this.api.query) {
          let fieldNames = joinProperties(theVue.form)
          this.api.query(theVue.defaultEntity, condition, fieldNames, true).then(function (res) {
            let resForm = res.data && res.data.length > 0 ? res.data[0] : {}
            for (let key in resForm) {
              // form需设置成响应式
              theVue.$set(theVue.form, key, resForm[key])
            }
            theVue.meta = res.meta
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

        /**
         *
         * @param obj {id:1,name:'z3',description:''}
         * @param separator ','
         * @returns {string} e.g. id,name,description
         */
        function joinProperties(obj, separator = ',') {
          let ary = []
          for (let key in obj) {
            ary.push(key)
          }
          return ary.join(separator)
        }
      },
      initUI() {
        // $(this.$el).form({
        //   fields: this.properties,
        //   onFailure: function (formErrors, fields) {
        //     console.log('packages > gl-form > Index.vue > onFailure > fields: ', fields, ' formErrors:', formErrors)
        //   },
        //   onSuccess: function (event, fields) {
        //     console.log('packages > gl-form > Index.vue > onSuccess > fields:', fields)
        //   }
        // })
      },
      /**
       * 检查字段是否必填
       * @param property 字段配置信息
       * @returns {boolean}
       */
      isRequired(property) {
        if (!property.rules || property.rules.length === 0) {
          return false
        } else {
          return property.rules.filter(item => item.type === 'empty' || item.type === 'checked').length > 0
        }
      },

      /**
       * 自动执行脚本，可在脚本中设置其它字段的值等、字段只读属性等
       * @param property 字段配置信息
       * @returns {boolean}
       */
      autoRun(property) {
        // console.log('packages > gl-form > Index.vue > autoRun > js: ', property.js)
        if (property.js && typeof property.js === 'string') {
          this.rungs(property.js)
        }
        return true
      },
      isReadonly(property) {
        if (property.readonly === true) {
          return true
        } else if (typeof property.readonly === 'string') {
          return this.rungs(property.readonly)
        }
        return false
      },
      /**
       *  layout.hidden中指定的属性需hide
       */
      isHidden(propertyName) {
        // console.log('packages > gl-form > Index.vue > isHidden > propertyName: ', propertyName)
        if (this.layout.hidden && this.layout.hidden.common) {
          let js = this.layout.hidden.common[propertyName]
          return js ? this.rungs(js) : false
        } else {
          return false
        }
      },
      getValues() {
        return this.form
      },
      setValues(form) {
        // this.reset(this.opts)
        for (let key in form) {
          // console.log('packages > gl-form > Index.vue > setValues > key,value: ', key, form[key])
          this.$set(this.form, key, form[key])
        }
        // this.reset(this.opts)
        // this.$forceUpdate()
        // this.reset(this.opts)
        this.$nextTick()
      },
      /**
       * 基于properties的定义，结合表单值构建
       * 获取保存操作的gql语句
       */
      getGql() {
        // 找出顶层的实体信息
        let thisVue = this
        let theForm = thisVue.getValues()
        console.log('packages > gl-form > Index.vue > getGql > form: ', theForm)
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
            let field = theForm[propertyName]
            console.log(property.entity, entityName, property, field)
            if (property.entity === entityName) {
              // 该实体的直属属性，直接添加
              // 获取表单中填写的值
              // boolean类型的值可以转换成数值的方式表示
              if (typeof field === 'boolean') {
                if (property.convert === 'number') {
                  parent[entityName][propertyName] = field ? 1 : 0
                } else {
                  parent[entityName][propertyName] = field
                }
              } else {
                parent[entityName][propertyName] = typeof field !== 'string' ? field : field.replace(REGEXP_CTX, CONST_GQL_PARENT)
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
              let dependProperty = thisVue.properties[item.substring(5)]
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
                //             let parentDependProperty = thisVue.properties[parentItem.substring(5)]
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
      validate() {
        // this.initUI()
        // let result = $(this.$el).form('validate form')
        // console.log('packages > gl-form > Index.vue > validate > result: ', result)
        // let isSuccess = result.get(0).className.indexOf('error') === -1
        // return {code: isSuccess ? 0 : -1, isSuccess: isSuccess, result: result}
      },
      clearValidateMessage() {
        // $(this.$el).find('.ui.error.message.segment').html('')
      },
      /**
       * 对于不存在的属性名，则返回默认的空属性
       * */
      getPropertyByCell(cell) {
        // 一个非$开头的key，即为属性名
        let name = null
        for (let key in cell) {
          if (key.indexOf('$') === -1) {
            name = key
            break
          }
        }
        return this.getProperty(name)
      },
      getProperty(name) {
        if (!name || !this.properties[name]) {
          return {control: 'null', title: ' '}
        }
        return this.properties[name]
      },
      getFieldNameByCell(cell) {
        return Object.keys(cell)[0]
      },
      /**
       * 加载数据源 TODO 改成同时加多个
       * */
      loadData(propertyName, property, dataSourceName) {
        let thisVue = this
        if (!dataSourceName) {
          return
        }
        // ds 示例格式
        // {
        //     entity: 'basedata_city',
        //     lazy: true, // default false
        //     fields: 'name text,id value'
        //     params: {
        //         provinceId: 'gs:$ctx.form.province'
        //     }
        // }
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
          thisVue.api.query(dsConfig.entity, params, dsConfig.fields).then(function (res) {
            thisVue.$set(thisVue.properties[propertyName], 'data', res.data)
            // 触发级联加载数据
            thisVue.loadRefData(propertyName)
          })
        } else {
          console.error('未配置数据源', dataSourceName)
        }
      },
      /**
       * 级联加载数据
       * */
      loadRefData(propertyName) {
        let thisVue = this
        let propertyNames = thisVue.dsBeDependentOn[propertyName] || []
        propertyNames.forEach(function (propertyName) {
          let triggerProperty = thisVue.getProperty(propertyName)
          // if (resetValue !== undefined) {
          //     // 重置选择的值为空
          //     triggerProperty.value = resetValue
          // }
          if (triggerProperty) {
            thisVue.loadData(propertyName, triggerProperty, triggerProperty.ds)
          }
        })
        // thisVue.set(thisVue.form, propertyName, property)
      },
      /**
       * gs(geelato script)执行表达式，若非gs表达式则直接返回
       * @param gs gs:$ctx.form.province
       */
      rungs(str) {
        let thisVue = this
        let $ctx = {form: thisVue.getValues(), vars: {}}
        for (let varName in (thisVue.vars || [])) {
          $ctx.vars[varName] = typeof thisVue.vars[varName] === 'object' ? thisVue.vars[varName].value : thisVue.vars[varName]
        }
        if (str.indexOf(GEELATO_SCRIPT_PREFIX) === 0) {
          return utils.eval(str.substring(3), $ctx)
        } else {
          return str
        }
      },
      uploadImage() {

      },
      copyTips(tips) {
        console.log('packages > gl-form > Index.vue > copyTips > tips: ', tips)
        // this.$copyText(tips).then(function () {
        // })
      }
    },
    components: {}
  }
</script>
<style>
  @import 'style.css';
</style>
