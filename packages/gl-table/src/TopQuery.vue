<!--
该组件面向单实体查询，查询条件中，可能存在同一个字段，多种条件的情况，如时间区间查询，故entity中用索引作为key，而不用字段名
-->
<template>
  <a-form layout="inline">
    <a-row :gutter="gutter">
      <a-col :md="colSpan" :sm="24" v-for="(property,index) in visibleProperties" :key="index"
             :title="property.title+dict[property.cop]">
        <a-form-item v-show="(!advanced&&index<colPerRow-1)||advanced" :label="property.title">
          <gl-control v-if="refsMounted=true" :ref="property.gid" :gid="property.gid" :opts="property" :form="entity"
                      @propertyUpdate="onPropertyUpdate" @keyup.enter="submit"></gl-control>
        </a-form-item>
      </a-col>
      <a-col :md="colSpan * (colPerRow - properties.length % colPerRow -1)" v-if="advanced">
        <a-form-item>&nbsp;</a-form-item>
      </a-col>
      <a-col :md="colSpan" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="submit">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset(params)">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px" v-if="isMultiRow">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
      </a-col>
    </a-row>
    <!--隐藏表单域-->
    <div style="display: none">
      <span v-for="(property,index) in inVisibleProperties" :key="index"
            :title="property.title+dict[property.cop]">
          <gl-control :ref="property.gid" :gid="property.gid" :opts="property" :form="entity"
                      @propertyUpdate="onPropertyUpdate"></gl-control>
      </span>
    </div>
  </a-form>
</template>
<script>

  import EntityDataReaderHandler from '../../EntityDataReaderHandler'
  import utils from '../../utils/utils'
  import selectItem from '../../base/selectItems.js'

  export default {
    name: 'GlTableTopQuery',
    props: {
      // 其它组件转进来的参数，如打开页面传参
      params: {
        type: Object,
        default() {
          return {}
        }
      },
      glRefControls: {
        type: Object,
        required: true
      },
      properties: {
        type: Array,
        default() {
          return []
        },
        required: true
      },
      ds: {
        type: Object,
        default() {
          return {}
        }
      },
      colPerRow: {
        type: Number,
        default() {
          return 4
        }
      },
      gutter: {
        type: Number,
        default() {
          return 48
        }
      }
    },
    data() {
      return {
        entity: {},
        // 高级搜索 展开/关闭
        advanced: false,
        // defaultValue: {},
        dict: selectItem.copDict,
        gidMap: {},
        entityDataReaderHandler: new EntityDataReaderHandler({
          $gl: this.$gl,
          ds: this.ds,
          dataMountTargetProperties: this.properties,
          $_ctxLoader: this.$_ctxLoader
        }),
        refsMounted: 0,
        refsMounted2: false
      }
    },
    watch: {},
    computed: {
      colSpan() {
        return 24 / this.colPerRow
      },
      isMultiRow() {
        return this.properties.length > this.colPerRow
      },
      visibleProperties() {
        console.log('computed() > visibleProperties')
        let result = this.properties.filter(property => {
          return property.show !== false
        })
        return result || []
      },
      inVisibleProperties() {
        console.log('computed() > inVisibleProperties')
        let result = this.properties.filter(property => {
          return property.show === false
        })
        return result || []
      }
    },
    mounted() {
      let that = this
      that.initData()
      console.log('geelato-ui-ant > gl-table-top-query > mounted() ')
      that.$_generateRefControl('top-query')
      // that.reset({params: this.params})
      // 解析数据源，并初始化加载数据
      that.entityDataReaderHandler.execute()
    },
    destroyed() {
      this.$_clearRefControl()
    },
    methods: {
      initData() {
        let that = this
        // 转换初始化数据
        for (const index in this.properties) {
          const item = this.properties[index]
          // 检查设置控件维一值
          if (!item.gid) {
            if (!this.gidMap[item.field]) {
              item.gid = this.$gl.utils.uuid(16)
              this.gidMap[item.gid] = item.field
            } else {
              item.gid = this.$gl.utils.uuid(16)
              this.gidMap[item.gid] = item.field
            }
          }
        }
      },
      reset({params = this.params} = {}) {
        const that = this
        if (!params) {
          return
        }

        for (const index in this.properties) {
          const item = this.properties[index]
          // while (Object.keys(this.$refs).length === 0 && this.properties && this.properties.length > 0) {
          //   (async function () {
          //     Object.assign(that.tableControlRefs, that.$_generateRefControl('top-query'))
          //     console.log('Do some thing, ' + new Date());
          //     await that.$_sleep(1000);
          //     console.log('Do other things, ' + new Date());
          //   })()
          // }

          // if (Object.keys(this.$refs).length === 0 && this.properties && this.properties.length > 0) {
          //   console.error(`$refs对象还未生成，跳过为查询字段“${item.title}”值设置。`, Object.keys(this.$refs).length)
          // } else {
          //
          // }
          if (item.gid in params) {
            item.value = params[item.gid]
            // this.$refs[item.gid][0].setValue(params[item.gid])
          } else if (item.field in params) {
            item.value = params[item.field]
            // this.$refs[item.gid][0].setValue(params[item.field])
          }
          // 设置查询表单实体值
          // 优先以property.value的值为准，若无则以property.props.defaultValue的值为准，最后以property.props.defaultActiveIndex对应项的值为准
          if (item.value !== undefined) {
            this.$set(this.entity, item.gid, item.value)
          } else if (item.props && item.props.defaultValue !== undefined) {
            this.$set(this.entity, item.gid, item.props.defaultValue)
          } else if (item.props && item.props.defaultActiveIndex !== undefined && item.data && item.data.length > 0) {
            this.$set(this.entity, item.gid, item.data[item.defaultActiveIndex].value)
          }
        }

        // 转换初始化数据
        Object.assign(this.entity, params)
        console.log('geelato-ui-ant > gl-table-top-query > reset > params ', params)
        console.log('geelato-ui-ant > gl-table-top-query > reset > entity ', this.entity)
      },
      onPropertyUpdate({property, val}) {
        this.$set(this.entity, property.gid, val)
        // 该属性值已改变，试着加载级联数据
        this.entityDataReaderHandler.onLoadRefData({property})
      },
      toggleAdvanced() {
        this.advanced = !this.advanced
      },
      convertCop(cop) {
        return this.dict[cop]
      },
      convertLop(o) {
        return o === 'or' ? '或' : '且'
      },
      getPlaceholder(item) {
        if (item.placeholder) {
          return item.placeholder
        } else {
          console.log(item.cop, this.dict[item.cop])
          return this.convertCop(item.cop)
        }
      },
      submit(e) {
        console.log('geelato-ui-ant > gl-table-top-query > submit >e, model, properties', e, this.model, this.properties)
        this.$emit('input', {value: this.getCondition().value, e: e})
      },
      getCondition() {
        const result = {}
        console.log('geelato-ui-ant > gl-table-top-query > getCondition() > before, this.properties>', this.properties)
        for (const index in this.properties) {
          const item = this.properties[index]
          if (this.entity[item.gid] === undefined || this.entity[item.gid] === null) {
            continue
          } else {
            if (item.control === 'checkbox') {
              result[item.field + '|' + item.cop] = this.entity[item.gid] ? 1 : 0
            } else if (item.control === 'date') {
              const moment = this.entity[item.gid]
              if (moment) {
                result[item.field + '|' + item.cop] = moment.format(item.format || 'L')
              }
            } else {
              try {
                const value = typeof this.entity[item.gid] === 'number' ? this.entity[item.gid] : utils.trim(this.entity[item.gid])
                if (value === '') {
                  continue
                }
                result[item.field + '|' + item.cop] = value
              } catch (e) {
                console.log('geelato-ui-ant >  gl-table-top-query > this.entity[item.gid] > ', item, this.entity[item.gid])
                console.log(e)
              }
            }
          }
        }
        console.log('geelato-ui-ant > gl-table-top-query > gql查询条件为: ', result)
        return {value: result}
      },
      $_ctxLoader() {
        // let $ctx = {form: this.getValues(), vars: {}}
        // for (let varName in (that.vars || [])) {
        //   $ctx.vars[varName] = typeof that.vars[varName] === 'object' ? that.vars[varName].value : that.vars[varName]
        // }
        return this.entity
      },
      $_generateRefControl(componentName) {
        for (let i in this.$refs) {
          this.glRefControls[i] = this.$refs[i].length !== undefined ? this.$refs[i][0] : this.$refs[i]
        }
        console.log(`geelato-ui-ant > gl-table-top-query > $_generateRefControl() > [${componentName}] $refs,glRefControls: `, this.$refs, this.glRefControls)
        return this.glRefControls
      },
      $_clearRefControl() {
        for (let i in this.$refs) {
          delete this.glRefControls[i]
        }
        console.log('geelato-ui-ant > gl-table-top-query > $_clearRefControl() > $refs,glRefControls: ', this.$refs, this.glRefControls)
      },
      $_getRefControlByGid(gid) {
        if (!this.glRefControls && !this.glRefControls[gid] && Object.keys(this.glRefControls).length === 0) {
          // 未初始化，则先进行初始化
          this.$_generateRefControl()
        }
        return this.glRefControls[gid]
      }
    }
  }
</script>
<style scoped>
</style>
